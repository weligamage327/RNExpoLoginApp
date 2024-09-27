import { useState } from 'react';

interface Errors {
  email: string;
  password: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Errors>({ email: '', password: '' });

  const validate = (email: string, password: string): boolean => {
    let valid = true;
    const validationErrors: Errors = { email: '', password: '' };

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      validationErrors.email = 'Email is required.';
      valid = false;
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    // Validate password
    if (!password) {
      validationErrors.password = 'Password is required.';
      valid = false;
    } else if (password.length <= 3) {
      validationErrors.password = 'Password must be more than 3 characters.';
      valid = false;
    }

    // Set the errors state
    setErrors(validationErrors);

    return valid;
  };

  return { errors, validate };
};
