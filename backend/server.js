import express from "express";
import cors from "cors";
import path from "path";

import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import { UploadRepo } from "./uploadRepository.js";

const app = express();
app.use(cors());

const uploadDir = path.join(process.cwd(), "uploads");

const tusServer = new Server({
  path: "/files",
  datastore: new FileStore({ directory: uploadDir })
});

app.all("/files", (req, res) => {
  tusServer.handle(req, res);
});

app.all("/files/:id", (req, res) => {
  tusServer.handle(req, res);
});

tusServer.on("POST_CREATE", (req, res, upload) => {
  console.log("Upload created:", upload);
  
  const metadata = upload.metadata || {};
  const filename = metadata.filename || "unknown";

  UploadRepo.create({
    id: upload.id,
    filename,
    size: upload.size ?? 0
  });
});

tusServer.on("PATCH_UPLOAD", (req, res, upload) => {
  console.log("Upload in progress:", upload.id, `${upload.offset}/${upload.size}`);
  if (upload.offset === 0) {
    UploadRepo.start(upload.id);
  }
});

tusServer.on("POST_FINISH", (req, res, upload) => {
  console.log("Upload complete:", upload.id);
  UploadRepo.complete(upload.id);
});

tusServer.on("POST_TERMINATE", (req, res, upload) => {
  console.log("Upload terminated:", upload.id);
  if (upload?.id) UploadRepo.fail(upload.id);
});

app.get("/status/:id", (req, res) => {
  const status = UploadRepo.get(req.params.id);
  if (!status) return res.status(404).json({ error: "Not found" });
  res.json(status);
});

app.get("/", (_, res) => {
  res.send("TUS server running");
});

app.listen(4000, () => {
  console.log("🚀 Backend running on http://localhost:4000");
});