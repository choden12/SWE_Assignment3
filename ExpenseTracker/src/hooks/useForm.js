// This is custom hook for form handling and validation
import { useState } from 'react';

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // It handles input change
  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
    // It will clear the error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  // It Mark field as touched
  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
  };
  
  // It validates form against rules
  const validate = (rules) => {
    const newErrors = {};
    
    for (const field in rules) {
      const fieldRules = rules[field];
      const value = values[field];
      
      // It Required validation
      if (fieldRules.required && (!value || String(value).trim() === '')) {
        newErrors[field] = `${field} is required`;
        continue;
      }
      
      // It Min length validation
      if (fieldRules.minLength && value && String(value).length < fieldRules.minLength) {
        newErrors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      }
      
      // For Max length validation
      if (fieldRules.maxLength && value && String(value).length > fieldRules.maxLength) {
        newErrors[field] = `${field} must be less than ${fieldRules.maxLength} characters`;
      }
      
      // For Min value validation (for numbers)
      if (fieldRules.min && value && parseFloat(value) < fieldRules.min) {
        newErrors[field] = `${field} must be greater than ${fieldRules.min}`;
      }
      
      // For Max value validation (for numbers)
      if (fieldRules.max && value && parseFloat(value) > fieldRules.max) {
        newErrors[field] = `${field} must be less than ${fieldRules.max}`;
      }
      
      // For Email validation
      if (fieldRules.isEmail && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = `Invalid email format`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // It resets form to initial values
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