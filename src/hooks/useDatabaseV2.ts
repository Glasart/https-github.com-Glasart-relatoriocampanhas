import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function useDatabaseV2() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [campanhas, setCampanhas] = useState<any[]>([])
  const [canais, setCanais] = useState<any[]>([])

  const fetchData = async () => {
    if (!user) return
    const [{ data: cData }, { data: canData }] = await Promise.all([
      supabase.from('campanhas').select('*').order('criado_em', { ascending: false }),
      supabase.from('canais_comunicacao').select('*').order('criado_em', { ascending: false }),
    ])
    if (cData) setCampanhas(cData)
    if (canData) setCanais(canData)
  }

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('db-changes-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campanhas' }, fetchData)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'canais_comunicacao' },
        fetchData,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const addCampanha = async (data: any) => {
    if (!user) return
    const { error } = await supabase.from('campanhas').insert({ ...data, usuario_id: user.id })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Registro de campanha salvo na nuvem.' })
  }

  const updateCampanha = async (id: string, data: any) => {
    const { error } = await supabase.from('campanhas').update(data).eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Registro de campanha atualizado.' })
  }

  const deleteCampanha = async (id: string) => {
    const { error } = await supabase.from('campanhas').delete().eq('id', id)
    if (error) toast({ title: 'Erro', variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Registro de campanha excluído.' })
  }

  const addCanal = async (data: any) => {
    if (!user) return
    const { error } = await supabase
      .from('canais_comunicacao')
      .insert({ ...data, usuario_id: user.id })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Registro de canal salvo na nuvem.' })
  }

  const updateCanal = async (id: string, data: any) => {
    const { error } = await supabase.from('canais_comunicacao').update(data).eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Registro de canal atualizado.' })
  }

  const deleteCanal = async (id: string) => {
    const { error } = await supabase.from('canais_comunicacao').delete().eq('id', id)
    if (error) toast({ title: 'Erro', variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Registro de canal excluído.' })
  }

  return {
    campanhas,
    canais,
    addCampanha,
    updateCampanha,
    deleteCampanha,
    addCanal,
    updateCanal,
    deleteCanal,
  }
}
