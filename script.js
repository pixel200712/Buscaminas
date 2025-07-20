const tablero = document.getElementById("tablero");
const minasRestantesSpan = document.getElementById("minas-restantes");
const puntajeSpan = document.getElementById("puntaje");

const ancho = 8;
const totalCeldas = ancho * ancho;
const totalMinas = 8;

let minasRestantes = totalMinas;
let puntaje = 0;
let celdas = [];

const logrosBase = {
  primerPaso: false,
  explotarMina: false,
  experto: false,
  sinBandera: false,
  banderaPro: false,
  velocidadLuz: false
};

let logrosUsuario = cargarLogros();

let primerClicHecho = false;
let tiempoInicio = Date.now();
let banderasCorrectas = new Set();

function cargarLogros() {
  const data = localStorage.getItem("logros");
  return data ? JSON.parse(data) : { ...logrosBase };
}

function guardarLogros() {
  localStorage.setItem("logros", JSON.stringify(logrosUsuario));
}

function desbloquearLogro(id) {
  if (!logrosUsuario[id]) {
    logrosUsuario[id] = true;
    guardarLogros();
    mostrarLogro(`🏆 Logro desbloqueado: ${id}`);
  }
}

function mostrarLogro(mensaje) {
  const div = document.createElement("div");
  div.textContent = mensaje;
  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.right = "20px";
  div.style.background = "#0f08";
  div.style.padding = "10px 20px";
  div.style.border = "2px solid #0ff";
  div.style.borderRadius = "10px";
  div.style.color = "#fff";
  div.style.fontWeight = "bold";
  div.style.zIndex = 9999;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

function crearTablero() {
  // Reiniciar variables
  puntaje = 0;
  puntajeSpan.textContent = puntaje;
  minasRestantes = totalMinas;
  minasRestantesSpan.textContent = minasRestantes;
  primerClicHecho = false;
  tiempoInicio = Date.now();
  banderasCorrectas.clear();
  celdas = [];
  tablero.innerHTML = "";

  // Preparar minas y casillas vacías
  const minasArray = Array(totalMinas).fill("mina");
  const vaciasArray = Array(totalCeldas - totalMinas).fill("vacio");
  const mezcla = [...minasArray, ...vaciasArray].sort(() => Math.random() - 0.5);

  mezcla.forEach((tipo, i) => {
    const celda = document.createElement("div");
    celda.setAttribute("data-id", i);
    celda.classList.add("celda");
    celda.dataset.tipo = tipo;

    // Agregar fila y columna para controlar banderas
    celda.dataset.fila = Math.floor(i / ancho);
    celda.dataset.columna = i % ancho;

    celda.addEventListener("click", () => revelarCelda(celda));
    celda.addEventListener("touchstart", (e) => {
    e.preventDefault(); // 👈 evita que se dispare el zoom o scroll accidental
    revelarCelda(celda);
    });
    celda.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      ponerBandera(celda);
    });

    tablero.appendChild(celda);
    celdas.push(celda);
  });
}

function ponerBandera(celda) {
  if (celda.classList.contains("revelada")) return;

  const esBandera = celda.classList.toggle("bandera");
  const key = `${celda.dataset.fila},${celda.dataset.columna}`;

  if (esBandera) {
    // Solo baja minasRestantes si la bandera está en una mina
    if (celda.dataset.tipo === "mina") {
      minasRestantes--;
      banderasCorrectas.add(key);
    }
  } else {
    // Solo sube minasRestantes si quitas la bandera de una mina
    if (celda.dataset.tipo === "mina") {
      minasRestantes++;
      banderasCorrectas.delete(key);
    }
  }

  minasRestantesSpan.textContent = minasRestantes;

  if (banderasCorrectas.size === totalMinas) {
    desbloquearLogro("banderaPro");
  }
}

function revelarCelda(celda) {
  if (celda.classList.contains("revelada") || celda.classList.contains("bandera")) return;

  celda.classList.add("revelada");

  if (!primerClicHecho) {
    primerClicHecho = true;
    desbloquearLogro("primerPaso");
  }

  if (celda.dataset.tipo === "mina") {
    celda.classList.add("bomba");
    desbloquearLogro("explotarMina");
    mostrarPantallaFin();
    mostrarTodasLasMinas();
  } else {
    puntaje++;
    puntajeSpan.textContent = puntaje;
    celda.textContent = "";

    if (puntaje === totalCeldas - totalMinas) {
      const tiempoTardado = (Date.now() - tiempoInicio) / 1000;
      if (tiempoTardado <= 30) desbloquearLogro("velocidadLuz");
      if (banderasCorrectas.size === 0) desbloquearLogro("sinBandera");
      desbloquearLogro("experto");
      mostrarPantallaFin();
    }
  }
}

