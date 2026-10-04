/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Mountain, 
  Satellite, 
  Layers, 
  Lightbulb, 
  Map as MapIcon,
  MapPin,
  X,
  History,
  Image as ImageIcon,
  Video,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Moon,
  Sun,
  Bell,
  Zap,
  AlertCircle,
  Database,
  Cpu,
  Activity,
  Maximize2,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FoundryMap, type Report } from './components/FoundryMap';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAPBOX_TOKEN = (import.meta as any).env.VITE_MAPBOX_TOKEN;

// --- Types ---
type TabType = 'diagnostico' | 'transito' | 'topografia' | 'satelital' | 'modelo' | 'soluciones' | 'roadmap';

// --- Mock Data Generation ---
const generateMockReports = (): Report[] => Array.from({ length: 200 }).map((_, i) => ({
  id: i,
  position: [
    -54.611 + (Math.random() - 0.5) * 0.05,
    -25.513 + (Math.random() - 0.5) * 0.05
  ],
  type: ['bache', 'alumbrado', 'aseo', 'transito'][Math.floor(Math.random() * 4)] as any,
  severity: Math.random(),
  verified: false
}));

// --- Mock Data ---
const trafficData = [
  { time: '0h', puente: 200, area1: 150 },
  { time: '4h', puente: 80, area1: 60 },
  { time: '7h', puente: 1800, area1: 1400 },
  { time: '8h', puente: 3200, area1: 2800 },
  { time: '12h', puente: 2000, area1: 1600 },
  { time: '17h', puente: 3400, area1: 3000 },
  { time: '18h', puente: 3800, area1: 3400 },
  { time: '21h', puente: 1800, area1: 1400 },
  { time: '24h', puente: 400, area1: 300 },
];

const topoData = [
  { dist: 'Porto', alt: 168 },
  { dist: 'Microcentro', alt: 172 },
  { dist: 'Oasis', alt: 178 },
  { dist: 'Km2', alt: 185 },
  { dist: 'Km4', alt: 208 },
  { dist: 'Km5', alt: 210 },
  { dist: 'Acaraymí', alt: 194 },
  { dist: 'Área 1', alt: 199 },
  { dist: 'Km10', alt: 203 },
  { dist: 'Minga G.', alt: 212 },
  { dist: 'Km16', alt: 218 },
];

const growthData = [
  { year: '2022', cde: 315, minga: 75, franco: 85, altos: 45 },
  { year: '2026', cde: 336, minga: 86, franco: 95, altos: 52 },
  { year: '2030', cde: 352, minga: 93, franco: 100, altos: 65 },
  { year: '2035', cde: 370, minga: 97, franco: 104, altos: 88 },
];

const modelScores = [
  { name: 'Colapso Tránsito', score: 0.82, color: '#f97316' },
  { name: 'Inundación Zona 1', score: 0.79, color: '#fb923c' },
  { name: 'Polo Minga 2030', score: 0.62, color: '#fdba74' },
  { name: 'CDE Policéntrica', score: 0.42, color: '#fed7aa' },
  { name: 'Bloqueo Área 1', score: 0.78, color: '#fed7aa' },
];

// --- Components ---

const Card = ({ children, className, title, subtitle, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string, icon?: any }) => (
  <div className={cn("glass-panel rounded-lg overflow-hidden technical-grid", className)}>
    {(title || subtitle) && (
      <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div>
          {title && <h3 className="font-mono font-bold text-orange-400 text-xs uppercase tracking-[0.2em]">{title}</h3>}
          {subtitle && <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-wider">{subtitle}</p>}
        </div>
        {Icon && <Icon size={16} className="text-orange-500/50" />}
      </div>
    )}
    <div className="p-5">
      {children}
    </div>
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'danger' | 'warning' | 'success' }) => {
  const variants = {
    default: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-widest", variants[variant])}>
      {children}
    </span>
  );
};

