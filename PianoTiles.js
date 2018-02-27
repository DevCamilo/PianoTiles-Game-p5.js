/** Dimensiones de las Teclas **/
const WIDTH = 100;
const HEIGHT = 150;

const WINNING_SCORE = 30;

var time; // Cuenta Regresiva
var score; // Numero de teclas clickeadas correctamente

var playing; // Determina el Estado
var won; // Determina si se alcanzó el WINNING_SCORE o no

/*
 *  -1 = red
 *   0 = black
 *   1 = white
 */
var tiles = []; //  Campos Oprimidos

function setup() {
  createCanvas(401, 601); // Mantiene los bordes (1 pixel padding)

  time = -3; // Cuenta regresiva que inicia en tres
  score = 0;

	/* Inicializando primeras filas */
  for (var i = 0; i < 4; i++) {

		newRow();
	}

  playing = false;
  won = false;

  textAlign(CENTER);
}

function draw() {
  background(51);

  drawTiles();

  handleState();
}

/**
 * Dibuja todas la teclas
 */
function drawTiles() {

	for (var i = 0; i < tiles.length; i++) {

    var x = (i % 4) * WIDTH;
    var y = (Math.floor(i / 4) * HEIGHT);

    /*
     *  -1 = red
     *   0 = black
     *   1 = white
     */
    fill((tiles[i] !== 0) ? ((tiles[i] === 1) ? "#FFFFFF" : "#FF0000") : "#000000");
    rect(x, y, WIDTH, HEIGHT);
  }
}

/**
 * Dibuja las teclas correctas dependiendo del estado del juego
 */
function handleState() {

  if (!playing) { // Si no se está jugando

    if (time > 0) { // Si no se está en la cuenta regresiva
      /* Fin del Juego */

      drawEnd(won);
    } else { // pre-juego

      /* Dibuja la cuenta regresiva */
      textSize(60);
      fill("#FF0000");
      text(-time, width / 2, height / 2);

			/* Cuenta Regresiva */
      if (frameCount % 60 === 0) {

        time++;
        if (time === 0) {
          playing = true;
        }
      }
    }
  } else { // Sigue Jugando

    /* Dibuja el tiempo */
    textSize(90);
    fill("#FFFF00");
    text(getTime(), width / 2, HEIGHT);
    time++;
  }
}

/**
 * basado en won, esto dibujará un mensaje "Complete" o un mensaje de "Game Over"
 **/
function drawEnd(won) {

	if (won) {

		background("#66EE66");

		fill("#FFFFFF");
		textSize(60);
		text("Complete!", width / 2, height / 2 - 80);

		fill("#000000");
		textSize(70);
		text(getTime(), width / 2, height / 2);

		fill("#808080");
		textSize(40);
		text("Press f5 to restart!", width / 2, height / 2 + 50);

	} else {

		fill("#808080");
		textSize(60);
		text("Game Over!", width / 2, height / 2);
		textSize(40);
		text("Press f5 to restart!", width / 2, height / 2 + 50);
	}
}

/**
 * Manejo de los input del usuario
 **/
function mousePressed() {

  if (!playing) // No permite la entrada si el jugador no está jugando
    return;

  if (mouseY >= 3 * HEIGHT && mouseY <= 4 * HEIGHT) {
		// comprueba si el clic está dentro de los límites del lienzo

    var tile = getClickedTile(mouseX, mouseY);

    if (tile == -1) // Hicieron clic fuera de los limites
      return;

    if (tiles[tile] !== 0) {
      /* Fin del Juego */

      tiles[tile] = -1;

      won = false;
      playing = false;
    } else {
      score++;
      newRow();

      if (score >= WINNING_SCORE) {
        /* Fin del Juego */

        won = true;
        playing = false;
      }
    }
  }

}

/**
 * Devuelve el indice de la tecla oprimida
 * Solo devuelve la fichas de la fila anterior
 **/
function getClickedTile(mX) {

  for (var i = 0; i < 4; i++) {

		var lowerBound = i * WIDTH;
		var upperBound = (i + 1) * WIDTH;
    if (mX >= lowerBound && mX <= upperBound) {
      return i + 12; // Solo regresa para la fila inferior, que es de 3 filas de 4 de profundidad en la matriz
    }
  }

  return -1; // El clic estaba fuera de los limites
}

/**
 * Empuja una nueva fila
 **/
function newRow() {

  var column = Math.floor(random(4));

  for (var i = 0; i < 4; i++) {

		tiles.unshift((column === i) ? 0 : 1); // Empuja las teclas al frende de, A.K.A. arriba
	}

}

/**
 * Regresa esta formato del tiempo, e.g.: "12.345\""
 **/
function getTime() {

  return Math.floor(time / 60) + "." + Math.floor(map(time % 60, 0, 59, 0, 999)) + "\"";
}
