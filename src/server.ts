import express, { json } from "express";
import { routes } from "./routes";

const app = express();

app.use(json());
app.use(routes);

app.listen(process.env.port || 3333, () => {
  console.log("Server is Running");
});
