import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Device from '../models/Device';

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

export const getUser = async (req: Request, res: Response) => {
  const id = (req as any).user.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = (req as any).user.id;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = (req as any).user.id;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    await Device.deleteMany({ ownerId: id });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
      process.env.JWT_SECRET as string,
      { expiresIn: '2 days' }
    );

    res.json({ token, message: 'Успішний вхід' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error });
  }
};