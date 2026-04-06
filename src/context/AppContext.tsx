import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
  CampaignRow,
  OtherChannelRow,
  Integration,
  Analysis,
  FilterState,
  User,
  ActivityLogEntry,
  ManualSectionConfig,
} from '../types'
import { mockIntegrations } from '../data/mock'
import { subDays } from 'date-fns'
import { toast } from '@/hooks/use-toast'
import { CloudAPI } from '@/services/api'
import { supabase } from '@/lib/supabase/client'
import { mapFromSupabase } from '@/services/campanhas'
import { useAuth } from '@/hooks/use-auth'

interface AppContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (user: User) => void
  logout: () => void
  data: CampaignRow[]
  setData: React.Dispatch<React.SetStateAction<CampaignRow[]>>
  otherChannelsData: OtherChannelRow[]
  setOtherChannelsData: React.Dispatch<React.SetStateAction<OtherChannelRow[]>>
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  specificFilters: FilterState
  setSpecificFilters: React.Dispatch<React.SetStateAction<FilterState>>
  integrations: Integration[]
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>
  analyses: Analysis[]
  setAnalyses: React.Dispatch<React.SetStateAction<Analysis[]>>
  activityLog: ActivityLogEntry[]
  logAction: (type: string, description: string, payload: any, actor?: User) => void
  undoAction: (id: string) => void
  manualConfig: Record<string, ManualSectionConfig>
  setManualConfig: React.Dispatch<React.SetStateAction<Record<string, ManualSectionConfig>>>
  updateManualConfig: (key: string, next: ManualSectionConfig) => void
  tableColumnWidths: Record<string, number>
  setTableColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>
  hasUnsavedChanges: boolean
  isSaving: boolean
  isRefreshing: boolean
  isInitializing: boolean
  commitToCloud: () => Promise<void>
  refreshFromCloud: (showToast?: boolean, isPassiveSync?: boolean) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const defaultTableWidths = {
  startDate: 100,
  endDate: 100,
  platform: 100,
  campaign: 160,
  audience: 120,
  impressions: 80,
  reach: 80,
  clicksRD: 80,
  clicksAds: 80,
  ctr: 70,
  diffClicks: 80,
  leadsSalesSheet: 80,
  leadsRD: 80,
  cvl: 70,
  quoteQty: 80,
  quoteValue: 90,
  orderQty: 80,
  orderValue: 90,
  leadsPerBudget: 80,
  budgetPerOrder: 90,
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
        email: authUser.email || '',
        role: 'admin',
        color: '#4f46e5',
      })
    }
  }, [authUser])

  const [isInitializing, setIsInitializing] = useState(true)
  const [data, _setData] = useState<CampaignRow[]>([])
  const [otherChannelsData, _setOtherChannelsData] = useState<OtherChannelRow[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [analyses, _setAnalyses] = useState<Analysis[]>([])
  const [manualConfig, _setManualConfig] = useState<Record<string, ManualSectionConfig>>({})

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: subDays(new Date(), 6),
      to: new Date(),
    },
    platforms: [],
    campaigns: [],
    audiences: [],
  })

  const [specificFilters, setSpecificFilters] = useState<FilterState>({
    dateRange: {
      from: subDays(new Date(), 3),
      to: new Date(),
    },
    platforms: [],
    campaigns: [],
    audiences: [],
  })

  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)

  const [tableColumnWidths, setTableColumnWidths] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('campaign_table_widths')
    return saved ? JSON.parse(saved) : defaultTableWidths
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const dataRef = useRef(data)
  const otherRef = useRef(otherChannelsData)
  const analysesRef = useRef(analyses)
  const manualRef = useRef(manualConfig)
  const userRef = useRef(user)
  const activityLogRef = useRef(activityLog)
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges)

  useEffect(() => {
    dataRef.current = data
  }, [data])
  useEffect(() => {
    otherRef.current = otherChannelsData
  }, [otherChannelsData])
  useEffect(() => {
    analysesRef.current = analyses
  }, [analyses])
  useEffect(() => {
    manualRef.current = manualConfig
  }, [manualConfig])
  useEffect(() => {
    userRef.current = user
  }, [user])
  useEffect(() => {
    activityLogRef.current = activityLog
  }, [activityLog])
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges
  }, [hasUnsavedChanges])

  const setData = useCallback((action: React.SetStateAction<CampaignRow[]>) => {
    _setData(action)
  }, [])

  const setOtherChannelsData = useCallback((action: React.SetStateAction<OtherChannelRow[]>) => {
    _setOtherChannelsData(action)
    setHasUnsavedChanges(true)
  }, [])

  const setAnalyses = useCallback((action: React.SetStateAction<Analysis[]>) => {
    _setAnalyses(action)
    setHasUnsavedChanges(true)
  }, [])

  const setManualConfig = useCallback(
    (action: React.SetStateAction<Record<string, ManualSectionConfig>>) => {
      _setManualConfig(action)
      setHasUnsavedChanges(true)
    },
    [],
  )

  useEffect(() => {
    localStorage.setItem('campaign_table_widths', JSON.stringify(tableColumnWidths))
  }, [tableColumnWidths])

  // Realtime Supabase Subscription for Campanhas
  useEffect(() => {
    if (!authUser) return

    const fetchCampanhas = async () => {
      setIsInitializing(true)
      const { data: dbData, error } = await supabase
        .from('campanhas')
        .select('*')
        .order('criado_em', { ascending: false })
      if (dbData) {
        _setData(dbData.map(mapFromSupabase))
      }
      if (error) {
        console.error('Error fetching campanhas:', error)
      }
      setIsInitializing(false)
    }

    fetchCampanhas()

    const sub = supabase
      .channel('campanhas_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campanhas' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newRow = mapFromSupabase(payload.new)
          _setData((prev) => {
            const exists = prev.find((r) => r.id === newRow.id)
            if (exists) return prev.map((r) => (r.id === newRow.id ? newRow : r))
            return [newRow, ...prev]
          })
        } else if (payload.eventType === 'DELETE') {
          _setData((prev) => prev.filter((r) => r.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(sub)
    }
  }, [authUser])

  const commitToCloud = useCallback(async () => {
    setIsSaving(true)
    try {
      // CloudAPI now only handles non-campaign data as mock/localstorage to avoid breaking the rest of the app
      const updatedDB = await CloudAPI.saveAll({
        campaigns: [], // managed directly via supabase now
        otherChannels: otherRef.current,
        analyses: analysesRef.current,
        activityLog: activityLogRef.current,
        manualConfig: manualRef.current,
      })
      setActivityLog(updatedDB.activityLog)
      setHasUnsavedChanges(false)
    } catch (e) {
      toast({
        title: 'Erro de Conexão',
        description: 'Não foi possível salvar configurações adicionais.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [])

  useEffect(() => {
    if (hasUnsavedChanges && !isSaving && !isInitializing) {
      const timer = setTimeout(() => {
        commitToCloud()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, isSaving, isInitializing, commitToCloud])

  const refreshFromCloud = useCallback(async (showToast = false, isPassiveSync = false) => {
    if (!isPassiveSync) setIsRefreshing(true)
    try {
      const db = await CloudAPI.fetchAll()
      if (isPassiveSync && hasUnsavedChangesRef.current) {
        return
      }
      _setOtherChannelsData(db.otherChannels)
      _setAnalyses(db.analyses)
      _setManualConfig(db.manualConfig)
      setActivityLog(db.activityLog)

      if (!hasUnsavedChangesRef.current) {
        setHasUnsavedChanges(false)
      }
    } catch (err) {
      console.error('Error refreshing config', err)
    } finally {
      if (!isPassiveSync) setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    refreshFromCloud(false)
  }, [refreshFromCloud])

  const logAction = useCallback((type: string, description: string, payload: any, actor?: User) => {
    setActivityLog((prev) => {
      const currentUser = actor || userRef.current
      if (!currentUser) return prev
      const entry: ActivityLogEntry = {
        id: crypto.randomUUID(),
        userId: currentUser.name,
        userName: currentUser.name,
        userColor: currentUser.color,
        type,
        description,
        timestamp: new Date().toISOString(),
        payload,
      }
      return [entry, ...prev]
    })
    setHasUnsavedChanges(true)
  }, [])

  const login = useCallback((newUser: User) => {
    // handled by supabase auth hook now, this is just legacy stub
  }, [])

  const logout = useCallback(() => {
    supabase.auth.signOut()
  }, [])

  const updateManualConfig = useCallback(
    (key: string, next: ManualSectionConfig) => {
      setManualConfig((prev) => {
        const old = prev[key]
        logAction('CONFIG_CHANGE', `Atualizou link/configuração: ${key}`, {
          prev: old,
          next,
        })
        return { ...prev, [key]: next }
      })
    },
    [logAction, setManualConfig],
  )

  const undoAction = useCallback((id: string) => {
    // simplified undo to avoid breaking supabase data consistency easily
    toast({
      title: 'Aviso',
      description: 'Desfazer alterações do banco principal não é suportado nesta versão.',
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        data,
        setData,
        otherChannelsData,
        setOtherChannelsData,
        filters,
        setFilters,
        specificFilters,
        setSpecificFilters,
        integrations,
        setIntegrations,
        analyses,
        setAnalyses,
        activityLog,
        logAction,
        undoAction,
        manualConfig,
        setManualConfig,
        updateManualConfig,
        tableColumnWidths,
        setTableColumnWidths,
        hasUnsavedChanges,
        isSaving,
        isRefreshing,
        isInitializing,
        commitToCloud,
        refreshFromCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
