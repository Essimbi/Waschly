import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonComponent } from '../../shared/ui/actions/button/button.component';
import { IconButtonComponent } from '../../shared/ui/actions/icon-button/icon-button.component';
import { FabComponent } from '../../shared/ui/actions/fab/fab.component';
import { InputComponent } from '../../shared/ui/forms/input/input.component';
import { SelectComponent } from '../../shared/ui/forms/select/select.component';
import { TextareaComponent } from '../../shared/ui/forms/textarea/textarea.component';
import { ToggleComponent } from '../../shared/ui/forms/toggle/toggle.component';
import { FileUploaderComponent } from '../../shared/ui/forms/file-uploader/file-uploader.component';
import { CardComponent } from '../../shared/ui/display/card/card.component';
import { AvatarComponent } from '../../shared/ui/display/avatar/avatar.component';
import { BadgeComponent } from '../../shared/ui/display/badge/badge.component';
import { StatusPillComponent } from '../../shared/ui/display/status-pill/status-pill.component';
import { RatingComponent } from '../../shared/ui/display/rating/rating.component';
import { EmptyStateComponent } from '../../shared/ui/feedback/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/ui/feedback/skeleton/skeleton.component';
import { SpinnerComponent } from '../../shared/ui/feedback/spinner/spinner.component';
import { ModalComponent } from '../../shared/ui/layout/modal/modal.component';
import { TabsComponent } from '../../shared/ui/layout/tabs/tabs.component';
import { ShellComponent } from '../../shared/ui/layout/shell/shell.component';
import { ToastService } from '../../shared/ui/feedback/toast/toast.service';
import { ToastComponent } from '../../shared/ui/feedback/toast/toast.component';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent, IconButtonComponent, FabComponent,
    InputComponent, SelectComponent, TextareaComponent, ToggleComponent, FileUploaderComponent,
    CardComponent, AvatarComponent, BadgeComponent, StatusPillComponent, RatingComponent,
    EmptyStateComponent, SkeletonComponent, SpinnerComponent,
    ModalComponent, TabsComponent, ShellComponent, ToastComponent
  ],
  template: `
    <!-- Include ToastContainer here just for the demo page -->
    <app-toast></app-toast>

    <app-shell [items]="navItems" *ngIf="!isPreview()">
      <div class="h-full flex flex-col bg-gray-100 overflow-hidden">
        <header class="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
          <h1 class="text-xl font-bold">Responsive Preview</h1>
          <div class="flex bg-gray-100 p-1 rounded-lg">
            <button class="px-4 py-2 text-sm rounded-md transition-colors" 
                    [ngClass]="previewWidth() === '375px' ? 'bg-white shadow text-accent-700' : 'text-gray-600 hover:text-gray-900'"
                    (click)="setPreviewWidth('375px')">Mobile (375px)</button>
            <button class="px-4 py-2 text-sm rounded-md transition-colors" 
                    [ngClass]="previewWidth() === '768px' ? 'bg-white shadow text-accent-700' : 'text-gray-600 hover:text-gray-900'"
                    (click)="setPreviewWidth('768px')">Tablet (768px)</button>
            <button class="px-4 py-2 text-sm rounded-md transition-colors" 
                    [ngClass]="previewWidth() === '1280px' ? 'bg-white shadow text-accent-700' : 'text-gray-600 hover:text-gray-900'"
                    (click)="setPreviewWidth('1280px')">Desktop (1280px)</button>
            <button class="px-4 py-2 text-sm rounded-md transition-colors" 
                    [ngClass]="previewWidth() === '100%' ? 'bg-white shadow text-accent-700' : 'text-gray-600 hover:text-gray-900'"
                    (click)="setPreviewWidth('100%')">Full Width</button>
          </div>
        </header>
        <div class="flex-1 overflow-auto flex justify-center items-start p-4 md:p-8">
          <iframe 
            [src]="previewUrl" 
            [style.width]="previewWidth()" 
            class="h-[812px] max-h-full bg-white shadow-2xl rounded-2xl border border-gray-200 transition-all duration-300"
            title="Responsive Preview"
          ></iframe>
        </div>
      </div>
    </app-shell>

    <div *ngIf="isPreview()" class="min-h-screen bg-page pb-32">
      <header class="bg-accent-900 text-white p-6 shadow-soft-sm mb-8">
        <h1 class="text-3xl font-bold">Waschly Design System</h1>
        <p class="text-accent-100 mt-2">Mobile-first UI components for the German market.</p>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <!-- Actions -->
        <section>
          <h2 class="text-2xl font-semibold mb-6 border-b pb-2">1. Actions</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Buttons</h3>
              <div class="flex flex-wrap gap-4">
                <app-button variant="primary">Primary</app-button>
                <app-button variant="secondary">Secondary</app-button>
                <app-button variant="danger">Danger</app-button>
                <app-button variant="ghost">Ghost</app-button>
                <app-button variant="primary" [disabled]="true">Disabled</app-button>
                <app-button variant="primary" [isLoading]="true">Loading</app-button>
              </div>
            </app-card>

            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Icon Buttons (WCAG 48x48)</h3>
              <div class="flex flex-wrap gap-4 items-center">
                <app-icon-button ariaLabel="Close" variant="ghost">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </app-icon-button>
                <app-icon-button ariaLabel="Add" variant="primary">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </app-icon-button>
              </div>
            </app-card>
          </div>
        </section>

        <!-- Feedback -->
        <section>
          <h2 class="text-2xl font-semibold mb-6 border-b pb-2">2. Feedback</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Toasts</h3>
              <div class="flex gap-4">
                <app-button variant="secondary" (click)="showToast('success')">Success</app-button>
                <app-button variant="secondary" (click)="showToast('error')">Error</app-button>
                <app-button variant="secondary" (click)="showToast('info')">Info</app-button>
              </div>
            </app-card>

            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Loaders & Skeletons</h3>
              <div class="space-y-4">
                <div class="flex gap-4 items-center">
                  <app-spinner size="sm" color="current"></app-spinner>
                  <app-spinner size="md" color="primary"></app-spinner>
                  <app-spinner size="lg" color="primary"></app-spinner>
                </div>
                <div class="flex gap-4 items-center mt-4">
                  <app-skeleton shape="circle" width="w-12" height="h-12"></app-skeleton>
                  <div class="flex-1 space-y-2">
                    <app-skeleton shape="text" width="w-3/4"></app-skeleton>
                    <app-skeleton shape="text" width="w-1/2"></app-skeleton>
                  </div>
                </div>
              </div>
            </app-card>

            <div class="md:col-span-2">
              <h3 class="font-medium text-lg mb-4">Empty State</h3>
              <app-empty-state 
                title="No washing requests" 
                description="Get started by creating a new washing request for your vehicle."
              >
                <app-button variant="primary">Create Request</app-button>
              </app-empty-state>
            </div>
          </div>
        </section>

        <!-- Forms -->
        <section>
          <h2 class="text-2xl font-semibold mb-6 border-b pb-2">3. Forms</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Text Inputs</h3>
              <div class="space-y-4">
                <app-input label="Email" type="email" placeholder="john@example.com" [(value)]="form.email" [required]="true"></app-input>
                <app-input label="Password" type="password" error="Password is too short" [(value)]="form.password"></app-input>
                <app-textarea label="Description" helperText="Add details about your vehicle" [(value)]="form.desc"></app-textarea>
              </div>
            </app-card>
            
            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Selections</h3>
              <div class="space-y-6">
                <app-select label="Vehicle Type" [options]="vehicleOptions" [(value)]="form.type"></app-select>
                <app-toggle label="Enable Notifications" description="Receive SMS updates" [(checked)]="form.notifications"></app-toggle>
                <app-file-uploader label="Upload Car Photo" (fileSelected)="onFileSelected($event)"></app-file-uploader>
                <app-file-uploader label="ID Document (Sensitive)" [sensitive]="true" (fileSelected)="onFileSelected($event)"></app-file-uploader>
              </div>
            </app-card>
          </div>
        </section>

        <!-- Data Display -->
        <section>
          <h2 class="text-2xl font-semibold mb-6 border-b pb-2">4. Data Display</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <app-card variant="request">
              <h3 header class="flex items-center justify-between">
                <span class="font-medium">Request #4920</span>
                <app-status-pill status="open"></app-status-pill>
              </h3>
              <div class="flex items-center gap-4 py-2">
                <app-avatar src="https://i.pravatar.cc/150?img=11" name="Max Müller" size="lg"></app-avatar>
                <div>
                  <p class="font-medium text-gray-900">Max Müller</p>
                  <p class="text-sm text-gray-500">BMW Series 5 • Exterior Wash</p>
                </div>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <app-badge status="verified">Verified Washer</app-badge>
                <app-badge status="pending">Pending Payment</app-badge>
              </div>
              <div footer class="flex justify-end">
                <app-button variant="primary">Accept Request</app-button>
              </div>
            </app-card>

            <app-card variant="generic">
              <h3 header class="font-medium text-lg">Avatars & Ratings</h3>
              <div class="space-y-6">
                <div class="flex gap-4 items-center border-b pb-4">
                  <app-avatar name="Hans Gruber" size="sm"></app-avatar>
                  <app-avatar name="Klaus Meyer" size="md"></app-avatar>
                  <app-avatar name="Sabine Schmidt" size="lg"></app-avatar>
                  <app-avatar src="https://i.pravatar.cc/150?img=5" name="Lisa" size="xl"></app-avatar>
                </div>
                <div>
                  <p class="text-sm font-medium mb-2">Readonly (4.5)</p>
                  <app-rating [readonly]="true" [value]="4.5"></app-rating>
                  
                  <p class="text-sm font-medium mt-4 mb-2">Interactive ({{ userRating() }})</p>
                  <app-rating [(value)]="userRating"></app-rating>
                </div>
              </div>
            </app-card>
          </div>
        </section>

        <!-- Layout & Navigation -->
        <section>
          <h2 class="text-2xl font-semibold mb-6 border-b pb-2">5. Navigation & Layout</h2>
          <div class="space-y-8">
            
            <app-tabs [tabs]="tabs" [(activeTabId)]="activeTab"></app-tabs>
            
            <div class="p-6 bg-white border border-gray-200 rounded-lg">
              <app-button variant="primary" (click)="isModalOpen.set(true)">Open Responsive Modal</app-button>
            </div>

          </div>
        </section>

      </main>
    </div>

    <!-- Modals & FAB (Fixed positioning) -->
    <ng-container *ngIf="isPreview()">
      <app-modal [isOpen]="isModalOpen()" (closed)="isModalOpen.set(false)" title="Confirm Action">
        <p class="text-gray-600">Are you sure you want to proceed with this action? This cannot be undone.</p>
        <div footer>
          <app-button variant="ghost" (click)="isModalOpen.set(false)">Cancel</app-button>
          <app-button variant="primary" (click)="isModalOpen.set(false)">Confirm</app-button>
        </div>
      </app-modal>

      <app-fab ariaLabel="Add new" (click)="showToast('info', 'FAB Clicked')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      </app-fab>
    </ng-container>
  `
})
export class DesignSystemComponent implements OnInit {
  toastService = inject(ToastService);
  sanitizer = inject(DomSanitizer);
  
