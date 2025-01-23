import { Elysia, t } from "elysia";

const users: { id: number; name: string }[] = [];
let id = 0;
const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/users", () => users)
	.post(
		"/users",
		({ body: { name } }) => {
			const newUser = {
				id: id++,
				name,
			};
			users.push(newUser);
			console.log(newUser);
			return newUser;
		},
		{
			body: t.Object({
				name: t.String(),
			}),
		},
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
