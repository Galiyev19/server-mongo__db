import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";

mongoose
  .connect(
    "mongodb+srv://galiyevalisher7:wwwwww@cluster0.kmz2lln.mongodb.net/users"
  )
  .then(() => console.log("Connect DB"))
  .catch((err) => console.log(err));
const app = express();

app.use(express.json());

app.post("/sign-in", UserController.login);
app.post("/sign-up", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getUser);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
