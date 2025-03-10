import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

username = sessionStorage.getItem('username') || 'Jugador';
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
  fallos = 0;
  juegoCompletado = false;
  mostrarIncorrecto = false;
  bloqueoVerificacion = false;

  grid: (number | null)[] = Array(9).fill(null);
  piezas: (number | null)[] = Array(9).fill(null);
  piezasDisponibles: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Limpiar localStorage y sessionStorage
    localStorage.removeItem('estadoPuzzle');
    sessionStorage.clear();

    // Reiniciar variables del juego
    this.puzzleActual = 0;
    this.aciertos = 0;
    this.fallos = 0;
    this.juegoCompletado = false;

    this.grid.fill(null);
    this.piezas.fill(null);

    this.username = sessionStorage.getItem('nombreUsuario') || 'Jugador';
    console.log('Valor de sessionStorage al cargar puzzle:', this.username); // Debug

    // Cargar un nuevo puzzle desde cero
    this.cargarPuzzle();
  }




  cargarEstadoDesdeLocalStorage() {
    const estadoGuardado = localStorage.getItem('estadoPuzzle');
    if (estadoGuardado) {
      const estado = JSON.parse(estadoGuardado);
      this.puzzleActual = estado.puzzleActual;
      this.aciertos = estado.aciertos;
      this.fallos = estado.fallos; // Aquí se mantiene si hay estado guardado
      this.piezas = estado.piezas;
      this.piezasDisponibles = estado.piezasDisponibles;
      this.juegoCompletado = estado.juegoCompletado;
    } else {
      this.fallos = 0; // Reinicia a 0 si no hay estado guardado
      this.cargarPuzzle();
    }
  }


  guardarEstadoEnLocalStorage() {
    const estado = {
      puzzleActual: this.puzzleActual,
      aciertos: this.aciertos,
      fallos: this.fallos,
      piezas: this.piezas,
      piezasDisponibles: this.piezasDisponibles,
      juegoCompletado: this.juegoCompletado
    };
    localStorage.setItem('estadoPuzzle', JSON.stringify(estado));
  }

  cargarPuzzle() {
    this.piezas = Array(9).fill(null);
    this.piezasDisponibles = this.desordenarArray(this.generarPiezas());
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

      if (origenIndex === index) {
        return;
      }

      if (this.piezas[index] === null) {
        this.piezas[index] = pieza;
        if (origenIndex !== null) {
          this.piezas[origenIndex] = null;
        } else {
          this.piezasDisponibles = this.piezasDisponibles.filter(p => p !== pieza);
        }
      }

      else {
        const piezaDestino = this.piezas[index];
        this.piezas[index] = pieza;

        if (origenIndex !== null) {
          this.piezas[origenIndex] = piezaDestino;
        } else
        {
          this.piezasDisponibles = this.piezasDisponibles.filter(p => p !== pieza);
          this.piezasDisponibles.push(piezaDestino);
        }
      }
      this.guardarEstadoEnLocalStorage();
      this.cdr.detectChanges();
    }
  }



  getBackgroundPosition(i: number): string {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return `-${col * 100}px -${row * 100}px`;
  }

  verificar() {
    if (this.bloqueoVerificacion) return;
    this.bloqueoVerificacion = true;

    if (this.piezas.includes(null)) {
      this.fallos++;
      setTimeout(() => this.siguientePuzzle(), 2000);
    } else {
      const piezasCorrectas = this.generarPiezas();
      if (JSON.stringify(this.piezas) === JSON.stringify(piezasCorrectas)) {
        this.aciertos++;
        if (this.puzzleActual < this.imagenesPuzzle.length - 1) {
          setTimeout(() => this.siguientePuzzle(), 2000);
        } else {
          this.juegoCompletado = true;
        }
      } else {
        this.fallos++;
        this.mostrarIncorrecto = true;
        setTimeout(() => {
          this.mostrarIncorrecto = false;
          this.siguientePuzzle();
        }, 2000);
      }
    }
    this.guardarEstadoEnLocalStorage();
  }

  siguientePuzzle() {
    if (this.puzzleActual < this.imagenesPuzzle.length - 1) {
      this.puzzleActual++;
      this.grid.fill(null);
      this.piezas.fill(null);
      this.cargarPuzzle();
    } else {
      this.juegoCompletado = true;
    }
    this.bloqueoVerificacion = false;
    this.guardarEstadoEnLocalStorage();
  }


  reiniciar() {
    this.grid.fill(null);
    this.piezas.fill(null);
    this.guardarEstadoEnLocalStorage();

    this.cdr.detectChanges();
  }

  reiniciarJuego() {
    this.puzzleActual = 0;
    this.aciertos = 0;
    this.fallos = 0;
    this.juegoCompletado = false;
    this.grid.fill(null);
    this.piezas.fill(null);
    this.cargarPuzzle();
    this.guardarEstadoEnLocalStorage();
    this.cdr.detectChanges();
  }
}
