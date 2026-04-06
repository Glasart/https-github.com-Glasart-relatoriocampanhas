DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed initial admin user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alexis.facchina@glasart.com.br') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'alexis.facchina@glasart.com.br',
      crypt('Skip@Pass123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Alexis"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    -- Insert into public.usuarios if not auto-handled by trigger
    INSERT INTO public.usuarios (id, email, nome)
    VALUES (new_user_id, 'alexis.facchina@glasart.com.br', 'Alexis')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.campanhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_inicio DATE,
    data_fim DATE,
    plataforma_canal TEXT,
    nome_campanha TEXT,
    publico TEXT,
    investimento NUMERIC DEFAULT 0,
    impressoes NUMERIC DEFAULT 0,
    alcance NUMERIC DEFAULT 0,
    cliques_rd NUMERIC DEFAULT 0,
    cliques_ads NUMERIC DEFAULT 0,
    ctr NUMERIC DEFAULT 0,
    dif_cliques NUMERIC DEFAULT 0,
    leads_plan NUMERIC DEFAULT 0,
    leads_rd NUMERIC DEFAULT 0,
    cvl NUMERIC DEFAULT 0,
    orcamentos_qtd NUMERIC DEFAULT 0,
    valor_orcamento NUMERIC DEFAULT 0,
    pedidos_qtd NUMERIC DEFAULT 0,
    valor_pedidos NUMERIC DEFAULT 0,
    leads_orcamento NUMERIC DEFAULT 0,
    orcamento_pedido NUMERIC DEFAULT 0,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "campanhas_select" ON public.campanhas;
CREATE POLICY "campanhas_select" ON public.campanhas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "campanhas_insert" ON public.campanhas;
CREATE POLICY "campanhas_insert" ON public.campanhas FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "campanhas_update" ON public.campanhas;
CREATE POLICY "campanhas_update" ON public.campanhas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "campanhas_delete" ON public.campanhas;
CREATE POLICY "campanhas_delete" ON public.campanhas FOR DELETE TO authenticated USING (true);
