import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Espace Admin</h1>
      <p>Bienvenue dans l'espace d'administration. Vous pouvez ici gérer les utilisateurs et litiges.</p>
    </div>
  `
})
export default class AdminComponent {}
