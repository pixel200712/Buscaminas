const lista = document.getElementById("lista-logros");

const logros = {
  primerPaso: "🧠 Primer paso: Jugaste tu primera partida",
  explotarMina: "💥 Ups: Pisaste una mina",
  experto: "🏁 Experto: Completaste el tablero sin explotar minas",
  sinErrores: "🎯 Sin errores: No pusiste ni una bandera mal (próximo)",
  
  // NUEVOS LOGROS
  jugadorFiel: "🔁 Jugaste 10 partidas",
  banderaPro: "🚩 Colocaste 10 banderas correctamente",
  sinBandera: "❌ Completaste el juego sin usar banderas",
  velocidadLuz: "⚡ Terminaste el juego en menos de 30 segundos",
  suerteMortal: "🍀 Descubriste 5 casillas seguidas sin fallar"
};

// Obtenemos los logros guardados (desbloqueados)
const logrosGuardados = JSON.parse(localStorage.getItem("logros")) || {};

// Limpiamos la lista para evitar duplicados si se llama más de una vez
lista.innerHTML = "";

for (const id in logros) {
  const li = document.createElement("li");
  li.textContent = logros[id];

  // Si no está desbloqueado, agregar clase "bloqueado" y texto extra
  if (!logrosGuardados[id]) {
    li.classList.add("locked");
    li.textContent += " (Bloqueado)";
  }

  lista.appendChild(li);
}