  isPreview = signal(false);
  previewWidth = signal('100%');
  previewUrl!: SafeResourceUrl;

  constructor() {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      this.isPreview.set(true);
    }
  }

  ngOnInit() {
    if (!this.isPreview()) {
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/dev/design-system');
    }
  }

  setPreviewWidth(width: string) {
    this.previewWidth.set(width);
  }

  // Form State
  form = {
    email: '',
    password: '',
    desc: '',
    type: '',
    notifications: false
  };

  vehicleOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' }
  ];

  // Rating State
  userRating = signal(3);

  // Modal State
  isModalOpen = signal(false);

  // Tabs State
  activeTab = signal('requests');
  tabs = [
    { id: 'requests', label: 'Open Requests', badge: '5' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' }
  ];

  // Nav State
  navItems = [
    { route: '/dev/design-system#home', label: 'Home', iconSvg: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
    { route: '/dev/design-system#search', label: 'Search', iconSvg: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>' },
    { route: '/dev/design-system#profile', label: 'Profile', iconSvg: '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' }
  ];

  showToast(type: 'success' | 'error' | 'info', msg?: string) {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'Something went wrong. Please try again.',
      info: 'Here is some useful information.'
    };
    this.toastService.show(type, msg || messages[type]);
  }

  onFileSelected(file: File | null) {
    console.log('File selected:', file?.name);
  }
}
