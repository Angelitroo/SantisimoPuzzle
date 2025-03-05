import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <h2>¡Bienvenido al Puzzle SAFA!</h2>
      <input type="text" [(ngModel)]="username" placeholder="Escribe tu nombre" class="username-input"/>
      <button (click)="startGame()" class="start-button">Iniciar</button>
      <p *ngIf="mostrarError" class="error-message">Por favor, ingrese un nombre de usuario.</p>
    </div>
  `,
  imports: [
    FormsModule,
    CommonModule
  ],
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 20px;
      background-color: #e0f7fa;
    }

    h2 {
      color: #00796b;
      font-size: 2rem;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    }

    .username-input {
      padding: 10px;
      font-size: 1rem;
      border: 2px solid #00796b;
      border-radius: 5px;
      width: 80%;
      max-width: 300px;
    }

    .start-button {
      background-color: #00796b;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      width: 80%;
      max-width: 300px;
      font-size: 1rem;
    }

    .start-button:hover {
      background-color: #004d40;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.9rem;
      margin-top: 10px;
    }
  `]
})
export class LoginComponent {
  username = '';
  mostrarError = false;

  constructor(private router: Router) {}

  startGame() {
    if (this.username.trim()) {
      localStorage.setItem('username', this.username);
      this.router.navigate(['/puzzle']);
    } else {
      this.mostrarError = true;
    }
  }
}
