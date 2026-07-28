import { supabase } from '../lib/supabase';
import type { Profile, UserStatus } from '../types/database';

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile by ID:', error);
    return null;
  }
  return data as Profile;
};

export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all profiles:', error);
    return [];
  }
  return data as Profile[];
};

export const getPendingProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pendente')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending profiles:', error);
    return [];
  }
  return data as Profile[];
};

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data as Profile;
};

export const updateProfileStatus = async (
  id: string, 
  status: UserStatus
): Promise<Profile | null> => {
  return updateProfile(id, { status });
};

export const createProfile = async (profileData: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  return data as Profile;
};

/**
 * Cria um novo cliente via Painel Administrativo.
 * Por padrão, cadastros feitos pelo Admin recebem status 'ativo' e role 'client'.
 */
export const createAdminClient = async (clientData: Partial<Profile>): Promise<Profile | null> => {
  const payload: Partial<Profile> = {
    id: clientData.id || crypto.randomUUID(),
    email: clientData.email || '',
    role: 'client',
    status: 'ativo', // Atribuição automática de status ativo para cadastros do Admin
    tipo_pessoa: clientData.tipo_pessoa || 'PF',
    nome_completo: clientData.nome_completo || null,
    cpf: clientData.cpf || null,
    razao_social: clientData.razao_social || null,
    cnpj: clientData.cnpj || null,
    telefone: clientData.telefone || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return createProfile(payload);
};

/**
 * Atualiza os dados cadastrais de um cliente (Nome/Razão Social, Documento, E-mail, Telefone).
 */
export const updateClientProfile = async (
  userId: string, 
  data: Partial<Profile>
): Promise<Profile | null> => {
  return updateProfile(userId, data);
};

export const fetchAllProfiles = getAllProfiles;

export const profileServices = {
  getProfileById,
  getAllProfiles,
  fetchAllProfiles,
  getPendingProfiles,
  updateProfile,
  updateProfileStatus,
  createProfile,
  createAdminClient,
  updateClientProfile,
};

export default profileServices;
