import { supabase } from '../lib/supabase';
import type { Project, Invoice } from '../types/database';

/**
 * Busca projetos/propostas ordenados por data.
 * Se clientId for informado, filtra por ele.
 */
export async function fetchClientProposals(clientId?: string): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (clientId) {
    query = query.eq('client_id', clientId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erro ao buscar propostas:', error);
    return [];
  }
  return data as Project[];
}

/**
 * Cria uma nova proposta/projeto no banco de dados.
 */
export async function createProposal(data: Partial<Project>): Promise<Project | null> {
  const payload = {
    ...data,
    fase_atual: data.fase_atual || 'proposta_pendente',
    ativo: true,
    created_at: new Date().toISOString(),
  };

  const { data: inserted, error } = await supabase
    .from('projects')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar proposta:', error);
    return null;
  }
  return inserted as Project;
}

/**
 * Envia uma proposta ao cliente: atualiza valores, altera fase para 'proposta_enviada'
 * e gera a fatura de entrada correspondente (50% do setup).
 */
export async function sendProposalToClient(
  projectId: string,
  valorSetup: number,
  valorMensal: number,
  descricao: string
): Promise<{ project: Project; invoice: Invoice } | null> {
  // 1. Buscar dados do projeto para obter o client_id
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (fetchError || !project) {
    console.error('Erro ao buscar projeto para envio de proposta:', fetchError);
    return null;
  }

  // 2. Atualizar o projeto
  const { data: updatedProject, error: updateError } = await supabase
    .from('projects')
    .update({
      valor_setup: valorSetup,
      valor_mensalidade: valorMensal,
      descricao: descricao,
      fase_atual: 'proposta_enviada'
    })
    .eq('id', projectId)
    .select()
    .single();

  if (updateError || !updatedProject) {
    console.error('Erro ao atualizar projeto com dados da proposta:', updateError);
    return null;
  }

  // 3. Gerar a fatura de entrada (50% do setup)
  const valorFatura = valorSetup * 0.5;
  const dataVencimento = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 dias de prazo

  const invoicePayload = {
    project_id: projectId,
    client_id: project.client_id,
    valor: valorFatura,
    vencimento: dataVencimento,
    tipo: 'entrada',
    status: 'pendente',
    created_at: new Date().toISOString()
  };

  const { data: insertedInvoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert([invoicePayload])
    .select()
    .single();

  if (invoiceError || !insertedInvoice) {
    console.error('Erro ao criar fatura de entrada:', invoiceError);
    return null;
  }

  return {
    project: updatedProject as Project,
    invoice: insertedInvoice as Invoice
  };
}

/**
 * Aceita a proposta e simula o pagamento da entrada.
 * Atualiza fatura para 'pago', fase do projeto para 'em_desenvolvimento' e ativa o perfil do cliente.
 */
export async function acceptProposalAndPayEntry(
  projectId: string,
  invoiceId: string
): Promise<boolean> {
  // 1. Atualizar a fatura para 'pago'
  const { error: invoiceError } = await supabase
    .from('invoices')
    .update({ status: 'pago' })
    .eq('id', invoiceId);

  if (invoiceError) {
    console.error('Erro ao atualizar status da fatura para pago:', invoiceError);
    return false;
  }

  // 2. Buscar o projeto para obter o client_id
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('client_id')
    .eq('id', projectId)
    .single();

  if (fetchError || !project) {
    console.error('Erro ao buscar projeto no pagamento da entrada:', fetchError);
    return false;
  }

  // 3. Atualizar a fase do projeto para 'em_desenvolvimento'
  const { error: projectError } = await supabase
    .from('projects')
    .update({ fase_atual: 'em_desenvolvimento' })
    .eq('id', projectId);

  if (projectError) {
    console.error('Erro ao atualizar fase do projeto:', projectError);
    return false;
  }

  // 4. Atualizar o timestamp de atualização do perfil do cliente
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', project.client_id);

  if (profileError) {
    console.warn('Aviso ao atualizar timestamp do perfil do cliente:', profileError);
  }

  return true;
}

export const proposalServices = {
  fetchClientProposals,
  createProposal,
  sendProposalToClient,
  acceptProposalAndPayEntry
};

export default proposalServices;
