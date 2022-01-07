import { Transform } from 'class-transformer';

export const TransformStringLowerCase = () => {
  return Transform(({ value }) => {
    if (value) return value.toLowerCase();
    return value;
  });
};
