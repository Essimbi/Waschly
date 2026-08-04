import { Component } from '@angular/core';

@Component({
  selector: 'app-washer',
  standalone: true,
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Espace Laveur</h1>
      <p>Bienvenue dans votre espace laveur. Vous pouvez ici accepter des missions.</p>
    </div>
  `
})
export default class WasherComponent {}
