-- Backup the old table
ALTER TABLE IF EXISTS public.campanhas RENAME TO campanhas_old_backup;

-- Create the historico table
CREATE TABLE IF NOT EXISTS public.campanhas_historico_semanal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campanha_id UUID,
    cliques_base_rd_semana_anterior NUMERIC DEFAULT 0,
    leads_base_rd_semana_anterior NUMERIC DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recreate the new campanhas table exactly as requested
CREATE TABLE public.campanhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_inicio DATE,
    data_fim DATE,
    plataforma_canal TEXT,
    nome_produto TEXT,
    nome_campanha TEXT,
    publico TEXT,
    investimento NUMERIC DEFAULT 0,
    impressoes NUMERIC DEFAULT 0,
    alcance NUMERIC DEFAULT 0,
    cliques_base_ads NUMERIC DEFAULT 0,
    cliques_base_rd NUMERIC DEFAULT 0,
    leads_base_planilhas_vendas NUMERIC DEFAULT 0,
    leads_base_rd NUMERIC DEFAULT 0,
    orcamentos_semana NUMERIC DEFAULT 0,
    pedidos_semana NUMERIC DEFAULT 0,
    ctr NUMERIC DEFAULT 0,
    dif_cliques_base_rd NUMERIC DEFAULT 0,
    cvl NUMERIC DEFAULT 0,
    dif_leads_base_rd NUMERIC DEFAULT 0,
    leads_orcamento NUMERIC DEFAULT 0,
    orcamento_pedido NUMERIC DEFAULT 0,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "campanhas_all" ON public.campanhas;
CREATE POLICY "campanhas_all" ON public.campanhas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger logic for campanhas
CREATE OR REPLACE FUNCTION calculate_campanhas_metrics() RETURNS trigger AS $BODY$
DECLARE
    hist RECORD;
BEGIN
    NEW.ctr := CASE WHEN NEW.impressoes > 0 THEN (NEW.cliques_base_ads / NEW.impressoes) * 100 ELSE 0 END;
    NEW.cvl := CASE WHEN NEW.leads_base_planilhas_vendas > 0 THEN NEW.leads_base_rd / NEW.leads_base_planilhas_vendas ELSE 0 END;
    NEW.leads_orcamento := CASE WHEN NEW.orcamentos_semana > 0 THEN (NEW.leads_base_rd / NEW.orcamentos_semana) * 100 ELSE 0 END;
    NEW.orcamento_pedido := CASE WHEN NEW.pedidos_semana > 0 THEN (NEW.orcamentos_semana / NEW.pedidos_semana) * 100 ELSE 0 END;

    SELECT * INTO hist FROM public.campanhas_historico_semanal WHERE campanha_id = NEW.id ORDER BY criado_em DESC LIMIT 1;
    IF FOUND THEN
        NEW.dif_cliques_base_rd := NEW.cliques_base_rd - hist.cliques_base_rd_semana_anterior;
        NEW.dif_leads_base_rd := NEW.leads_base_rd - hist.leads_base_rd_semana_anterior;
    ELSE
        NEW.dif_cliques_base_rd := NEW.cliques_base_rd;
        NEW.dif_leads_base_rd := NEW.leads_base_rd;
    END IF;

    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_campanhas_metrics ON public.campanhas;
CREATE TRIGGER trg_calculate_campanhas_metrics
BEFORE INSERT OR UPDATE ON public.campanhas
FOR EACH ROW EXECUTE FUNCTION calculate_campanhas_metrics();


-- Create the new canais_comunicacao table
CREATE TABLE IF NOT EXISTS public.canais_comunicacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_inicio DATE,
    data_fim DATE,
    canal_nome TEXT,
    acessos NUMERIC DEFAULT 0,
    cliques NUMERIC DEFAULT 0,
    conversas NUMERIC DEFAULT 0,
    leads NUMERIC DEFAULT 0,
    orcamentos_qtd NUMERIC DEFAULT 0,
    orcamentos_valor NUMERIC DEFAULT 0,
    pedidos_qtd NUMERIC DEFAULT 0,
    pedidos_valor NUMERIC DEFAULT 0,
    lead_orcamento_pct NUMERIC DEFAULT 0,
    orcamento_pedido_pct NUMERIC DEFAULT 0,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.canais_comunicacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "canais_all" ON public.canais_comunicacao;
CREATE POLICY "canais_all" ON public.canais_comunicacao FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger logic for canais_comunicacao
CREATE OR REPLACE FUNCTION calculate_canais_metrics() RETURNS trigger AS $BODY$
BEGIN
    NEW.lead_orcamento_pct := CASE WHEN NEW.orcamentos_qtd > 0 THEN (NEW.leads / NEW.orcamentos_qtd) * 100 ELSE 0 END;
    NEW.orcamento_pedido_pct := CASE WHEN NEW.pedidos_qtd > 0 THEN (NEW.orcamentos_qtd / NEW.pedidos_qtd) * 100 ELSE 0 END;
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_canais_metrics ON public.canais_comunicacao;
CREATE TRIGGER trg_calculate_canais_metrics
BEFORE INSERT OR UPDATE ON public.canais_comunicacao
FOR EACH ROW EXECUTE FUNCTION calculate_canais_metrics();
