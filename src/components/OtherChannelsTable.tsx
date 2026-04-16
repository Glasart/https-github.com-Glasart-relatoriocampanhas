import React, { useState, useRef, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Settings2, Trash2, Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format, parseISO } from 'date-fns'

function EditableCell({
  value,
  onSave,
  type = 'number',
  formatStyle = 'number',
  disabled = false,
}: {
  value: any
  onSave: (val: any) => void
  type?: 'text' | 'number' | 'date'
  formatStyle?: 'number' | 'currency' | 'percent' | 'text' | 'date'
  disabled?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [localVal, setLocalVal] = useState(value?.toString() || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (type === 'date' && value) setLocalVal(value)
    else setLocalVal(value?.toString() || '')
  }, [value, type])

  if (disabled) {
    let display = value
    if (formatStyle === 'percent') display = formatPercent(Number(value) || 0)
    else if (formatStyle === 'number') display = formatNumber(Number(value) || 0)
    else if (formatStyle === 'currency') display = formatCurrency(Number(value) || 0)
    return (
      <div className="text-center text-muted-foreground min-w-[60px] px-2 py-1.5">{display}</div>
    )
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (type === 'number') {
      const parsed = parseFloat(localVal)
      if (!isNaN(parsed) && parsed !== value) onSave(parsed)
      else setLocalVal(value?.toString() || '0')
    } else if (type === 'text' || type === 'date') {
      if (localVal !== value) onSave(localVal)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') inputRef.current?.blur()
    if (e.key === 'Escape') {
      setLocalVal(value?.toString() || '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={cn(
          'h-8 px-2 py-1 text-xs bg-white border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-400',
          type === 'number' ? 'text-right w-24 ml-auto font-mono' : 'w-full',
        )}
      />
    )
  }

  let displayValue = value
  if (type === 'number') {
    const num = Number(value) || 0
    displayValue =
      formatStyle === 'currency'
        ? formatCurrency(num)
        : formatStyle === 'percent'
          ? formatPercent(num)
          : formatNumber(num)
  } else if (type === 'date' && value) {
    try {
      displayValue = format(parseISO(value), 'dd/MM/yyyy')
    } catch (e) {
      displayValue = value
    }
  }

  return (
    <div
      className={cn(
        'cursor-pointer hover:bg-blue-50/50 hover:ring-1 hover:ring-blue-200 px-2 py-1.5 rounded transition-all min-h-[28px] overflow-hidden text-ellipsis whitespace-nowrap',
        type === 'number' ? 'text-right min-w-[60px] ml-auto font-mono' : 'w-full',
      )}
      onClick={() => setIsEditing(true)}
      title="Clique para editar"
    >
      {displayValue || '-'}
    </div>
  )
}

interface OtherChannelsTableProps {
  data: any[]
  onUpdate: (id: string, field: string, value: any) => void
  onBulkUpdate?: (ids: string[], updates: Record<string, any>) => void
  onDelete?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onAddRow?: () => void
  visibleCols?: Record<string, boolean>
  isExpanded?: boolean
}

const BULK_EDIT_FIELDS_OTHER = [
  { id: 'acessos', label: 'Acessos' },
  { id: 'cliques', label: 'Cliques' },
  { id: 'conversas', label: 'Conversas' },
  { id: 'leads', label: 'Leads' },
  { id: 'orcamentos_qtd', label: 'Orçamentos (Qtd)' },
  { id: 'orcamentos_valor', label: 'Orçamentos (Valor)' },
  { id: 'pedidos_qtd', label: 'Pedidos (Qtd)' },
  { id: 'pedidos_valor', label: 'Pedidos (Valor)' },
]

