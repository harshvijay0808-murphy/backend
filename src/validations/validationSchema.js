export const emailSchema = {
  required: 'Email is required',
  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
};

export const passwordSchema = {
  required: 'Password is required',
  minLength: {
    value: 10,
    message: 'Password must be at least 10 characters'
  },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    message: 'Password must contain at least one uppercase letter and one special character'
  }
};

export const confirmPasswordSchema = {
  required: 'confirm Password is required',
  minLength: {
    value: 10,
    message: ' confirm Password must be at least 10 characters'
  },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    message: 'confirm Password must contain at least one uppercase letter and one special character'
  }
};

export const firstNameSchema = {
  required: 'First name is required',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid first name' }
};

export const lastNameSchema = {
  required: 'Last name is required',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid last name' }
};
export const mobileNumberSchema = {
  required: 'Mobile number is required',
  pattern: { value: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' }
};
// export const mobileNumberSchema = {
//   required: 'Mobile number is required',
//   pattern: {
//     value: /^\+?[0-9]{7,15}$/,
//     message: 'Enter a valid mobile number (7–15 digits, optional +)'
//   }
// };