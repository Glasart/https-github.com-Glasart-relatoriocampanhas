import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function usePerformanceData() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [outrosCanaisData, setOutrosCanaisData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [perfResponse, canaisResponse] = await Promise.all([
      supabase.from('performance_campanha').select('*').order('criado_em', { ascending: false }),
      supabase.from('outros_canais').select('*').order('criado_em', { ascending: false }),
    ])

    if (perfResponse.data) setPerformanceData(perfResponse.data)
    if (canaisResponse.data) setOutrosCanaisData(canaisResponse.data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()

    const perfSubscription = supabase
      .channel('perf_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'performance_campanha' },
        fetchData,
      )
      .subscribe()

    const canaisSubscription = supabase
      .channel('canais_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'outros_canais' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(perfSubscription)
      supabase.removeChannel(canaisSubscription)
    }
  }, [fetchData])

  const updatePerformance = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from('performance_campanha')
      .update({ [field]: value })
      .eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const updateBulkPerformance = async (ids: string[], updates: Record<string, any>) => {
    const { error } = await supabase.from('performance_campanha').update(updates).in('id', ids)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const deletePerformance = async (id: string) => {
    const { error } = await supabase.from('performance_campanha').delete().eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const deleteBulkPerformance = async (ids: string[]) => {
    const { error } = await supabase.from('performance_campanha').delete().in('id', ids)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const addPerformance = async (data: any) => {
    if (!user) return
    const { error } = await supabase
      .from('performance_campanha')
      .insert({ ...data, usuario_id: user.id })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const updateOutrosCanais = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from('outros_canais')
      .update({ [field]: value })
      .eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const updateBulkOutrosCanais = async (ids: string[], updates: Record<string, any>) => {
    const { error } = await supabase.from('outros_canais').update(updates).in('id', ids)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const deleteOutrosCanais = async (id: string) => {
    const { error } = await supabase.from('outros_canais').delete().eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const deleteBulkOutrosCanais = async (ids: string[]) => {
    const { error } = await supabase.from('outros_canais').delete().in('id', ids)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  const addOutrosCanais = async (data: any) => {
    if (!user) return
    const { error } = await supabase.from('outros_canais').insert({ ...data, usuario_id: user.id })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  return {
    performanceData,
    outrosCanaisData,
    loading,
    updatePerformance,
    updateBulkPerformance,
    deletePerformance,
    deleteBulkPerformance,
    addPerformance,
    updateOutrosCanais,
    updateBulkOutrosCanais,
    deleteOutrosCanais,
    deleteBulkOutrosCanais,
    addOutrosCanais,
  }
}
