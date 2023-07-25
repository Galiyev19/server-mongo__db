import { body } from "express-validator";

export const registerValidation = [
  body("username","").isLength({min:3}),
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("avartarUrl").optional().isURL(),
  body("movieList").optional().isObject()
];
