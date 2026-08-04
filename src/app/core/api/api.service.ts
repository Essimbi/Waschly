import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';

export interface WasherAd {
  id: string;
  name: string;
  status: 'available' | 'busy';
  location: [number, number]; // [lat, lng]
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.waschly.com/v1'; // Dummy URL

  // Example of using TanStack Query in an Angular Service
  // This will be called from a component using signals
  getAvailableWashers() {
    return injectQuery(() => ({
      queryKey: ['washers', 'available'],
      queryFn: async () => {
        // In a real app, you would use this.http.get() or fetch
        // For now, we simulate an API call
        return new Promise<WasherAd[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'WashPro', status: 'available', location: [52.5200, 13.4050] },
              { id: '2', name: 'CleanCar', status: 'available', location: [52.5250, 13.4100] }
            ]);
          }, 1000);
        });
      }
    }));
  }
}
