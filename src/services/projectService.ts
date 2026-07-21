import { supabase } from '../lib/supabase';
import type { Project, ProjectRoadmap } from '../types/database';

// Mock de Fallback para o Projeto Principal e os Sistemas/Projetos Adicionais
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'sistema-agendamentos',
    client_id: 'cliente-corp-id',
    nome: 'SISTEMA INTEGRADO DE AGENDAMENTOS E IA',
    descricao: 'Seu ecossistema digital está na fase final de testes. Nossa equipe está validando os fluxos de agendamento para garantir que seus clientes tenham uma experiência perfeita antes do lançamento oficial.',
    data_inicio: '01 Jun 2026',
    previsao_entrega: '10 Ago 2026',
    fase_atual: 'Homologação Visual',
    proxima_entrega: 'Integração WhatsApp',
    status_pagamento: '2/3 Parcelas Pagas',
    status_geral: 'Em Homologação',
    url_projeto: '#homologacao',
    btn_online_label: 'Ambiente de Testes',
    btn_gerenciar_label: 'Aprovar Layout Atual',
    progresso: 60,
    ativo: true,
    created_at: new Date('2026-06-01').toISOString()
  },
  {
    id: 'portal-assescor',
    client_id: 'cliente-corp-id',
    nome: 'PORTAL ASSESCOR',
    descricao: 'Plataforma corporativa para automação de fluxos e captação de leads.',
    data_inicio: '12 Out 2025',
    previsao_entrega: '25 Fev 2026',
    fase_atual: 'Lançamento',
    proxima_entrega: 'Concluído',
    status_pagamento: 'Pago',
    status_geral: 'Concluído & Entregue',
    url_projeto: 'https://www.assescor.com.br',
    btn_online_label: 'Ver Projeto Online',
    btn_gerenciar_label: 'Gerenciar',
    progresso: 100,
    ativo: true,
    created_at: new Date('2025-10-12').toISOString()
  },
  {
    id: 'erp-comercial',
    client_id: 'cliente-corp-id',
    nome: 'SISTEMA ERP COMERCIAL',
    descricao: 'Módulos ativos: Frente de Caixa, Gestão de Retaguarda e Emissão de Notas (NF-e / NFC-e).',
    data_inicio: '01 Mar 2026',
    previsao_entrega: 'Recorrência Mensal',
    fase_atual: 'Operação em Produção',
    proxima_entrega: 'Licença Ativa',
    status_pagamento: 'Em Dia',
    status_geral: 'Licença Ativa',
    url_projeto: 'https://erp.automationtest.com',
    btn_online_label: 'Acessar Retaguarda',
    btn_gerenciar_label: 'Gerenciar Licença',
    progresso: null,
    ativo: true,
    created_at: new Date('2026-03-01').toISOString()
  }
];

// Mock de Fallback para as etapas de Roadmap de cada projeto
const FALLBACK_ROADMAPS: Record<string, ProjectRoadmap[]> = {
  'sistema-agendamentos': [
    { id: 'sa-1', project_id: 'sistema-agendamentos', nome_fase: 'Análise de Requisitos', status: 'done', descricao_fase: 'Reunião de alinhamento técnico e levantamento inicial', ordem: 1 },
    { id: 'sa-2', project_id: 'sistema-agendamentos', nome_fase: 'Design & Protótipo', status: 'done', descricao_fase: 'Interface visual de luxo validada com o cliente', ordem: 2 },
    { id: 'sa-3', project_id: 'sistema-agendamentos', nome_fase: 'Desenvolvimento Core', status: 'done', descricao_fase: 'Codificação da lógica do sistema e conexões básicas', ordem: 3 },
    { id: 'sa-4', project_id: 'sistema-agendamentos', nome_fase: 'Homologação Visual', status: 'current', descricao_fase: 'Validação estética em ambiente de homologação', ordem: 4 },
    { id: 'sa-5', project_id: 'sistema-agendamentos', nome_fase: 'Integração de IA & WhatsApp', status: 'pending', descricao_fase: 'Finalização do agente de IA e conexão da API oficial do WhatsApp', ordem: 5 }
  ],
  'portal-assescor': [
    { id: 'pa-1', project_id: 'portal-assescor', nome_fase: 'Definição de Escopo', status: 'done', descricao_fase: 'Briefing e arquitetura de dados', ordem: 1 },
    { id: 'pa-2', project_id: 'portal-assescor', nome_fase: 'Design Visual', status: 'done', descricao_fase: 'Protótipos de alta fidelidade aprovados', ordem: 2 },
    { id: 'pa-3', project_id: 'portal-assescor', nome_fase: 'Desenvolvimento Core', status: 'done', descricao_fase: 'Construção das APIs e frontend em React', ordem: 3 },
    { id: 'pa-4', project_id: 'portal-assescor', nome_fase: 'Homologação Final', status: 'done', descricao_fase: 'Testes de carga e integridade', ordem: 4 },
    { id: 'pa-5', project_id: 'portal-assescor', nome_fase: 'Lançamento', status: 'done', descricao_fase: 'Deploy final e transferência de DNS', ordem: 5 }
  ],
  'erp-comercial': [
    { id: 'ec-1', project_id: 'erp-comercial', nome_fase: 'Ativação da Infraestrutura', status: 'done', descricao_fase: 'Provisionamento de servidores e banco de dados isolado', ordem: 1 },
    { id: 'ec-2', project_id: 'erp-comercial', nome_fase: 'Configuração Fiscal & Notas', status: 'done', descricao_fase: 'Parametrização de alíquotas de impostos e certificados fiscais (NF-e / NFC-e)', ordem: 2 },
    { id: 'ec-3', project_id: 'erp-comercial', nome_fase: 'Importação de Cadastros', status: 'done', descricao_fase: 'Migração de clientes, fornecedores e produtos para a nova base', ordem: 3 },
    { id: 'ec-4', project_id: 'erp-comercial', nome_fase: 'Treinamento da Equipe', status: 'done', descricao_fase: 'Capacitação prática para operadores de caixa e faturamento', ordem: 4 },
    { id: 'ec-5', project_id: 'erp-comercial', nome_fase: 'Operação em Produção', status: 'done', descricao_fase: 'Sistemas ativos 24/7 com suporte dedicado de retaguarda', ordem: 5 }
  ]
};

