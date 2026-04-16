ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS plataforma TEXT;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS publico TEXT;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS investimento NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS cliques_base_ads NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS cliques_base_rd NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS leads_base_planilhas_vendas NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS leads_base_rd NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS orcamentos_semana NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS pedidos_semana NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS dif_cliques NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS cvl NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS dif_leads NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS leads_orcamento NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS orcamento_pedido NUMERIC DEFAULT 0;
ALTER TABLE public.performance_campanha ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.performance_campanha_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campanha_id UUID REFERENCES public.performance_campanha(id) ON DELETE CASCADE,
    cliques_base_rd_semana_anterior NUMERIC DEFAULT 0,
    leads_base_rd_semana_anterior NUMERIC DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_calc_performance_campanha ON public.performance_campanha;

CREATE OR REPLACE FUNCTION public.calc_performance_campanha_new() RETURNS trigger AS $$
DECLARE
    hist RECORD;
BEGIN
    NEW.ctr := CASE WHEN NEW.impressoes > 0 THEN (NEW.cliques_base_ads / NEW.impressoes) * 100 ELSE 0 END;
    NEW.cvl := CASE WHEN NEW.leads_base_planilhas_vendas > 0 THEN NEW.leads_base_rd / NEW.leads_base_planilhas_vendas ELSE 0 END;
    NEW.leads_orcamento := CASE WHEN NEW.orcamentos_semana > 0 THEN (NEW.leads_base_rd / NEW.orcamentos_semana) * 100 ELSE 0 END;
    NEW.orcamento_pedido := CASE WHEN NEW.pedidos_semana > 0 THEN (NEW.orcamentos_semana / NEW.pedidos_semana) * 100 ELSE 0 END;

    SELECT * INTO hist FROM public.performance_campanha_historico WHERE campanha_id = NEW.id ORDER BY criado_em DESC LIMIT 1;
    IF FOUND THEN
        NEW.dif_cliques := NEW.cliques_base_rd - hist.cliques_base_rd_semana_anterior;
        NEW.dif_leads := NEW.leads_base_rd - hist.leads_base_rd_semana_anterior;
    ELSE
        NEW.dif_cliques := NEW.cliques_base_rd;
        NEW.dif_leads := NEW.leads_base_rd;
    END IF;

    NEW.cliques := NEW.cliques_base_ads;
    NEW.leads := NEW.leads_base_rd;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_performance_campanha
BEFORE INSERT OR UPDATE ON public.performance_campanha
FOR EACH ROW EXECUTE FUNCTION public.calc_performance_campanha_new();

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'alexis.facchina@glasart.com.br' LIMIT 1;
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.performance_campanha (
      data_inicio, data_fim, plataforma, campanha_nome, publico, investimento, impressoes, alcance,
      cliques_base_ads, cliques_base_rd, leads_base_planilhas_vendas, leads_base_rd,
      orcamentos_semana, pedidos_semana, usuario_id
    ) VALUES (
      '2026-01-01', '2026-01-07', 'Google Ads', 'Campanha de Verão', 'Restaurantes', 5000, 50000, 10000,
      300, 500, 50, 45, 20, 5, v_user_id
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;
