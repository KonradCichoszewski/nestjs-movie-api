import { isArray } from 'class-validator';

export const sanitizeGenreNames = ({ value }) => {
  // If value is not an array, return original value
  if (!isArray(value)) return value;

  // If any element is a non-string value, return original value
  if (value.some((name) => typeof name !== 'string')) return value;

  // Trim and lowercase all elements
  return value.map((name) => name.trim().toLowerCase());
};
