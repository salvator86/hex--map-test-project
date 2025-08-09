import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeoJson } from '../models/geo-json.model';

@Injectable({
  providedIn: 'root',
})
export class GeoJsonService {
  private readonly url = '/assets/data.json';

  constructor(private http: HttpClient) {}

  public getGeoJsonData(): Observable<GeoJson> {
    return this.http.get<GeoJson>(this.url);
  }
}
