export const genRandomString = (): string => {
  return Math.random().toString(36).slice(2, 7);
};
