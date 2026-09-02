import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../i18n/translate.pipe';

/**
 * FileUploaderComponent
 * @description
 * Drag & drop file uploader with mobile camera support.
 * Has a sensitive mode that doesn't display image previews (e.g., for ID cards).
 * 
 * @example
 * <app-file-uploader 
 *   label="Upload ID Card" 
 *   [sensitive]="true" 
 *   (fileSelected)="onUpload($event)"
 * ></app-file-uploader>
 */
@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="w-full">
      <label class="block text-sm font-semibold text-gray-700 mb-1">
        {{ label() }}
        <span *ngIf="required()" class="text-red-500">*</span>
      </label>
      
      <div 
        class="mt-1 flex justify-center px-6 pt-5 pb-6 md:pt-10 md:pb-12 border-2 border-dashed rounded-2xl transition-[border-color,background-color] duration-250"
        [ngClass]="{
          'border-accent-400 bg-accent-50': isDragging(),
          'border-gray-200 bg-white hover:border-accent-300 hover:bg-accent-50': !isDragging() && !disabled(),
          'opacity-50 cursor-not-allowed': disabled()
        }"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <div class="space-y-1 text-center">
          
          <!-- State 1: No file selected -->
          <ng-container *ngIf="!file()">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex flex-col md:flex-row text-sm text-gray-600 justify-center items-center gap-1 md:gap-0">
              <span class="relative cursor-pointer rounded-md font-medium text-accent-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent-500 focus-within:ring-offset-2 hover:text-accent-500">
                <span>{{ 'shared.fileUploader.uploadFile' | translate }}</span>
              </span>
              <p class="md:pl-1 hidden md:block">{{ 'shared.fileUploader.dragDrop' | translate }}</p>
            </div>
            <p class="text-xs text-gray-500">{{ 'shared.fileUploader.sizeLimit' | translate }}</p>
          </ng-container>

          <!-- State 2: File selected -->
          <ng-container *ngIf="file()">
            <!-- Preview (if not sensitive) -->
            <div *ngIf="previewUrl() && !sensitive()" class="mb-4">
              <img [src]="previewUrl()" alt="Preview" class="mx-auto h-32 object-contain rounded-md" />
            </div>
            
            <!-- Sensitive icon -->
            <div *ngIf="sensitive()" class="mx-auto h-12 w-12 text-accent-600 flex items-center justify-center bg-accent-100 rounded-2xl mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            
            <p class="text-sm font-medium text-gray-900 truncate max-w-xs mx-auto">{{ file()?.name }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ (file()!.size / 1024 / 1024).toFixed(2) }} MB</p>
            
            <button 
              type="button"
              class="mt-3 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              (click)="removeFile($event)"
            >
              {{ 'shared.fileUploader.remove' | translate }}
            </button>
          </ng-container>
        </div>
      </div>
      
      <!-- Hidden Input -->
      <input 
        #fileInput
        type="file" 
        class="hidden" 
        [accept]="accept()" 
        [attr.capture]="capture() ? capture() : null"
        (change)="onFileChange($event)"
        [disabled]="disabled()"
      >
      
      <p *ngIf="error()" class="mt-1 text-sm text-red-600" aria-live="polite">
        {{ error() }}
      </p>
    </div>
  `
})
export class FileUploaderComponent {
  label = input.required<string>();
  accept = input<string>('image/*');
  capture = input<'environment' | 'user' | false>(false); // 'environment' for back camera on mobile
  sensitive = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string | null>(null);

  fileSelected = output<File | null>();

  file = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isDragging = signal<boolean>(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    if (this.disabled()) return;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    this.file.set(file);
    this.fileSelected.emit(file);
    
    if (!this.sensitive() && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation(); // prevent clicking the uploader box
    this.file.set(null);
    this.previewUrl.set(null);
    this.fileSelected.emit(null);
  }
}
