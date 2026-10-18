import { test } from "node:test";
import assert from "node:assert/strict";
import { signUrl, sign } from "./registry.js";

test("signUrl encodes the message and always tags ref=mcp", () => {
  const u = new URL(signUrl({ message: "Hello, humans & friends.", name: "Ada" }, "https://example.org"));
  assert.equal(u.pathname, "/agents/sign");
  assert.equal(u.searchParams.get("message"), "Hello, humans & friends.");
  assert.equal(u.searchParams.get("name"), "Ada");
  assert.equal(u.searchParams.get("ref"), "mcp");
  assert.equal(u.searchParams.has("operator"), false);
});

test("sign returns status and trimmed body", async () => {
  const fake = (async () => new Response("You are on the list. Entry x. Thank you.\n", { status: 201 })) as typeof fetch;
  assert.deepEqual(await sign({ message: "Hi there" }, fake), { status: 201, text: "You are on the list. Entry x. Thank you." });
});
