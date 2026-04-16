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
import { Settings2, Trash2, Plus, GripVertical } from 'lucide-react'
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

export interface ColumnDef {
  id: string
  label: string
  type?: 'text' | 'number' | 'date'
  formatStyle?: 'number' | 'currency' | 'percent' | 'text' | 'date'
  readOnly?: boolean
}

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
    if (type === 'date' && value) {
      setLocalVal(value)
    } else {
      setLocalVal(value?.toString() || '')
    }
  }, [value, type])

  if (disabled) {
    let display = value
    if (formatStyle === 'percent') display = formatPercent(Number(value) || 0)
    else if (formatStyle === 'number') display = formatNumber(Number(value) || 0)
    else if (formatStyle === 'currency') display = formatCurrency(Number(value) || 0)
    else if (type === 'date' && value) {
      try {
        display = format(parseISO(value), 'dd/MM/yyyy')
      } catch (e) {
        display = value
      }
    }
    return (
      <div
        className={cn(
          'text-muted-foreground min-w-[60px] px-2 py-1.5',
          type === 'number' ? 'text-right' : '',
        )}
      >
        {display || '-'}
      </div>
    )
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (type === 'number') {
      const parsed = parseFloat(localVal)
      if (!isNaN(parsed) && parsed !== value) {
        onSave(parsed)
      } else {
        setLocalVal(value?.toString() || '0')
      }
    } else if (type === 'text' || type === 'date') {
      if (localVal !== value) {
        onSave(localVal)
      }
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
          type === 'number' ? 'text-right w-24 ml-auto font-mono' : 'w-full min-w-[120px]',
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
        type === 'number' ? 'text-right min-w-[60px] ml-auto font-mono' : 'w-full min-w-[120px]',
      )}
      onClick={() => setIsEditing(true)}
      title="Clique para editar"
    >
      {displayValue || '-'}
    </div>
  )
}

interface ComparisonTableProps {
  data: any[]
  columns: ColumnDef[]
  onUpdate: (id: string, field: string, value: any) => void
  onBulkUpdate?: (ids: string[], updates: Record<string, any>) => void
  onDelete?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onAddRow?: () => void
  onReorder?: (sourceId: string, targetId: string) => void
  onPasteData?: (rows: string[][]) => void
  visibleCols?: Record<string, boolean>
  isExpanded?: boolean
}

export function ComparisonTable({
  data,
  columns,
  onUpdate,
  onBulkUpdate,
  onDelete,
  onBulkDelete,
  onAddRow,
  onReorder,
  onPasteData,
  visibleCols = {},
  isExpanded = false,
}: ComparisonTableProps) {
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (sourceId && sourceId !== targetId && onReorder) {
      onReorder(sourceId, targetId)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!onPasteData) return

    if (e.target instanceof HTMLInputElement) return

    const clipboardData = e.clipboardData.getData('Text')
    if (!clipboardData) return
    const rows = clipboardData.split('\n').filter((r) => r.trim() !== '')
    if (rows.length === 0) return

    const parsedRows = rows.map((row) => row.split('\t'))
    e.preventDefault()
    onPasteData(parsedRows)
  }

  const isAllSelected = data.length > 0 && selectedIds.size === data.length
  const activeColumns = columns.filter((c) => visibleCols[c.id])

  return (
    <div
      className={cn(
        'rounded-xl border bg-white shadow-sm overflow-hidden relative flex flex-col',
        isExpanded ? 'h-full' : '',
      )}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <div className="overflow-auto flex-1 w-full min-h-0 pb-16">
        <Table className="min-w-[1000px] border-collapse text-xs">
          <TableHeader className="bg-slate-50 sticky top-0 z-20 shadow-sm">
            <TableRow>
              <TableHead className="w-[40px] text-center border-r px-2 bg-white sticky left-0 z-30">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              {onReorder && (
                <TableHead className="w-[30px] border-r px-1 bg-white sticky left-[40px] z-30"></TableHead>
              )}

              {activeColumns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    'whitespace-nowrap border-r',
                    col.type === 'number' && 'text-right',
                  )}
                >
                  {col.label}
                </TableHead>
              ))}

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
                <TableCell
                  colSpan={activeColumns.length + 3}
                  className="text-center h-32 text-muted-foreground"
                >
                  Nenhum dado encontrado. Você pode colar dados de uma planilha (Ctrl+V) ou
                  adicionar uma linha.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50/50"
                  data-state={selectedIds.has(row.id) ? 'selected' : undefined}
                  draggable={!!onReorder}
                  onDragStart={(e) => handleDragStart(e, row.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, row.id)}
                >
                  <TableCell className="border-r py-2 px-2 text-center w-[40px] bg-white sticky left-0 z-10">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={(c) => handleSelectRow(row.id, !!c)}
                    />
                  </TableCell>

                  {onReorder && (
                    <TableCell className="border-r py-2 px-1 text-center w-[30px] bg-white sticky left-[40px] z-10 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                      <GripVertical className="w-4 h-4 mx-auto" />
                    </TableCell>
                  )}

                  {activeColumns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn('py-1 px-2 border-r', col.readOnly && 'bg-slate-50/30')}
                    >
                      <EditableCell
                        value={row[col.id]}
                        type={col.type}
                        formatStyle={col.formatStyle}
                        disabled={col.readOnly}
                        onSave={(v) => onUpdate(row.id, col.id, v)}
                      />
                    </TableCell>
                  ))}

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
        <span className="text-xs text-slate-500">
          Dica: Selecione a tabela e use Ctrl+V para colar dados em lote.
        </span>
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
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                    {activeColumns
                      .filter((c) => c.type === 'number' && !c.readOnly)
                      .map((f) => (
                        <div key={f.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`bulk-${f.id}`}
                            checked={!!bulkFields[f.id]}
                            onCheckedChange={(c) =>
                              setBulkFields((prev) => ({ ...prev, [f.id]: !!c }))
                            }
                          />
                          <Label
                            htmlFor={`bulk-${f.id}`}
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
                    Tem certeza que deseja excluir os {selectedIds.size} registros selecionados?
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
