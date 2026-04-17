import { useMemo, useState, useCallback } from 'react'
import { useAppContext } from '@/context/AppContext'
import { MetricCard } from '@/components/MetricCard'
import { ComparisonTable, ColumnDef } from '@/components/ComparisonTable'
import { OtherChannelsTable } from '@/components/OtherChannelsTable'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { subDays, parseISO, startOfDay, endOfDay, format } from 'date-fns'
import { debounce } from 'lodash'
import { usePerformanceData } from '@/hooks/use-performance-data'
import { useAuth } from '@/hooks/use-auth'

/* ===================== COLUNAS ===================== */

const campCols: ColumnDef[] = [
  { id: 'data_inicio', label: 'Data Início', type: 'date', formatStyle: 'date' },
  { id: 'data_fim', label: 'Data Fim', type: 'date', formatStyle: 'date' },
  { id: 'plataforma', label: 'Plataforma', type: 'text' },
  { id: 'campanha_nome', label: 'Nome da Campanha', type: 'text' },
  { id: 'publico', label: 'Público', type: 'text' },
  { id: 'investimento', label: 'Investimento', type: 'number', formatStyle: 'currency' },
  { id: 'impressoes', label: 'Impressões', type: 'number' },
  { id: 'alcance', label: 'Alcance', type: 'number' },
  { id: 'cliques_base_ads', label: 'Cliques ADS', type: 'number' },
  { id: 'cliques_base_rd', label: 'Cliques RD', type: 'number' },
  { id: 'dif_cliques', label: 'Dif. Cliques', type: 'number', readOnly: true },
  { id: 'ctr', label: 'CTR (%)', type: 'number', formatStyle: 'percent', readOnly: true },
  { id: 'leads_base_planilhas_vendas', label: 'Leads Planilha', type: 'number' },
  { id: 'leads_base_rd', label: 'Leads RD', type: 'number' },
  { id: 'cvl', label: 'CVL', type: 'number', formatStyle: 'percent', readOnly: true },
  { id: 'dif_leads', label: 'Dif. Leads', type: 'number', readOnly: true },
  { id: 'orcamentos_semana', label: 'Orçamentos', type: 'number' },
  { id: 'pedidos_semana', label: 'Pedidos', type: 'number' },
  {
    id: 'leads_orcamento',
    label: 'Leads/Orç',
    type: 'number',
    formatStyle: 'percent',
    readOnly: true,
  },
  {
    id: 'orcamento_pedido',
    label: 'Orç/Ped',
    type: 'number',
    formatStyle: 'percent',
    readOnly: true,
  },
]

/* ===================== COMPONENT ===================== */

export default function Index() {
  const { user } = useAuth()
  const { filters, setFilters } = useAppContext()

  const {
    performanceData,
    outrosCanaisData,
    loading,
    updatePerformance,
    updateBulkPerformance,
    deletePerformance,
    deleteBulkPerformance,
    addPerformance,
    insertBulkPerformance,
    updateOutrosCanais,
    addOutrosCanais,
    reorderPerformance,
  } = usePerformanceData()

  /* ===================== DEBOUNCE ===================== */

  const debouncedUpdate = useMemo(
    () =>
      debounce((id: string, field: string, value: any) => {
        updatePerformance(id, field, value)
      }, 500),
    [updatePerformance],
  )

  /* ===================== FILTRO DE DATA ===================== */

  const dates = useMemo(() => {
    const from = filters.dateRange?.from
    const to = filters.dateRange?.to || from

    return {
      currentFrom: from ? startOfDay(from) : new Date(0),
      currentTo: to ? endOfDay(to) : new Date(),
    }
  }, [filters.dateRange])

  const filterRows = (arr, from, to) =>
    arr.filter((r) => {
      const d = r.data_inicio ? parseISO(r.data_inicio) : new Date()
      return d >= from && d <= to
    })

  const currMergedCamp = useMemo(
    () => filterRows(performanceData, dates.currentFrom, dates.currentTo),
    [performanceData, dates],
  )

  const currMergedOther = useMemo(
    () => filterRows(outrosCanaisData, dates.currentFrom, dates.currentTo),
    [outrosCanaisData, dates],
  )

  /* ===================== PASTE EM LOTE ===================== */

  const handlePasteData = useCallback(
    async (rows: string[][]) => {
      if (!user) return

      const newRecords = rows.map((row) => {
        const record: any = { usuario_id: user.id }

        row.forEach((val, i) => {
          const col = campCols[i]
          if (!col || col.readOnly) return

          if (col.type === 'number') {
            const clean = val.replace(/\./g, '').replace(',', '.')
            record[col.id] = Number(clean) || 0
          } else {
            record[col.id] = val
          }
        })

        return record
      })

      if (newRecords.length) {
        await insertBulkPerformance(newRecords)
      }
    },
    [user, insertBulkPerformance],
  )

  /* ===================== ADD ROW ===================== */

  const handleAddCamp = useCallback(async () => {
    await addPerformance({
      campanha_nome: 'Nova Campanha',
      data_inicio: format(new Date(), 'yyyy-MM-dd'),
      data_fim: format(new Date(), 'yyyy-MM-dd'),
    })
  }, [addPerformance])

  const handleAddOther = useCallback(async () => {
    await addOutrosCanais({
      canal_nome: 'Novo Canal',
      data_inicio: format(new Date(), 'yyyy-MM-dd'),
      data_fim: format(new Date(), 'yyyy-MM-dd'),
    })
  }, [addOutrosCanais])

  /* ===================== UI ===================== */

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold">Comparativo Semanal</h1>

      <DatePickerWithRange
        date={filters.dateRange}
        setDate={(date) => setFilters((prev) => ({ ...prev, dateRange: date }))}
      />

      {loading ? (
        <div className="p-10 text-center">Carregando...</div>
      ) : (
        <>
          <ComparisonTable
            data={currMergedCamp}
            columns={campCols}
            onUpdate={(id, field, value) => debouncedUpdate(id, field, value)}
            onBulkUpdate={updateBulkPerformance}
            onDelete={deletePerformance}
            onBulkDelete={deleteBulkPerformance}
            onAddRow={handleAddCamp}
            onPasteData={handlePasteData}
            onReorder={(source, target) => reorderPerformance(source, target, currMergedCamp)}
          />

          <OtherChannelsTable
            data={currMergedOther}
            onUpdate={updateOutrosCanais}
            onAddRow={handleAddOther}
          />
        </>
      )}
    </div>
  )
}
