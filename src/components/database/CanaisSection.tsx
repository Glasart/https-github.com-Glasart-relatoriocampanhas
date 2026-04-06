import { useState, useMemo } from 'react'
import { useDatabaseV2 } from '@/hooks/useDatabaseV2'
import { CanaisEditableTable, canaisCols } from './CanaisEditableTable'
import { BatchEditBar } from './BatchEditBar'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

export function CanaisSection({ startDate, endDate }: any) {
  const { canais, addCanal, updateCanal, updateMultipleCanais, deleteCanal, deleteMultipleCanais } =
    useDatabaseV2()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    return canais.filter((c) => {
      let pass = true
      if (startDate && c.data_inicio && c.data_inicio < startDate) pass = false
      if (endDate && c.data_fim && c.data_fim > endDate) pass = false
      return pass
    })
  }, [canais, startDate, endDate])

  const handleApplyBatch = (col: string, val: string) => {
    if (!col) return
    const updateData = { [col]: val }
    updateMultipleCanais(selectedIds, updateData)
    setSelectedIds([])
  }

  const handleDeleteBatch = () => {
    if (confirm('Tem certeza que deseja deletar os registros selecionados?')) {
      deleteMultipleCanais(selectedIds)
      setSelectedIds([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Canais de Comunicação</h2>
          <p className="text-sm text-muted-foreground">
            Comparativo semanal e performance dos canais auxiliares.
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteBatch} className="gap-2">
              <Trash2 className="w-4 h-4" /> Excluir {selectedIds.length}
            </Button>
          )}
          <Button
            onClick={() => addCanal({ canal_nome: 'E-mail' })}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Adicionar Linha
          </Button>
        </div>
      </div>

      <BatchEditBar
        selectedIds={selectedIds}
        columns={canaisCols}
        onApply={handleApplyBatch}
        onClear={() => setSelectedIds([])}
      />

      <CanaisEditableTable
        data={filtered}
        onUpdate={(id: string, key: string, val: any) => updateCanal(id, { [key]: val })}
        onDelete={deleteCanal}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  )
}
