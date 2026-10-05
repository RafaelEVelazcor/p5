import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { beforeAll, describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("D1-backed people endpoint", () => {
	beforeAll(async () => {
		await env.p5_d.prepare(
			"CREATE TABLE IF NOT EXISTS personas (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, edad INTEGER NOT NULL)",
		).run();
		await env.p5_d.prepare(
			"INSERT OR IGNORE INTO personas (id, nombre, edad) VALUES (?, ?, ?)",
		)
			.bind(1, "Ana", 20)
			.run();
	});

	it("returns the sample person from D1", async () => {
		const request = new IncomingRequest("http://example.com/api/personas");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([{ id: 1, nombre: "Ana", edad: 20 }]);
	});

	it("returns the sample person through the Worker integration", async () => {
		const response = await SELF.fetch("https://example.com/api/personas");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([{ id: 1, nombre: "Ana", edad: 20 }]);
	});
});
