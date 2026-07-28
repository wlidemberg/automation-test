import { supabase } from '../lib/supabase';
import type { Product } from '../types/database';

/**
 * Busca todos os produtos ativos do Supabase, ordenados por nome.
 * @returns Lista de produtos ativos.
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar produtos ativos:', error);
    throw error;
  }

  return data || [];
}

/**
 * Busca um produto específico do Supabase através do seu slug.
 * @param slug O slug único do produto.
 * @returns O produto correspondente ou null caso não seja encontrado.
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('ativo', true)
    .maybeSingle();

  if (error) {
    console.error(`Erro ao buscar produto pelo slug "${slug}":`, error);
    throw error;
  }

  return data;
}
