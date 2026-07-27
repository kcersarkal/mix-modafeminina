import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const SUPABASE_URL = 'https://edzagtvukayclklhvokk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkemFndHZ1a2F5Y2xrbGh2b2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNjgzNTQsImV4cCI6MjEwMDY0NDM1NH0.dAfwIDKyLB-KCFCxZkWIIO_fWibhOXa2Ax_RT3KFXjM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const MAX_HOURS_STALE = 6

export async function fetchProdutos(options = {}) {
  const { onlyFresh = true, category = null, search = null, limit = null } = options

  let query = supabase
    .from('produtos')
    .select('*')
    .order('spotlight', { ascending: false })
    .order('rating', { ascending: false })

  if (onlyFresh) {
    const cutoff = new Date(Date.now() - MAX_HOURS_STALE * 3600000).toISOString()
    query = query.gte('last_checked_at', cutoff)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar produtos do Supabase:', error)
    return null
  }

  return data
}

export async function fetchProdutoById(id) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }

  return data
}

export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('produtos')
    .select('category')
    .order('category')

  if (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }

  return [...new Set(data.map(p => p.category).filter(Boolean))]
}

export async function fetchProdutosSpotlight() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('spotlight', true)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Erro ao buscar spotlight:', error)
    return []
  }

  return data
}

export async function fetchPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar pedidos:', error)
    return []
  }

  return data
}

export async function inserirPedido(pedido) {
  const { data, error } = await supabase
    .from('pedidos')
    .insert([pedido])
    .select()

  if (error) {
    console.error('Erro ao inserir pedido:', error)
    return null
  }

  return data
}

export async function atualizarProduto(id, updates) {
  const { data, error } = await supabase
    .from('produtos')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Erro ao atualizar produto:', error)
    return null
  }

  return data
}
