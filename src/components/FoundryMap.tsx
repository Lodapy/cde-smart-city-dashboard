import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Types
export interface Report {
  id: number;
  position: [number, number];
  type: 'bache' | 'alumbrado' | 'aseo' | 'transito';
  severity: number;
  verified?: boolean;
}

interface FoundryMapProps {
  mapboxToken?: string;
  reports: Report[];
  activeAlerts: number[];
  onSelectReport?: (report: Report) => void;
}

const TYPE_COLORS: Record<string, [number, number, number]> = {
  bache: [255, 100, 0],
  alumbrado: [255, 255, 0],
  aseo: [0, 255, 100],
  transito: [0, 100, 255]
};

export const FoundryMap: React.FC<FoundryMapProps> = ({ mapboxToken, reports, activeAlerts, onSelectReport }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useBasicMap, setUseBasicMap] = useState(false);
  const mapRef = useRef<any>(null);
  const deckRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initMap = async () => {
      try {
        if (mapboxToken && !useBasicMap) {
          mapboxgl.accessToken = mapboxToken;
          
          const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-54.611, -25.513], // CDE Coordinates
            zoom: 13,
            pitch: 45,
            bearing: -17,
            antialias: true
          });

          map.on('load', () => {
            // Add 3D terrain
            map.addSource('mapbox-dem', {
              type: 'raster-dem',
              url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
              tileSize: 512,
              maxzoom: 14
            });
            map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

            // Add building extrusion
            map.addLayer({
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 15,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.6
              }
            });

            // Add Deck.gl overlay
            const deckOverlay = new MapboxOverlay({
              layers: [
                new ScatterplotLayer({
                  id: 'reports-layer',
                  data: reports,
                  getPosition: (d: Report) => d.position,
                  getFillColor: (d: Report) => {
                    if (d.verified) return [16, 185, 129, 200]; // Emerald for verified
                    const baseColor = TYPE_COLORS[d.type];
                    if (activeAlerts.includes(d.id)) {
                      return [239, 68, 68, 255]; // Red for active alerts
                    }
                    return [...baseColor, 200] as [number, number, number, number];
                  },
                  getRadius: (d: Report) => {
                    if (activeAlerts.includes(d.id)) {
                      return 100;
                    }
                    return d.severity * 50 + 10;
                  },
                  pickable: true,
                  onClick: (info) => onSelectReport?.(info.object),
                  updateTriggers: {
                    getFillColor: [activeAlerts, reports],
                    getRadius: [activeAlerts]
                  }
                })
              ]
            });

            map.addControl(deckOverlay as any);
            deckRef.current = deckOverlay;
          });

          mapRef.current = map;
        } else {
          // Fallback to MapLibre
          const map = new maplibregl.Map({
            container: mapContainerRef.current!,
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [-54.611, -25.513],
            zoom: 13
          });

          mapRef.current = map;
        }
      } catch (err) {
        console.error('Map initialization failed:', err);
        setMapError('Error técnico al cargar el motor cartográfico.');
      }
    };

    initMap();

    return () => {
      mapRef.current?.remove();
    };
  }, [mapboxToken, useBasicMap]);

  // Update deck.gl layers when reports or activeAlerts change
  useEffect(() => {
    if (deckRef.current && reports) {
      deckRef.current.setProps({
        layers: [
          new ScatterplotLayer({
            id: 'reports-layer',
            data: reports,
            getPosition: (d: Report) => d.position,
            getFillColor: (d: Report) => {
              if (d.verified) return [16, 185, 129, 200];
              const baseColor = TYPE_COLORS[d.type];
              if (activeAlerts.includes(d.id)) {
                return [239, 68, 68, 255];
              }
              return [...baseColor, 200] as [number, number, number, number];
            },
            getRadius: (d: Report) => {
              if (activeAlerts.includes(d.id)) {
                return 100;
              }
              return d.severity * 50 + 10;
            },
            pickable: true,
            onClick: (info) => onSelectReport?.(info.object),
            updateTriggers: {
              getFillColor: [activeAlerts, reports],
              getRadius: [activeAlerts]
            }
          })
        ]
      });
    }
  }, [reports, activeAlerts]);

  if (mapError && !useBasicMap) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Fallo Crítico de Sistema</h2>
        <p className="text-slate-400 max-w-md mb-8 font-mono text-sm">
          No se detectó un token de Mapbox válido o el motor de renderizado 3D no es compatible con este entorno.
        </p>
        <button 
          onClick={() => setUseBasicMap(true)}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20"
        >
          Usar Mapa Básico (MapLibre)
        </button>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />;
};
