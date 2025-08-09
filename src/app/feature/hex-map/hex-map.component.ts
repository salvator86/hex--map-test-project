import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import * as h3 from 'h3-js';

import { CoordinatesHelper } from '../../helpers/coordinates.helper';
import { GeoJson } from '../../models/geo-json.model';
import { GeoJsonService } from '../../services/data-json.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-hex-map',
  template: `
    <google-map height="100vh" width="100%" [center]="center" [zoom]="zoom"></google-map>
  `,
  standalone: true,
  imports: [GoogleMap],
})
export class HexMapComponent implements AfterViewInit {
  @ViewChild(GoogleMap) public mapComponent!: GoogleMap;

  public map: google.maps.Map;
  public geoJsonData: GeoJson;
  public polygons: google.maps.Polygon[] = [];

  public center = { lat: 23.8859, lng: 45.0792 };
  public zoom = 6;

  public constructor(private geoJsonService: GeoJsonService) {}

  public ngAfterViewInit() {
    if (this.mapComponent?.googleMap) {
      this.map = this.mapComponent.googleMap;

      this.geoJsonService.getGeoJsonData().pipe(take(1)).subscribe(data => {
        this.geoJsonData = data;
        this.drawHexagons();
      });

      this.map.addListener('idle', () => this.drawHexagons());
    }
  }

  public drawHexagons() {
    if (!this.map || !this.geoJsonData?.features?.length) return;

    const bounds = this.map.getBounds();
    if (!bounds) return;

    this.polygons.forEach(p => p.setMap(null));
    this.polygons = [];

    const zoom = this.map.getZoom() ?? this.zoom;
    const h3Resolution = CoordinatesHelper.getH3Resolution(zoom);

    this.geoJsonData.features.forEach(feature => {
      const rawColor = feature.properties.COLOR_HEX || '000000';
      const color = rawColor.startsWith('#') ? rawColor : '#' + rawColor;

      const polygons = feature.geometry.type === 'MultiPolygon'
        ? (feature.geometry.coordinates as number[][][][]).flat(1)
        : (feature.geometry.coordinates as number[][][]);

      polygons.forEach(polygonCoords => {
        const path = polygonCoords.map(([x, y]) => CoordinatesHelper.projectCoords(y, x));
        const centroid = CoordinatesHelper.getPolygonCentroid(path);

        const h3Index = h3.latLngToCell(centroid.lat, centroid.lng, h3Resolution);
        const hexBoundary = h3.cellToBoundary(h3Index, true) as [number, number][];
        const hexPath = hexBoundary.map(([lat, lng]) => ({ lat, lng }));

        const hexBounds = new google.maps.LatLngBounds();
        hexPath.forEach(coordinate => hexBounds.extend(coordinate));

        if (bounds.intersects(hexBounds)) {
          this.addPolygon(hexPath, color);
        }
      });
    });
  }


  public addPolygon(path: google.maps.LatLngLiteral[], fillColor: string) {
    const polygon = new google.maps.Polygon({
      paths: path,
      strokeColor: '#000000',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor,
      fillOpacity: 0.6,
      map: this.map,
    });

    this.polygons.push(polygon);
  }
}
