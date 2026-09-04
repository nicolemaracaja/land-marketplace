import type { PolygonGeometry } from "./geometry";

export type LandRequest = {
  name: string;
  description: string;
  price: number;
  contact: string;
  geometry: PolygonGeometry;
};