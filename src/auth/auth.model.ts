export type AuthModel = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  refreshToken: {
    id: string;
    expiresIn: number;
    userId: string;
    createdAt: string;
  };
};
