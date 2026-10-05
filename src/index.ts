/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/personas" && request.method === "GET") {
			const { results } = await env.p5_d.prepare(
				"SELECT id, nombre, edad FROM personas ORDER BY id",
			).all();

			return Response.json(results);
		}

		return new Response("Consulta las personas en /api/personas", {
			status: pathname === "/api/personas" ? 405 : 404,
		});
	},
} satisfies ExportedHandler<Env>;
