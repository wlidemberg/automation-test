export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'client';
  tipo_pessoa: 'PJ' | 'PF';
  razao_social?: string | null;
  cnpj?: string | null;
  nome_completo?: string | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  endereco?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}
