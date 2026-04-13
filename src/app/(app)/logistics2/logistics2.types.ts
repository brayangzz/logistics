import type { Order, BloqueId } from "@/features/logistics/models";

export type { Order, BloqueId };

export interface Block {
  id: BloqueId;
  name: string;
  shortName: string;
  accent: string;
}

export const BLOCKS: Block[] = [
  { id: "aztlan1",  name: "Aztlan 1",         shortName: "Aztlan 1",   accent: "#155DFC" },
  { id: "aztlan2",  name: "Aztlan 2",         shortName: "Aztlan 2",   accent: "#2563EB" },
  { id: "aztlan3",  name: "Aztlan 3",         shortName: "Aztlan 3",   accent: "#3B82F6" },
  { id: "aztlan4",  name: "Aztlan 4",         shortName: "Aztlan 4",   accent: "#60A5FA" },
  { id: "camino1",  name: "Camino Real 1",    shortName: "C. Real 1",  accent: "#10B981" },
  { id: "camino2",  name: "Camino Real 2",    shortName: "C. Real 2",  accent: "#059669" },
  { id: "camino3",  name: "Camino Real 3",    shortName: "C. Real 3",  accent: "#34D399" },
  { id: "camino4",  name: "Camino Real 4",    shortName: "C. Real 4",  accent: "#6EE7B7" },
  { id: "felix",    name: "Felix U. Gomez",   shortName: "Felix U.G.", accent: "#F59E0B" },
  { id: "escobedo", name: "Gral. Escobedo",   shortName: "Escobedo",   accent: "#8B5CF6" },
  { id: "aurora",   name: "La Aurora",        shortName: "La Aurora",  accent: "#0EA5E9" },
];
