import { useMemo } from 'react'
import { useDatabaseV2 } from '@/hooks/useDatabaseV2'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'

export function DatabaseDashboard({ startDate, endDate, platform }: any) {
  const { campanhas } = useDatabaseV2()

  const chartData = useMemo(() => {
    const map: any = {}
    campanhas.forEach((c) => {
      let pass = true
      if (startDate && c.data_inicio && c.data_inicio < startDate) pass = false
      if (endDate && c.data_fim && c.data_fim > endDate) pass = false
      if (platform && platform !== 'Todas' && c.plataforma_canal !== platform) pass = false
      if (!pass) return

      const plat = c.plataforma_canal || 'Outros'
      if (!map[plat]) map[plat] = { name: plat, leads: 0, investimento: 0, cliques: 0 }
      map[plat].leads += Number(c.leads_base_rd || 0)
      map[plat].investimento += Number(c.investimento || 0)
      map[plat].cliques += Number(c.cliques_base_rd || 0)
    })
    return Object.values(map)
  }, [campanhas, startDate, endDate, platform])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 mt-4">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Leads RD por Plataforma</CardTitle>
          <CardDescription>Total de leads gerados agrupados por canal selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ leads: { color: 'hsl(var(--chart-1))', label: 'Leads RD' } }}
            className="h-[300px] w-full"
          >
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="leads"
                fill="var(--color-leads)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Investimento x Cliques</CardTitle>
          <CardDescription>Relação entre valor investido e cliques gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              investimento: { color: 'hsl(var(--chart-2))', label: 'Investimento (R$)' },
              cliques: { color: 'hsl(var(--chart-3))', label: 'Cliques RD' },
            }}
            className="h-[300px] w-full"
          >
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="left"
                dataKey="investimento"
                fill="var(--color-investimento)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                yAxisId="right"
                dataKey="cliques"
                fill="var(--color-cliques)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
