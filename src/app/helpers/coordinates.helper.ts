import proj4 from 'proj4';

export class CoordinatesHelper {
  private static readonly EPSG3857 = 'EPSG:3857';
  private static readonly EPSG4326 = 'EPSG:4326';

  public static projectCoords(x: number, y: number): google.maps.LatLngLiteral {
    if (Math.abs(x) > 180 || Math.abs(y) > 90) {
      const [lng, lat] = proj4(this.EPSG3857, this.EPSG4326, [x, y]);
      return { lat, lng };
    } else {
      return { lat: y, lng: x };
    }
  }

  public static getPolygonCentroid(path: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral {
    if (!path.length) return { lat: 0, lng: 0 };
    let latSum = 0;
    let lngSum = 0;

    path.forEach(point => {
      latSum += point.lat;
      lngSum += point.lng;
    });

    return {
      lat: latSum / path.length,
      lng: lngSum / path.length,
    };
  }

  public static getH3Resolution(zoom: number): number {
    if (zoom >= 12) return 9;
    if (zoom >= 9) return 7;
    if (zoom >= 6) return 5;

    return 2;
  }
}
