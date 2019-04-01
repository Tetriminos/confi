import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { User, getUserRepository } from '../entity/User';
import { JWT_SECRET } from '../config';

export default class AuthController {
  static login = async (req: Request, res: Response) => {
    // check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    // get user from db
    const userRepository = getUserRepository();
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(404).send();
      return;
    }

    // check password
    if (!await user.isNonEncryptedPasswordValid(password)) {
      res.status(401).send();
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.send(token);
  };
}
