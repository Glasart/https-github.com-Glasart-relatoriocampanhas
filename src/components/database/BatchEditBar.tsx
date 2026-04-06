import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function BatchEditBar({ selectedIds, columns, onApply, onClear }: any) {
  const [col, setCol] = useState('')
  const [val, setVal] = useState('')

  if (selectedIds.length === 0) return null

  const selectedCol = columns.find((c: any) => c.key === col)

  return (
    <div className="bg-indigo-50/80 p-3 rounded-lg flex flex-wrap items-center gap-4 mb-4 border border-indigo-200 shadow-sm animate-in slide-in-from-top-2 print:hidden">
      <span className="text-sm font-semibold text-indigo-800 bg-indigo-100 px-3 py-1.5 rounded-md">
        {selectedIds.length} selecionados
      </span>
      <select
        className="text-sm border border-indigo-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
        value={col}
        onChange={(e) => setCol(e.target.value)}
      >
        <option value="">Selecione a coluna...</option>
        {columns
          .filter((c: any) => c.type !== 'readonly')
          .map((c: any) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
      </select>

      {selectedCol?.type === 'select' ? (
        <select
          className="text-sm border border-indigo-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        >
          <option value="">Selecione o valor...</option>
          {selectedCol.options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={
            selectedCol?.type === 'date'
              ? 'date'
              : selectedCol?.type === 'number'
                ? 'number'
                : 'text'
          }
          className="text-sm border border-indigo-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
          placeholder="Novo valor em lote"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      )}

      <Button
        size="sm"
        onClick={() => {
          onApply(col, val)
          setCol('')
          setVal('')
        }}
        disabled={!col}
        className="bg-indigo-600 hover:bg-indigo-700 h-9"
      >
        Aplicar em Lote
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onClear}
        className="text-slate-500 hover:text-slate-700 ml-auto"
        title="Cancelar seleção"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  )
}
