import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  // get token from the auth header
  let token = req.headers['authorization'] as string;

  if (!token) {
    res.status(401).send();
    return;
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  let jwtPayload;
  // validate token
  try {
    jwtPayload = jwt.verify(token, JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send();
    return;
  }

  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.setHeader('token', newToken);

  next();
};
