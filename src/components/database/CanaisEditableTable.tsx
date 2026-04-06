import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export const canaisCols = [
  { key: 'data_inicio', label: 'Data Início', type: 'date' },
  { key: 'data_fim', label: 'Data Fim', type: 'date' },
  {
    key: 'canal_nome',
    label: 'Canal',
    type: 'select',
    options: ['E-mail', 'WhatsApp', 'Site', 'Outro'],
  },
  { key: 'acessos', label: 'Acessos', type: 'number' },
  { key: 'cliques', label: 'Cliques', type: 'number' },
  { key: 'conversas', label: 'Conversas', type: 'number' },
  { key: 'leads', label: 'Leads', type: 'number' },
  { key: 'orcamentos_qtd', label: 'Orçamentos (Qtd)', type: 'number' },
  { key: 'orcamentos_valor', label: 'Orçamentos (R$)', type: 'number' },
  { key: 'pedidos_qtd', label: 'Pedidos (Qtd)', type: 'number' },
  { key: 'pedidos_valor', label: 'Pedidos (R$)', type: 'number' },
  { key: 'lead_orcamento_pct', label: '% Lead → Orç.', type: 'readonly', isPct: true, target: 10 },
  {
    key: 'orcamento_pedido_pct',
    label: '% Orç. → Ped.',
    type: 'readonly',
    isPct: true,
    target: 20,
  },
]

const EditableCell = ({ row, col, onSave }: any) => {
  const [val, setVal] = useState(row[col.key] ?? '')

  useEffect(() => {
    setVal(row[col.key] ?? '')
  }, [row[col.key]])

  const handleBlur = () => {
    if (val !== (row[col.key] ?? '')) {
      onSave(row.id, col.key, val)
    }
  }

  if (col.type === 'readonly') {
    let value = row[col.key]
    let isBad = false
    if (col.isPct) {
      value = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(
        Number(value || 0) / 100,
      )
      isBad = col.target !== undefined && Number(row[col.key] || 0) < col.target
    }
    return (
      <div
        className={cn(
          'px-2 py-1.5 w-full rounded text-sm min-w-[80px]',
          isBad ? 'text-red-700 font-bold bg-red-100' : 'text-slate-700',
        )}
      >
        {value}
      </div>
    )
  }

  if (col.type === 'select') {
    return (
      <select
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        className="w-full min-w-[120px] bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded p-1 text-sm outline-none transition-all"
      >
        <option value="">Selecione...</option>
        {col.options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={col.type === 'date' ? 'date' : col.type === 'number' ? 'number' : 'text'}
      value={col.type === 'date' && val ? String(val).split('T')[0] : val}
      onChange={(e) =>
        setVal(
          e.target.type === 'number'
            ? e.target.value === ''
              ? ''
              : Number(e.target.value)
            : e.target.value,
        )
      }
      onBlur={handleBlur}
      className="w-full min-w-[100px] bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded p-1 text-sm outline-none transition-all"
    />
  )
}

export function CanaisEditableTable({
  data,
  onUpdate,
  onDelete,
  selectedIds,
  setSelectedIds,
}: any) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(data.map((r: any) => r.id))
    else setSelectedIds([])
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((x: string) => x !== id))
    else setSelectedIds([...selectedIds, id])
  }

  return (
    <div className="overflow-x-auto border rounded-md shadow-sm max-h-[650px] overflow-y-auto bg-white print:overflow-visible print:max-h-none print:shadow-none print:border-none custom-scrollbar">
      <Table className="text-xs whitespace-nowrap min-w-[1400px] print:min-w-full">
        <TableHeader className="bg-slate-50 sticky top-0 z-20 shadow-sm print:static print:bg-transparent">
          <TableRow className="hover:bg-transparent border-b-slate-200">
            <TableHead className="w-10 px-2 sticky left-0 z-30 bg-slate-50 print:hidden">
              <Checkbox
                checked={data.length > 0 && selectedIds.length === data.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-8 px-0 print:hidden"></TableHead>
            {canaisCols.map((c) => (
              <TableHead
                key={c.key}
                className={cn(
                  'px-3 py-3 font-semibold text-slate-700',
                  (c.isPct || c.type === 'number' || c.type === 'readonly') && 'text-right',
                )}
              >
                {c.label}
              </TableHead>
            ))}
            <TableHead className="text-right px-4 sticky right-0 bg-slate-50 z-30 shadow-[-4px_0_10px_rgba(0,0,0,0.02)] print:hidden">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any) => (
            <TableRow
              key={row.id}
              className={cn(
                'hover:bg-blue-50/50 transition-colors group border-b-slate-100',
                selectedIds.includes(row.id) && 'bg-blue-50/70',
              )}
            >
              <TableCell className="px-2 py-1 sticky left-0 z-10 bg-white group-hover:bg-blue-50/50 print:hidden">
                <Checkbox
                  checked={selectedIds.includes(row.id)}
                  onCheckedChange={() => toggleSelect(row.id)}
                />
              </TableCell>
              <TableCell className="px-0 py-1 text-slate-300 cursor-move print:hidden">
                <GripVertical className="w-4 h-4 mx-auto" />
              </TableCell>
              {canaisCols.map((c) => (
                <TableCell
                  key={c.key}
                  className={cn(
                    'px-1 py-1 border-r border-slate-100/50 last:border-r-0',
                    (c.isPct || c.type === 'number' || c.type === 'readonly') && 'text-right',
                  )}
                >
                  <EditableCell row={row} col={c} onSave={onUpdate} />
                </TableCell>
              ))}
              <TableCell className="text-right px-2 py-1 sticky right-0 bg-white group-hover:bg-blue-50/50 shadow-[-4px_0_10px_rgba(0,0,0,0.02)] print:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDelete(row.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={canaisCols.length + 3}
                className="text-center py-16 text-slate-500 bg-slate-50/50"
              >
                Nenhum registro encontrado. Clique em "Adicionar Linha" para começar a editar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
