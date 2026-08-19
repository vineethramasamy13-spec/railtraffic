'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Train, AlertTriangle, Cloud, Layers, Search,
  Thermometer, Eye, Filter, X, ZoomIn, ZoomOut, Info,
  ChevronRight, Activity, Navigation2
} from 'lucide-react';
import {
  DEMO_STATIONS, DEMO_ALERTS, DEMO_KPIS
} from '@/lib/demo-data';
import { useAppStore } from '@/store';

// ============================================================
// INTERACTIVE RAILWAY NETWORK MAP
// Uses MapLibre GL JS for rendering Indian Railways network.
// Station positions use accurate coordinates from demo dataset.
// Layer data from OpenStreetMap Railway network (public).
// ============================================================

type MapLayer = 'network' | 'trains' | 'congestion' | 'weather' | 'alerts';

interface TrainMarker {
  id: string;
  trainNumber: string;
  trainName: string;
  lat: number;
  lng: number;
  status: string;
  delayMinutes: number;
}

const LAYER_CONFIG: Record<MapLayer, { label: string; icon: React.ElementType; color: string }> = {
  network: { label: 'Railway Network', icon: Navigation2, color: '#3B82F6' },
  trains: { label: 'Live Trains', icon: Train, color: '#22C55E' },
  congestion: { label: 'Congestion Heatmap', icon: Activity, color: '#F59E0B' },
  weather: { label: 'Weather Overlay', icon: Cloud, color: '#60A5FA' },
  alerts: { label: 'Active Alerts', icon: AlertTriangle, color: '#EF4444' },
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#F59E0B',
  LOW: '#22C55E',
  INFO: '#3B82F6',
};

// Simulated train positions between stations (interpolated)
const TRAIN_POSITIONS: TrainMarker[] = [
  { id: 't1', trainNumber: '12301', trainName: 'Howrah Rajdhani', lat: 25.62, lng: 84.92, status: 'DELAYED', delayMinutes: 47 },
  { id: 't2', trainNumber: '12302', trainName: 'New Delhi Rajdhani', lat: 25.5, lng: 85.0, status: 'ON_TIME', delayMinutes: 0 },
  { id: 't3', trainNumber: '12951', trainName: 'Mumbai Rajdhani', lat: 23.18, lng: 77.6, status: 'DELAYED', delayMinutes: 23 },
  { id: 't4', trainNumber: '22439', trainName: 'Vande Bharat', lat: 26.6, lng: 80.7, status: 'ON_TIME', delayMinutes: 0 },
  { id: 't6', trainNumber: '12627', trainName: 'Karnataka Express', lat: 17.5, lng: 78.4, status: 'RUNNING_LATE', delayMinutes: 65 },
  { id: 't9', trainNumber: '12560', trainName: 'Shiv Ganga Express', lat: 26.5, lng: 80.8, status: 'DELAYED', delayMinutes: 38 },
  { id: 't10', trainNumber: '15657', trainName: 'Brahmaputra Mail', lat: 25.5, lng: 84.9, status: 'RUNNING_LATE', delayMinutes: 82 },
];

