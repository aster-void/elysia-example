import { edenFetch } from "@elysiajs/eden";
import type { App } from "../server/main.ts";

if (Bun.argv.length !== 3) {
	console.error("usage: bun ./client/main.ts (your name)");
	process.exit(1);
}
const fetch = edenFetch<App>("http://localhost:3000");

// 作成前
const { data: users } = await fetch("/users", {
	method: "GET",
});
console.log("before", users);

// 作成
const { data } = await fetch("/users", {
	method: "POST",
	body: {
		name: Bun.argv[2], // 名前
	},
});
console.log("new user:", data);

// 作成後
const { data: users2 } = await fetch("/users", {
	method: "GET",
});
console.log("after", users2);

// error
// const this_error_at_comptime = await fetch("/users", {
// 	method: "POST",
// 	body: {},
// });
