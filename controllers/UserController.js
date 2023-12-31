import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import UserModel from "../models/User.js";
import { json } from "express";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      userName: req.body.username,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Не удалость зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {

    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Wrong login or password",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Wrong login or password",
      });
    }

    console.log(user)
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Нет доступа ",
    });
  }
};


export const addUserItemMovieList = async (req,res) => {
  try{
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(
      {
        _id: userId
      },
      {
      $push: {
        movieList: req.body.body
      }
    },
    {
      returnDocument: "after"
    });

    if(!user){
      return res.status(404).json({
        message: "User not found"
      })
    }

    console.log(req.body.body);

    res.json(user);
    // console.log(user);
  }catch(e){
    console.log(e)
    return res.status(500).json({
      message: "Failed to add item"
    })
  }
}

export const deleteItemFromListUser = async (req,res) => {
  try{
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate({_id: userId},{
      $pull: { movieList: {  id: req.body.body}}
    })

    if(!user){
      return res.json({
        message: "User not found"
      })
    }

    // console.log(req.body.body)
    res.json({
      success: true
    })
  }catch(e){
    return res.status(500).json({
      message: "Failed to delete item"
    })
  }
}

export const userMovieList = async (req,res) => {
  try{
    const userId = req.params.id;
    const user = await UserModel.findById({_id: userId});

    if(!user){
      return res.json({
        message: "User not found"
      })
    }
    
    res.json(user.movieList)

  }catch(error){
    return res.status(500).json({
      message: "Movie not found"
    })
  }
}


export const UploadUserImage = async (req,res) => {
  try{
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate({_id: userId},{
      avatarUrl: req.file.originalname
    })

    console.log(req.file)

    if(!user){
      return res.json({
        message: "User not found"
      })
    }

    res.json({
      success: true
    })
  }catch(error){
    return res.status(500).json({
      message: "Failed to upload image"
    })
  }
}