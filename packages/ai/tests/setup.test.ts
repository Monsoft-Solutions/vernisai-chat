/**
 * Setup tests for the AI package
 */

import { ModelPreset } from "../src/types/model.type";

describe("AI Package Setup", () => {
  it("should have model presets defined", () => {
    expect(ModelPreset.SPEED).toBe("speed");
    expect(ModelPreset.SMART).toBe("smart");
    expect(ModelPreset.GENIUS).toBe("genius");
    expect(ModelPreset.REASONING).toBe("reasoning");
  });

  it("should have all model presets available", () => {
    const presets = Object.values(ModelPreset);
    expect(presets).toHaveLength(4);
    expect(presets).toContain("speed");
    expect(presets).toContain("smart");
    expect(presets).toContain("genius");
    expect(presets).toContain("reasoning");
  });
});
