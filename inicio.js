let progreso = 0;
let intervalo;
let pausado = false;

// Frases para diferentes porcentajes
const frases = {
  10: 'Inicializando motor gráfico...',
  25: 'Cargando escenario...',
  40: 'Procesando datos...',
  50: 'Cargando módulos secretos...',
  65: 'Estableciendo conexión...',
  80: 'Preparando explosivos...',
  90: 'Casi listo...',
  95: 'Desbloqueando acceso final...'
};

function actualizarBarra() {
  document.getElementById('barra-progreso').style.width = progreso + '%';
  document.getElementById('porcentaje').textContent = progreso + '%';

  // Mostrar frase si existe para este porcentaje y no estamos pausados
  if (frases[progreso] && !pausado) {
    pausado = true;
    clearInterval(intervalo);
    document.querySelector('.cargando').textContent = frases[progreso];

    setTimeout(() => {
      document.querySelector('.cargando').textContent = 'Cargando...';
      pausado = false;
      iniciarCarga();
    }, 2500);
  }

  if (progreso >= 100) {
    clearInterval(intervalo);
    const pantalla = document.getElementById('pantalla-carga');
    pantalla.classList.add('fade-out');

    setTimeout(() => {
    const pantalla = document.getElementById('pantalla-carga');
    pantalla.style.display = 'none';  // oculta solo la pantalla de carga
    document.getElementById('menu-principal').classList.remove('oculto'); // muestra menú
    }, 1000);
  }
}

function iniciarCarga() {
  intervalo = setInterval(() => {
    progreso++;
    actualizarBarra();
  }, 30);
}

iniciarCarga();

//inician las funciones del menu 
function jugar() {
  window.location.href = 'index.html';
}

function mostrarInstrucciones() {
 window.location.href = 'instrucciones.html';
}

function verLogros() {
   window.location.href = 'logros.html';
}
