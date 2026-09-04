import type { PolygonGeometry } from "./geometry";

export type LandStatus = "AVAILABLE" | "SOLD" | "RESERVED";

export type Land = {
  id: number;
  name: string;
  description: string;
  price: number;
  contact: string;
  geometry: PolygonGeometry;
  status: LandStatus;
};
