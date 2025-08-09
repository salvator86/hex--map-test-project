import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { GeoJson } from '../models/geo-json.model';

@Injectable({
  providedIn: 'root',
})
export class GeoJsonService {
  private readonly url = '/data.json';
  private geoJson$!: Observable<GeoJson>;

  constructor(private http: HttpClient) {}

  getGeoJsonData(): Observable<GeoJson> {
    if (!this.geoJson$) {
      this.geoJson$ = this.http.get<GeoJson>(this.url).pipe(shareReplay(1));
    }
    return this.geoJson$;
  }
}
