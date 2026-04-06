// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      base_dados: {
        Row: {
          criado_em: string
          dados_json: Json
          descricao: string | null
          id: string
          tipo_registro: string
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          dados_json?: Json
          descricao?: string | null
          id?: string
          tipo_registro: string
          usuario_id: string
        }
        Update: {
          criado_em?: string
          dados_json?: Json
          descricao?: string | null
          id?: string
          tipo_registro?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'base_dados_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      campanhas: {
        Row: {
          alcance: number | null
          cliques_base_ads: number | null
          cliques_base_rd: number | null
          criado_em: string
          ctr: number | null
          cvl: number | null
          data_fim: string | null
          data_inicio: string | null
          dif_cliques_base_rd: number | null
          dif_leads_base_rd: number | null
          id: string
          impressoes: number | null
          investimento: number | null
          leads_base_planilhas_vendas: number | null
          leads_base_rd: number | null
          leads_orcamento: number | null
          nome_campanha: string | null
          nome_produto: string | null
          orcamento_pedido: number | null
          orcamentos_semana: number | null
          pedidos_semana: number | null
          plataforma_canal: string | null
          publico: string | null
          usuario_id: string
        }
        Insert: {
          alcance?: number | null
          cliques_base_ads?: number | null
          cliques_base_rd?: number | null
          criado_em?: string
          ctr?: number | null
          cvl?: number | null
          data_fim?: string | null
          data_inicio?: string | null
          dif_cliques_base_rd?: number | null
          dif_leads_base_rd?: number | null
          id?: string
          impressoes?: number | null
          investimento?: number | null
          leads_base_planilhas_vendas?: number | null
          leads_base_rd?: number | null
          leads_orcamento?: number | null
          nome_campanha?: string | null
          nome_produto?: string | null
          orcamento_pedido?: number | null
          orcamentos_semana?: number | null
          pedidos_semana?: number | null
          plataforma_canal?: string | null
          publico?: string | null
          usuario_id: string
        }
        Update: {
          alcance?: number | null
          cliques_base_ads?: number | null
          cliques_base_rd?: number | null
          criado_em?: string
          ctr?: number | null
          cvl?: number | null
          data_fim?: string | null
          data_inicio?: string | null
          dif_cliques_base_rd?: number | null
          dif_leads_base_rd?: number | null
          id?: string
          impressoes?: number | null
          investimento?: number | null
          leads_base_planilhas_vendas?: number | null
          leads_base_rd?: number | null
          leads_orcamento?: number | null
          nome_campanha?: string | null
          nome_produto?: string | null
          orcamento_pedido?: number | null
          orcamentos_semana?: number | null
          pedidos_semana?: number | null
          plataforma_canal?: string | null
          publico?: string | null
          usuario_id?: string
        }
        Relationships: []
      }
      campanhas_historico_semanal: {
        Row: {
          campanha_id: string | null
          cliques_base_rd_semana_anterior: number | null
          criado_em: string
          id: string
          leads_base_rd_semana_anterior: number | null
        }
        Insert: {
          campanha_id?: string | null
          cliques_base_rd_semana_anterior?: number | null
          criado_em?: string
          id?: string
          leads_base_rd_semana_anterior?: number | null
        }
        Update: {
          campanha_id?: string | null
          cliques_base_rd_semana_anterior?: number | null
          criado_em?: string
          id?: string
          leads_base_rd_semana_anterior?: number | null
        }
        Relationships: []
      }
      campanhas_old_backup: {
        Row: {
          alcance: number | null
          cliques_ads: number | null
          cliques_rd: number | null
          criado_em: string
          ctr: number | null
          cvl: number | null
          data_fim: string | null
          data_inicio: string | null
          dif_cliques: number | null
          id: string
          impressoes: number | null
          investimento: number | null
          leads_orcamento: number | null
          leads_plan: number | null
          leads_rd: number | null
          nome_campanha: string | null
          orcamento_pedido: number | null
          orcamentos_qtd: number | null
          pedidos_qtd: number | null
          plataforma_canal: string | null
          publico: string | null
          usuario_id: string
          valor_orcamento: number | null
          valor_pedidos: number | null
        }
        Insert: {
          alcance?: number | null
          cliques_ads?: number | null
          cliques_rd?: number | null
          criado_em?: string
          ctr?: number | null
          cvl?: number | null
          data_fim?: string | null
          data_inicio?: string | null
          dif_cliques?: number | null
          id?: string
          impressoes?: number | null
          investimento?: number | null
          leads_orcamento?: number | null
          leads_plan?: number | null
          leads_rd?: number | null
          nome_campanha?: string | null
          orcamento_pedido?: number | null
          orcamentos_qtd?: number | null
          pedidos_qtd?: number | null
          plataforma_canal?: string | null
          publico?: string | null
          usuario_id: string
          valor_orcamento?: number | null
          valor_pedidos?: number | null
        }
        Update: {
          alcance?: number | null
          cliques_ads?: number | null
          cliques_rd?: number | null
          criado_em?: string
          ctr?: number | null
          cvl?: number | null
          data_fim?: string | null
          data_inicio?: string | null
          dif_cliques?: number | null
          id?: string
          impressoes?: number | null
          investimento?: number | null
          leads_orcamento?: number | null
          leads_plan?: number | null
          leads_rd?: number | null
          nome_campanha?: string | null
          orcamento_pedido?: number | null
          orcamentos_qtd?: number | null
          pedidos_qtd?: number | null
          plataforma_canal?: string | null
          publico?: string | null
          usuario_id?: string
          valor_orcamento?: number | null
          valor_pedidos?: number | null
        }
        Relationships: []
      }
      canais_comunicacao: {
        Row: {
          acessos: number | null
          canal_nome: string | null
          cliques: number | null
          conversas: number | null
          criado_em: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          lead_orcamento_pct: number | null
          leads: number | null
          orcamento_pedido_pct: number | null
          orcamentos_qtd: number | null
          orcamentos_valor: number | null
          pedidos_qtd: number | null
          pedidos_valor: number | null
          usuario_id: string
        }
        Insert: {
          acessos?: number | null
          canal_nome?: string | null
          cliques?: number | null
          conversas?: number | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          lead_orcamento_pct?: number | null
          leads?: number | null
          orcamento_pedido_pct?: number | null
          orcamentos_qtd?: number | null
          orcamentos_valor?: number | null
          pedidos_qtd?: number | null
          pedidos_valor?: number | null
          usuario_id: string
        }
        Update: {
          acessos?: number | null
          canal_nome?: string | null
          cliques?: number | null
          conversas?: number | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          lead_orcamento_pct?: number | null
          leads?: number | null
          orcamento_pedido_pct?: number | null
          orcamentos_qtd?: number | null
          orcamentos_valor?: number | null
          pedidos_qtd?: number | null
          pedidos_valor?: number | null
          usuario_id?: string
        }
        Relationships: []
      }
      dados_consolidados: {
        Row: {
          criado_em: string
          id: string
          metrica_nome: string
          periodo: string
          usuario_id: string
          valor_total: number
        }
        Insert: {
          criado_em?: string
          id?: string
          metrica_nome: string
          periodo: string
          usuario_id: string
          valor_total: number
        }
        Update: {
          criado_em?: string
          id?: string
          metrica_nome?: string
          periodo?: string
          usuario_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: 'dados_consolidados_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      dados_diarios: {
        Row: {
          criado_em: string
          data: string
          id: string
          metrica_nome: string
          usuario_id: string
          valor: number
        }
        Insert: {
          criado_em?: string
          data: string
          id?: string
          metrica_nome: string
          usuario_id: string
          valor: number
        }
        Update: {
          criado_em?: string
          data?: string
          id?: string
          metrica_nome?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: 'dados_diarios_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      usuarios: {
        Row: {
          criado_em: string
          email: string
          id: string
          nome: string
          senha: string | null
        }
        Insert: {
          criado_em?: string
          email: string
          id: string
          nome: string
          senha?: string | null
        }
        Update: {
          criado_em?: string
          email?: string
          id?: string
          nome?: string
          senha?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: base_dados
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   tipo_registro: text (not null)
//   descricao: text (nullable)
//   dados_json: jsonb (not null, default: '{}'::jsonb)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: campanhas
//   id: uuid (not null, default: gen_random_uuid())
//   data_inicio: date (nullable)
//   data_fim: date (nullable)
//   plataforma_canal: text (nullable)
//   nome_produto: text (nullable)
//   nome_campanha: text (nullable)
//   publico: text (nullable)
//   investimento: numeric (nullable, default: 0)
//   impressoes: numeric (nullable, default: 0)
//   alcance: numeric (nullable, default: 0)
//   cliques_base_ads: numeric (nullable, default: 0)
//   cliques_base_rd: numeric (nullable, default: 0)
//   leads_base_planilhas_vendas: numeric (nullable, default: 0)
//   leads_base_rd: numeric (nullable, default: 0)
//   orcamentos_semana: numeric (nullable, default: 0)
//   pedidos_semana: numeric (nullable, default: 0)
//   ctr: numeric (nullable, default: 0)
//   dif_cliques_base_rd: numeric (nullable, default: 0)
//   cvl: numeric (nullable, default: 0)
//   dif_leads_base_rd: numeric (nullable, default: 0)
//   leads_orcamento: numeric (nullable, default: 0)
//   orcamento_pedido: numeric (nullable, default: 0)
//   usuario_id: uuid (not null)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: campanhas_historico_semanal
//   id: uuid (not null, default: gen_random_uuid())
//   campanha_id: uuid (nullable)
//   cliques_base_rd_semana_anterior: numeric (nullable, default: 0)
//   leads_base_rd_semana_anterior: numeric (nullable, default: 0)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: campanhas_old_backup
//   id: uuid (not null, default: gen_random_uuid())
//   data_inicio: date (nullable)
//   data_fim: date (nullable)
//   plataforma_canal: text (nullable)
//   nome_campanha: text (nullable)
//   publico: text (nullable)
//   investimento: numeric (nullable, default: 0)
//   impressoes: numeric (nullable, default: 0)
//   alcance: numeric (nullable, default: 0)
//   cliques_rd: numeric (nullable, default: 0)
//   cliques_ads: numeric (nullable, default: 0)
//   ctr: numeric (nullable, default: 0)
//   dif_cliques: numeric (nullable, default: 0)
//   leads_plan: numeric (nullable, default: 0)
//   leads_rd: numeric (nullable, default: 0)
//   cvl: numeric (nullable, default: 0)
//   orcamentos_qtd: numeric (nullable, default: 0)
//   valor_orcamento: numeric (nullable, default: 0)
//   pedidos_qtd: numeric (nullable, default: 0)
//   valor_pedidos: numeric (nullable, default: 0)
//   leads_orcamento: numeric (nullable, default: 0)
//   orcamento_pedido: numeric (nullable, default: 0)
//   usuario_id: uuid (not null)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: canais_comunicacao
//   id: uuid (not null, default: gen_random_uuid())
//   data_inicio: date (nullable)
//   data_fim: date (nullable)
//   canal_nome: text (nullable)
//   acessos: numeric (nullable, default: 0)
//   cliques: numeric (nullable, default: 0)
//   conversas: numeric (nullable, default: 0)
//   leads: numeric (nullable, default: 0)
//   orcamentos_qtd: numeric (nullable, default: 0)
//   orcamentos_valor: numeric (nullable, default: 0)
//   pedidos_qtd: numeric (nullable, default: 0)
//   pedidos_valor: numeric (nullable, default: 0)
//   lead_orcamento_pct: numeric (nullable, default: 0)
//   orcamento_pedido_pct: numeric (nullable, default: 0)
//   usuario_id: uuid (not null)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: dados_consolidados
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   periodo: text (not null)
//   metrica_nome: text (not null)
//   valor_total: numeric (not null)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: dados_diarios
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   data: date (not null)
//   metrica_nome: text (not null)
//   valor: numeric (not null)
//   criado_em: timestamp with time zone (not null, default: now())
// Table: usuarios
//   id: uuid (not null)
//   email: text (not null)
//   nome: text (not null)
//   criado_em: timestamp with time zone (not null, default: now())
//   senha: text (nullable)

// --- CONSTRAINTS ---
// Table: base_dados
//   PRIMARY KEY base_dados_pkey: PRIMARY KEY (id)
//   FOREIGN KEY base_dados_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: campanhas
//   PRIMARY KEY campanhas_pkey1: PRIMARY KEY (id)
//   FOREIGN KEY campanhas_usuario_id_fkey1: FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: campanhas_historico_semanal
//   PRIMARY KEY campanhas_historico_semanal_pkey: PRIMARY KEY (id)
// Table: campanhas_old_backup
//   PRIMARY KEY campanhas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY campanhas_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: canais_comunicacao
//   PRIMARY KEY canais_comunicacao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY canais_comunicacao_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: dados_consolidados
//   PRIMARY KEY dados_consolidados_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dados_consolidados_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: dados_diarios
//   PRIMARY KEY dados_diarios_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dados_diarios_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: usuarios
//   FOREIGN KEY usuarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: base_dados
//   Policy "base_dados_all" (ALL, PERMISSIVE) roles={public}
//     USING: true
//     WITH CHECK: true
// Table: campanhas
//   Policy "campanhas_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: campanhas_old_backup
//   Policy "campanhas_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "campanhas_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "campanhas_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "campanhas_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: canais_comunicacao
//   Policy "canais_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: dados_consolidados
//   Policy "dados_consolidados_all" (ALL, PERMISSIVE) roles={public}
//     USING: true
//     WITH CHECK: true
// Table: dados_diarios
//   Policy "dados_diarios_all" (ALL, PERMISSIVE) roles={public}
//     USING: true
//     WITH CHECK: true
// Table: usuarios
//   Policy "usuarios_all" (ALL, PERMISSIVE) roles={public}
//     USING: true
//     WITH CHECK: true

// --- WARNING: TABLES WITH RLS ENABLED BUT NO POLICIES ---
// These tables have Row Level Security enabled but NO policies defined.
// This means ALL queries (SELECT, INSERT, UPDATE, DELETE) will return ZERO rows
// for non-superuser roles (including the anon and authenticated roles used by the app).
// You MUST create RLS policies for these tables to allow data access.
//   - campanhas_historico_semanal

// --- DATABASE FUNCTIONS ---
// FUNCTION calculate_campanhas_metrics()
//   CREATE OR REPLACE FUNCTION public.calculate_campanhas_metrics()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       hist RECORD;
//   BEGIN
//       NEW.ctr := CASE WHEN NEW.impressoes > 0 THEN (NEW.cliques_base_ads / NEW.impressoes) * 100 ELSE 0 END;
//       NEW.cvl := CASE WHEN NEW.leads_base_planilhas_vendas > 0 THEN NEW.leads_base_rd / NEW.leads_base_planilhas_vendas ELSE 0 END;
//       NEW.leads_orcamento := CASE WHEN NEW.orcamentos_semana > 0 THEN (NEW.leads_base_rd / NEW.orcamentos_semana) * 100 ELSE 0 END;
//       NEW.orcamento_pedido := CASE WHEN NEW.pedidos_semana > 0 THEN (NEW.orcamentos_semana / NEW.pedidos_semana) * 100 ELSE 0 END;
//
//       SELECT * INTO hist FROM public.campanhas_historico_semanal WHERE campanha_id = NEW.id ORDER BY criado_em DESC LIMIT 1;
//       IF FOUND THEN
//           NEW.dif_cliques_base_rd := NEW.cliques_base_rd - hist.cliques_base_rd_semana_anterior;
//           NEW.dif_leads_base_rd := NEW.leads_base_rd - hist.leads_base_rd_semana_anterior;
//       ELSE
//           NEW.dif_cliques_base_rd := NEW.cliques_base_rd;
//           NEW.dif_leads_base_rd := NEW.leads_base_rd;
//       END IF;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION calculate_canais_metrics()
//   CREATE OR REPLACE FUNCTION public.calculate_canais_metrics()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.lead_orcamento_pct := CASE WHEN NEW.orcamentos_qtd > 0 THEN (NEW.leads / NEW.orcamentos_qtd) * 100 ELSE 0 END;
//       NEW.orcamento_pedido_pct := CASE WHEN NEW.pedidos_qtd > 0 THEN (NEW.orcamentos_qtd / NEW.pedidos_qtd) * 100 ELSE 0 END;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.usuarios (id, email, nome)
//     VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: campanhas
//   trg_calculate_campanhas_metrics: CREATE TRIGGER trg_calculate_campanhas_metrics BEFORE INSERT OR UPDATE ON public.campanhas FOR EACH ROW EXECUTE FUNCTION calculate_campanhas_metrics()
// Table: canais_comunicacao
//   trg_calculate_canais_metrics: CREATE TRIGGER trg_calculate_canais_metrics BEFORE INSERT OR UPDATE ON public.canais_comunicacao FOR EACH ROW EXECUTE FUNCTION calculate_canais_metrics()
