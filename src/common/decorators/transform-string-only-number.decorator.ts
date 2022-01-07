import { Transform } from 'class-transformer';

export const TransformStringOnlyNumber = () => {
  return Transform(({ value }) => {
    if (value) return value.replace(/[^0-9]+/g, '');
    return value;
  });
};
