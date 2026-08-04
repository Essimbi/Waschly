import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, effect, input } from '@angular/core';
import * as L from 'leaflet';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div #mapContainer class="w-full h-full min-h-[300px] rounded-lg shadow-md z-0"></div>`,
  styles: [`
    /* Ensure map container has constraints */
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  // Using Angular 17+ input signals
  center = input<[number, number]>([52.5200, 13.4050]); // Berlin by default
  markers = input<MapMarker[]>([]);

  private map: L.Map | undefined;
  private markerLayer: L.LayerGroup | undefined;

  constructor() {
    effect(() => {
      // React to changes in markers input
      const currentMarkers = this.markers();
      if (this.map && this.markerLayer) {
        this.markerLayer.clearLayers();
        currentMarkers.forEach(m => {
          L.marker([m.lat, m.lng], { title: m.title }).addTo(this.markerLayer!);
        });
      }
    });

    effect(() => {
      // React to center changes
      const currentCenter = this.center();
      if (this.map) {
        this.map.setView(currentCenter, this.map.getZoom());
      }
    });
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView(this.center(), 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
