import { edenFetch } from "@elysiajs/eden";
import type { App } from "../server/main.ts";
import { z } from "zod";

const UserSchema = z.object({
	name: z.string(),
	thisPropertyDoesNotExist: z.number(),
});
type User = z.infer<typeof UserSchema>;

if (Bun.argv.length !== 3) {
	console.error("usage: bun ./client/main.ts (your name)");
	process.exit(1);
}
// this is usually called `fetch`,
// but to contrast against web standard `fetch` API,
// this is assigned to to `elysiaFetch`
const elysiaFetch = edenFetch<App>("http://localhost:3000");

{
	// 作成前
	const { data: users } = await elysiaFetch("/users", {
		method: "GET",
	});
	console.log("before", users);
}

{
	// 作成
	const { data } = await elysiaFetch("/users", {
		method: "POST",
		body: {
			// OK. try removing this line.
			name: Bun.argv[2], // 名前
		},
	});
	console.log("new user:", data);
}

{
	// 作成後
	const { data: users } = await elysiaFetch("/users", {
		method: "GET",
	});
	console.log("after", users);
}

{
	// errors at comptime, without any kind of execution involved
	const { data } = await elysiaFetch("/users", {
		method: "GET",
	});
	data?.thisPropertyDoesNotExist; // Property 'thisPropertyDoesNotExist' does not exist on type ' { id: number, name: string }[]'
}

{
	// this error at runtime, because zod is a runtime library
	const resp = await fetch("/users", {
		method: "GET",
		// method: "POST",
		// body: JSON.stringify({}),
	});
	const data = UserSchema.parse(await resp.json());
	console.log(data.thisPropertyDoesNotExist.toString()); // typescript says OK, but your browser / runtime won't.
}