export function OtherChannelsTable({
  data,
  onUpdate,
  onBulkUpdate,
  onDelete,
  onBulkDelete,
  onAddRow,
  visibleCols = {
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
  },
  isExpanded = false,
}: OtherChannelsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [bulkFields, setBulkFields] = useState<Record<string, boolean>>({})
  const [bulkValue, setBulkValue] = useState<string>('0')

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(data.map((r) => r.id)))
    else setSelectedIds(new Set())
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) newSet.add(id)
    else newSet.delete(id)
    setSelectedIds(newSet)
  }

  const handleBulkSave = () => {
    const val = parseFloat(bulkValue)
    if (isNaN(val)) return

    const updates: Record<string, number> = {}
    Object.entries(bulkFields).forEach(([field, isSelected]) => {
      if (isSelected) updates[field] = val
    })

    if (Object.keys(updates).length > 0 && onBulkUpdate) {
      onBulkUpdate(Array.from(selectedIds), updates)
    }

    setIsBulkOpen(false)
    setSelectedIds(new Set())
    setBulkFields({})
    setBulkValue('0')
  }

  const isAllSelected = data.length > 0 && selectedIds.size === data.length

  return (
    <div
      className={cn(
        'rounded-xl border bg-white shadow-sm overflow-hidden relative flex flex-col',
        isExpanded ? 'h-full' : '',
      )}
    >
      <div className="overflow-auto flex-1 w-full min-h-0 pb-16">
        <Table className="min-w-[1200px] border-collapse text-xs">
          <TableHeader className="bg-slate-50 sticky top-0 z-20 shadow-sm">
            <TableRow>
              <TableHead className="w-[40px] text-center border-r px-2 bg-white">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              {visibleCols.data_inicio && (
                <TableHead className="whitespace-nowrap border-r">Data Início</TableHead>
              )}
              {visibleCols.data_fim && (
                <TableHead className="whitespace-nowrap border-r">Data Fim</TableHead>
              )}
              {visibleCols.canal_nome && (
                <TableHead className="whitespace-nowrap border-r min-w-[150px]">
                  Nome do Canal
                </TableHead>
              )}
              {visibleCols.acessos && (
                <TableHead className="text-right whitespace-nowrap">Acessos</TableHead>
              )}
              {visibleCols.cliques && (
                <TableHead className="text-right whitespace-nowrap">Cliques</TableHead>
              )}
              {visibleCols.conversas && (
                <TableHead className="text-right whitespace-nowrap border-r">Conversas</TableHead>
              )}
              {visibleCols.leads && (
                <TableHead className="text-right whitespace-nowrap">Leads</TableHead>
              )}
              {visibleCols.orcamentos_qtd && (
                <TableHead className="text-right whitespace-nowrap">Orçamentos (Qtd)</TableHead>
              )}
              {visibleCols.orcamentos_valor && (
                <TableHead className="text-right whitespace-nowrap border-r">
                  Orçamentos (R$)
                </TableHead>
              )}
              {visibleCols.pedidos_qtd && (
                <TableHead className="text-right whitespace-nowrap">Pedidos (Qtd)</TableHead>
              )}
              {visibleCols.pedidos_valor && (
                <TableHead className="text-right whitespace-nowrap border-r">
                  Pedidos (R$)
                </TableHead>
              )}
              {visibleCols.lead_orcamento_pct && (
                <TableHead className="text-right whitespace-nowrap">% Lead → Orç.</TableHead>
              )}
              {visibleCols.orcamento_pedido_pct && (
                <TableHead className="text-right whitespace-nowrap">% Orç. → Ped.</TableHead>
              )}
              {onDelete && (
                <TableHead className="text-center border-l whitespace-nowrap w-[40px]">
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center h-32 text-muted-foreground">
                  Nenhum dado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50/50"
                  data-state={selectedIds.has(row.id) ? 'selected' : undefined}
                >
                  <TableCell className="border-r py-2 px-2 text-center w-[40px]">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={(c) => handleSelectRow(row.id, !!c)}
                    />
                  </TableCell>
                  {visibleCols.data_inicio && (
                    <TableCell className="py-1 px-2 border-r max-w-[100px]">
                      <EditableCell
                        value={row.data_inicio}
                        type="date"
                        formatStyle="date"
                        onSave={(v) => onUpdate(row.id, 'data_inicio', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.data_fim && (
                    <TableCell className="py-1 px-2 border-r max-w-[100px]">
                      <EditableCell
                        value={row.data_fim}
                        type="date"
                        formatStyle="date"
                        onSave={(v) => onUpdate(row.id, 'data_fim', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.canal_nome && (
                    <TableCell className="py-1 px-2 border-r">
                      <EditableCell
                        value={row.canal_nome}
                        type="text"
                        formatStyle="text"
                        onSave={(v) => onUpdate(row.id, 'canal_nome', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.acessos && (
                    <TableCell className="py-1 px-2">
                      <EditableCell
                        value={row.acessos}
                        onSave={(v) => onUpdate(row.id, 'acessos', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.cliques && (
                    <TableCell className="py-1 px-2">
                      <EditableCell
                        value={row.cliques}
                        onSave={(v) => onUpdate(row.id, 'cliques', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.conversas && (
                    <TableCell className="py-1 px-2 border-r">
                      <EditableCell
                        value={row.conversas}
                        onSave={(v) => onUpdate(row.id, 'conversas', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.leads && (
                    <TableCell className="py-1 px-2">
                      <EditableCell
                        value={row.leads}
                        onSave={(v) => onUpdate(row.id, 'leads', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.orcamentos_qtd && (
                    <TableCell className="py-1 px-2">
                      <EditableCell
                        value={row.orcamentos_qtd}
                        onSave={(v) => onUpdate(row.id, 'orcamentos_qtd', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.orcamentos_valor && (
                    <TableCell className="py-1 px-2 border-r">
                      <EditableCell
                        value={row.orcamentos_valor}
                        formatStyle="currency"
                        onSave={(v) => onUpdate(row.id, 'orcamentos_valor', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.pedidos_qtd && (
                    <TableCell className="py-1 px-2">
                      <EditableCell
                        value={row.pedidos_qtd}
                        onSave={(v) => onUpdate(row.id, 'pedidos_qtd', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.pedidos_valor && (
                    <TableCell className="py-1 px-2 border-r">
                      <EditableCell
                        value={row.pedidos_valor}
                        formatStyle="currency"
                        onSave={(v) => onUpdate(row.id, 'pedidos_valor', v)}
                      />
                    </TableCell>
                  )}
                  {visibleCols.lead_orcamento_pct && (
                    <TableCell className="py-1 px-2 bg-slate-50/30">
                      <EditableCell
                        value={row.lead_orcamento_pct}
                        disabled
                        formatStyle="percent"
                        onSave={() => {}}
                      />
                    </TableCell>
                  )}
                  {visibleCols.orcamento_pedido_pct && (
                    <TableCell className="py-1 px-2 bg-slate-50/30">
                      <EditableCell
                        value={row.orcamento_pedido_pct}
                        disabled
                        formatStyle="percent"
                        onSave={() => {}}
                      />
                    </TableCell>
                  )}
                  {onDelete && (
                    <TableCell className="border-l py-1.5 px-2 text-center w-[40px]">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(row.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-3 border-t bg-slate-50 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onAddRow} className="gap-2">
          <Plus className="w-4 h-4" /> Adicionar Linha
        </Button>
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4 z-50 border border-slate-800 animate-in slide-in-from-bottom-8">
          <Badge
            variant="secondary"
            className="bg-slate-800 text-white hover:bg-slate-700 border-none"
          >
            {selectedIds.size} selecionados
          </Badge>
          <div className="w-px h-4 bg-slate-700 mx-1"></div>

          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-slate-200 hover:text-white hover:bg-slate-800 gap-2"
              >
                <Settings2 className="w-4 h-4" /> Editar em Massa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edição em Massa</DialogTitle>
                <DialogDescription>
                  Selecione os campos numéricos e defina o novo valor para os {selectedIds.size}{' '}
                  registros selecionados.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Valor a ser aplicado</Label>
                  <Input
                    type="number"
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Campos para atualizar</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {BULK_EDIT_FIELDS_OTHER.map((f) => (
                      <div key={f.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`bulk-other-${f.id}`}
                          checked={!!bulkFields[f.id]}
                          onCheckedChange={(c) =>
                            setBulkFields((prev) => ({ ...prev, [f.id]: !!c }))
                          }
                        />
                        <Label
                          htmlFor={`bulk-other-${f.id}`}
                          className="text-xs font-normal cursor-pointer"
                        >
                          {f.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkOpen(false)}>
                  Cancelar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={Object.values(bulkFields).filter(Boolean).length === 0}>
                      Aplicar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Atenção</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja editar esses dados em massa? Essa ação afetará{' '}
                        {selectedIds.size} registros e será salva no banco.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkSave}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {onBulkDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-red-400 hover:text-red-300 hover:bg-slate-800 gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Excluir Selecionados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Registros</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir os {selectedIds.size} registros selecionados do
                    banco de dados? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onBulkDelete(Array.from(selectedIds))
                      setSelectedIds(new Set())
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  )
}
