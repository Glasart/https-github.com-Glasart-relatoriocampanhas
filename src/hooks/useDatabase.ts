import { useState, useMemo } from 'react'
import { useAppContext } from '@/context/AppContext'
import { CampaignRow } from '@/types'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { mapToSupabase } from '@/services/campanhas'
import { useAuth } from '@/hooks/use-auth'

export function useDatabase() {
  const { data, setData, logAction } = useAppContext()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>()
  const [sortField, setSortField] = useState<keyof CampaignRow | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)
  const [editingRow, setEditingRow] = useState<CampaignRow | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const processedData = useMemo(() => {
    let result = [...data]

    if (search) {
      result = result.filter(
        (d) =>
          d.campaign.toLowerCase().includes(search.toLowerCase()) ||
          d.platform.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (dateFilter?.from) {
      const fromStr = format(dateFilter.from, 'yyyy-MM-dd')
      const toStr = dateFilter.to ? format(dateFilter.to, 'yyyy-MM-dd') : fromStr
      result = result.filter((d) => d.startDate <= toStr && d.endDate >= fromStr)
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let aVal = a[sortField]
        let bVal = b[sortField]
        if (aVal === undefined || bVal === undefined) return 0
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [data, search, dateFilter, sortField, sortDirection])

  const handleUpdate = async <K extends keyof CampaignRow>(
    id: string,
    field: K,
    value: CampaignRow[K],
  ) => {
    const oldRow = data.find((r) => r.id === id)
    if (!oldRow || !user) return

    const newRow = { ...oldRow, [field]: value }

    // Optimistic Update
    setData((prev) => prev.map((r) => (r.id === id ? newRow : r)))

    try {
      const mapped = mapToSupabase(newRow, user.id)
      const { error } = await supabase.from('campanhas').upsert(mapped)
      if (error) throw error

      logAction('DB_EDIT', `Editou campo '${field}' na campanha ${oldRow.campaign}`, {
        id: newRow.id,
        prev: oldRow,
        next: newRow,
      })
    } catch (e) {
      // rollback could be implemented here
      toast({
        title: 'Erro de sincronização',
        description: 'A alteração pode não ter sido salva.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkPaste = async (
    updates: { id: string; field: keyof CampaignRow; value: number }[],
  ) => {
    if (!user) return

    const newRows: CampaignRow[] = []

    setData((prev) => {
      const newData = [...prev]
      updates.forEach(({ id, field, value }) => {
        const index = newData.findIndex((r) => r.id === id)
        if (index !== -1) {
          const updated = { ...newData[index], [field]: value }
          newData[index] = updated
          newRows.push(updated)
        }
      })
      return newData
    })

    if (newRows.length > 0) {
      try {
        const rowsToUpsert = newRows.map((r) => mapToSupabase(r, user.id))
        const { error } = await supabase.from('campanhas').upsert(rowsToUpsert)
        if (error) throw error

        logAction('DB_BULK_PASTE', `Colou ${newRows.length} valores em massa`, { updates })
        toast({
          title: 'Ação Sincronizada',
          description: `${updates.length} registros atualizados em tempo real.`,
        })
      } catch (e) {
        toast({ title: 'Erro de sincronização', variant: 'destructive' })
      }
    }
  }

  const handleSaveEdit = async () => {
    if (editingRow && user) {
      // Optimistic update
      setData((prev) => prev.map((r) => (r.id === editingRow.id ? editingRow : r)))

      try {
        const mapped = mapToSupabase(editingRow, user.id)
        const { error } = await supabase.from('campanhas').upsert(mapped)

        if (error) throw error

        logAction('DB_EDIT', `Atualizou metadados/métricas da campanha ${editingRow.campaign}`, {
          id: editingRow.id,
          next: editingRow,
        })

        toast({
          title: 'Ação Sincronizada',
          description: 'Os dados foram atualizados com sucesso.',
        })
        // O formulário NÃO é fechado/limpo intencionalmente (setEditingRow(null) removido)
      } catch (e) {
        toast({ title: 'Erro de sincronização', variant: 'destructive' })
      }
    }
  }

  const handleReorder = (draggedId: string, targetId: string) => {
    // Reorder makes less sense in a strictly DB driven table without order index,
    // but keeping optimistic local state update to preserve feature visually if needed
  }

  const handleSort = (field: keyof CampaignRow) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDuplicate = async (row: CampaignRow) => {
    if (!user) return
    const newRow = {
      ...row,
      id: crypto.randomUUID(),
      campaign: `${row.campaign} (Cópia)`,
      createdAt: new Date().toISOString(),
    }

    setData((prev) => [newRow, ...prev])

    try {
      const mapped = mapToSupabase(newRow, user.id)
      const { error } = await supabase.from('campanhas').insert(mapped)
      if (error) throw error

      logAction('DB_DUPLICATE', `Duplicou a campanha ${row.campaign}`, {
        newId: newRow.id,
        row: newRow,
      })
      toast({
        title: 'Ação Sincronizada',
        description: 'Uma cópia foi criada no banco de dados.',
      })
    } catch (e) {
      toast({ title: 'Erro ao duplicar', variant: 'destructive' })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(processedData.map((r) => r.id)))
    else setSelectedIds(new Set())
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) newSet.add(id)
    else newSet.delete(id)
    setSelectedIds(newSet)
  }

  const handleBulkDuplicate = async () => {
    if (!user) return
    const toDuplicate = data.filter((r) => selectedIds.has(r.id))
    const newRows = toDuplicate.map((r) => ({
      ...r,
      id: crypto.randomUUID(),
      campaign: `${r.campaign} (Cópia)`,
      createdAt: new Date().toISOString(),
    }))

    setData((prev) => [...newRows, ...prev])

    try {
      const rowsToInsert = newRows.map((r) => mapToSupabase(r, user.id))
      const { error } = await supabase.from('campanhas').insert(rowsToInsert)
      if (error) throw error

      logAction('DB_BULK_DUPLICATE', `Duplicou ${newRows.length} campanhas em lote`, {
        newIds: newRows.map((r) => r.id),
      })
      toast({
        title: 'Ação Sincronizada',
        description: `${newRows.length} campanhas duplicadas na nuvem.`,
      })
    } catch (e) {
      toast({ title: 'Erro ao duplicar em lote', variant: 'destructive' })
    }
  }

  const handleBulkCopy = () => {
    const toCopy = data.filter((r) => selectedIds.has(r.id))
    navigator.clipboard.writeText(JSON.stringify(toCopy, null, 2))
    toast({
      title: 'Cópia em Lote',
      description: `${toCopy.length} campanhas copiadas para a área de transferência.`,
    })
  }

  const handleResetDatabase = () => {
    // Dangerous operation to delete everything. Disabled for real DB by default unless needed.
  }

  const handleZeroMetrics = async () => {
    if (!user) return
    const newRows = data.map((r) => ({
      ...r,
      cost: 0,
      impressions: 0,
      reach: 0,
      clicksAds: 0,
      clicksRD: 0,
      leadsSalesSheet: 0,
      leadsRD: 0,
      quoteQty: 0,
      quoteValue: 0,
      orderQty: 0,
      orderValue: 0,
    }))

    setData(newRows)

    try {
      const rowsToUpsert = newRows.map((r) => mapToSupabase(r, user.id))
      await supabase.from('campanhas').upsert(rowsToUpsert)
      logAction('DB_ZERO_METRICS', 'Zerou todos os dados numéricos', {})
      toast({ title: 'Ação Sincronizada', description: 'Valores redefinidos para 0.' })
    } catch (e) {
      toast({ title: 'Erro de sincronização', variant: 'destructive' })
    }
  }

  const handleDeleteRecords = async (idsToDelete: Set<string>) => {
    const ids = Array.from(idsToDelete)

    // Optimistic
    setData((prev) => prev.filter((r) => !idsToDelete.has(r.id)))
    setSelectedIds(new Set())

    try {
      const { error } = await supabase.from('campanhas').delete().in('id', ids)
      if (error) throw error

      logAction('DB_DELETE', `Excluiu ${ids.length} registro(s)`, { ids })
      toast({
        title: 'Ação Sincronizada',
        description: `${ids.length} registro(s) excluído(s) do banco de dados.`,
      })
    } catch (e) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  return {
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    sortField,
    sortDirection,
    handleSort,
    editingRow,
    setEditingRow,
    handleSaveEdit,
    handleReorder,
    selectedIds,
    handleSelectAll,
    handleSelectRow,
    processedData,
    handleUpdate,
    handleBulkPaste,
    handleDuplicate,
    handleBulkDuplicate,
    handleBulkCopy,
    handleResetDatabase,
    handleZeroMetrics,
    handleDeleteRecords,
    data,
    setData,
  }
}

export type DatabaseState = ReturnType<typeof useDatabase>
