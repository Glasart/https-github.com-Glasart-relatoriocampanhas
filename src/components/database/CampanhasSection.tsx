import { useState, useMemo } from 'react'
import { useDatabaseV2 } from '@/hooks/useDatabaseV2'
import { CampanhasForm } from './CampanhasForm'
import { CampanhasTable } from './CampanhasTable'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search } from 'lucide-react'

export function CampanhasSection() {
  const { campanhas, addCampanha, updateCampanha, deleteCampanha } = useDatabaseV2()
  const [editingRow, setEditingRow] = useState<any>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return campanhas.filter(
      (c) =>
        c.nome_campanha?.toLowerCase().includes(search.toLowerCase()) ||
        c.plataforma_canal?.toLowerCase().includes(search.toLowerCase()) ||
        c.nome_produto?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [campanhas, search])

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800 border-b pb-3">Adicionar Nova Campanha</h2>
        <CampanhasForm onSubmit={addCampanha} />
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Registros de Campanhas</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plataforma, produto ou campanha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50"
            />
          </div>
        </div>
        <CampanhasTable data={filtered} onEdit={setEditingRow} onDelete={deleteCampanha} />
      </div>

      <Dialog open={!!editingRow} onOpenChange={(open) => !open && setEditingRow(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Registro de Campanha</DialogTitle>
          </DialogHeader>
          {editingRow && (
            <CampanhasForm
              initialData={editingRow}
              isEdit
              onSubmit={(data: any) => {
                const {
                  id,
                  criado_em,
                  usuario_id,
                  ctr,
                  dif_cliques_base_rd,
                  cvl,
                  dif_leads_base_rd,
                  leads_orcamento,
                  orcamento_pedido,
                  ...rest
                } = data
                updateCampanha(editingRow.id, rest)
                setEditingRow(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
