export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
};
