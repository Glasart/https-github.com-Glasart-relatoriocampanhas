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
  { key: 'plataforma_canal', label: 'Plataforma' },
  { key: 'nome_produto', label: 'Produto' },
  { key: 'nome_campanha', label: 'Campanha' },
  { key: 'publico', label: 'Público' },
  { key: 'investimento', label: 'Invest. (R$)', isCurrency: true },
  { key: 'impressoes', label: 'Impressões', isNum: true },
  { key: 'alcance', label: 'Alcance', isNum: true },
  { key: 'cliques_base_ads', label: 'Cliques Ads', isNum: true },
  { key: 'cliques_base_rd', label: 'Cliques RD', isNum: true },
  { key: 'ctr', label: 'CTR', isPct: true },
  { key: 'dif_cliques_base_rd', label: 'Dif. Cliques', isNum: true },
  { key: 'leads_base_planilhas_vendas', label: 'Leads Planilha', isNum: true },
  { key: 'leads_base_rd', label: 'Leads RD', isNum: true },
  { key: 'cvl', label: 'CVL', isPct: true },
  { key: 'dif_leads_base_rd', label: 'Dif. Leads', isNum: true },
  { key: 'orcamentos_semana', label: 'Orçamentos', isNum: true },
  { key: 'pedidos_semana', label: 'Pedidos', isNum: true },
  { key: 'leads_orcamento', label: 'Leads/Orç.', isPct: true },
  { key: 'orcamento_pedido', label: 'Orç./Ped.', isPct: true },
]

export function CampanhasTable({ data, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto border rounded-md custom-scrollbar max-h-[600px] overflow-y-auto">
      <Table className="text-xs whitespace-nowrap min-w-[2000px]">
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
