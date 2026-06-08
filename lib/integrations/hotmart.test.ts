import { describe, it, expect } from "vitest";
import { extractAffiliateCode, cleanAffiliateUrl } from "./hotmart";

// A real long link an influencer might paste: the `ref` is the affiliate code,
// everything after it is Google Analytics cross-domain tracking junk.
const LONG_LINK =
  "https://www.scanplates.com/?ref=R106197159S&_gl=1*5zvpb4*_gcl_au*MjEw*FPAU*MjEw*_ga*ODcz*_ga_GQH2V1F11Q*czE3";

describe("extractAffiliateCode", () => {
  it("reads the ref code from a clean ScanPlates link", () => {
    expect(extractAffiliateCode("https://www.scanplates.com/?ref=R106197159S")).toBe(
      "R106197159S",
    );
  });

  it("reads the ref code even with Google tracking junk appended", () => {
    expect(extractAffiliateCode(LONG_LINK)).toBe("R106197159S");
  });

  it("falls back to Hotmart's `ap` affiliate param", () => {
    expect(extractAffiliateCode("https://pay.hotmart.com/B123?ap=ABCD1234")).toBe(
      "ABCD1234",
    );
  });

  it("trims surrounding whitespace from a pasted link", () => {
    expect(extractAffiliateCode("  https://www.scanplates.com/?ref=ABC123  ")).toBe(
      "ABC123",
    );
  });

  it("returns null when there is no affiliate code", () => {
    expect(extractAffiliateCode("https://www.scanplates.com/")).toBeNull();
  });

  it("returns null for input that is not a URL", () => {
    expect(extractAffiliateCode("meu link")).toBeNull();
  });
});

describe("cleanAffiliateUrl", () => {
  it("strips tracking junk and keeps only the affiliate ref", () => {
    expect(cleanAffiliateUrl(LONG_LINK)).toBe(
      "https://www.scanplates.com/?ref=R106197159S",
    );
  });

  it("leaves an already-clean link unchanged", () => {
    expect(cleanAffiliateUrl("https://www.scanplates.com/?ref=R106197159S")).toBe(
      "https://www.scanplates.com/?ref=R106197159S",
    );
  });

  it("preserves the original param name (ap) when cleaning", () => {
    expect(cleanAffiliateUrl("https://pay.hotmart.com/B123?ap=ABCD1234&x=1")).toBe(
      "https://pay.hotmart.com/B123?ap=ABCD1234",
    );
  });

  it("returns null when no affiliate code is present", () => {
    expect(cleanAffiliateUrl("https://www.scanplates.com/")).toBeNull();
  });
});
