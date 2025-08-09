export interface GeoJsonFeature {
  type: "Feature";
  properties: {
    COLOR_HEX: string;
    ID: number;
  };
  geometry: {
    type: "MultiPolygon" | "Polygon";
    coordinates: number[][][][] | number[][][];
  };
}

export interface GeoJson {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}
