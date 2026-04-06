import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const fields = [
  { name: 'data_inicio', label: 'Data Início', type: 'date' },
  { name: 'data_fim', label: 'Data Fim', type: 'date' },
  { name: 'plataforma_canal', label: 'Plataforma/Canal' },
  { name: 'nome_produto', label: 'Nome do Produto' },
  { name: 'nome_campanha', label: 'Nome da Campanha' },
  { name: 'publico', label: 'Público' },
  { name: 'investimento', label: 'Investimento (R$)', type: 'number' },
  { name: 'impressoes', label: 'Impressões', type: 'number' },
  { name: 'alcance', label: 'Alcance', type: 'number' },
  { name: 'cliques_base_ads', label: 'Cliques (Ads)', type: 'number' },
  { name: 'cliques_base_rd', label: 'Cliques (RD)', type: 'number' },
  { name: 'leads_base_planilhas_vendas', label: 'Leads (Planilha Vendas)', type: 'number' },
  { name: 'leads_base_rd', label: 'Leads (RD)', type: 'number' },
  { name: 'orcamentos_semana', label: 'Orçamentos (Semana)', type: 'number' },
  { name: 'pedidos_semana', label: 'Pedidos (Semana)', type: 'number' },
]

export function CampanhasForm({ onSubmit, initialData, isEdit }: any) {
  const [form, setForm] = useState(
    initialData || {
      data_inicio: '',
      data_fim: '',
      plataforma_canal: '',
      nome_produto: '',
      nome_campanha: '',
      publico: '',
      investimento: 0,
      impressoes: 0,
      alcance: 0,
      cliques_base_ads: 0,
      cliques_base_rd: 0,
      leads_base_planilhas_vendas: 0,
      leads_base_rd: 0,
      orcamentos_semana: 0,
      pedidos_semana: 0,
    },
  )

  const handleChange = (e: any) => {
    const { name, value, type } = e.target
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit(form)
    // IMPORTANT: Form is not cleared here to keep values filled as requested.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto px-8"
        >
          {isEdit ? 'Atualizar Campanha' : 'Salvar Nova Campanha'}
        </Button>
      </div>
    </form>
  )
}
