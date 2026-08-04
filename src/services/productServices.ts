import { supabase } from '../lib/supabase';
import { productsData } from '../data/productsData';
import type { Product } from '../types/database';

/**
 * Catálogo mock base caso o banco esteja indisponível
 */
const mockProductsList: Product[] = [
  {
    id: '1',
    nome: 'Site Institucional Corporativo',
    slug: 'site-institucional',
    categoria: 'design_web',
    tipo_cobranca: 'unico',
    preco_setup: 2500.00,
    preco_mensal: 0.00,
    descricao_curta: 'Website corporativo de alta performance com design responsivo e estética moderna.',
    icone: 'Globe',
    recursos: ['Design Responsivo', 'SEO Avançado', 'Performance 100/100'],
    status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Landing Page de Alta Conversão',
    slug: 'landing-page',
    categoria: 'design_web',
    tipo_cobranca: 'unico',
    preco_setup: 1500.00,
    preco_mensal: 0.00,
    descricao_curta: 'Página única focada em conversão e captação de leads de alta qualidade.',
    icone: 'Layout',
    recursos: ['Conversão Focada', 'Pixel Integrado', 'Integração CRM'],
    status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Loja Virtual & E-commerce',
    slug: 'loja-virtual',
    categoria: 'desenvolvimento',
    tipo_cobranca: 'hibrido',
    preco_setup: 4500.00,
    preco_mensal: 150.00,
    descricao_curta: 'Plataforma completa de vendas online com checkout transparente e gestão de estoque.',
    icone: 'ShoppingBag',
    recursos: ['Checkout Transparente', 'Gestão de Estoque', 'PIX & Cartão'],
    status: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Busca todos os produtos do Supabase ordenados por data de criação.
 */
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao consultar Supabase public.products:', error.message);
      return mockProductsList;
    }

    if (data && data.length > 0) {
      return data as Product[];
    }

    return mockProductsList;
  } catch (err) {
    console.error('Erro na chamada fetchAllProducts:', err);
    return mockProductsList;
  }
};

/**
 * Cria um novo produto no banco de dados Supabase.
 */
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  const payload: Partial<Product> = {
    nome: productData.nome || '',
    slug: productData.slug || (productData.nome ? productData.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ''),
    rotulo: productData.rotulo || null,
    categoria: productData.categoria || 'design_web',
    tipo_cobranca: productData.tipo_cobranca || 'unico',
    preco_setup: Number(productData.preco_setup) || 0,
    preco_mensal: Number(productData.preco_mensal) || 0,
    descricao_curta: productData.descricao_curta || '',
    descricao_completa: productData.descricao_completa || null,
    icone: productData.icone || 'Package',
    recursos: productData.recursos || [],
    status: productData.status !== undefined ? productData.status : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Falha ao inserir produto no Supabase:', error.message);
      const newMock = { id: crypto.randomUUID(), ...payload } as Product;
      mockProductsList.unshift(newMock);
      return newMock;
    }

    return data as Product;
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    const newMock = { id: crypto.randomUUID(), ...payload } as Product;
    mockProductsList.unshift(newMock);
    return newMock;
  }
};

/**
 * Atualiza um produto existente no Supabase.
 */
export const updateProduct = async (
  id: string, 
  updates: Partial<Product>
): Promise<Product | null> => {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('Falha ao atualizar produto no Supabase:', error.message);
      const index = mockProductsList.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProductsList[index] = { ...mockProductsList[index], ...payload };
        return mockProductsList[index];
      }
      return null;
    }

    return data as Product;
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    const index = mockProductsList.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProductsList[index] = { ...mockProductsList[index], ...payload };
      return mockProductsList[index];
    }
    return null;
  }
};

/**
 * Alterna o status do produto entre ativo (true) e inativo (false).
 * REGRA ABSOLUTA DE NEGÓCIO: Não implementa deleção física (DELETE).
 */
export const toggleProductStatus = async (
  id: string, 
  currentStatus: boolean
): Promise<Product | null> => {
  return updateProduct(id, { status: !currentStatus });
};

export async function fetchActiveProducts(): Promise<Partial<Product>[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', true)
      .order('nome', { ascending: true });

    if (error) {
      console.warn('Aviso: Erro ao buscar produtos do Supabase (usando fallback local):', error.message);
      return productsData as unknown as Partial<Product>[];
    }

    if (!data || data.length === 0) {
      return productsData as unknown as Partial<Product>[];
    }

    return data;
  } catch (err) {
    console.error('Falha na busca de produtos:', err);
    return productsData as unknown as Partial<Product>[];
  }
}

export const productServices = {
  fetchAllProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  fetchActiveProducts,
};

export default productServices;
