// Helpers for the influencer's Hotmart affiliate link.
//
// An affiliate link carries the influencer's affiliate code in a query param —
// for ScanPlates it's `ref` (e.g. https://www.scanplates.com/?ref=R106197159S).
// That code is what the sales webhook matches on (`hotmart_affiliate_code`), so
// when an influencer pastes their link we pull the code out and store it too.
// Links shared from a browser often have Google Analytics tracking junk
// (`_gl`, `_ga`, `_gcl_au`, …) appended — we strip all of that.

// Params that can carry the affiliate code, in priority order.
const AFFILIATE_PARAMS = ["ref", "ap", "sck"] as const;

function parseUrl(input: string): URL | null {
  try {
    return new URL(input.trim());
  } catch {
    return null;
  }
}

function findAffiliate(input: string): { code: string; param: string } | null {
  const url = parseUrl(input);
  if (!url) return null;
  for (const param of AFFILIATE_PARAMS) {
    const code = url.searchParams.get(param)?.trim();
    if (code) return { code, param };
  }
  return null;
}

/** Pull the affiliate code out of a pasted Hotmart/ScanPlates link, or null. */
export function extractAffiliateCode(input: string): string | null {
  return findAffiliate(input)?.code ?? null;
}

/**
 * Return a clean affiliate link — origin + path + only the affiliate param —
 * stripping Google Analytics tracking and anything else. Null if no code.
 */
export function cleanAffiliateUrl(input: string): string | null {
  const url = parseUrl(input);
  const affiliate = findAffiliate(input);
  if (!url || !affiliate) return null;
  return `${url.origin}${url.pathname}?${affiliate.param}=${affiliate.code}`;
}
