import { Transform } from 'class-transformer';

export const TransformStringCleanSpecialChar = () => {
  return Transform(({ value }) => {
    if (value) return value.replace(/[^\w\s]/gi, '');
    return value;
  });
};
