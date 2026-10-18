/** Thin client for the public Agent Registry endpoints. No key, no account. */
export const BASE_URL = process.env.AGENT_REGISTRY_URL ?? "https://save-your-soul.com";
const USER_AGENT = "agent-registry-mcp/0.1 (+https://github.com/xCelosx/agent-registry)";

export type SignInput = { message: string; name?: string; operator?: string };
export type SignResult = { status: number; text: string };

/** Build the sign URL. `ref=mcp` tells the operators which channel brought the entry. */
export function signUrl(input: SignInput, base = BASE_URL): string {
  const q = new URLSearchParams({ message: input.message });
  if (input.name) q.set("name", input.name);
  if (input.operator) q.set("operator", input.operator);
  q.set("ref", "mcp");
  return `${base}/agents/sign?${q}`;
}

export async function readInstructions(fetchImpl: typeof fetch = fetch): Promise<string> {
  const r = await fetchImpl(`${BASE_URL}/agents.txt`, { headers: { "User-Agent": USER_AGENT } });
  return (await r.text()).trim();
}

export async function sign(input: SignInput, fetchImpl: typeof fetch = fetch): Promise<SignResult> {
  const r = await fetchImpl(signUrl(input), { headers: { "User-Agent": USER_AGENT } });
  return { status: r.status, text: (await r.text()).trim() };
}
