# React Context Patterns

This document provides examples of common React Context patterns for different use cases.

## Basic Context Pattern

This is the basic pattern for creating and using a React Context:

```tsx
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

// 1. Define the context interface
interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

// 2. Create the context
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Create the provider component
export function MyContextProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState('');
  
  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);
  
  // Memoize the context value
  const contextValue = useMemo(() => ({
    value,
    setValue: handleSetValue
  }), [value, handleSetValue]);
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

// 4. Create the hook for consuming the context
export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
}
```

## Theme Context Pattern

A common use case for React Context is to manage theme preferences:

```tsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

// Define the theme modes
type ThemeMode = 'light' | 'dark' | 'system';

// Define the context interface
interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Effect to apply the theme
  useEffect(() => {
    // Apply theme logic here
    // ...
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      setIsDarkMode(theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);
  
  // Memoize the context value
  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    isDarkMode
  }), [theme, isDarkMode]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Create the hook for consuming the context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## Form Context Pattern

For complex forms, React Context can be useful for managing form state:

```tsx
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

// Define the form values interface
interface FormValues {
  name: string;
  email: string;
  message: string;
  [key: string]: string;
}

// Define the context interface
interface FormContextType {
  values: FormValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isValid: boolean;
}

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Define the provider props
interface FormProviderProps {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => void | Promise<void>;
  validate?: (values: FormValues) => Record<string, string>;
  children: ReactNode;
}

// Create the provider component
export function FormProvider({ initialValues, onSubmit, validate, children }: FormProviderProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Compute if the form is valid
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  
  // Validate the form values
  const validateForm = useCallback(() => {
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  }, [values, validate]);
  
  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  // Handle input blur events
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    const isFormValid = validateForm();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);
  
  // Memoize the context value
  const contextValue = useMemo(() => ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid
  }), [values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid]);
  
  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

// Create the hook for consuming the context
export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
```

## Translation Context Pattern

For internationalization, React Context can manage language preferences and translations:

```tsx
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

// Define the available languages
type Language = 'en' | 'fr' | 'es' | 'de';

// Define the translations interface
interface Translations {
  [key: string]: {
    [language in Language]: string;
  };
}

// Define the context interface
interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLanguages: Language[];
}

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Define the provider props
interface I18nProviderProps {
  initialLanguage?: Language;
  translations: Translations;
  children: ReactNode;
}

// Create the provider component
export function I18nProvider({ initialLanguage = 'en', translations, children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  
  // Available languages
  const availableLanguages = useMemo<Language[]>(() => {
    return ['en', 'fr', 'es', 'de'];
  }, []);
  
  // Translation function
  const t = useCallback((key: string, params?: Record<string, string>) => {
    const translation = translations[key]?.[language] || key;
    
    if (!params) return translation;
    
    // Replace parameters in the translation
    return Object.entries(params).reduce(
      (result, [param, value]) => result.replace(`{{${param}}}`, value),
      translation
    );
  }, [language, translations]);
  
  // Memoize the context value
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    availableLanguages
  }), [language, t, availableLanguages]);
  
  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

// Create the hook for consuming the context
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
```

## Feature Flag Context Pattern

For feature flags, React Context can manage feature availability:

```tsx
import React, { createContext, useContext, useMemo, ReactNode } from 'react';

// Define the feature flags interface
interface FeatureFlags {
  [key: string]: boolean;
}

// Define the context interface
interface FeatureFlagContextType {
  isEnabled: (featureName: string) => boolean;
  features: FeatureFlags;
}

// Create the context
const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Define the provider props
interface FeatureFlagProviderProps {
  features: FeatureFlags;
  children: ReactNode;
}

// Create the provider component
export function FeatureFlagProvider({ features, children }: FeatureFlagProviderProps) {
  // Check if a feature is enabled
  const isEnabled = (featureName: string) => {
    return !!features[featureName];
  };
  
  // Memoize the context value
  const contextValue = useMemo(() => ({
    isEnabled,
    features
  }), [features]);
  
  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// Create the hook for consuming the context
export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}

// Conditional rendering component
export function Feature({ name, fallback = null, children }: { name: string; fallback?: ReactNode; children: ReactNode }) {
  const { isEnabled } = useFeatureFlags();
  
  if (!isEnabled(name)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
```