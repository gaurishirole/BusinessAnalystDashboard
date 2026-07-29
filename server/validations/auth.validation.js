// Validation rules stub
export const validateLoginInput = (email, password) => {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }
  return { valid: true };
};
