import { createClient } from '@supabase/supabase-js';

// Busca as variáveis de ambiente que definimos no .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Atenção: As variáveis de ambiente do Supabase não foram encontradas no .env.local!');
}

// Cria e exporta a instância do cliente Supabase para ser usada em qualquer lugar do app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);