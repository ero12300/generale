import { describe, expect, it } from "vitest";
import { createDealSchema, updateDealSchema } from "@/lib/validations/api";

describe("createDealSchema", () => {
  it("accetta un deal valido", () => {
    const result = createDealSchema.safeParse({
      title: "Trilocale Milano",
      strategy: "fix_flip",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta titolo vuoto", () => {
    const result = createDealSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });
});

describe("updateDealSchema", () => {
  it("accetta cambio stage", () => {
    const result = updateDealSchema.safeParse({ stage: "offer" });
    expect(result.success).toBe(true);
  });

  it("rifiuta body vuoto", () => {
    const result = updateDealSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
