// Inicializa el mapa centrado en Orizaba
var map = L.map('map', {
  zoomControl: true,
  maxZoom: 18,  // Aumentamos el zoom máximo para ver edificios
  minZoom: 12
}).setView([18.8538, -97.1056], 13);

// Límite del área visible del mapa (zona de Orizaba)
var bounds = L.latLngBounds(
  [18.82, -97.14],  // Suroeste
  [18.89, -97.07]   // Noreste
);

map.setMaxBounds(bounds);
map.on('drag', function() {
  map.panInsideBounds(bounds, { animate: false });
});

// Capa de mosaico base mejorada para calles visibles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  detectRetina: true
}).addTo(map);

// Capa adicional de edificios (se activa con zoom)
var buildingsLayer = L.tileLayer('https://tiles.{s}.waze.com/tiles/{z}/{x}/{y}.png?lang=es&token=USERToken', {
  maxZoom: 18,
  subdomains: ['1','2','3','4'],
  opacity: 0.7
});

map.on('zoomend', function() {
  if (map.getZoom() >= 16) {
    buildingsLayer.addTo(map);
  } else {
    map.removeLayer(buildingsLayer);
  }
});

// Icono futurista para los marcadores
var turisticoIcon = L.divIcon({
  html: `
    <div class="cyber-marker">
      <div class="marker-pulse"></div>
      <div class="marker-core"></div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

// Lista de puntos turísticos
var lugares = [
  { coords: [18.889, -97.072], title: 'CERRO DEL BORREGO', desc: 'Teleférico con vistas panorámicas' },
  { coords: [18.8538, -97.1056], title: 'CENTRO HISTÓRICO', desc: 'Arquitectura colonial y plaza principal' },
  { coords: [18.842, -97.099], title: 'POLIFORUM', desc: 'Centro cultural y exposiciones' },
  { coords: [18.857, -97.108], title: 'PASEO DEL RÍO', desc: 'Ruta escénica junto al río Crystal' },
  { coords: [18.847, -97.130], title: 'PLAZA VALLE', desc: 'Centro comercial moderno' },
  { coords: [18.860, -97.120], title: '500 ESCALONES', desc: 'Mirador con escalinata emblemática' }
];

// Agregar los marcadores al mapa
lugares.forEach(l => {
  L.marker(l.coords, {icon: turisticoIcon}).addTo(map)
    .bindPopup(`
      <div class="cyber-popup">
        <h3>${l.title}</h3>
        <p>${l.desc}</p>
        <div class="cyber-popup-footer"></div>
      </div>
    `);
});

// Control de escala estilizado
L.control.scale({
  position: 'bottomleft',
  maxWidth: 200,
  metric: true,
  imperial: false,
  updateWhenIdle: true
}).addTo(map);

// Efecto 3D con el toggle
document.getElementById('toggle3d').addEventListener('change', function(e) {
  const mapElement = document.getElementById('map');
  if(e.target.checked) {
    mapElement.classList.add('three-d');
  } else {
    mapElement.classList.remove('three-d');
  }
});

// Añadir estilo para los marcadores
const style = document.createElement('style');
style.textContent = `
  .cyber-marker {
    position: relative;
    width: 24px;
    height: 24px;
  }
  
  .marker-core {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: var(--neon-blue);
    border-radius: 50%;
    top: 6px;
    left: 6px;
    box-shadow: 0 0 10px var(--neon-blue),
                0 0 20px var(--neon-blue);
    z-index: 2;
  }
  
  .marker-pulse {
    position: absolute;
    width: 24px;
    height: 24px;
    background-color: var(--neon-pink);
    border-radius: 50%;
    opacity: 0.6;
    animation: pulse 2s infinite;
    z-index: 1;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.6;
    }
    70% {
      transform: scale(1.3);
      opacity: 0.1;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.6;
    }
  }
  
  /* Mejorar visibilidad de calles */
  .leaflet-container {
    background-color: var(--map-bg) !important;
  }
  
  /* Estilo para las calles */
  .leaflet-tile {
    filter: brightness(1.05) contrast(1.1);
  }
`;
document.head.appendChild(style);