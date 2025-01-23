import { edenFetch } from "@elysiajs/eden";
import type { App } from "../server/main.ts";
import { z } from "zod";

const UserSchema = z.object({
	name: z.string(),
	thisPropertyDoesntExist: z.number(),
});
type User = z.infer<typeof UserSchema>;

if (Bun.argv.length !== 3) {
	console.error("usage: bun ./client/main.ts (your name)");
	process.exit(1);
}
const elysiaFetch = edenFetch<App>("http://localhost:3000");

// 作成前
const { data: users } = await elysiaFetch("/users", {
	method: "GET",
});
console.log("before", users);

// 作成
const { data } = await elysiaFetch("/users", {
	method: "POST",
	body: {
		name: Bun.argv[2], // 名前
	},
});
console.log("new user:", data);

// 作成後
const { data: users2 } = await elysiaFetch("/users", {
	method: "GET",
});
console.log("after", users2);

// error
const { data: valid_user_type } = await elysiaFetch("/users", {
	method: "GET",
});
valid_user_type?.thisPropertyDoesntExist;

const resp = await fetch("/users", {
	method: "GET",
	// method: "POST",
	// body: JSON.stringify({}),
});
// this error at runtime, because zod is a runtime library
const dat = await resp.json();
console.log(dat?.thisPropertyDoesntExist);
