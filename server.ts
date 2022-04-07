// importing abc library
import { Application, Context } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.2/mod.ts";

const BASE_URI = Deno.env.get("MONGO_URI") || "";
const DATA_API_KEY = Deno.env.get("API_KEY") || "";
const DATA_SOURCE = "Cluster0";
const DATABASE = "Deno-server";
const COLLECTION = "Notes";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": DATA_API_KEY,
  },
  body: "",
};

const app = new Application();

app.static("/static/", "./static");

app.get("/", (ctx: Context) => {
  return ctx.file("./public/index.html");
});

app.get("/jokes/random", async (_: Context) => {
  const response = await fetch(
    "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single",
  );
  const jokeJSON = await response.json();
  console.log(jokeJSON);
  const template = await renderFileToString("./public/random.ejs", {
    joke: jokeJSON.joke,
    category: jokeJSON.category,
  });
  return template;
});

app.get("/crud", async (ctx: Context) => {
  options.body = JSON.stringify({
    collection: COLLECTION,
    database: DATABASE,
    dataSource: DATA_SOURCE,
  });
  const response = await fetch(`${BASE_URI}/find`, options);
  if (response.status === 404) {
    return ctx.file("./public/crud/notFound.html");
  } else if (response.status === 400 || response.status === 500) {
    return ctx.file("./public/index.html");
  } else if (response.status === 200) {
    const dataJSON = await response.json();
    console.log(dataJSON);
    return ctx.file("./public/index.html");
  }
  return ctx.file("./public/index.html");
});

app.get("/crud/create", (ctx: Context) => {
  return ctx.file("./public/index.html");
});

console.log("http://localhost:3000/");
app.start({ port: 3000 });
