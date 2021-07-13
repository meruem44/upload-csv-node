import { Router } from "express";
import multer from "multer";
import { Readable } from "stream";
import readline from "readline";
import { client } from "./database/client";

const multerConfig = multer();

const routes = Router();

interface IClients {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

routes.post(
  "/users",
  multerConfig.single("file"),
  async (request, response) => {
    const { file } = request;
    const readableFile = new Readable();

    readableFile.push(file?.buffer);
    readableFile.push(null);

    const clientsLine = readline.createInterface({
      input: readableFile,
    });

    const clients: IClients[] = [];

    for await (let line of clientsLine) {
      const [name, email, password, avatar] = line.split(",");

      clients.push({
        name,
        email,
        password,
        avatar,
      });
    }

    for await (let { name, email, password, avatar } of clients) {
      await client.clients.create({
        data: {
          name,
          email,
          password,
          avatar,
        },
      });
    }

    return response.json(clients);
  }
);

export { routes };
