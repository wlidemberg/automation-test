import { supabase } from '../lib/supabase';
import type { Briefing, BriefingStatus } from '../types/database';

/**
 * Cria ou atualiza um briefing no Supabase e opcionalmente dispara o webhook para o N8N.
 */
export async function createBriefing(briefingData: Partial<Briefing>): Promise<Briefing | null> {
  const id = briefingData.id || crypto.randomUUID();
  const payload = {
    ...briefingData,
    id,
    status_briefing: briefingData.status_briefing || 'pendente',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('briefings')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar briefing:', error.message);
    throw error;
  }

  return data as Briefing;
}

/**
 * Busca um briefing pelo ID.
 */
export async function fetchBriefingById(briefingId: string): Promise<Briefing | null> {
  const { data, error } = await supabase
    .from('briefings')
    .select('*')
    .eq('id', briefingId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar briefing por ID:', error.message);
    return null;
  }
  return data as Briefing;
}

/**
 * Busca o briefing associado a um projeto.
 */
export async function fetchBriefingByProjectId(projectId: string): Promise<Briefing | null> {
  const { data, error } = await supabase
    .from('briefings')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar briefing por ID de projeto:', error.message);
    return null;
  }
  return data as Briefing;
}

/**
 * Atualiza o status do briefing e dados adicionais (como proposta_ia).
 */
export async function updateBriefing(
  briefingId: string,
  updates: Partial<Briefing>
): Promise<Briefing | null> {
  const { data, error } = await supabase
    .from('briefings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', briefingId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar briefing:', error.message);
    return null;
  }
  return data as Briefing;
}

/**
 * Dispara o Webhook do N8N enviando os dados do briefing para processamento do Agente de IA.
 */
export async function triggerN8NBriefingWebhook(briefing: Briefing): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_N8N_BRIEFING_WEBHOOK;
  if (!webhookUrl) {
    console.warn('Aviso: URL do webhook N8N não configurada em VITE_N8N_BRIEFING_WEBHOOK.');
    return true; // Retorna true em ambiente local para não travar o fluxo
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(briefing)
    });

    if (!response.ok) {
      console.error('N8N webhook respondeu com status:', response.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erro ao disparar webhook N8N:', err);
    return false;
  }
}

/**
 * Verifica se já existe um perfil com o mesmo e-mail, CPF ou CNPJ para evitar duplicidade.
 */
export async function checkProfileDuplicity(
  email: string,
  cpfCnpj?: string
): Promise<{ exists: boolean; field?: 'email' | 'cpf_cnpj' }> {
  // Verifica e-mail
  const { data: emailMatch, error: emailError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailMatch) {
    return { exists: true, field: 'email' };
  }

  // Se houver CPF ou CNPJ informado
  if (cpfCnpj) {
    const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
    if (cleanCpfCnpj) {
      // Verifica CPF
      const { data: cpfMatch } = await supabase
        .from('profiles')
        .select('id')
        .eq('cpf', cleanCpfCnpj)
        .maybeSingle();

      if (cpfMatch) {
        return { exists: true, field: 'cpf_cnpj' };
      }

      // Verifica CNPJ
      const { data: cnpjMatch } = await supabase
        .from('profiles')
        .select('id')
        .eq('cnpj', cleanCpfCnpj)
        .maybeSingle();

      if (cnpjMatch) {
        return { exists: true, field: 'cpf_cnpj' };
      }
    }
  }

  return { exists: false };
}