const INDIA_BORDER_COORDS = [
  { lng: 76.8, lat: 37.0 },
  { lng: 77.8, lat: 35.5 },
  { lng: 78.8, lat: 35.2 },
  { lng: 80.2, lat: 31.0 },
  { lng: 81.0, lat: 30.2 },
  { lng: 84.5, lat: 27.2 },
  { lng: 88.0, lat: 27.8 },
  { lng: 88.6, lat: 28.2 },
  { lng: 88.8, lat: 27.2 },
  { lng: 91.5, lat: 27.8 },
  { lng: 92.5, lat: 27.8 },
  { lng: 96.0, lat: 28.2 },
  { lng: 97.4, lat: 27.8 },
  { lng: 95.8, lat: 26.5 },
  { lng: 94.3, lat: 25.2 },
  { lng: 93.3, lat: 22.0 },
  { lng: 92.2, lat: 21.8 },
  { lng: 92.0, lat: 23.5 },
  { lng: 89.8, lat: 22.0 },
  { lng: 88.2, lat: 21.6 },
  { lng: 86.8, lat: 21.8 },
  { lng: 86.2, lat: 21.0 },
  { lng: 84.0, lat: 19.3 },
  { lng: 80.2, lat: 13.5 },
  { lng: 79.8, lat: 10.2 },
  { lng: 78.5, lat: 9.0 },
  { lng: 77.6, lat: 8.0 },
  { lng: 76.5, lat: 10.0 },
  { lng: 74.8, lat: 13.0 },
  { lng: 73.8, lat: 15.5 },
  { lng: 72.8, lat: 19.0 },
  { lng: 72.2, lat: 21.1 },
  { lng: 70.0, lat: 21.0 },
  { lng: 68.2, lat: 22.8 },
  { lng: 68.5, lat: 23.8 },
  { lng: 70.0, lat: 24.5 },
  { lng: 71.0, lat: 24.6 },
  { lng: 71.2, lat: 26.0 },
  { lng: 72.5, lat: 28.2 },
  { lng: 74.2, lat: 30.2 },
  { lng: 74.8, lat: 32.8 },
  { lng: 75.8, lat: 34.2 },
  { lng: 74.0, lat: 35.0 },
  { lng: 74.5, lat: 36.8 }
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [activeLayers, setActiveLayers] = useState<Set<MapLayer>>(new Set(['network', 'trains', 'alerts']));
  const [selectedStation, setSelectedStation] = useState<(typeof DEMO_STATIONS)[0] | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [filteredStations, setFilteredStations] = useState(DEMO_STATIONS);
  const storeTrains = useAppStore(state => state.trains);
  const activeTrains = TRAIN_POSITIONS.map(tp => {
    const matched = storeTrains.find(t => t.id === tp.id || t.trainNumber === tp.trainNumber);
    return {
      ...tp,
      status: matched ? matched.status : tp.status,
      delayMinutes: matched ? matched.delayMinutes : tp.delayMinutes,
      trainName: matched ? matched.trainName : tp.trainName,
    };
  });

  const minLng = 68; const maxLng = 98;
  const minLat = 8; const maxLat = 36;
  const pointsStr = INDIA_BORDER_COORDS.map((pt) => {
    const x = ((pt.lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - pt.lat) / (maxLat - minLat)) * 100;
    return `${x},${y}`;
  }).join(' ');

  useEffect(() => {
    const search = searchQuery.toLowerCase();
    setFilteredStations(
      DEMO_STATIONS.filter(
        (s) => s.name.toLowerCase().includes(search) || s.code.toLowerCase().includes(search) || s.city.toLowerCase().includes(search)
      )
    );
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapError(true);
      setMapLoaded(true);
    }, 2500);

    const initMap = async () => {
      try {
        const maplibregl = await import('maplibre-gl');
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [78.9629, 20.5937], // Center of India
          zoom: 4.5,
          attributionControl: false,
        });

        map.on('load', () => {
          clearTimeout(timer);
          setMapLoaded(true);

          // Add station markers
          DEMO_STATIONS.forEach((station) => {
            const el = document.createElement('div');
            el.className = 'station-marker';
            el.style.cssText = `
              width: 12px; height: 12px; background: #FF6B2B;
              border: 2px solid white; border-radius: 50%;
              cursor: pointer; box-shadow: 0 0 0 3px rgba(255,107,43,0.3);
            `;

            const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
              .setHTML(`
                <div style="background:#1A2840;padding:12px;border-radius:8px;color:white;min-width:180px;">
                  <div style="font-weight:700;font-size:14px;color:#FF6B2B">${station.code}</div>
                  <div style="font-size:13px;margin:4px 0;">${station.name}</div>
                  <div style="font-size:11px;color:#94A3B8">${station.zone} Zone · ${station.totalPlatforms} platforms</div>
                  <div style="margin-top:8px;font-size:11px;color:#22C55E">● ${station.city}, ${station.state}</div>
                </div>
              `);

            new maplibregl.Marker({ element: el })
              .setLngLat([station.longitude, station.latitude])
              .setPopup(popup)
              .addTo(map as unknown as import('maplibre-gl').Map);

            el.addEventListener('click', () => {
              setSelectedStation(station);
            });
          });

          // Add train position markers
          TRAIN_POSITIONS.forEach((train) => {
            const el = document.createElement('div');
            const color = train.status === 'ON_TIME' ? '#22C55E' :
                         train.status === 'DELAYED' ? '#F97316' : '#EF4444';
            el.style.cssText = `
              width: 8px; height: 8px; background: ${color};
              border: 1px solid white; border-radius: 50%;
              animation: pulse 2s infinite;
            `;
            new maplibregl.Marker({ element: el })
              .setLngLat([train.lng, train.lat])
              .addTo(map as unknown as import('maplibre-gl').Map);
          });
        });

        map.on('error', () => {
          clearTimeout(timer);
          setMapError(true);
          setMapLoaded(true);
        });
        mapRef.current = map;
      } catch {
        clearTimeout(timer);
        setMapError(true);
        setMapLoaded(true);
      }
    };

    initMap();
    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
      }
    };
  }, []);

  const toggleLayer = useCallback((layer: MapLayer) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] flex overflow-hidden bg-[#0D1B2A]">
      {/* ─── Left Sidebar ─────────────────────────────────── */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="relative z-10 w-80 flex flex-col bg-[#0A1628]/95 backdrop-blur border-r border-white/10 shrink-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold text-white">Railway Network Map</h1>
          <p className="text-xs text-slate-400 mt-0.5">Indian Railways — 20 Major Stations · {storeTrains.length} Trains</p>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6B2B]/50"
            />
          </div>
        </div>

        {/* Layer Controls */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Map Layers</span>
          </div>
          <div className="space-y-2">
            {(Object.entries(LAYER_CONFIG) as [MapLayer, typeof LAYER_CONFIG[MapLayer]][]).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeLayers.has(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${isActive ? 'opacity-100' : 'opacity-30'}`}
                    style={{ background: config.color }} />
                  <Icon className="h-3.5 w-3.5" />
                  <span>{config.label}</span>
                  <div className={`ml-auto h-4 w-8 rounded-full transition-colors ${isActive ? 'bg-[#FF6B2B]' : 'bg-white/10'}`}>
                    <div className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Network Stats */}
        <div className="p-4 border-b border-white/10">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'On Time', value: `${DEMO_KPIS.onTimePercentage}%`, color: '#22C55E' },
              { label: 'Avg Delay', value: `${DEMO_KPIS.averageDelayMinutes}min`, color: '#F97316' },
              { label: 'Active Trains', value: DEMO_KPIS.totalTrainsRunning, color: '#3B82F6' },
              { label: 'Critical Alerts', value: DEMO_KPIS.criticalAlerts, color: '#EF4444' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredStations.map((station) => {
              const hasAlert = DEMO_ALERTS.some((a) => a.stationCode === station.code && a.status === 'ACTIVE');
              return (
                <motion.button
                  key={station.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedStation(station)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    selectedStation?.id === station.id
                      ? 'bg-[#FF6B2B]/20 border border-[#FF6B2B]/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#FF6B2B]">{station.code.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{station.name}</div>
                    <div className="text-xs text-slate-400">{station.zone} · {station.totalPlatforms}P</div>
                  </div>
                  {hasAlert && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── Map Container ────────────────────────────────── */}
      <div className="flex-1 relative">
        {/* Map */}
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Fallback visualization when MapLibre fails or is loading */}
        {(mapError || !mapLoaded) && (
          <div className="absolute inset-0 bg-[#0D1B2A] flex flex-col">
            {/* India SVG map placeholder */}
            <div className="flex-1 relative overflow-hidden">
              {/* Background gradient simulating map */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#1B3A6B]/20 to-[#0D1B2A]" />

              {/* Grid overlay */}
              <div className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />

              {/* India SVG map outline */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon
                  points={pointsStr}
                  className="fill-[#1B3A6B]/15 stroke-[#1B3A6B]/50 stroke-[0.3]"
                  style={{ strokeDasharray: '0.6, 0.6' }}
                />
              </svg>

              {/* Station dots on canvas */}
              {DEMO_STATIONS.map((station, idx) => {
                // Project lat/lng to screen (rough India bounding box)
                const mapW = 800; const mapH = 600;
                const minLng = 68; const maxLng = 98;
                const minLat = 8; const maxLat = 36;
                const x = ((station.longitude - minLng) / (maxLng - minLng)) * 100;
                const y = ((maxLat - station.latitude) / (maxLat - minLat)) * 100;
                const hasAlert = DEMO_ALERTS.some((a) => a.stationCode === station.code && a.status === 'ACTIVE');

                return (
                  <motion.button
                    key={station.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setSelectedStation(station)}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
                  >
                    <div className={`relative h-4 w-4 rounded-full border-2 border-white/80 transition-all group-hover:scale-150 ${
                      hasAlert ? 'bg-red-500' :
                      selectedStation?.id === station.id ? 'bg-[#FF6B2B]' : 'bg-[#FF6B2B]'
                    }`}>
                      {hasAlert && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-400 animate-ping" />
                      )}
                    </div>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                      <div className="bg-[#1A2840] border border-white/10 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap">
                        <span className="text-[#FF6B2B] font-bold">{station.code}</span>
                        {' · '}{station.name}
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              {activeLayers.has('trains') && activeTrains.map((train, idx) => {
                const minLng = 68; const maxLng = 98;
                const minLat = 8; const maxLat = 36;
                const x = ((train.lng - minLng) / (maxLng - minLng)) * 100;
                const y = ((maxLat - train.lat) / (maxLat - minLat)) * 100;
                const color = train.status === 'ON_TIME' ? '#22C55E' :
                             train.status === 'DELAYED' ? '#F97316' : '#EF4444';
                return (
                  <motion.button
                    key={train.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    onClick={() => setSelectedTrain(train)}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
                  >
                    <div className="h-2.5 w-2.5 rounded-full border border-white/60 animate-pulse"
                      style={{ background: color }} />
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                      <div className="bg-[#1A2840] border border-white/10 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap">
                        <span className="font-bold">{train.trainNumber}</span>
                        {train.delayMinutes > 0 && <span className="text-red-400"> +{train.delayMinutes}m</span>}
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              {/* Map attribution */}
              <div className="absolute bottom-4 right-4 text-xs text-slate-600">
                Railway Network · Indian Railways Zones
              </div>

              {/* Loading indicator */}
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-[#FF6B2B] border-t-transparent animate-spin" />
                    <span className="text-sm text-slate-400">Loading railway network...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Alerts Overlay (top-right) */}
        {activeLayers.has('alerts') && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 z-20 w-72 space-y-2 max-h-64 overflow-y-auto"
          >
            {DEMO_ALERTS.filter((a) => a.status === 'ACTIVE').slice(0, 3).map((alert) => (
              <motion.div
                key={alert.id}
                layout
                className="bg-[#0A1628]/90 backdrop-blur-sm border rounded-lg p-3"
                style={{ borderColor: `${SEVERITY_COLORS[alert.severity]}40` }}
              >
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: SEVERITY_COLORS[alert.severity] }} />
                  <div>
                    <div className="text-xs font-semibold text-white leading-tight">{alert.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{alert.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Map Controls */}
        <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
          <button className="h-9 w-9 bg-[#1A2840]/90 backdrop-blur border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button className="h-9 w-9 bg-[#1A2840]/90 backdrop-blur border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-4 z-20 bg-[#0A1628]/90 backdrop-blur border border-white/10 rounded-lg p-3">
          <div className="text-xs font-semibold text-slate-400 mb-2">Legend</div>
          <div className="space-y-1.5">
            {[
              { color: '#FF6B2B', label: 'Station' },
              { color: '#22C55E', label: 'On Time Train' },
              { color: '#F97316', label: 'Delayed Train' },
              { color: '#EF4444', label: 'Critical Alert' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Station Detail Panel ─────────────────────────── */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-[#0A1628]/95 backdrop-blur-sm border-l border-white/10 z-30 flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#FF6B2B]">{selectedStation.code}</span>
                  <span className="text-xs bg-white/10 rounded px-2 py-0.5 text-slate-300">{selectedStation.category}</span>
                </div>
                <h3 className="font-semibold text-white mt-0.5">{selectedStation.name}</h3>
                <p className="text-xs text-slate-400">{selectedStation.city}, {selectedStation.state}</p>
              </div>
              <button onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Zone', value: selectedStation.zone },
                  { label: 'Division', value: selectedStation.division },
                  { label: 'Platforms', value: selectedStation.totalPlatforms },
                  { label: 'Junction', value: selectedStation.isJunction ? 'Yes' : 'No' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className="text-sm font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Platform Status */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform Status</h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: Math.min(selectedStation.totalPlatforms, 8) }).map((_, i) => {
                    const statuses = ['AVAILABLE', 'OCCUPIED', 'AVAILABLE', 'AVAILABLE', 'OCCUPIED', 'BLOCKED', 'AVAILABLE', 'AVAILABLE'];
                    const s = statuses[i % statuses.length];
                    return (
                      <div key={i} className={`rounded p-1.5 text-center text-xs font-medium ${
                        s === 'AVAILABLE' ? 'bg-green-500/20 text-green-400' :
                        s === 'OCCUPIED' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        P{i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Trains at Station */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Trains</h4>
                {storeTrains
                  .filter((t: any) => t.currentStation === selectedStation.code || t.nextStation === selectedStation.code)
                  .slice(0, 3)
                  .map((train: any) => (
                    <div key={train.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2.5 mb-1.5">
                      <div className={`h-2 w-2 rounded-full ${
                        train.status === 'ON_TIME' ? 'bg-green-400' :
                        train.status === 'DELAYED' ? 'bg-orange-400' : 'bg-red-400'
                      }`} />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-white">{train.trainNumber}</div>
                        <div className="text-xs text-slate-400 truncate">{train.trainName}</div>
                      </div>
                      {train.delayMinutes > 0 && (
                        <span className="text-xs text-red-400">+{train.delayMinutes}m</span>
                      )}
                    </div>
                  ))}
                {storeTrains.filter((t: any) => t.currentStation === selectedStation.code || t.nextStation === selectedStation.code).length === 0 && (
                  <p className="text-xs text-slate-500 italic">No active trains at this station</p>
                )}
              </div>

              {/* Alerts */}
              {DEMO_ALERTS.filter((a) => a.stationCode === selectedStation.code).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Alerts</h4>
                  {DEMO_ALERTS.filter((a) => a.stationCode === selectedStation.code).map((alert) => (
                    <div key={alert.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-300">{alert.severity}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{alert.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Assessment */}
              <div className="bg-[#1B3A6B]/20 border border-[#1B3A6B]/40 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-5 rounded bg-[#FF6B2B]/20 flex items-center justify-center">
                    <span className="text-xs">✦</span>
                  </div>
                  <span className="text-xs font-semibold text-[#FF6B2B]">RailCopilot Assessment</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedStation.name} is operating at {selectedStation.isJunction ? 'junction' : 'terminal'} capacity.
                  Network health for {selectedStation.zone} zone is within acceptable parameters.
                  Recommend monitoring Platform 2 occupancy during evening peak hours.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
