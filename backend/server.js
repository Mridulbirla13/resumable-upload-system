import express from 'express';
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());

const uploadDir = path.join(process.cwd(), "uploads");

const tusServer = new Server({
  path: "/files",
  datastore: new FileStore({ directory: uploadDir }),
});

app.use("/files", (req, res) => {
  tusServer.handle(req, res);
});

app.get("/", (_, res) => {
  res.send("TUS server running");
});

app.listen(4000, () => {
  console.log("🚀 Backend running on http://localhost:4000");
});
