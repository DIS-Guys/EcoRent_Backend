import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { UserService } from '../services/UserService';

export const createUser = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  try {
    await UserService.createUser(name, surname, email, password);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'BAD_REQUEST') {
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });
    }
    console.error('createUser error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await UserService.authenticateUser(email, password);

    res.json({ token, message: 'Login successful.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (error instanceof Error && error.message === 'BAD_REQUEST') {
      return res.status(400).json({ message: 'Invalid password.' });
    }
    console.error('authenticateUser error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user.id;

  try {
    const user = await UserService.getUser(id);

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('getUser error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user.id;
  const updates = req.body;

  try {
    const updatedUser = await UserService.updateUser(id, updates);

    res.status(200).json({ message: 'User data updated.', updatedUser });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('updateUser error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    await UserService.changePassword(id, oldPassword, newPassword);

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (error instanceof Error && error.message === 'BAD_REQUEST') {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }
    console.error('changePassword error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user.id;

  try {
    await UserService.deleteUser(id);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('deleteUser error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
