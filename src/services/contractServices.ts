import { supabase } from '../lib/supabase'
import { getProposalWithLead } from './proposalAdminServices'
import type { Proposal, AcceptContractPayload } from '../types/database'

/**
 * Busca os dados de uma proposta e Lead associado a partir do token de acesso ou ID da proposta.
 */
export async function getProposalByToken(token: string): Promise<Proposal | null> {
  try {
    if (!token) return null

    // 1. Tenta buscar diretamente pelo ID ou token em proposals / leads / briefings
    const proposal = await getProposalWithLead(token)
    if (proposal) return proposal

    // 2. Tenta buscar na tabela `contracts` pelo token_acesso
    const { data: contractData } = await supabase
      .from('contracts')
      .select('proposal_id')
      .eq('token_acesso', token)
      .maybeSingle()

    if (contractData?.proposal_id) {
      return await getProposalWithLead(contractData.proposal_id)
    }

    return null
  } catch (err) {
    console.error('Erro ao buscar proposta por token:', err)
    return null
  }
}

/**
 * Registra o aceite do cliente, salva o contrato na tabela `public.contracts` no Supabase,
 * atualiza o status da proposta para 'aceita' e gera o registro da fatura de entrada.
 */
export async function acceptProposalAndCreateContract(
  payload: AcceptContractPayload
): Promise<{ success: boolean; contractId: string; invoiceId?: string }> {
  try {
    if (!payload.proposalId || !payload.leadId) {
      throw new Error('Identificação da proposta e do lead são obrigatórias.')
    }

    const currentProp = await getProposalWithLead(payload.proposalId)
    const contractId = crypto.randomUUID()
    const tokenAcesso = crypto.randomUUID()

    // 1. Atualiza ou insere o registro da proposta na tabela `proposals` com status 'aceita'
    let { data: updatedProps, error: updatePropErr } = await supabase
      .from('proposals')
      .update({
        status_proposta: 'aceita',
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.proposalId)
      .select()

    if (updatePropErr || !updatedProps || updatedProps.length === 0) {
      const validAi = currentProp?.proposta_ia || {}
      const upsertObj: Record<string, any> = {
        id: payload.proposalId,
        lead_id: payload.leadId,
        resumo_executivo: validAi.resumo_executivo || 'Aceite do contrato realizado pelo cliente.',
        valor_total_setup: payload.valorSetupBase || Number(validAi.valor_setup || 4500),
        valor_entrada_50: payload.valorEntrada50 || Number(validAi.parcela_entrada || 2250),
        mensalidade_recorrente: payload.mensalidadeRecorrente || Number(validAi.valor_mensal || 590),
        prazo_estimado_dias: Number(validAi.prazo_estimado_dias || 15),
        entregaveis_principais: Array.isArray(validAi.entregaveis) ? validAi.entregaveis : [],
        sugestoes_upsell: payload.modulosUpsellSelecionados || [],
        status_proposta: 'aceita',
        updated_at: new Date().toISOString()
      }

      const { error: upsertErr } = await supabase
        .from('proposals')
        .upsert(upsertObj)

      if (upsertErr) {
        console.warn('[contractServices] Aviso de upsert em proposals:', upsertErr.message)
      }
    }

    // 2. Atualiza o status do briefing
    await supabase
      .from('briefings')
      .update({
        status_briefing: 'aprovado',
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.proposalId)

    // 3. Insere o contrato na tabela `public.contracts`
    const contractRecord = {
      id: contractId,
      proposal_id: payload.proposalId,
      lead_id: payload.leadId,
      valor_setup_base: payload.valorSetupBase,
      modulos_upsell: payload.modulosUpsellSelecionados || [],
      valor_total_contrato: payload.valorTotalContrato,
      valor_entrada_50: payload.valorEntrada50,
      mensalidade_recorrente: payload.mensalidadeRecorrente,
      status_contrato: 'aguardando_pagamento_entrada',
      token_acesso: tokenAcesso,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: insertedContract, error: contractErr } = await supabase
      .from('contracts')
      .insert([contractRecord])
      .select()
      .maybeSingle()

    if (contractErr) {
      console.warn('[contractServices] Aviso de inserção em contracts:', contractErr.message)
    }

    // 4. Cadastra ou atualiza fatura de entrada na tabela `invoices`
    const invoiceId = crypto.randomUUID()
    const { error: invErr } = await supabase
      .from('invoices')
      .insert([{
        id: invoiceId,
        project_id: payload.proposalId,
        client_id: payload.leadId,
        valor: payload.valorEntrada50,
        vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tipo: 'entrada',
        status: 'pendente',
        payload_pagamento: {
          contrato_id: contractId,
          valor_total: payload.valorTotalContrato,
          valor_entrada: payload.valorEntrada50
        }
      }])

    if (invErr) {
      console.warn('[contractServices] Registro de fatura fallback:', invErr.message)
    }

    return {
      success: true,
      contractId: insertedContract?.id || contractId,
      invoiceId
    }
  } catch (err: any) {
    console.error('Erro em acceptProposalAndCreateContract:', err)
    throw new Error(err.message || 'Ocorreu um erro ao registrar o aceite do contrato.')
  }
}

export const contractServices = {
  getProposalByToken,
  acceptProposalAndCreateContract
}

export default contractServices
