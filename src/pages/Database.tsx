import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampanhasSection } from '@/components/database/CampanhasSection'
import { CanaisSection } from '@/components/database/CanaisSection'
import { Database, Megaphone, RadioTower } from 'lucide-react'

export default function DatabasePage() {
  return (
    <div className="space-y-6 max-w-[1800px] mx-auto animate-fade-in-up pb-12">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2.5 rounded-lg border border-indigo-200 shadow-sm">
          <Database className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Base de Dados Oficial
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie e unifique todos os dados. As edições aqui são sincronizadas instantaneamente
            em nuvem.
          </p>
        </div>
      </div>

      <Tabs defaultValue="campanhas" className="w-full">
        <TabsList className="mb-6 h-12 w-full justify-start bg-slate-100/50 p-1 border border-slate-200 shadow-sm rounded-lg overflow-x-auto">
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

        <TabsContent value="campanhas" className="mt-0 outline-none">
          <CampanhasSection />
        </TabsContent>

        <TabsContent value="canais" className="mt-0 outline-none">
          <CanaisSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
