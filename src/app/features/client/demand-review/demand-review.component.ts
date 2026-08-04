import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { RatingComponent } from '../../../shared/ui/display/rating/rating.component';
import { TextareaComponent } from '../../../shared/ui/forms/textarea/textarea.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { IconButtonComponent } from '../../../shared/ui/actions/icon-button/icon-button.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';

import { DemandService } from '../services/demand.service';
import { ReviewDto } from '../models/demand.dto';

@Component({
  selector: 'app-demand-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RatingComponent,
    TextareaComponent,
    ButtonComponent,
    IconButtonComponent,
    AvatarComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <header class="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <app-icon-button ariaLabel="Go back" variant="ghost" (click)="goBack()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </app-icon-button>
        <h1 class="font-bold text-lg">Rate Your Washer</h1>
      </header>

      <main class="flex-1 p-4 space-y-8">
        <!-- Washer Preview -->
        @if (demandQuery.data()?.washer) {
          <div class="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center gap-3">
            <app-avatar 
              [src]="demandQuery.data()!.washer!.avatarUrl ?? null"
              [name]="demandQuery.data()!.washer!.name"
              size="xl">
            </app-avatar>
            <div>
              <p class="font-bold text-lg text-gray-900">{{ demandQuery.data()!.washer!.name }}</p>
              <p class="text-sm text-gray-500">How did they do?</p>
            </div>
          </div>
        }

        <!-- Star Rating -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border text-center">
          <p class="text-gray-600 mb-6">Tap a star to rate</p>
          <div class="flex justify-center">
            <app-rating 
              [(value)]="ratingValue" 
              size="lg"
              class="scale-125">
            </app-rating>
          </div>
          <p class="mt-4 font-semibold text-lg text-gray-900 h-7 transition-all">{{ ratingLabel() }}</p>
        </div>

        <!-- Comment -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border">
          <app-textarea 
            label="Leave a comment (optional)"
            helperText="Your feedback helps the community."
            [value]="comment()"
            (valueChange)="comment.set($event)">
          </app-textarea>
        </div>
      </main>

      <footer class="bg-white border-t p-4 pb-8">
        <app-button 
          variant="primary" 
          class="w-full"
          [disabled]="ratingValue() === 0"
          [isLoading]="reviewMutation.isPending()"
          (click)="submit()">
          Submit Review
        </app-button>
        <button 
          class="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
          (click)="goBack()">
          Skip for now
        </button>
      </footer>
    </div>
  `
})
export class DemandReviewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private demandService = inject(DemandService);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);

  demandId = signal('');
  ratingValue = signal(0);
  comment = signal('');

  demandQuery = injectQuery(() => ({
    queryKey: ['demand', this.demandId()],
    queryFn: () => this.demandService.getDemandById(this.demandId()),
    enabled: !!this.demandId()
  }));

  reviewMutation = injectMutation(() => ({
    mutationFn: (review: ReviewDto) => this.demandService.submitReview(review),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['demands', 'my'] });
      this.toast.show('success', 'Thank you! Your review has been submitted.');
      this.router.navigate(['/client']);
    },
    onError: () => this.toast.show('error', 'Failed to submit review. Try again.')
  }));

  ngOnInit() {
    this.demandId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  ratingLabel() {
    const labels: Record<number, string> = {
      0: '',
      1: 'Very Disappointing',
      2: 'Below Expectations',
      3: 'Average',
      4: 'Very Good',
      5: 'Excellent!'
    };
    return labels[this.ratingValue()] ?? '';
  }

  submit() {
    if (this.ratingValue() === 0) return;
    this.reviewMutation.mutate({
      demandId: this.demandId(),
      rating: this.ratingValue(),
      comment: this.comment() || undefined
    });
  }

  goBack() {
    this.router.navigate(['/client']);
  }
}
