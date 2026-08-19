// ============================================================
// RAIL TRAFFIC MANAGEMENT PLATFORM — Shared Type Definitions
// ============================================================

// ─── User & Auth ────────────────────────────────────────────

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'TRAFFIC_CONTROLLER'
  | 'ANALYST'
  | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  stationId?: string;
  zoneId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Train ──────────────────────────────────────────────────

export type TrainStatus =
  | 'ON_TIME'
  | 'DELAYED'
  | 'CANCELLED'
  | 'DIVERTED'
  | 'RUNNING_LATE'
  | 'ARRIVED'
  | 'DEPARTED'
  | 'HALTED';

export type TrainCategory =
  | 'RAJDHANI'
  | 'SHATABDI'
  | 'VANDE_BHARAT'
  | 'DURONTO'
  | 'EXPRESS'
  | 'MAIL'
  | 'PASSENGER'
  | 'GOODS'
  | 'EMU'
  | 'MEMU';

export interface TrainPosition {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  trackSection: string;
  timestamp: string;
}

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  category: TrainCategory;
  status: TrainStatus;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  estimatedArrival?: string;
  delayMinutes: number;
  currentStation?: string;
  nextStation?: string;
  position?: TrainPosition;
  platformNumber?: string;
  rake: string;
  zone: string;
  division: string;
  route: RouteSegment[];
  occupancy: number;
  capacity: number;
  updatedAt: string;
}

export interface DelayPrediction {
  trainId: string;
  trainNumber: string;
  predictedDelayMinutes: number;
  confidence: number;
  factors: DelayFactor[];
  explanation: string;
  predictedAt: string;
  modelVersion: string;
}

export interface DelayFactor {
  factor: string;
  impact: number;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// ─── Station ─────────────────────────────────────────────────

export type StationCategory = 'A1' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Station {
  id: string;
  code: string;
  name: string;
  nameHindi?: string;
  latitude: number;
  longitude: number;
  zone: string;
  division: string;
  category: StationCategory;
  platforms: Platform[];
  totalPlatforms: number;
  state: string;
  city: string;
  isJunction: boolean;
  hasWifi: boolean;
  hasRetirementRoom: boolean;
  health: StationHealth;
  updatedAt: string;
}

export interface Platform {
  id: string;
  stationId: string;
  number: string;
  length: number;
  type: 'MAIN' | 'LOOP' | 'GOODS';
  status: 'AVAILABLE' | 'OCCUPIED' | 'BLOCKED' | 'MAINTENANCE';
  currentTrainId?: string;
  nextTrainId?: string;
  scheduledDeparture?: string;
}

export interface StationHealth {
  score: number;
  signalStatus: 'NOMINAL' | 'DEGRADED' | 'FAILED';
  powerStatus: 'NOMINAL' | 'BACKUP' | 'FAILED';
  communicationStatus: 'NOMINAL' | 'DEGRADED' | 'FAILED';
  trackStatus: 'CLEAR' | 'OCCUPIED' | 'BLOCKED';
  lastUpdated: string;
}

// ─── Alert ──────────────────────────────────────────────────

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AlertCategory =
  | 'DELAY'
  | 'SAFETY'
  | 'INFRASTRUCTURE'
  | 'WEATHER'
  | 'OPERATIONAL'
  | 'SYSTEM'
  | 'SECURITY';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  stationId?: string;
  trainId?: string;
  trainNumber?: string;
  stationCode?: string;
  aiRootCause?: string;
  recommendedAction?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Network & Routes ────────────────────────────────────────

export interface RouteSegment {
  stationCode: string;
  stationName: string;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  platform?: string;
  distance: number;
  delayAtStation?: number;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING' | 'SKIPPED';
}

export interface TrackSection {
  id: string;
  name: string;
  fromStation: string;
  toStation: string;
  distance: number;
  maxSpeed: number;
  currentSpeed?: number;
  occupancy: 'FREE' | 'OCCUPIED' | 'BLOCKED';
  trackType: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUADRUPLE';
  electrification: boolean;
  zone: string;
}

// ─── Analytics & KPIs ────────────────────────────────────────

export interface NetworkKPIs {
  totalTrainsRunning: number;
  onTimePercentage: number;
  averageDelayMinutes: number;
  totalPassengers: number;
  networkHealthScore: number;
  activeAlerts: number;
  criticalAlerts: number;
  stationsMonitored: number;
  tracksMonitored: number;
  timestamp: string;
}

export interface DelayDistribution {
  onTime: number;
  slight: number;
  moderate: number;
  severe: number;
  veryLate: number;
  cancelled: number;
}

export interface ThroughputData {
  timestamp: string;
  trains: number;
  passengers: number;
  onTimeRate: number;
}

// ─── Weather ─────────────────────────────────────────────────

export interface WeatherData {
  stationCode: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  conditions: string;
  icon: string;
  precipitation: number;
  uvIndex: number;
  timestamp: string;
}

// ─── Report ──────────────────────────────────────────────────

export type ReportType =
  | 'DAILY_OPERATIONS'
  | 'DELAY_ANALYSIS'
  | 'STATION_PERFORMANCE'
  | 'INCIDENT_REPORT'
  | 'EXECUTIVE_SUMMARY'
  | 'CUSTOM';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';
  format: 'PDF' | 'EXCEL' | 'CSV';
  aiSummary?: string;
  fileUrl?: string;
  parameters: Record<string, unknown>;
  generatedBy: string;
  generatedAt?: string;
  createdAt: string;
}

// ─── AI / RailCopilot ────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: RAGSource[];
  isStreaming?: boolean;
  timestamp: string;
}

export interface RAGSource {
  documentId: string;
  documentName: string;
  pageNumber?: number;
  excerpt: string;
  relevanceScore: number;
}

export interface PageContext {
  currentPage: string;
  userRole: UserRole;
  filters?: Record<string, unknown>;
  selectedStation?: string;
  selectedTrain?: string;
  chartData?: unknown;
}

// ─── Audit ──────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: string;
}

// ─── System Health ───────────────────────────────────────────

export interface ServiceHealth {
  service: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  responseTime?: number;
  uptime?: number;
  lastChecked: string;
  details?: Record<string, unknown>;
}

export interface SystemHealth {
  overall: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  services: ServiceHealth[];
  timestamp: string;
}

// ─── WebSocket Events ────────────────────────────────────────

export interface WSEvent<T = unknown> {
  event: string;
  data: T;
  timestamp: string;
}

export type TrainUpdateEvent = WSEvent<Train>;
export type AlertEvent = WSEvent<Alert>;
export type KPIUpdateEvent = WSEvent<NetworkKPIs>;
