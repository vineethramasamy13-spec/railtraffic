'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_ALERTS } from '../lib/demo-data';

// ─── User & Auth Types ────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TRAFFIC_CONTROLLER' | 'ANALYST' | 'VIEWER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stationId?: string;
  zoneId?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'rail-auth-storage',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return JSON.parse(str);
          } catch (e) {
            console.warn("Zustand persist key corrupted, clearing:", name, e);
            try { localStorage.removeItem(name); } catch {}
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        }
      }
    }
  )
);

// ─── UI State ─────────────────────────────────────────────

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isDemoMode: boolean;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  notificationsOpen: boolean;
  railCopilotOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDemoMode: (isDemoMode: boolean) => void;
  updateAlertsCount: (count: number, critical?: number) => void;
  setNotificationsOpen: (open: boolean) => void;
  setRailCopilotOpen: (open: boolean) => void;
}

const criticalCount = DEMO_ALERTS.filter((a) => a.severity === 'CRITICAL').length;
const activeCount = DEMO_ALERTS.filter((a) => a.status === 'ACTIVE').length;

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  isDemoMode: true,
  activeAlertsCount: activeCount,
  criticalAlertsCount: criticalCount,
  notificationsOpen: false,
  railCopilotOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setDemoMode: (isDemoMode) => set({ isDemoMode }),
  updateAlertsCount: (activeAlertsCount, critical) =>
    set({ activeAlertsCount, ...(critical !== undefined ? { criticalAlertsCount: critical } : {}) }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
  setRailCopilotOpen: (railCopilotOpen) => set({ railCopilotOpen }),
}));

// ─── App / Selection State ────────────────────────────────

import { DEMO_TRAINS, DEMO_STATIONS } from '../lib/demo-data';

interface AppState {
  trains: typeof DEMO_TRAINS;
  selectedTrainId: string | null;
  selectedStationId: string | null;
  currentPage: string;
  pageFilters: Record<string, unknown>;
  chartContext: Record<string, unknown>;
  setTrains: (trains: typeof DEMO_TRAINS) => void;
  updateTrain: (id: string, updates: Partial<(typeof DEMO_TRAINS)[0]>) => void;
  setSelectedTrainId: (id: string | null) => void;
  setSelectedStationId: (id: string | null) => void;
  setCurrentPage: (page: string) => void;
  setPageFilters: (filters: Record<string, unknown>) => void;
  setChartContext: (data: Record<string, unknown>) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  trains: DEMO_TRAINS,
  selectedTrainId: null,
  selectedStationId: null,
  currentPage: '/dashboard',
  pageFilters: {},
  chartContext: {},
  setTrains: (trains) => set({ trains }),
  updateTrain: (id, updates) => set((state) => ({
    trains: state.trains.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),
  setSelectedTrainId: (selectedTrainId) => set({ selectedTrainId }),
  setSelectedStationId: (selectedStationId) => set({ selectedStationId }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageFilters: (pageFilters) => set({ pageFilters }),
  setChartContext: (chartContext) => set({ chartContext }),
}));

// ─── Page Context for RailCopilot AI ─────────────────────
// Provides context injection for the AI assistant

export function buildPageContext(
  user: AuthUser | null,
  currentPage: string,
  selectedTrainId: string | null,
  selectedStationId: string | null,
  pageFilters: Record<string, unknown>
): Record<string, unknown> {
  return {
    current_page: currentPage,
    user_role: user?.role ?? 'VIEWER',
    user_name: user?.name ?? 'Guest',
    selected_train: selectedTrainId,
    selected_station: selectedStationId,
    active_filters: pageFilters,
    is_demo_mode: true,
    platform: 'RailTrack AI v1.0 — SIH25022',
  };
}
