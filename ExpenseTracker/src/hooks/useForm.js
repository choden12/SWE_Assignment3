// Custom hook for form handling and validation
import { useState } from 'react';

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Handle input change
  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  // Mark field as touched
  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
  };
  
  // Validate form against rules
  const validate = (rules) => {
    const newErrors = {};
    
    for (const field in rules) {
      const fieldRules = rules[field];
      const value = values[field];
      
      // Required validation
      if (fieldRules.required && (!value || String(value).trim() === '')) {
        newErrors[field] = `${field} is required`;
        continue;
      }
      
      // Min length validation
      if (fieldRules.minLength && value && String(value).length < fieldRules.minLength) {
        newErrors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      }
      
      // Max length validation
      if (fieldRules.maxLength && value && String(value).length > fieldRules.maxLength) {
        newErrors[field] = `${field} must be less than ${fieldRules.maxLength} characters`;
      }
      
      // Min value validation (for numbers)
      if (fieldRules.min && value && parseFloat(value) < fieldRules.min) {
        newErrors[field] = `${field} must be greater than ${fieldRules.min}`;
      }
      
      // Max value validation (for numbers)
      if (fieldRules.max && value && parseFloat(value) > fieldRules.max) {
        newErrors[field] = `${field} must be less than ${fieldRules.max}`;
      }
      
      // Email validation
      if (fieldRules.isEmail && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = `Invalid email format`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    resetForm,
    setValues
  };
};