const ProblemCard = ({ severity, title, meta, data, analysis }: any) => (
  <div className="glass-panel rounded-lg mb-4 overflow-hidden technical-grid hover:bg-white/5 transition-colors">
    <div className="flex border-b border-white/5">
      <div className={cn(
        "w-16 flex flex-col items-center justify-center p-3 text-center text-[9px] font-mono font-bold",
        severity === 'CRÍTICO' ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
      )}>
        <AlertTriangle size={16} className="mb-1" />
        {severity}
      </div>
      <div className="flex-1 p-3">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-sm text-slate-200">{title}</h4>
          <Badge variant={severity === 'CRÍTICO' ? 'danger' : 'warning'}>VERIFICADO</Badge>
        </div>
        <p className="text-[9px] text-slate-500 mt-1 font-mono uppercase tracking-widest">{meta}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 text-[11px] font-mono">
      <div className="p-4 border-r border-white/5">
        <h5 className="font-bold text-orange-500 uppercase text-[9px] mb-2 tracking-widest">Datos Verificados</h5>
        <ul className="space-y-1 text-slate-400 list-disc pl-4">
          {data.map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className="p-4 bg-white/5">
        <h5 className="font-bold text-orange-500 uppercase text-[9px] mb-2 tracking-widest">Análisis Modelo 11 Capas</h5>
        <ul className="space-y-1 text-slate-400 list-disc pl-4">
          {analysis.map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  </div>
);

const HistoricalImageryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const images = [
    { date: "2024-03", label: "Actual", url: "https://picsum.photos/seed/cde-2024/800/600" },
    { date: "2020-05", label: "Pre-Pandemia", url: "https://picsum.photos/seed/cde-2020/800/600" },
    { date: "2015-11", label: "Expansión Km 7", url: "https://picsum.photos/seed/cde-2015/800/600" },
    { date: "2010-01", label: "Base Histórica", url: "https://picsum.photos/seed/cde-2010/800/600" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div>
                <h3 className="text-lg font-black text-orange-400 uppercase tracking-tighter flex items-center gap-2">
                  <History size={20} /> Archivo Satelital Histórico
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">Análisis de evolución urbana CDE 2010-2024</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto technical-grid">
              {images.map((img, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-white border border-white/10">
                      {img.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-bold text-slate-200">{img.label}</span>
                    <button className="text-[10px] font-mono text-orange-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                      Analizar Δ <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MapView = ({ activeAlerts, reports, onSelectReport, onVerify }: { activeAlerts: number[], reports: Report[], onSelectReport: (r: Report) => void, onVerify: (id: number) => void }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelect = (report: Report) => {
    setSelectedReport(report);
    onSelectReport(report);
  };

  const handleVerify = () => {
    if (!selectedReport) return;
    setIsVerifying(true);
    setTimeout(() => {
      onVerify(selectedReport.id);
      setSelectedReport(prev => prev ? { ...prev, verified: true } : null);
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="relative h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-2xl glass-panel">
      <FoundryMap 
        mapboxToken={MAPBOX_TOKEN} 
        reports={reports}
        activeAlerts={activeAlerts}
        onSelectReport={handleSelect}
      />
      
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="glass-panel p-4 rounded-lg border border-white/10 shadow-xl max-w-xs">
          <h4 className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-[0.2em] mb-2">Estado de Red</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-500"
                animate={{ width: ['20%', '90%', '40%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">88% CAP</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <div className="glass-panel p-3 rounded-lg border border-white/10 text-[9px] font-mono space-y-2 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> <span>Baches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" /> <span>Alumbrado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" /> <span>Aseo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" /> <span>Tránsito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> <span>Verificado</span>
          </div>
        </div>
      </div>

      {/* Report Detail Overlay */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-6 right-6 bottom-6 w-80 glass-panel border border-white/10 rounded-xl p-6 shadow-2xl z-20 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <Badge variant={selectedReport.verified ? "success" : "warning"}>
                {selectedReport.verified ? "VERIFICADO" : `REPORTE #${selectedReport.id}`}
              </Badge>
              <button onClick={() => setSelectedReport(null)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-200 uppercase tracking-tighter mb-1">
                  {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}
                </h3>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">ID_REF: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500">SEVERIDAD</span>
                  <span className="text-orange-400">{(selectedReport.severity * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${selectedReport.severity * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Coordenadas</h4>
                <p className="text-xs font-mono text-slate-300">LAT: {selectedReport.position[1].toFixed(6)}</p>
                <p className="text-xs font-mono text-slate-300">LNG: {selectedReport.position[0].toFixed(6)}</p>
              </div>
            </div>

            <button 
              onClick={handleVerify}
              disabled={isVerifying || selectedReport.verified}
              className={cn(
                "w-full py-3 font-black rounded-lg transition-all uppercase tracking-widest text-[10px] shadow-xl",
                selectedReport.verified 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
              )}
            >
              {isVerifying ? "Verificando..." : selectedReport.verified ? "Datos Verificados" : "Verificar Datos"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('diagnostico');
  const [notifications, setNotifications] = useState<{id: number, pointId: number, message: string, time: string}[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<number[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  // Initialize reports
  React.useEffect(() => {
    setReports(generateMockReports());
  }, []);

  const handleVerify = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...prev.find(x => x.id === id)!, verified: true } : r));
  };

  // Simulate Real-time Alerts
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && reports.length > 0) {
        const randomIdx = Math.floor(Math.random() * reports.length);
        const randomReport = reports[randomIdx];
        
        const newAlert = {
          id: Date.now(),
          pointId: randomReport.id,
          message: `ANOMALÍA DETECTADA: REPORTE #${randomReport.id} - ${randomReport.type.toUpperCase()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setNotifications(prev => [newAlert, ...prev].slice(0, 3));
        setActiveAlerts(prev => Array.from(new Set([...prev, randomReport.id])));

        setTimeout(() => {
          setActiveAlerts(prev => prev.filter(id => id !== randomReport.id));
        }, 15000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [reports]);

  const tabs = [
    { id: 'diagnostico', label: 'SISTEMA CENTRAL', icon: LayoutDashboard },
    { id: 'transito', label: 'FLUJO VIAL', icon: Car },
    { id: 'topografia', label: 'GEOMORFOLOGÍA', icon: Mountain },
    { id: 'satelital', label: 'EXPANSIÓN', icon: Satellite },
    { id: 'modelo', label: 'XAVIER CORE', icon: Layers },
    { id: 'soluciones', label: 'ESTRATEGIA', icon: Lightbulb },
    { id: 'roadmap', label: 'ROADMAP', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Technical Background Grid */}
      <div className="fixed inset-0 technical-grid opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-md p-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center shadow-2xl shadow-orange-500/20">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-white">
                CDE <span className="text-orange-500">SMART CITY</span> DASHBOARD
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">INTENDENCIA MUNICIPAL</span>
                <div className="h-3 w-px bg-white/10" />
                <span className="text-[10px] font-mono text-orange-500/80 uppercase tracking-[0.2em] flex items-center gap-1">
                  <Activity size={10} /> XAVIER URBAN INTELLIGENCE V4.2
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Estado de Servidor</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                OPERACIONAL / LAT: 24ms
              </span>
            </div>
            <div className="h-10 w-px bg-white/10 mx-2" />
            <div className="flex gap-2">
              <Badge variant="default">336.1k HAB</Badge>
              <Badge variant="default">70k V/D</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto p-6">
        {/* Tabs Navigation */}
        <nav className="flex flex-wrap gap-1 mb-8 glass-panel p-1 rounded-lg border border-white/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded text-[10px] font-mono font-bold transition-all uppercase tracking-widest",
                activeTab === tab.id 
                  ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'diagnostico' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <MapView 
                    activeAlerts={activeAlerts} 
                    reports={reports} 
                    onSelectReport={() => {}} 
                    onVerify={handleVerify} 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Métricas de Sistema" icon={Cpu}>
                      <div className="space-y-4">
                        {[
                          { label: "Carga de Procesamiento", val: "42%", color: "bg-orange-500" },
                          { label: "Integridad de Datos", val: "99.8%", color: "bg-emerald-500" },
                          { label: "Latencia de Sensores", val: "12ms", color: "bg-blue-500" },
                        ].map((m, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                              <span className="text-slate-500">{m.label}</span>
                              <span className="text-slate-200">{m.val}</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className={cn("h-full", m.color)} style={{ width: m.val.includes('%') ? m.val : '70%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card title="Alertas Recientes" icon={Bell}>
                      <div className="space-y-3">
                        {notifications.length > 0 ? notifications.map(n => (
                          <div key={n.id} className="p-3 bg-white/5 rounded border border-white/5 flex gap-3">
                            <div className="text-orange-500 mt-0.5"><AlertCircle size={14} /></div>
                            <div>
                              <p className="text-[11px] font-mono text-slate-300 leading-tight">{n.message}</p>
                              <p className="text-[9px] font-mono text-slate-500 mt-1">{n.time}</p>
                            </div>
                          </div>
                        )) : (
                          <div className="flex flex-col items-center justify-center py-8 text-slate-600">
                            <CheckCircle2 size={32} className="mb-2 opacity-20" />
                            <p className="text-[10px] font-mono uppercase tracking-widest">Sin alertas activas</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card title="Análisis de Problemáticas" icon={Layers}>
                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                      <ProblemCard 
                        severity="CRÍTICO"
                        title="Puente de la Amistad — Colapso Movilidad"
                        meta="REF: PM-2026-001"
                        data={["Demoras 3-6h", "50k veh/día", "Saturación 96%"]}
                        analysis={["Re_tráfico = 389k", "Vorticidad +0.94", "Caos Determinista"]}
                      />
                      <ProblemCard 
                        severity="CRÍTICO"
                        title="Rotonda Área 1 — Nudo Sistémico"
                        meta="REF: RA1-2025-042"
                        data={["70k veh/día", "Cruce PY07/San José", "Sin control inteligente"]}
                        analysis={["∇P_geo Máximo", "P(bloqueo) = 0.78", "Conflicto ω=0.85"]}
                      />
                      <ProblemCard 
                        severity="ALTO"
                        title="Expansión Urbana Descontrolada"
                        meta="REF: URB-2025-012"
                        data={["Crecimiento 1.5%/año", "Déficit habitacional", "Sin plan maestro"]}
                        analysis={["Λ_geo = +0.38/año", "Volatilidad Q=0.42", "Captura Inst. P=0.22"]}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'transito' && (
              <div className="space-y-6">
                <Card title="ARQUITECTURA DE CONTROL VIAL" subtitle="Integración Xavier AGX + CCTV + Semáforos">
                  <div className="bg-slate-900 dark:bg-black text-orange-300 p-4 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto">
                    <pre>{`CAPA HARDWARE:
  Cámaras IP (RTSP stream):
  ├── 12 cámaras Puente Amistad
  ├── 8 cámaras Rotonda Área 1
  ├── 6 cámaras Rotonda Oasis
  └── TOTAL: ~96 cámaras fase 1

CAPA MODELO (Navier-Stokes):
  ∂(ρu)/∂t = -∇p + μ∇²u + F_semaforo
  F_semaforo = fuerza de control optimizada según ∇p`}</pre>
                  </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card title="CURVA DE DEMANDA VIAL" subtitle="Vehículos/hora por nodo principal">
                    <div className="h-[300px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                          <defs>
                            <linearGradient id="colorPuente" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorArea1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                          <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                          <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="puente" stroke="#f97316" fillOpacity={1} fill="url(#colorPuente)" strokeWidth={2} name="Puente Amistad" />
                          <Area type="monotone" dataKey="area1" stroke="#fb923c" fillOpacity={1} fill="url(#colorArea1)" strokeWidth={2} name="Rotonda Área 1" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card title="NODOS CRÍTICOS" subtitle="Estado de saturación en tiempo real">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-orange-50 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 uppercase tracking-tighter font-bold">
                            <th className="py-3 px-2">Nodo</th>
                            <th className="py-3 px-2">Veh/día</th>
                            <th className="py-3 px-2">Re_tráfico</th>
                            <th className="py-3 px-2">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-50/50 dark:divide-orange-900/10">
                          <tr>
                            <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-300">Puente Amistad</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400">50.000</td>
                            <td className="py-3 px-2 text-red-600 dark:text-red-400 font-mono">389.583</td>
                            <td className="py-3 px-2"><Badge variant="danger">BLOQUEO</Badge></td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-300">Rotonda Área 1</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400">70.000</td>
                            <td className="py-3 px-2 text-red-600 dark:text-red-400 font-mono">285.000</td>
                            <td className="py-3 px-2"><Badge variant="danger">CRÍTICO</Badge></td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-300">Rotonda Oasis</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400">20.000+</td>
                            <td className="py-3 px-2 text-amber-600 dark:text-amber-400 font-mono">195.000</td>
                            <td className="py-3 px-2"><Badge variant="warning">SATURADO</Badge></td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-300">Km 4</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400">25.000</td>
                            <td className="py-3 px-2 text-amber-600 dark:text-amber-400 font-mono">165.000</td>
                            <td className="py-3 px-2"><Badge variant="warning">ALTO</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'topografia' && (
              <div className="space-y-6">
                <Card title="PERFIL TOPOGRÁFICO EJE ESTE-OESTE" subtitle="Análisis de cotas y riesgo hídrico (msnm)">
                  <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={topoData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                        <XAxis dataKey="dist" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                        <YAxis domain={[160, 230]} fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="alt" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} name="Altitud (msnm)" />
                        {/* Reference lines for flood zones */}
                        <Line type="monotone" dataKey={() => 175} stroke="#ef4444" strokeDasharray="5 5" dot={false} name="Riesgo Inundación" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
                    <h4 className="font-bold text-red-800 dark:text-red-400 text-xs mb-1">ZONA CRÍTICA</h4>
                    <p className="text-2xl font-black text-red-600 dark:text-red-500">P=0.79</p>
                    <p className="text-[10px] text-red-700 dark:text-red-400 mt-1">Microcentro-sur, San Blas. Cota 165-180m. Flujo NS converge.</p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 text-xs mb-1">RIESGO MODERADO</h4>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-500">P=0.55</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">Oasis-Km4. Pendientes pronunciadas. Encharcamiento.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs mb-1">ZONA SEGURA</h4>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-500">P=0.09</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">Minga Guazú Km14-16. Cota &gt;200m. Expansión óptima.</p>
                  </div>
                </div>

                <Card title="ALERTA TEMPRANA ITAIPÚ" subtitle="Integración de datos hidrológicos">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    El sistema Xavier procesa el nivel del embalse y apertura de compuertas de Itaipú para predecir crecidas del arroyo Acaray con 4-8 horas de antelación.
                  </p>
                  <div className="flex items-center gap-4 p-3 bg-slate-900 dark:bg-black rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400">CONEXIÓN ESTABLE CON API ITAIPÚ · NIVEL NORMAL</span>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'satelital' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-black text-white border-b-2 border-orange-500 pb-2 uppercase tracking-tighter">
                    Análisis de Expansión Satelital
                  </h2>
                  <button 
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest transition-all"
                  >
                    <History size={14} /> Ver Archivo Histórico
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-lg border border-white/5">
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">CDE 2025</p>
                    <p className="text-xl font-black text-orange-400">336.1k</p>
                    <p className="text-[9px] text-slate-600 font-mono">HABITANTES (INE)</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-white/5">
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">CDE 2035</p>
                    <p className="text-xl font-black text-orange-400">370.6k</p>
                    <p className="text-[9px] text-slate-600 font-mono">PROYECCIÓN +10.3%</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-white/5">
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Minga 2035</p>
                    <p className="text-xl font-black text-emerald-400">97.2k</p>
                    <p className="text-[9px] text-slate-600 font-mono">CRECIMIENTO +1.5%/AÑO</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-white/5">
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Área Metro</p>
                    <p className="text-xl font-black text-slate-200">~620k</p>
                    <p className="text-[9px] text-slate-600 font-mono">ESTIMACIÓN 2035</p>
                  </div>
                </div>

                <Card title="Proyección de Crecimiento por Polo" subtitle="Habitantes (miles) · Análisis Satelital Sentinel-2" icon={TrendingUp}>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff" opacity={0.05} />
                        <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false} stroke="#475569" />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#475569" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#020617', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="cde" stroke="#f97316" strokeWidth={2} dot={false} name="CDE Microcentro" />
                        <Line type="monotone" dataKey="minga" stroke="#10b981" strokeWidth={2} dot={false} name="Minga Guazú" />
                        <Line type="monotone" dataKey="franco" stroke="#fb923c" strokeWidth={2} dot={false} name="Presidente Franco" />
                        <Line type="monotone" dataKey="altos" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Los Altos (Nuevo)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Metodología NDBI" subtitle="Normalized Difference Built-up Index" icon={Maximize2}>
                    <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                      Utilizamos bandas SWIR y NIR de Sentinel-2 para detectar nuevas zonas urbanizadas. 
                      <span className="text-orange-400"> Minga Guazú (Km 14-16)</span> muestra un ΔNDBI de +0.26, indicando la urbanización más rápida del departamento.
                    </p>
                  </Card>
                  <Card title="Datasets Integrados" subtitle="Fuentes de Datos Xavier" icon={Database}>
                    <ul className="text-[10px] font-mono space-y-1 text-slate-500 uppercase tracking-widest">
                      <li>· Sentinel-2 L2A (10m res)</li>
                      <li>· SRTM 30m (NASA)</li>
                      <li>· Landsat 8/9 - Serie Histórica</li>
                      <li>· OpenStreetMap - Grafo Vial</li>
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'modelo' && (
              <div className="space-y-6">
                <Card title="MODELO 11 CAPAS GEOPOLÍTICO" subtitle="Adaptación al Dominio Urbano CDE">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-50 dark:border-orange-900/20">
                        <h5 className="font-bold text-orange-600 dark:text-orange-300 text-[10px] uppercase mb-1">Capa 1: S_vial(t)</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Análogo a GPR para tránsito. Hoy: S_vial(Puente) = 0.96 (Estado Crítico).</p>
                      </div>
                      <div className="p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-50 dark:border-orange-900/20">
                        <h5 className="font-bold text-orange-600 dark:text-orange-300 text-[10px] uppercase mb-1">Capa 5: Lorenz_vial</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Caos determinista. λ_max &gt; 0 → El sistema no converge al equilibrio sin intervención.</p>
                      </div>
                      <div className="p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-50 dark:border-orange-900/20">
                        <h5 className="font-bold text-orange-600 dark:text-orange-300 text-[10px] uppercase mb-1">Capa 11: Navier-Stokes</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Ecuación de flujo. Re_tráfico(Área 1) = 285k. Turbulencia extrema.</p>
                      </div>
                    </div>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={modelScores} layout="vertical">
                          <XAxis type="number" domain={[0, 1]} hide />
                          <YAxis dataKey="name" type="category" fontSize={9} width={100} tickLine={false} axisLine={false} stroke="#94a3b8" />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                            {modelScores.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                <div className="bg-slate-900 dark:bg-black p-6 rounded-2xl text-orange-50">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Layers size={16} className="text-orange-300" />
                    ECUACIÓN MAESTRA DE PREDICCIÓN URBANA
                  </h4>
                  <div className="font-mono text-lg md:text-2xl text-center py-4 text-orange-300">
                    P_urbano = Σ (w_i · Capa_i) + η_geo
                  </div>
                  <p className="text-[10px] text-orange-100/60 text-center italic">
                    Donde η_geo representa la volatilidad de crecimiento y α_urbana la cohesión institucional (0.18 en CDE).
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'soluciones' && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-200 border-b-2 border-orange-400 pb-2 w-fit mb-6">
                  RANKING DE SOLUCIONES PRIORITARIAS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { title: "Habilitación 24/7 Puente Integración", p: 96, cost: "$0", time: "30-60d" },
                      { title: "Viaducto Rotonda Área 1", p: 88, cost: "Itaipú", time: "18-24m" },
                      { title: "Sistema Cámaras + Semáforos", p: 82, cost: "$2-4M", time: "6-12m" },
                      { title: "Alerta Temprana Inundaciones", p: 79, cost: "<$100k", time: "3m" },
                    ].map((sol, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-orange-50 dark:border-orange-900/20 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{sol.title}</h4>
                          <span className="text-orange-500 dark:text-orange-400 font-black text-sm">{sol.p}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${sol.p}%` }}
                            className="bg-orange-500 h-full"
                          />
                        </div>
                        <div className="flex gap-4 mt-2 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                          <span>Costo: {sol.cost}</span>
                          <span>Tiempo: {sol.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Card title="SOLUCIÓN DE IMPACTO INMEDIATO" subtitle="Habilitación Puente Integración (P=96%)">
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      El puente ya está construido. La habilitación total para camiones y livianos reduce el Re_tráfico del Puente Amistad de 389k a 169k (-56%).
                    </p>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-lg flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">ACCIÓN RECOMENDADA</p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-500">Decreto presidencial para habilitación 24/7. Costo cero.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-orange-100 dark:border-orange-900/20 space-y-12">
                  {[
                    { year: "2026 Q2", title: "Habilitación Puente Integración + Viaducto Área 1", desc: "P(logro)=0.88. Primer sistema de cámaras en 3 nodos críticos.", color: "bg-orange-500" },
                    { year: "2026 Q4", title: "Alerta Temprana + Plan Maestro Minga Guazú", desc: "App ciudadana lanzada. Identificación de 50ha para nuevo polo.", color: "bg-orange-400" },
                    { year: "2027", title: "Red Completa de Cámaras (96) + Viaducto Km 10", desc: "Re_tráfico Área 1 baja a 150k. Reubicación voluntaria cota baja.", color: "bg-orange-300" },
                    { year: "2030", title: "Ciudad Policéntrica Operativa", desc: "Descongestión real del microcentro. 3 centros funcionales activos.", color: "bg-orange-200" },
                    { year: "2035", title: "CDE Smart City Consolidada", desc: "370k hab. absorbidos con infraestructura. Modelo regional.", color: "bg-emerald-500" },
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className={cn("absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-slate-950 shadow-sm", step.color)} />
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-50 dark:border-orange-900/20 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-[10px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest">{step.year}</span>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">{step.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-orange-500 rounded-3xl text-white shadow-xl shadow-orange-100 dark:shadow-orange-900/40">
                  <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                    <TrendingUp size={20} />
                    CONCLUSIÓN ESTRATÉGICA
                  </h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    La ventana de oportunidad crítica son los próximos 18 meses. Intervenir ahora tiene un P(éxito) superior al 80%. El modelo NS indica que sin acción, el colapso sistémico del tránsito será irreversible para 2028 debido a la tasa de crecimiento Λ_urbana de +0.52/año.
                  </p>
                  <button className="mt-6 bg-white text-orange-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-slate-100 transition-colors">
                    Generar Reporte Ejecutivo <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 p-12 text-center mt-12 bg-slate-950/50">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em]">SENTINEL-2</span>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em]">NASA SRTM</span>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em]">ITAIPÚ BINACIONAL</span>
          </div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
            © 2026 INTENDENCIA MUNICIPAL DE CIUDAD DEL ESTE · POWERED BY XAVIER URBAN INTELLIGENCE
          </p>
        </div>
      </footer>

      <HistoricalImageryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
      />
    </div>
  );
}
