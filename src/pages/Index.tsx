import { useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { MetricCard } from '@/components/MetricCard'
import { ComparisonTable, ColumnDef } from '@/components/ComparisonTable'
import { OtherChannelsTable } from '@/components/OtherChannelsTable'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { subDays, parseISO, startOfDay, endOfDay, format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Settings2, Maximize2, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePerformanceData } from '@/hooks/use-performance-data'
import { useAuth } from '@/hooks/use-auth'

const campCols: ColumnDef[] = [
  { id: 'data_inicio', label: 'Data Início', type: 'date', formatStyle: 'date' },
  { id: 'data_fim', label: 'Data Fim', type: 'date', formatStyle: 'date' },
  { id: 'plataforma', label: 'Plataforma', type: 'text', formatStyle: 'text' },
  { id: 'campanha_nome', label: 'Nome da Campanha', type: 'text', formatStyle: 'text' },
  { id: 'publico', label: 'Público', type: 'text', formatStyle: 'text' },
  { id: 'investimento', label: 'Investimento', type: 'number', formatStyle: 'currency' },
  { id: 'impressoes', label: 'Impressões', type: 'number', formatStyle: 'number' },
  { id: 'alcance', label: 'Alcance', type: 'number', formatStyle: 'number' },
  { id: 'cliques_base_ads', label: 'Cliques Base ADS', type: 'number', formatStyle: 'number' },
  { id: 'cliques_base_rd', label: 'Cliques Base RD', type: 'number', formatStyle: 'number' },
  {
    id: 'dif_cliques',
    label: 'Dif. Cliques',
    type: 'number',
    formatStyle: 'number',
    readOnly: true,
  },
  { id: 'ctr', label: 'CTR (%)', type: 'number', formatStyle: 'percent', readOnly: true },
  {
    id: 'leads_base_planilhas_vendas',
    label: 'Leads Planilha Vendas',
    type: 'number',
    formatStyle: 'number',
  },
  { id: 'leads_base_rd', label: 'Leads RD', type: 'number', formatStyle: 'number' },
  { id: 'dif_leads', label: 'Dif. Leads', type: 'number', formatStyle: 'number', readOnly: true },
  { id: 'cvl', label: 'CVL', type: 'number', formatStyle: 'number', readOnly: true },
  { id: 'orcamentos_semana', label: 'Orçamentos Sem.', type: 'number', formatStyle: 'number' },
  { id: 'pedidos_semana', label: 'Pedidos Sem.', type: 'number', formatStyle: 'number' },
  {
    id: 'leads_orcamento',
    label: 'Leads/Orç (%)',
    type: 'number',
    formatStyle: 'percent',
    readOnly: true,
  },
  {
    id: 'orcamento_pedido',
    label: 'Orç/Ped (%)',
    type: 'number',
    formatStyle: 'percent',
    readOnly: true,
  },
]

const otherCols = [
  { id: 'data_inicio', label: 'Data Início' },
  { id: 'data_fim', label: 'Data Fim' },
  { id: 'canal_nome', label: 'Nome do Canal' },
  { id: 'acessos', label: 'Acessos' },
  { id: 'cliques', label: 'Cliques' },
  { id: 'conversas', label: 'Conversas' },
  { id: 'leads', label: 'Leads' },
  { id: 'orcamentos_qtd', label: 'Orçamentos (Qtd)' },
  { id: 'orcamentos_valor', label: 'Orçamentos (R$)' },
  { id: 'pedidos_qtd', label: 'Pedidos (Qtd)' },
  { id: 'pedidos_valor', label: 'Pedidos (R$)' },
  { id: 'lead_orcamento_pct', label: '% Lead → Orç.' },
  { id: 'orcamento_pedido_pct', label: '% Orç. → Ped.' },
]

const SectionHeader = ({ title, cols, visibleCols, setVisibleCols, onExpand, extra }: any) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs">
              <Settings2 className="w-4 h-4" /> Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
            {cols.map((col: any) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={visibleCols[col.id]}
                onCheckedChange={(c) => setVisibleCols((prev: any) => ({ ...prev, [col.id]: !!c }))}
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 bg-white text-xs"
          onClick={onExpand}
        >
          <Maximize2 className="w-4 h-4" /> Expandir
        </Button>
      </div>
    </div>
  )
}

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
    reorderPerformance,
    insertBulkPerformance,
    updateOutrosCanais,
    updateBulkOutrosCanais,
    deleteOutrosCanais,
    deleteBulkOutrosCanais,
    addOutrosCanais,
  } = usePerformanceData()

  const [expandedState, setExpandedState] = useState({ camp: false, other: false })
  const [platformFilter, setPlatformFilter] = useState<string>('all')

  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(
    campCols.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}),
  )

  const [visibleOtherCols, setVisibleOtherCols] = useState<Record<string, boolean>>({
    data_inicio: true,
    data_fim: true,
    canal_nome: true,
    acessos: true,
    cliques: true,
    conversas: true,
    leads: true,
    orcamentos_qtd: true,
    orcamentos_valor: true,
    pedidos_qtd: true,
    pedidos_valor: true,
    lead_orcamento_pct: true,
    orcamento_pedido_pct: true,
  })

  const dates = useMemo(() => {
    const baseFrom = filters.dateRange?.from
    const baseTo = filters.dateRange?.to || baseFrom
    const currentFrom = baseFrom ? startOfDay(baseFrom) : new Date(0)
    const currentTo = baseTo ? endOfDay(baseTo) : new Date(8640000000000000)
    const pastFrom = subDays(currentFrom, 7)
    const pastTo = subDays(currentTo, 7)
    return { currentFrom, currentTo, pastFrom, pastTo }
  }, [filters.dateRange])

  const filterRows = (arr: any[], from: Date, to: Date) => {
    return arr.filter((r) => {
      const dDate = r.data_inicio ? parseISO(r.data_inicio) : new Date()
      return dDate >= from && dDate <= to
    })
  }

  const platforms = useMemo(() => {
    const set = new Set(performanceData.map((r) => r.plataforma).filter(Boolean))
    return Array.from(set)
  }, [performanceData])

  const currMergedCamp = useMemo(() => {
    let res = filterRows(performanceData, dates.currentFrom, dates.currentTo)
    if (platformFilter !== 'all') res = res.filter((r) => r.plataforma === platformFilter)
    return res
  }, [performanceData, dates, platformFilter])

  const currMergedOther = useMemo(
    () => filterRows(outrosCanaisData, dates.currentFrom, dates.currentTo),
    [outrosCanaisData, dates],
  )

  const totals = useMemo(() => {
    const pastCamp = filterRows(performanceData, dates.pastFrom, dates.pastTo)
    const pastOther = filterRows(outrosCanaisData, dates.pastFrom, dates.pastTo)

    return {
      currInvestimento: currMergedCamp.reduce((s, r) => s + (Number(r.investimento) || 0), 0),
      pastInvestimento: pastCamp.reduce((s, r) => s + (Number(r.investimento) || 0), 0),
      currOrcamento: currMergedOther.reduce((s, r) => s + (Number(r.orcamentos_valor) || 0), 0),
      pastOrcamento: pastOther.reduce((s, r) => s + (Number(r.orcamentos_valor) || 0), 0),
      currLeads:
        currMergedCamp.reduce((s, r) => s + (Number(r.leads_base_rd) || 0), 0) +
        currMergedOther.reduce((s, r) => s + (Number(r.leads) || 0), 0),
      pastLeads:
        pastCamp.reduce((s, r) => s + (Number(r.leads_base_rd) || 0), 0) +
        pastOther.reduce((s, r) => s + (Number(r.leads) || 0), 0),
      currPedidos:
        currMergedCamp.reduce((s, r) => s + (Number(r.pedidos_semana) || 0), 0) +
        currMergedOther.reduce((s, r) => s + (Number(r.pedidos_qtd) || 0), 0),
      pastPedidos:
        pastCamp.reduce((s, r) => s + (Number(r.pedidos_semana) || 0), 0) +
        pastOther.reduce((s, r) => s + (Number(r.pedidos_qtd) || 0), 0),
    }
  }, [currMergedCamp, currMergedOther, performanceData, outrosCanaisData, dates])

  const handlePasteData = async (rows: string[][]) => {
    if (!user) return
    const visibleColIds = campCols.filter((c) => visibleCols[c.id] && !c.readOnly).map((c) => c.id)

    const newRecords = rows.map((row) => {
      const record: any = { usuario_id: user.id }
      row.forEach((val, i) => {
        if (i < visibleColIds.length) {
          const colId = visibleColIds[i]
          const colDef = campCols.find((c) => c.id === colId)
          if (colDef?.type === 'number') {
            let cleanVal = val.replace(/\./g, '').replace(',', '.')
            record[colId] = Number(cleanVal.replace(/[^0-9.-]+/g, '')) || 0
          } else {
            record[colId] = val
          }
        }
      })
      return record
    })

    if (newRecords.length > 0) {
      await insertBulkPerformance(newRecords)
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Comparativo Semanal</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Análise agregada das campanhas e canais. Edite diretamente na tabela e as alterações
            serão salvas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 mr-2">Período:</span>
            <DatePickerWithRange
              date={filters.dateRange}
              setDate={(date) => setFilters((prev) => ({ ...prev, dateRange: date }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Investimento Total"
          current={totals.currInvestimento}
          past={totals.pastInvestimento}
          type="currency"
          inverseGood
        />
        <MetricCard
          title="Orçamento Total"
          current={totals.currOrcamento}
          past={totals.pastOrcamento}
          type="currency"
        />
        <MetricCard
          title="Leads Totais"
          current={totals.currLeads}
          past={totals.pastLeads}
          type="number"
        />
        <MetricCard
          title="Pedidos Totais"
          current={totals.currPedidos}
          past={totals.pastPedidos}
          type="number"
        />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-slate-50/50 rounded-xl border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="pt-4">
            <SectionHeader
              title="Performance de Campanhas"
              cols={campCols}
              visibleCols={visibleCols}
              setVisibleCols={setVisibleCols}
              onExpand={() => setExpandedState((prev) => ({ ...prev, camp: true }))}
              extra={
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                    <Filter className="w-3 h-3 mr-2" />
                    <SelectValue placeholder="Plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Plataformas</SelectItem>
                    {platforms.map((p) => (
                      <SelectItem key={p as string} value={p as string}>
                        {p as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            />
            <ComparisonTable
              data={currMergedCamp}
              columns={campCols}
              onUpdate={updatePerformance}
              onBulkUpdate={updateBulkPerformance}
              onDelete={deletePerformance}
              onBulkDelete={deleteBulkPerformance}
              onAddRow={() =>
                addPerformance({
                  campanha_nome: 'Nova Campanha',
                  data_inicio: format(new Date(), 'yyyy-MM-dd'),
                  data_fim: format(new Date(), 'yyyy-MM-dd'),
                })
              }
              onReorder={(src, tgt) => reorderPerformance(src, tgt, currMergedCamp)}
              onPasteData={handlePasteData}
              visibleCols={visibleCols}
            />
          </div>

          <div className="pt-4">
            <SectionHeader
              title="Outros Canais"
              cols={otherCols}
              visibleCols={visibleOtherCols}
              setVisibleCols={setVisibleOtherCols}
              onExpand={() => setExpandedState((prev) => ({ ...prev, other: true }))}
            />
            <OtherChannelsTable
              data={currMergedOther}
              onUpdate={updateOutrosCanais}
              onBulkUpdate={updateBulkOutrosCanais}
              onDelete={deleteOutrosCanais}
              onBulkDelete={deleteBulkOutrosCanais}
              onAddRow={() =>
                addOutrosCanais({
                  canal_nome: 'Novo Canal',
                  data_inicio: format(new Date(), 'yyyy-MM-dd'),
                  data_fim: format(new Date(), 'yyyy-MM-dd'),
                })
              }
              visibleCols={visibleOtherCols}
            />
          </div>
        </div>
      )}

      <Dialog
        open={expandedState.camp}
        onOpenChange={(v) => setExpandedState((prev) => ({ ...prev, camp: v }))}
      >
        <DialogContent className="max-w-[98vw] w-full h-[96vh] flex flex-col p-4 sm:p-6 gap-4">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <DialogTitle className="text-xl">Visualização Completa - Campanhas</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0 -mx-2 sm:-mx-0">
            <ComparisonTable
              data={currMergedCamp}
              columns={campCols}
              onUpdate={updatePerformance}
              onBulkUpdate={updateBulkPerformance}
              onDelete={deletePerformance}
              onBulkDelete={deleteBulkPerformance}
              onAddRow={() =>
                addPerformance({
                  campanha_nome: 'Nova Campanha',
                  data_inicio: format(new Date(), 'yyyy-MM-dd'),
                  data_fim: format(new Date(), 'yyyy-MM-dd'),
                })
              }
              onReorder={(src, tgt) => reorderPerformance(src, tgt, currMergedCamp)}
              onPasteData={handlePasteData}
              visibleCols={visibleCols}
              isExpanded={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={expandedState.other}
        onOpenChange={(v) => setExpandedState((prev) => ({ ...prev, other: v }))}
      >
        <DialogContent className="max-w-[98vw] w-full h-[96vh] flex flex-col p-4 sm:p-6 gap-4">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <DialogTitle className="text-xl">Visualização Completa - Outros Canais</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0 -mx-2 sm:-mx-0">
            <OtherChannelsTable
              data={currMergedOther}
              onUpdate={updateOutrosCanais}
              onBulkUpdate={updateBulkOutrosCanais}
              onDelete={deleteOutrosCanais}
              onBulkDelete={deleteBulkOutrosCanais}
              onAddRow={() =>
                addOutrosCanais({
                  canal_nome: 'Novo Canal',
                  data_inicio: format(new Date(), 'yyyy-MM-dd'),
                  data_fim: format(new Date(), 'yyyy-MM-dd'),
                })
              }
              visibleCols={visibleOtherCols}
              isExpanded={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
