import { supabase } from '../lib/supabase';

interface LeadData {
  tipo_pessoa: 'PF' | 'PJ';
  nome_completo: string;
  email: string;
  telefone: string;
  produtoId: string;
  produtoNome: string;
  needs: string;
}

export async function submitProposalRequest(lead: LeadData): Promise<boolean> {
  try {
    // 1. Verificar se o perfil já existe pelo email
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('id, status')
      .eq('email', lead.email)
      .maybeSingle();

    if (selectError) {
      console.error('Erro ao verificar perfil existente:', selectError.message);
      return false;
    }

    let clientId: string;

    if (existingProfile) {
      clientId = existingProfile.id;
      // Atualizar perfil para pendente e atualizar os dados cadastrais
      const updatePayload: any = {
        status: 'pendente',
        tipo_pessoa: lead.tipo_pessoa,
        telefone: lead.telefone,
        updated_at: new Date().toISOString(),
      };

      if (lead.tipo_pessoa === 'PJ') {
        updatePayload.razao_social = lead.nome_completo;
      } else {
        updatePayload.nome_completo = lead.nome_completo;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', clientId);

      if (updateError) {
        console.error('Erro ao atualizar perfil do lead:', updateError.message);
        return false;
      }
    } else {
      clientId = crypto.randomUUID();
      // Criar novo perfil
      const insertPayload: any = {
        id: clientId,
        email: lead.email,
        role: 'client',
        status: 'pendente',
        tipo_pessoa: lead.tipo_pessoa,
        telefone: lead.telefone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (lead.tipo_pessoa === 'PJ') {
        insertPayload.razao_social = lead.nome_completo;
      } else {
        insertPayload.nome_completo = lead.nome_completo;
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([insertPayload]);

      if (insertError) {
        console.error('Erro ao criar perfil do lead:', insertError.message);
        return false;
      }
    }

    // 2. Criar registro inicial na tabela projects
    const projectPayload = {
      id: crypto.randomUUID(),
      client_id: clientId,
      nome: lead.produtoNome,
      descricao: lead.needs,
      fase_atual: 'briefing',
      status_projeto: 'briefing',
      status_geral: 'briefing',
      valor_setup: 0,
      valor_mensalidade: 0,
      valor_total: 0,
      ativo: true,
      created_at: new Date().toISOString()
    };

    const { error: projectError } = await supabase
      .from('projects')
      .insert([projectPayload]);

    if (projectError) {
      console.error('Erro ao criar projeto do lead:', projectError.message);
      // Se falhar por conta do ENUM 'fase_atual' não aceitar 'briefing', tentamos com 'proposta_pendente'
      if (projectError.message.includes('invalid input value for enum') || projectError.message.includes('project_phase')) {
        const fallbackPayload = {
          ...projectPayload,
          fase_atual: 'proposta_pendente'
        };
        const { error: fallbackError } = await supabase
          .from('projects')
          .insert([fallbackPayload]);

        if (fallbackError) {
          console.error('Erro no fallback de criação de projeto:', fallbackError.message);
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Erro inesperado ao processar solicitação de proposta:', err);
    return false;
  }
}
