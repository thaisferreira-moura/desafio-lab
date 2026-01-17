export type Classification = "Patogênico" | "Benigno" | "VUS";

export interface Variant {
  id: string;
  gene: string;
  classification: Classification;
}
