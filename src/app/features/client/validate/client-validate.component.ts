import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DemandService } from '../services/demand.service';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { RatingComponent } from '../../../shared/ui/display/rating/rating.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';

@Component({
  selector: 'app-client-validate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, RatingComponent, AvatarComponent],
  template: `
    <div class="max-w-3xl mx-auto space-y-8 p-4 pt-6 pb-24">
      <!-- Header with Back Button -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <a routerLink="/client/history" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-accent-700 transition-colors duration-200 mb-2">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Zurück zur Historie
          </a>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Wäsche abschließen</h1>
          <p class="text-gray-500 text-sm mt-1">Überprüfen Sie das Ergebnis und bewerten Sie den Service.</p>
        </div>
      </header>

      @if (demandQuery.isPending()) {
        <div class="animate-pulse space-y-8">
          <div class="h-64 bg-accent-50 rounded-3xl w-full"></div>
          <div class="h-32 bg-accent-50 rounded-3xl w-full"></div>
        </div>
      } @else if (demand()) {
        
        <!-- Results Gallery -->
        <section class="bg-white rounded-3xl shadow-soft-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Ergebnis der Wäsche</h2>
            <!-- Mock Before / After Gallery -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1550529815-46eb132223a5?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale opacity-80" alt="Vorher">
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white font-bold tracking-wider uppercase text-sm">Vorher</span>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Nachher">
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white font-bold tracking-wider uppercase text-sm">Nachher</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-surface-2 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Gewaschenes Fahrzeug</p>
              <p class="font-bold text-gray-900 uppercase">{{ demand()!.vehicleType }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500 mb-1">Betrag</p>
              <p class="font-bold text-xl text-gray-900">35.00 €</p>
            </div>
          </div>
        </section>

        <!-- Rating & Review -->
        <section class="bg-white rounded-3xl shadow-soft-md p-8 md:p-10 text-center max-w-xl mx-auto mt-8">
          
          <div class="flex flex-col items-center mb-6">
            <app-avatar [src]="demand()!.washer?.avatarUrl || 'https://i.pravatar.cc/150?img=11'" [name]="demand()!.washer?.name || 'Washer'" size="xl" class="mb-4 ring-4 ring-gray-50"></app-avatar>
            <h3 class="text-lg font-bold text-gray-900">Wie war der Service von {{ demand()!.washer?.name || 'Ihrem Wäscher' }}?</h3>
            <p class="text-gray-500 text-sm mt-1">Ihre Bewertung hilft uns, die Qualität hoch zu halten.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submitReview()" class="space-y-6">
            
            <div class="flex justify-center">
              <app-rating size="lg" (valueChange)="setRating($event)"></app-rating>
            </div>
            
            <input type="hidden" formControlName="rating">
            <div *ngIf="form.get('rating')?.touched && form.get('rating')?.invalid" class="text-red-500 text-sm mt-2">
              Bitte vergeben Sie eine Sternebewertung.
            </div>

            <div>
              <textarea 
                formControlName="comment" 
                rows="4" 
                class="w-full p-4 bg-accent-50/30 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-[border-color,box-shadow,background-color] duration-200 outline-none resize-none"
                placeholder="Haben Sie noch Feedback? (Optional)"
              ></textarea>
            </div>

            <div class="pt-2">
              <app-button 
                type="submit" 
                variant="primary" 
                size="lg" 
                class="w-full"
                [disabled]="form.invalid"
                [isLoading]="rateMutation.isPending()">
                Bewertung senden & Abschließen
              </app-button>
            </div>
          </form>

        </section>

      }
    </div>
  `
})
export class ClientValidateComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private demandService = inject(DemandService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);

  demandId = this.route.snapshot.paramMap.get('id')!;

  demandQuery = injectQuery(() => ({
    queryKey: ['demand', this.demandId],
    queryFn: () => this.demandService.getDemandById(this.demandId)
  }));

  demand = computed(() => this.demandQuery.data());

  form = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['']
  });

  rateMutation = injectMutation(() => ({
    mutationFn: (data: { rating: number; comment?: string }) => 
      this.demandService.submitReview({ demandId: this.demandId, rating: data.rating, comment: data.comment }),
    onSuccess: () => {
      this.toast.show('success', 'Vielen Dank für Ihre Bewertung!');
      this.queryClient.invalidateQueries({ queryKey: ['demands'] });
      this.router.navigate(['/client/history']);
    },
    onError: () => {
      this.toast.show('error', 'Fehler beim Senden der Bewertung.');
    }
  }));

  setRating(val: number) {
    this.form.patchValue({ rating: val });
    this.form.get('rating')?.markAsTouched();
  }

  submitReview() {
    if (this.form.valid) {
      this.rateMutation.mutate({
        rating: this.form.value.rating!,
        comment: this.form.value.comment || undefined
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
