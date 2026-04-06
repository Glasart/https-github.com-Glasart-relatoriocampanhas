import { useState, useMemo } from 'react'
import { useDatabaseV2 } from '@/hooks/useDatabaseV2'
import { CampanhasEditableTable, campanhasCols } from './CampanhasEditableTable'
import { BatchEditBar } from './BatchEditBar'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

export function CampanhasSection({ startDate, endDate, platform }: any) {
  const {
    campanhas,
    addCampanha,
    updateCampanha,
    updateMultipleCampanhas,
    deleteCampanha,
    deleteMultipleCampanhas,
  } = useDatabaseV2()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    return campanhas.filter((c) => {
      let pass = true
      if (startDate && c.data_inicio && c.data_inicio < startDate) pass = false
      if (endDate && c.data_fim && c.data_fim > endDate) pass = false
      if (platform && platform !== 'Todas' && c.plataforma_canal !== platform) pass = false
      return pass
    })
  }, [campanhas, startDate, endDate, platform])

  const handleApplyBatch = (col: string, val: string) => {
    if (!col) return
    const updateData = { [col]: val }
    updateMultipleCampanhas(selectedIds, updateData)
    setSelectedIds([])
  }

  const handleDeleteBatch = () => {
    if (confirm('Tem certeza que deseja deletar os registros selecionados?')) {
      deleteMultipleCampanhas(selectedIds)
      setSelectedIds([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Registros de Campanhas</h2>
          <p className="text-sm text-muted-foreground">
            Adicione e edite os dados das suas campanhas. O salvamento é automático.
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteBatch} className="gap-2">
              <Trash2 className="w-4 h-4" /> Excluir {selectedIds.length}
            </Button>
          )}
          <Button
            onClick={() =>
              addCampanha({ plataforma_canal: platform !== 'Todas' ? platform : 'Google Ads' })
            }
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Adicionar Linha
          </Button>
        </div>
      </div>

      <BatchEditBar
        selectedIds={selectedIds}
        columns={campanhasCols}
        onApply={handleApplyBatch}
        onClear={() => setSelectedIds([])}
      />

      <CampanhasEditableTable
        data={filtered}
        onUpdate={(id: string, key: string, val: any) => updateCampanha(id, { [key]: val })}
        onDelete={deleteCampanha}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  )
}
