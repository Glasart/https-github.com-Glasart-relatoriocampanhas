import { useState, useMemo } from 'react'
import { useDatabaseV2 } from '@/hooks/useDatabaseV2'
import { CanaisForm } from './CanaisForm'
import { CanaisTable } from './CanaisTable'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search } from 'lucide-react'

export function CanaisSection() {
  const { canais, addCanal, updateCanal, deleteCanal } = useDatabaseV2()
  const [editingRow, setEditingRow] = useState<any>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return canais.filter((c) => c.canal_nome?.toLowerCase().includes(search.toLowerCase()))
  }, [canais, search])

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800 border-b pb-3">
          Adicionar Novo Canal de Comunicação
        </h2>
        <CanaisForm onSubmit={addCanal} />
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Registros de Canais</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do canal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50"
            />
          </div>
        </div>
        <CanaisTable data={filtered} onEdit={setEditingRow} onDelete={deleteCanal} />
      </div>

      <Dialog open={!!editingRow} onOpenChange={(open) => !open && setEditingRow(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Registro de Canal</DialogTitle>
          </DialogHeader>
          {editingRow && (
            <CanaisForm
              initialData={editingRow}
              isEdit
              onSubmit={(data: any) => {
                const {
                  id,
                  criado_em,
                  usuario_id,
                  lead_orcamento_pct,
                  orcamento_pedido_pct,
                  ...rest
                } = data
                updateCanal(editingRow.id, rest)
                setEditingRow(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
