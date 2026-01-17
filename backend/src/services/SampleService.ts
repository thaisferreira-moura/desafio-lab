import { Sample } from "../models/Sample";
import { Variant, Classification } from "../models/Variant";

const ALLOWED_CLASSIFICATIONS: ReadonlyArray<Classification> = [
  "Patogênico",
  "Benigno",
  "VUS",
];

export class SampleService {
  private samples: Sample[] = [];

  create(payload: { name: string; variants: Variant[] }): Sample {
    const name = payload.name?.trim();

    if (!name || name.length < 2) {
      throw new Error("Nome da amostra é obrigatório.");
    }

    if (!Array.isArray(payload.variants)) {
      throw new Error("variants precisa ser um array.");
    }

    const idRegex = /^chr\d+-\d+-[ACGT]-[ACGT]$/;

    for (const v of payload.variants) {
      if (!v?.id || !v?.gene || !v?.classification) {
        throw new Error("Cada variante deve ter id, gene e classification.");
      }

      if (!idRegex.test(v.id)) {
        throw new Error(
          `Variant id inválido: ${v.id}. Use o formato chr<numero>-<posição>-<ref>-<alt> (ex: chr1-154548-A-G)`
        );
      }

      if (!ALLOWED_CLASSIFICATIONS.includes(v.classification)) {
        throw new Error(
          "classification inválida. Use: Patogênico, Benigno ou VUS."
        );
      }
    }

    const sample: Sample = {
      id: `sample_${Date.now()}`,
      name,
      variants: payload.variants,
    };

    this.samples.push(sample);
    return sample;
  }

  list(): Sample[] {
    return this.samples;
  }

  getById(sampleId: string): Sample | undefined {
    return this.samples.find((s) => s.id === sampleId);
  }
}