function mostrarTodasLasMinas() {
  celdas.forEach((celda) => {
    if (celda.dataset.tipo === "mina") {
      celda.classList.add("bomba");
    }
  });
}

function mostrarPantallaFin() {
  document.getElementById("pantalla-fin").classList.remove("oculto");
}

function limpiarTablero() {
  tablero.innerHTML = "";
  celdas = [];
  minasRestantes = totalMinas;
  minasRestantesSpan.textContent = minasRestantes;
  puntaje = 0;
  puntajeSpan.textContent = puntaje;
  primerClicHecho = false;
  banderasCorrectas.clear();
  tiempoInicio = Date.now();
}

// Botones
document.getElementById("btn-reiniciar").addEventListener("click", () => {
  document.getElementById("pantalla-fin").classList.add("oculto");
  limpiarTablero();
  crearTablero();
});

document.getElementById("btn-menu").addEventListener("click", () => {
  window.location.href = "menu.html";
});

// Iniciar juego
crearTablero();
ajustarTamanioCeldas();

function ajustarTamanioCeldas() {
  const celdas = document.querySelectorAll('.celda');
  let tamano = window.innerWidth <= 480 ? 32 : 40;

  celdas.forEach(celda => {
    celda.style.width = `${tamano}px`;
    celda.style.height = `${tamano}px`;
    celda.style.fontSize = window.innerWidth <= 480 ? '1rem' : '1.2rem';
  });
}

//funciones especiales del juego 

const btnPista = document.getElementById('btn-pista');
let pistasDisponibles = 3;

function actualizarTextoPista() {
  btnPista.textContent = `🎯 Pistas: ${pistasDisponibles}`;
  btnPista.disabled = pistasDisponibles <= 0;
  btnPista.style.opacity = pistasDisponibles <= 0 ? '0.5' : '1';
}

function mostrarPista() {
  if (pistasDisponibles <= 0) {
    alert("No te quedan pistas 😢");
    return;
  }

  const seguras = celdas.filter(c => !c.classList.contains('revelada') && c.dataset.tipo !== "mina");

  if (seguras.length > 0) {
    pistasDisponibles--;
    actualizarTextoPista();

    const randomIndex = Math.floor(Math.random() * seguras.length);
    const celdaPista = seguras[randomIndex];
    celdaPista.classList.add('pista');

    const minasCercanas = contarMinasAlrededor(celdaPista);
    celdaPista.textContent = minasCercanas;

    setTimeout(() => {
      celdaPista.classList.remove('pista');
      celdaPista.textContent = '';
    }, 2000);
  }
}

btnPista.addEventListener('click', mostrarPista);

// Lógica para contar minas alrededor de la celda usando data-id
function contarMinasAlrededor(celda) {
  const id = Number(celda.dataset.id);
  const vecinos = [
    id - ancho - 1, id - ancho, id - ancho + 1,
    id - 1,               /*id*/    id + 1,
    id + ancho - 1, id + ancho, id + ancho + 1,
  ];

  let minas = 0;
  vecinos.forEach(i => {
    if (i >= 0 && i < totalCeldas) {
      if (celdas[i].dataset.tipo === 'mina') minas++;
    }
  });

  return minas;
}

// Inicializa texto del botón al cargar
actualizarTextoPista();

let pistasMinasDisponibles = 3;

document.getElementById('btn-pista-minas').addEventListener('click', mostrarPistaMinas);

function mostrarPistaMinas() {
  if (pistasMinasDisponibles <= 0) {
    alert("No te quedan pistas de minas 😢");
    return;
  }

  const minasNoReveladas = celdas.filter(c => c.dataset.tipo === "mina" && !c.classList.contains('revelada'));

  if (minasNoReveladas.length > 0) {
    pistasMinasDisponibles--;

    const randomIndex = Math.floor(Math.random() * minasNoReveladas.length);
    const celdaPista = minasNoReveladas[randomIndex];
    celdaPista.classList.add('pista-mina');

    setTimeout(() => {
      celdaPista.classList.remove('pista-mina');
    }, 2000);

    // Actualizar texto y desactivar si ya no hay pistas
    const btn = document.getElementById('btn-pista-minas');
    btn.textContent = `💣 Pista Mina: ${pistasMinasDisponibles}`;
    
    if (pistasMinasDisponibles <= 0) {
      btn.disabled = true;
    }
  }
}