/**
 * Busca todos os projetos/licenças associados a um determinado cliente.
 * Se nenhum projeto for encontrado no banco de dados, retorna os dados de fallback.
 * @param clientId O ID do cliente.
 */
export async function fetchClientProjects(clientId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao consultar projetos do Supabase, aplicando fallback:', error);
      return FALLBACK_PROJECTS;
    }

    if (!data || data.length === 0) {
      console.info('Nenhum projeto encontrado no Supabase para este cliente. Utilizando dados de fallback.');
      return FALLBACK_PROJECTS;
    }

    return data;
  } catch (err) {
    console.error('Falha crítica na busca de projetos, aplicando fallback:', err);
    return FALLBACK_PROJECTS;
  }
}

/**
 * Busca os detalhes de um projeto específico e as respectivas fases do roadmap.
 * Se o projeto não for encontrado no banco de dados, busca na lista de fallback.
 * @param projectId O ID do projeto.
 */
export async function fetchProjectDetails(projectId: string): Promise<{ project: Project; roadmap: ProjectRoadmap[] } | null> {
  try {
    // 1. Busca os detalhes do projeto
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('ativo', true)
      .maybeSingle();

    if (projError || !project) {
      console.warn(`Projeto "${projectId}" não encontrado no Supabase, buscando no fallback...`);
      const fallbackProj = FALLBACK_PROJECTS.find(p => p.id === projectId);
      if (!fallbackProj) return null;

      return {
        project: fallbackProj,
        roadmap: FALLBACK_ROADMAPS[projectId] || [
          { id: 'f-1', project_id: projectId, nome_fase: 'Análise de Requisitos', status: 'done', descricao_fase: 'Reunião de alinhamento técnico', ordem: 1 },
          { id: 'f-2', project_id: projectId, nome_fase: 'Design Inicial', status: 'current', descricao_fase: 'Criação de protótipos de telas', ordem: 2 },
          { id: 'f-3', project_id: projectId, nome_fase: 'Desenvolvimento', status: 'pending', descricao_fase: 'Codificação da arquitetura modular', ordem: 3 },
          { id: 'f-4', project_id: projectId, nome_fase: 'Lançamento', status: 'pending', descricao_fase: 'Deploy oficial em ambiente produtivo', ordem: 4 }
        ]
      };
    }

    // 2. Busca o roadmap do projeto
    const { data: roadmap, error: roadError } = await supabase
      .from('project_roadmaps')
      .select('*')
      .eq('project_id', projectId)
      .order('ordem', { ascending: true });

    if (roadError) {
      console.error('Erro ao buscar roadmap no Supabase:', roadError);
      return { project, roadmap: [] };
    }

    return {
      project,
      roadmap: roadmap || []
    };
  } catch (err) {
    console.error('Erro na camada de serviços do projeto:', err);
    // Fallback completo em caso de falhas
    const fallbackProj = FALLBACK_PROJECTS.find(p => p.id === projectId);
    if (!fallbackProj) return null;
    return {
      project: fallbackProj,
      roadmap: FALLBACK_ROADMAPS[projectId] || []
    };
  }
}
