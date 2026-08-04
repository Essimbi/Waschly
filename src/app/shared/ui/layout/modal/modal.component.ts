import { Component, ElementRef, ViewChild, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ModalComponent
 * @description
 * An accessible modal utilizing the native HTML <dialog> element.
 * Acts as a bottom sheet on mobile (<768px) and a centered modal on desktop.
 * 
 * @example
 * <app-modal [isOpen]="isModalOpen" (closed)="isModalOpen = false" title="Confirm Action">
 *   <p>Are you sure?</p>
 *   <div footer>
 *      <app-button (click)="isModalOpen = false">Cancel</app-button>
 *   </div>
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- The native dialog element manages focus trapping, top layer positioning, and backdrop natively -->
    <dialog 
      #dialog 
      class="backdrop:bg-black/50 p-0 w-full md:w-auto md:min-w-[400px] md:max-w-lg md:rounded-xl shadow-2xl fixed inset-x-0 bottom-0 md:static md:m-auto bg-white transition-transform ease-out duration-300 md:duration-200 focus:outline-none"
      [ngClass]="{
        'rounded-t-2xl': true,
        'translate-y-full md:translate-y-0 md:scale-95 opacity-0': !isOpen(),
        'translate-y-0 md:scale-100 opacity-100': isOpen()
      }"
      (close)="onNativeClose()"
      (click)="onBackdropClick($event)"
    >
      <div class="flex flex-col max-h-[90vh]">
        
        <!-- Mobile drag handle indicator -->
        <div class="md:hidden flex justify-center pt-3 pb-1" (click)="close()">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">{{ title() }}</h2>
          <button 
            type="button" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full p-1"
            (click)="close()"
            aria-label="Close dialog"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="px-6 py-5 overflow-y-auto">
          <ng-content></ng-content>
        </div>
        
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end gap-3" *ngIf="hasFooter">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </dialog>
  `,
  styles: [`
    /* Ensure the dialog is block when open for CSS transitions */
    dialog[open] {
      display: block;
    }
    
    /* On desktop, we want it to behave as a normal dialog (centered) */
    @media (min-width: 768px) {
      dialog[open] {
        display: block; /* The browser will center it due to margin: auto and top layer */
      }
    }
  `]
})
export class ModalComponent {
  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;
  
  isOpen = input<boolean>(false);
  title = input.required<string>();
  
  closed = output<void>();

  hasFooter = true; // Simplified for demo

  // Use an effect in constructor or ngOnChanges to manage showModal()
  // Since we are using standard component lifecycle, let's use ngOnChanges equivalent
  ngOnChanges(changes: any) {
    if (changes.isOpen) {
      this.syncState();
    }
  }
  
  ngAfterViewInit() {
    this.syncState();
  }

  private syncState() {
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) return;

    if (this.isOpen() && !dialog.open) {
      dialog.showModal();
    } else if (!this.isOpen() && dialog.open) {
      dialog.close();
    }
  }

  close() {
    this.dialogRef.nativeElement.close();
  }

  onNativeClose() {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    const dialog = this.dialogRef.nativeElement;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      dialog.close();
    }
  }
}
