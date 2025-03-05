import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <h2>Puzzle de <span class="username">{{ username }}</span></h2>
      <div *ngIf="juegoCompletado; else juegoEnCurso">
        <h3>¡Juego completado!</h3>
        <p>Total de aciertos: {{ aciertos }} de 10</p>
        <button (click)="reiniciarJuego()" class="action-button">Jugar de nuevo</button>
      </div>
      <ng-template #juegoEnCurso>
        <div class="puzzle-container">
          <div class="grid">
            <div *ngFor="let celda of grid; let i = index"
                 class="cell"
                 (drop)="soltarPieza($event, i)"
                 (dragover)="permitirSoltar($event)">
              <div *ngIf="piezas[i] !== null"
                   [ngStyle]="{'background-position': getBackgroundPosition(piezas[i]!)}"
                   class="puzzle-piece"
                   [style.background-image]="'url(' + imagenesPuzzle[puzzleActual] + ')'"
                   [style.background-size]="'300px 300px'"
                   draggable="true"
                   (dragstart)="arrastrarPieza($event, piezas[i]!, i)">
              </div>
            </div>
          </div>
          <div class="reference">
            <img [src]="imagenesPuzzle[puzzleActual]" class="reference-image"/>
          </div>
        </div>
        <div class="pieces-container">
          <div *ngFor="let pieza of piezasDisponibles; let i = index"
               class="puzzle-piece-container"
               draggable="true"
               (dragstart)="arrastrarPieza($event, pieza, null)">
            <div [ngStyle]="{'background-position': getBackgroundPosition(pieza)}"
                 class="puzzle-piece"
                 [style.background-image]="'url(' + imagenesPuzzle[puzzleActual] + ')'"
                 [style.background-size]="'300px 300px'">
            </div>
          </div>
        </div>
        <div class="actions">
          <button (click)="verificar()" class="action-button">Verificar</button>
          <button (click)="reiniciar()" class="action-button">Reiniciar este puzzle</button>
        </div>
        <p class="aciertos">Aciertos: {{ aciertos }}</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .game-container {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      min-height: 100vh;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    h2 {
      color: #ffffff;
      font-size: 2.5rem;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      margin-bottom: 20px;
    }

    .puzzle-container {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 100px);
      gap: 10px;
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .cell {
      width: 100px;
      height: 100px;
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .cell:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .reference-image {
      width: 300px;
      height: 300px;
      border: 4px solid #ffffff;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .pieces-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      gap: 10px;
      flex-wrap: wrap;
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .puzzle-piece {
      width: 100px;
      height: 100px;
      background-size: 300px 300px;
      border: 2px solid #ffffff;
      border-radius: 10px;
      transition: transform 0.2s ease;
    }

    .puzzle-piece:hover {
      transform: scale(1.1);
    }

    .puzzle-piece-container {
      width: 100px;
      height: 100px;
      cursor: pointer;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    .action-button {
      background-color: #ffffff;
      color: #1e3c72;
      padding: 12px 24px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .action-button:hover {
      background-color: #ffffff;
      transform: scale(1.05);
    }

    .aciertos {
      font-size: 1.5rem;
      color: #7aff6b;
      margin-top: 20px;
    }

    h3 {
      color: #ffffff;
      font-size: 2rem;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.2rem;
      color: white;
    }
  `]
})
export class PuzzleComponent implements OnInit {
  username = localStorage.getItem('username') || 'Jugador';
  imagenesPuzzle = [
    'assets/imagenes/captura1.png',
    'assets/imagenes/captura2.png',
    'assets/imagenes/captura3.png',
    'assets/imagenes/captura4.png',
    'assets/imagenes/captura5.png',
    'assets/imagenes/captura6.png',
    'assets/imagenes/captura7.png',
    'assets/imagenes/captura8.png',
    'assets/imagenes/captura9.png',
    'assets/imagenes/captura10.png'
  ];
  puzzleActual = 0;
  aciertos = 0;
  juegoCompletado = false;

  grid: (number | null)[] = Array(9).fill(null);
  piezas: (number | null)[] = Array(9).fill(null);
  piezasDisponibles: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarEstadoDesdeLocalStorage();
  }

  cargarEstadoDesdeLocalStorage() {
    const estadoGuardado = localStorage.getItem('estadoPuzzle');
    if (estadoGuardado) {
      const estado = JSON.parse(estadoGuardado);
      this.puzzleActual = estado.puzzleActual;
      this.aciertos = estado.aciertos;
      this.piezas = estado.piezas;
      this.piezasDisponibles = estado.piezasDisponibles;
      this.juegoCompletado = estado.juegoCompletado;
    } else {
      this.cargarPuzzle();
    }
  }

  guardarEstadoEnLocalStorage() {
    const estado = {
      puzzleActual: this.puzzleActual,
      aciertos: this.aciertos,
      piezas: this.piezas,
      piezasDisponibles: this.piezasDisponibles,
      juegoCompletado: this.juegoCompletado
    };
    localStorage.setItem('estadoPuzzle', JSON.stringify(estado));
  }

  cargarPuzzle() {
    this.piezasDisponibles = this.generarPiezas();
    this.piezasDisponibles = this.desordenarArray(this.piezasDisponibles);
    this.guardarEstadoEnLocalStorage();
  }

  generarPiezas(): number[] {
    let piezas: number[] = [];
    for (let i = 0; i < 9; i++) {
      piezas.push(i);
    }
    return piezas;
  }

  desordenarArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  permitirSoltar(event: DragEvent) {
    event.preventDefault();
  }

  arrastrarPieza(event: DragEvent, pieza: number, index: number | null) {
    event.dataTransfer?.setData('text', JSON.stringify({ pieza, index }));
  }

  soltarPieza(event: DragEvent, index: number) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text');
    if (data) {
      const { pieza, origenIndex } = JSON.parse(data);

      // Si la pieza viene de otra celda del grid, vaciamos la celda de origen
      if (origenIndex !== null) {
        this.piezas[origenIndex] = null;
      } else {
        // Si la pieza viene de la lista de piezas disponibles, la eliminamos de allí
        this.piezasDisponibles = this.piezasDisponibles.filter(p => p !== pieza);
      }

      // Si la celda de destino ya tiene una pieza, la movemos a la lista de piezas disponibles
      if (this.piezas[index] !== null && this.piezas[index] !== pieza) {
        this.piezasDisponibles.push(this.piezas[index]!);
      }

      // Colocamos la pieza en la celda de destino
      this.piezas[index] = pieza;

      // Guardar el estado en localStorage
      this.guardarEstadoEnLocalStorage();

      // Forzar la detección de cambios
      this.cdr.detectChanges();
    }
  }

  getBackgroundPosition(i: number): string {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return `-${col * 100}px -${row * 100}px`;  // Divide la imagen en 9 fragmentos
  }

  verificar() {
    const piezasCorrectas = this.generarPiezas(); // Array ordenado de piezas correctas
    if (JSON.stringify(this.piezas) === JSON.stringify(piezasCorrectas)) {
      this.aciertos++;
      if (this.puzzleActual < this.imagenesPuzzle.length - 1) {
        this.siguientePuzzle();
      } else {
        this.juegoCompletado = true;
      }
      this.guardarEstadoEnLocalStorage();
    }
  }

  siguientePuzzle() {
    this.puzzleActual++;
    this.grid.fill(null);
    this.piezas.fill(null);
    this.cargarPuzzle();
    this.guardarEstadoEnLocalStorage();
  }

  reiniciar() {
    // Reiniciar solo el grid (panel 3x3)
    this.grid.fill(null);
    this.piezas.fill(null);
    this.guardarEstadoEnLocalStorage();

    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  reiniciarJuego() {
    this.puzzleActual = 0;
    this.aciertos = 0;
    this.juegoCompletado = false;
    this.grid.fill(null);
    this.piezas.fill(null);
    this.cargarPuzzle();
    this.guardarEstadoEnLocalStorage();
    this.cdr.detectChanges();
  }
}
