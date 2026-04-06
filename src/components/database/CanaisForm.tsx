import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const fields = [
  { name: 'data_inicio', label: 'Data Início', type: 'date' },
  { name: 'data_fim', label: 'Data Fim', type: 'date' },
  { name: 'canal_nome', label: 'Nome do Canal' },
  { name: 'acessos', label: 'Acessos', type: 'number' },
  { name: 'cliques', label: 'Cliques', type: 'number' },
  { name: 'conversas', label: 'Conversas', type: 'number' },
  { name: 'leads', label: 'Leads', type: 'number' },
  { name: 'orcamentos_qtd', label: 'Orçamentos (Qtd)', type: 'number' },
  { name: 'orcamentos_valor', label: 'Orçamentos (R$)', type: 'number' },
  { name: 'pedidos_qtd', label: 'Pedidos (Qtd)', type: 'number' },
  { name: 'pedidos_valor', label: 'Pedidos (R$)', type: 'number' },
]

export function CanaisForm({ onSubmit, initialData, isEdit }: any) {
  const [form, setForm] = useState(
    initialData || {
      data_inicio: '',
      data_fim: '',
      canal_nome: '',
      acessos: 0,
      cliques: 0,
      conversas: 0,
      leads: 0,
      orcamentos_qtd: 0,
      orcamentos_valor: 0,
      pedidos_qtd: 0,
      pedidos_valor: 0,
    },
  )

  const handleChange = (e: any) => {
    const { name, value, type } = e.target
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit(form)
    // Form is intentionally not cleared to maintain values for consecutive entries
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">{f.label}</Label>
          <Input
            type={f.type || 'text'}
            name={f.name}
            value={form[f.name] || (f.type === 'number' ? 0 : '')}
            onChange={handleChange}
            className="h-9 text-sm"
            step="any"
            required={f.type === 'date'}
          />
        </div>
      ))}
      <div className="col-span-full flex justify-end mt-2 pt-4 border-t border-slate-100">
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-8"
        >
          {isEdit ? 'Atualizar Canal' : 'Salvar Novo Canal'}
        </Button>
      </div>
    </form>
  )
}
