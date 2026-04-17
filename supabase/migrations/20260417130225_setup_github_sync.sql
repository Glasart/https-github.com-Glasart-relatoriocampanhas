-- Enable the pg_net extension to make HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Setup the cron job to call the edge function every 10 minutes
DO $DO_BLOCK$
BEGIN
  -- Remove existing job if it exists to be idempotent
  PERFORM cron.unschedule('sync-github-job');
  
  -- Schedule the job
  PERFORM cron.schedule(
    'sync-github-job',
    '*/10 * * * *',
    $$
    SELECT net.http_post(
        url:='https://soenfmydetgzogueigtu.supabase.co/functions/v1/sync-github'
    );
    $$
  );
EXCEPTION WHEN OTHERS THEN
  -- Fallback if pg_cron is not available or user lacks permissions
  RAISE NOTICE 'Could not schedule cron job: %', SQLERRM;
END $DO_BLOCK$;

-- Insert initial sample data if empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.performance_campanha WHERE campanha_nome = 'Campanha de Verão') THEN
    INSERT INTO public.performance_campanha (
      data_inicio, data_fim, plataforma, campanha_nome, publico, investimento, impressoes,
      alcance, cliques_base_ads, cliques_base_rd, leads_base_planilhas_vendas, leads_base_rd,
      orcamentos_semana, pedidos_semana, usuario_id
    )
    SELECT
      '2026-01-01', '2026-01-07', 'Google Ads', 'Campanha de Verão', 'Restaurantes', 5000, 50000,
      10000, 300, 500, 50, 45, 20, 5, id
    FROM auth.users
    LIMIT 1;
  END IF;
END $$;
