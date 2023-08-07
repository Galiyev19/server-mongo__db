import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import cors from 'cors'
import multer from "multer";
import * as dotenv from 'dotenv'

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import User from "./models/User.js";


dotenv.config()
mongoose.set('strictQuery', true)

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect DB"))
  .catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage})
app.use('/uploads',express.static('uploads'));

app.use(express.json());
app.use(cors())

app.post("/sign-in", UserController.login);
app.post("/sign-up", registerValidation, UserController.register);
app.get("/user-movie-list/:id",UserController.userMovieList)

app.post("/upload/:id", upload.single('image'),UserController.UploadUserImage )

app.get("/auth/me", checkAuth, UserController.getUser);
app.patch("/user/:id",  UserController.addUserItemMovieList);
app.patch("/deleteMovie/:id", UserController.deleteItemFromListUser)

app.get("/getMovie/:id",UserController.userMovieList)



app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  } 
  
  console.log("Server OK");
});
