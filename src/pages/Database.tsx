import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampanhasSection } from '@/components/database/CampanhasSection'
import { CanaisSection } from '@/components/database/CanaisSection'
import { DatabaseDashboard } from '@/components/database/DatabaseDashboard'
import { Database, Megaphone, RadioTower, BarChart3, Printer } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function DatabasePage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [platform, setPlatform] = useState('Todas')

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto animate-fade-in-up pb-12 print:p-0 print:m-0 print:block">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-lg border border-indigo-200 shadow-sm">
            <Database className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Base de Dados Oficial
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Edição rápida estilo Excel. As alterações são salvas automaticamente.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2 bg-white shadow-sm border-slate-200"
          >
            <Printer className="w-4 h-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filtros Globais */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end print:hidden relative z-10">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-600">Data Início</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 w-40"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-600">Data Fim</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 w-40"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-600">Plataforma</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as Plataformas</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(startDate || endDate || platform !== 'Todas') && (
          <Button
            variant="ghost"
            onClick={() => {
              setStartDate('')
              setEndDate('')
              setPlatform('Todas')
            }}
            className="h-9 text-slate-500 hover:text-slate-800"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <Tabs defaultValue="dashboard" className="w-full print:block">
        <TabsList className="mb-6 h-12 w-full justify-start bg-slate-100/50 p-1 border border-slate-200 shadow-sm rounded-lg overflow-x-auto print:hidden">
          <TabsTrigger
            value="dashboard"
            className="h-10 px-6 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            <BarChart3 className="w-4 h-4" /> Dashboard Visual
          </TabsTrigger>
          <TabsTrigger
            value="campanhas"
            className="h-10 px-6 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            <Megaphone className="w-4 h-4" /> Campanhas
          </TabsTrigger>
          <TabsTrigger
            value="canais"
            className="h-10 px-6 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            <RadioTower className="w-4 h-4" /> Comparativo Semanal - Canais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0 outline-none print:block">
          <DatabaseDashboard startDate={startDate} endDate={endDate} platform={platform} />
        </TabsContent>

        <TabsContent value="campanhas" className="mt-0 outline-none print:block print:mt-8">
          <div className="print:block hidden mb-4">
            <h2 className="text-xl font-bold border-b pb-2">Relatório de Campanhas</h2>
          </div>
          <CampanhasSection startDate={startDate} endDate={endDate} platform={platform} />
        </TabsContent>

        <TabsContent value="canais" className="mt-0 outline-none print:block print:mt-8">
          <div className="print:block hidden mb-4">
            <h2 className="text-xl font-bold border-b pb-2">Comparativo Semanal - Canais</h2>
          </div>
          <CanaisSection startDate={startDate} endDate={endDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
