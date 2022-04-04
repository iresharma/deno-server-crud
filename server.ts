// importing abc library
import { Application, Context } from "https://deno.land/x/abc@v1.3.3/mod.ts";

const app = new Application();

app.static("/static/", "./static");

app.get('/', (ctx: Context) => {
    return ctx.file("./public/index.html");
})

app.start({ port: 3000 });