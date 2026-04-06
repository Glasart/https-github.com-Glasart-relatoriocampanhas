import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

const formatPercent = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(val)
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

const cols = [
  { key: 'data_inicio', label: 'Data Início' },
  { key: 'data_fim', label: 'Data Fim' },
  { key: 'canal_nome', label: 'Canal' },
  { key: 'acessos', label: 'Acessos', isNum: true },
  { key: 'cliques', label: 'Cliques', isNum: true },
  { key: 'conversas', label: 'Conversas', isNum: true },
  { key: 'leads', label: 'Leads', isNum: true },
  { key: 'orcamentos_qtd', label: 'Orçamentos (Qtd)', isNum: true },
  { key: 'orcamentos_valor', label: 'Orçamentos (R$)', isCurrency: true },
  { key: 'pedidos_qtd', label: 'Pedidos (Qtd)', isNum: true },
  { key: 'pedidos_valor', label: 'Pedidos (R$)', isCurrency: true },
  { key: 'lead_orcamento_pct', label: '% Lead → Orç.', isPct: true },
  { key: 'orcamento_pedido_pct', label: '% Orç. → Ped.', isPct: true },
]

export function CanaisTable({ data, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto border rounded-md custom-scrollbar max-h-[600px] overflow-y-auto">
      <Table className="text-xs whitespace-nowrap min-w-[1200px]">
        <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
          <TableRow>
            {cols.map((c) => (
              <TableHead
                key={c.key}
                className={c.isNum || c.isPct || c.isCurrency ? 'text-right' : ''}
              >
                {c.label}
              </TableHead>
            ))}
            <TableHead className="text-right sticky right-0 bg-slate-50 z-20 shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
              {cols.map((c) => (
                <TableCell
                  key={c.key}
                  className={
                    c.isNum || c.isPct || c.isCurrency ? 'text-right font-mono text-slate-600' : ''
                  }
                >
                  {c.isPct
                    ? formatPercent(Number(row[c.key] || 0) / 100)
                    : c.isCurrency
                      ? formatCurrency(Number(row[c.key] || 0))
                      : row[c.key]}
                </TableCell>
              ))}
              <TableCell className="text-right sticky right-0 bg-white/95 backdrop-blur-sm shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                    onClick={() => onEdit(row)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(row.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={cols.length + 1}
                className="text-center py-12 text-muted-foreground"
              >
                Nenhum registro encontrado no banco de dados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
