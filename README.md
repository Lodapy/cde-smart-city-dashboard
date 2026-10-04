# CDE Smart City Dashboard 🏙️📊
> **Sistema de Inteligencia Urbana y Gemelo Digital para la Intendencia de Ciudad del Este**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deck.gl](https://img.shields.io/badge/Deck.gl-9.3-green?logo=uber&logoColor=white)](https://deck.gl/)
[![Mapbox / MapLibre](https://img.shields.io/badge/GIS-Mapbox%20%7C%20MapLibre-orange)](https://maplibre.org/)

---

## 📌 Descripción del Proyecto

El **CDE Smart City Dashboard** es una plataforma interactiva de inteligencia geoespacial y analítica urbana de alta precisión diseñada para la **Intendencia Municipal de Ciudad del Este (Paraguay)**. 

Inspirada en la estética **"Foundry"** (estilo centros de comando críticos y sistemas de inteligencia operativa de alto rendimiento), la aplicación combina visualización 3D por capas, telemetría urbana en tiempo real, simulación de fluidos de tráfico y análisis satelital histórico para respaldar la toma de decisiones basada en evidencia.

---

## ✨ Características Principales

### 1. 🗺️ Gemelo Digital 3D & Cartografía Avanzada
- **Visualización 3D de Alta Fidelidad**: Renderizado con `Mapbox GL JS` y capas masivas con `@deck.gl`, con soporte para extrusión de edificios y relieve topográfico.
- **Resiliencia Automática (Fallback Inteligente)**: Si no se provee un token de Mapbox o falla la conexión, el sistema conmuta automáticamente o mediante un botón a **MapLibre GL** con cartografía oscura de CartoDB, asegurando 100% de operatividad en cualquier contexto.
- **Capas de Dispersión Interactivas**: Visualización geoespacial de incidentes municipales categorizados por baches, alumbrado público, aseo urbano y puntos críticos de tránsito.

### 2. 🚨 Sistema de Alertas en Tiempo Real y Verificación en Terreno
- **Monitor de Incidentes Críticos**: Detección dinámica y priorización de eventos urbanos con animación pulsante roja en el mapa.
- **Auditoría y Flujo de Verificación**: Sidebar interactivo con metadatos técnicos (coordenadas, severidad, tipo de reporte, estado de verificación). Botón **"Verificar Datos"** con confirmación inmediata que actualiza el estado a verificado (color esmeralda) en tiempo real.

### 3. 🌊 Diagnóstico de Nodos Críticos de Tránsito
- Análisis focalizado en los tres puntos de mayor congestión y fricción comercial de Ciudad del Este:
  - **Puente de la Amistad** (Paso fronterizo internacional)
  - **Rotonda Área 1** (Eje neurálgico de conexión interbarrial)
  - **Rotonda Oasis** (Distribuidor central de acceso comercial)
- Gráficos de flujo de saturación vehicular horaria, niveles de congestión y matrices de severidad.

### 4. 🛰️ Expansión Satelital & Archivo Histórico Multitemporal
- Comparador interactivo de imágenes satelitales multitemporales (**2010 vs 2024**).
- Métricas de impermeabilización del suelo, pérdida de cobertura verde y tasa de densificación urbana por cuadrantes.

### 5. 🎯 Roadmap Estratégico Municipal & KPIs
- Matriz de iniciativas clasificadas por horizonte temporal (Corto, Mediano y Largo Plazo).
- Indicadores clave de rendimiento (KPIs) para presupuesto, cobertura de sensores IoT, tiempo medio de respuesta y reducción de cuellos de botella.

---

## 🎨 Identidad Visual & Diseño ("Foundry Aesthetic")

- **Paleta de Colores**: Tema oscuro táctico (`#090A0F`, `#0E121A`) con acentos vibrantes de advertencia y acción en tonos naranja ámbar (`#F97316`, `#FB923C`, `#FDBA74`).
- **Tipografía Técnica**: Fuentes monoespaciadas y jerarquía tipográfica limpia para visualización de telemetría y coordenadas.
- **Glassmorphism y Paneles de Datos**: Interfaces semi-translúcidas con desenfoque de fondo (`backdrop-blur`), bordes sutiles y micro-interacciones fluidas mediante `motion`.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Frontend Core** | React 19, TypeScript 5.8 |
| **Build & Bundler** | Vite 6 |
| **Estilos & UI** | Tailwind CSS v4, Lucide React, Motion (Framer Motion) |
| **Geointeligencia & 3D** | Deck.gl v9, Mapbox GL JS, MapLibre GL |
| **Gráficos & Métricas** | Recharts |
| **Backend Opcional** | Express, Node.js (`server.ts`) |

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js 18+ o superior
- Gestor de paquetes `npm`, `pnpm` o `bun`

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/cde-smart-city-dashboard.git
cd cde-smart-city-dashboard
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno (Opcional)
Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Si dispones de un token público de Mapbox, añádelo en `.env.local`:
```env
VITE_MAPBOX_TOKEN="tu_mapbox_access_token_aqui"
```
*(Nota: Si no configuras el token, la aplicación usará de forma automática y transparente el motor MapLibre GL con CartoDB Dark Matter)*.

### 4. Iniciar el entorno de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### 5. Compilación para producción
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

---

## 📁 Estructura del Proyecto

```text
├── index.html                   # Entry point HTML con metadatos y SEO
├── metadata.json                # Metadatos del applet y configuración
├── package.json                 # Dependencias y scripts de ejecución
├── tsconfig.json                # Configuración de compilador TypeScript
├── vite.config.ts               # Configuración de Vite y plugins
├── src/
│   ├── main.tsx                 # Montaje de la aplicación React
│   ├── App.tsx                  # Dashboard principal, estados y tabs
│   ├── index.css                # Estilos globales y tokens Tailwind v4
│   └── components/
│       ├── FoundryMap.tsx       # Componente de mapa dual 3D (Mapbox / MapLibre + Deck.gl)
│       └── ...                  # Modales, gráficos y componentes de UI
```

---

## 🏛️ Contexto Institucional

Este prototipo fue concebido para modernizar la gestión urbana y de servicios de la **Municipalidad de Ciudad del Este**, permitiendo a las direcciones de:
1. **Obras Públicas y Vialidad**: Priorizar recapados y bacheos según densidad de reportes verificados.
2. **Tránsito y Transporte**: Modelar desvíos dinámicos en los corredores del microcentro y accesos fronterizos.
3. **Medio Ambiente y Catastro**: Fiscalizar la expansión urbana y la impermeabilización de cuencas hidrológicas.

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE) - puedes utilizarlo, adaptarlo y distribuirlo libremente.
