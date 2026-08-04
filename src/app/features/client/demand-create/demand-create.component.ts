import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';

import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { IconButtonComponent } from '../../../shared/ui/actions/icon-button/icon-button.component';
import { SelectComponent } from '../../../shared/ui/forms/select/select.component';
import { TextareaComponent } from '../../../shared/ui/forms/textarea/textarea.component';
import { FileUploaderComponent } from '../../../shared/ui/forms/file-uploader/file-uploader.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';

import { DemandService } from '../services/demand.service';
import { CreateDemandDto } from '../models/demand.dto';

@Component({
  selector: 'app-demand-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    IconButtonComponent,
    SelectComponent,
    TextareaComponent,
    FileUploaderComponent
  ],
  template: `
    <div class="min-h-screen bg-page flex flex-col pb-safe">
      <!-- Header with Progress -->
      <header class="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm md:shadow-none border-b border-gray-100">
        <app-icon-button ariaLabel="Go back" variant="ghost" (click)="goBack()">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </app-icon-button>
        <div class="flex-1">
          <h1 class="font-bold text-xl text-gray-900">Neue Wäsche</h1>
          <!-- Progress bar (Mobile only) -->
          <div class="w-full bg-gray-100 h-1.5 rounded-full mt-2 md:hidden overflow-hidden">
            <div class="bg-accent-500 h-1.5 rounded-full transition-all duration-500 ease-out" [style.width]="(currentStep() / 4) * 100 + '%'"></div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8 overflow-y-auto max-w-3xl mx-auto w-full">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8 pb-20">
          
          <!-- STEP 1: Vehicle Details -->
          <div [ngClass]="currentStep() !== 1 ? 'hidden md:block' : 'block animate-fade-up'" class="space-y-8 fade-in">
            <div class="md:bg-white md:p-8 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-accent-100 text-accent-700 text-sm font-bold md:hidden">1</span>
                Fahrzeug & Wäsche
              </h2>
              
              <!-- Vehicle Type -->
              <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-700 mb-3">Fahrzeugtyp</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  @for (opt of vehicleOptions; track opt.value) {
                    <div 
                      (click)="updateControl('vehicleType', opt.value)"
                      class="cursor-pointer border-2 rounded-2xl p-4 text-center transition-all duration-200"
                      [ngClass]="form.get('vehicleType')?.value === opt.value ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300 text-gray-600'">
                      <svg class="w-8 h-8 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                      <span class="text-sm font-medium">{{ opt.label }}</span>
                    </div>
                  }
                </div>
              </div>
              
              <!-- Wash Type -->
              <div class="mb-8">
                <label class="block text-sm font-semibold text-gray-700 mb-3">Art der Wäsche</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  @for (opt of washOptions; track opt.value) {
                    <div 
                      (click)="updateControl('washType', opt.value)"
                      class="cursor-pointer border-2 rounded-2xl p-4 transition-all duration-200"
                      [ngClass]="form.get('washType')?.value === opt.value ? 'border-accent-500 bg-accent-50 text-accent-800 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'">
                      <div class="font-bold mb-1">{{ opt.label }}</div>
                      <div class="text-xs opacity-75">Perfekt für den {{ opt.label.toLowerCase() }}en Bereich.</div>
                    </div>
                  }
                </div>
              </div>

              <!-- Dirt Level -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Verschmutzungsgrad</label>
                <div class="flex bg-gray-100 p-1 rounded-2xl">
                  @for (opt of dirtOptions; track opt.value) {
                    <button 
                      type="button"
                      (click)="updateControl('dirtLevel', opt.value)"
                      class="flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                      [ngClass]="form.get('dirtLevel')?.value === opt.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                      {{ opt.label }}
                    </button>
                  }
                </div>
              </div>

            </div>
          </div>

          <!-- STEP 2: Location -->
          <div [ngClass]="currentStep() !== 2 ? 'hidden md:block' : 'block animate-fade-up'" class="space-y-6 fade-in">
            <div class="md:bg-white md:p-8 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-accent-100 text-accent-700 text-sm font-bold md:hidden">2</span>
                Standort
              </h2>
              
              <div class="bg-accent-50 border border-accent-100 p-4 rounded-2xl mb-6 flex gap-3 text-accent-700">
                <svg class="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-sm leading-relaxed">Für diesen Prototypen nutzen wir einen fiktiven Standort in Berlin. In der echten App würde hier eine interaktive Karte erscheinen.</p>
              </div>
              
              <!-- Abstract Map Placeholder -->
              <div class="w-full h-56 bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden mb-6 group cursor-pointer shadow-soft-sm" (click)="setLocation()">
                <div class="absolute inset-0 pattern-dots text-gray-300 opacity-50"></div>
                <div class="relative z-10 flex flex-col items-center">
                  <div class="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  </div>
                  <span class="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm text-gray-800 border border-gray-100">Alexanderplatz, Berlin</span>
                </div>
              </div>
              
              <app-button type="button" variant="secondary" class="w-full" (click)="setLocation()">Standort verwenden</app-button>
            </div>
          </div>

          <!-- STEP 3: Photos & Notes -->
          <div [ngClass]="currentStep() !== 3 ? 'hidden md:block' : 'block animate-fade-up'" class="space-y-6 fade-in">
            <div class="md:bg-white md:p-8 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-accent-100 text-accent-700 text-sm font-bold md:hidden">3</span>
                Details & Fotos
              </h2>
              
              <div class="mb-8">
                <app-file-uploader 
                  label="Fahrzeug Fotos (Optional)" 
                  (fileSelected)="onFileSelected($event)">
                </app-file-uploader>
              </div>
              
              <app-textarea 
                label="Notizen für den Wäscher" 
                helperText="Z.B. Zugangscode für das Parkhaus"
                [value]="form.get('notes')?.value"
                (valueChange)="updateControl('notes', $event)">
              </app-textarea>
            </div>
          </div>

          <!-- STEP 4: Review (Mobile only view, hidden on desktop since the user can see everything) -->
          <div [ngClass]="currentStep() !== 4 ? 'hidden' : 'block animate-fade-up'" class="space-y-6 fade-in md:hidden">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-accent-100 text-accent-700 text-sm font-bold md:hidden">4</span>
              Zusammenfassung
            </h2>
            
            <div class="bg-white rounded-3xl p-6 shadow-soft-sm space-y-4 text-sm">
              <div class="flex justify-between items-center border-b border-gray-50 pb-4">
                <span class="text-gray-500">Fahrzeug</span>
                <span class="font-bold text-gray-900 uppercase bg-gray-100 px-3 py-1 rounded-lg">{{ form.value.vehicleType }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-50 pb-4">
                <span class="text-gray-500">Wäsche</span>
                <span class="font-bold text-gray-900 uppercase bg-gray-100 px-3 py-1 rounded-lg">{{ form.value.washType }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-50 pb-4">
                <span class="text-gray-500">Standort</span>
                <span class="font-bold text-gray-900 truncate max-w-[150px] text-right">{{ form.value.location?.address || 'Alexanderplatz' }}</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-gray-900 font-bold text-lg">Total</span>
                <span class="font-bold text-accent-600 text-xl">35.00 €</span>
              </div>
            </div>
          </div>
          
          <!-- Desktop Submit Button (Hidden on Mobile) -->
          <div class="hidden md:flex justify-end mt-12">
            <app-button 
              type="submit"
              variant="primary" 
              size="lg"
              class="w-full md:w-auto md:min-w-[240px]"
              [disabled]="form.invalid"
              [isLoading]="createMutation.isPending()">
              Kostenpflichtig buchen
            </app-button>
          </div>

        </form>
      </main>

      <!-- Footer Actions (Mobile Only) -->
      <footer class="md:hidden bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 pb-safe flex gap-3 fixed bottom-0 left-0 right-0 z-30 shadow-[0_-4px_20px_rgba(15,45,88,0.06)]">
        <app-button 
          *ngIf="currentStep() > 1" 
          type="button"
          variant="secondary" 
          class="flex-1"
          (click)="previousStep()"
          [disabled]="createMutation.isPending()">
          Zurück
        </app-button>
        
        <app-button 
          *ngIf="currentStep() < 4" 
          type="button"
          variant="primary" 
          class="flex-[2]"
          (click)="nextStep()">
          Weiter
        </app-button>
        
        <app-button 
          *ngIf="currentStep() === 4" 
          type="button"
          variant="primary" 
          class="flex-[2]"
          (click)="onSubmit()"
          [disabled]="form.invalid"
          [isLoading]="createMutation.isPending()">
          Buchen
        </app-button>
      </footer>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(10px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    
    /* Abstract dots pattern for map */
    .pattern-dots {
      background-image: radial-gradient(currentColor 1px, transparent 1px);
      background-size: 16px 16px;
    }
  `]
})
export class DemandCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private demandService = inject(DemandService);
  private toast = inject(ToastService);

  currentStep = signal(1);

  // Form setup
  form: FormGroup = this.fb.group({
    vehicleType: ['sedan', Validators.required],
    washType: ['exterior', Validators.required],
    dirtLevel: ['medium', Validators.required],
    location: this.fb.group({
      lat: [null, Validators.required],
      lng: [null, Validators.required],
      address: ['']
    }),
    availability: ['asap', Validators.required],
    notes: [''],
    photoUrls: [[]]
  });

  // Options
  vehicleOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' }
  ];

  washOptions = [
    { value: 'exterior', label: 'Exterior Only' },
    { value: 'interior', label: 'Interior Only' },
    { value: 'full', label: 'Full Wash' }
  ];

  dirtOptions = [
    { value: 'light', label: 'Light Dirt' },
    { value: 'medium', label: 'Medium Dirt' },
    { value: 'heavy', label: 'Heavy Dirt' }
  ];

  // TanStack Mutation
  createMutation = injectMutation(() => ({
    mutationFn: (dto: CreateDemandDto) => this.demandService.createDemand(dto),
    onSuccess: (data) => {
      this.toast.show('success', 'Request published successfully!');
      this.router.navigate(['/client/tracking', data.id]);
    },
    onError: () => {
      this.toast.show('error', 'Failed to publish request. Try again.');
    }
  }));

  updateControl(name: string, value: any) {
    this.form.get(name)?.setValue(value);
  }

  setLocation() {
    this.form.get('location')?.patchValue({ lat: 52.5200, lng: 13.4050, address: 'Alexanderplatz' });
    this.toast.show('success', 'Location acquired');
  }

  onFileSelected(file: File | null) {
    if (file) {
      // Fake upload
      this.toast.show('info', 'Uploading photo...');
      setTimeout(() => {
        const current = this.form.get('photoUrls')?.value || [];
        this.form.get('photoUrls')?.setValue([...current, 'fake-url']);
        this.toast.show('success', 'Photo attached');
      }, 500);
    }
  }

  nextStep() {
    // Quick validation before advancing
    if (this.currentStep() === 2 && !this.form.get('location.lat')?.value) {
      // Auto-set location if they skipped it for the prototype
      this.setLocation();
    }
    this.currentStep.update(s => Math.min(s + 1, 4));
  }

  previousStep() {
    this.currentStep.update(s => Math.max(s - 1, 1));
  }

  goBack() {
    if (this.currentStep() > 1) {
      this.previousStep();
    } else {
      this.router.navigate(['/client']);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toast.show('error', 'Please complete all required fields.');
      return;
    }
    this.createMutation.mutate(this.form.value as CreateDemandDto);
  }
}
