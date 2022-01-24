import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      refreshToken?: {
        id: string;
        expiresIn: number;
        userId: string;
        createdAt: string;
      };
    }
  }
}
