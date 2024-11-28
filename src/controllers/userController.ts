import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Користувач із таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'Користувача зареєстровано успішно' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error });
  }
};

export const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, surname: user.surname },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Успішний вхід' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error });
  }
};
