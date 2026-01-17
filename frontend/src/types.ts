export type Classification = "Patogênico" | "Benigno" | "VUS";

export type Variant = {
  id: string;
  gene: string;
  classification: Classification;
};

export type Sample = {
  id: string;
  name: string;
  variants: Variant[];
};

export type Report = {
  sampleId: string;
  summary: string;
  statistics: { pathogenic: number; benign: number; vus: number };
  highlightedVariants: Variant[];
  notes: string;
  generatedAt: string;
};

export type UIStatus = "idle" | "loading" | "success" | "error";
