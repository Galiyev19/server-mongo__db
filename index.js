import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import cors from 'cors'
import multer from "multer";
import * as dotenv from 'dotenv'
import connectDB from "./mongodb/connect.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import User from "./models/User.js";

const app = express();

dotenv.config()
app.use(express.json());

app.use(cors())
mongoose.set('strictQuery', true)
.connect(process.env.MONGODB_URL)
.then(() => console.log("Connect DB"))
.catch((err) => console.log(err));


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


app.get('/',(req,res) => {
  res.send({message: "HELLO"})
})

app.post("/sign-in", UserController.login);
app.post("/sign-up", registerValidation, UserController.register);
app.get("/user-movie-list/:id",UserController.userMovieList)

app.post("/upload/:id", upload.single('image'),UserController.UploadUserImage )

app.get("/auth/me", checkAuth, UserController.getUser);
app.patch("/user/:id",  UserController.addUserItemMovieList);
app.patch("/deleteMovie/:id", UserController.deleteItemFromListUser)

app.get("/getMovie/:id",UserController.userMovieList)


const PORT = process.env.PORT

const startServer = async () => {
  try{
    connectDB(process.env.MONGODB_URL)
    app.listen(PORT, () => { console.log("Server started " + PORT);});

  }catch(error){
    console.log(error)
  }
}

startServer()
