import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  nombreUsuario = '';
  mostrarError = false;

  constructor(private router: Router) {}

  iniciarJuego() {
    if (this.nombreUsuario.trim()) {
      sessionStorage.setItem('nombreUsuario', this.nombreUsuario);
      console.log('Guardado en sessionStorage:', sessionStorage.getItem('nombreUsuario')); // Debug
      this.router.navigate(['/puzzle']);
    } else {
      this.mostrarError = true;
    }
  }

}
