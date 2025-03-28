# Task 12: Apply Component Size Limitations

## Description
Apply the component size limitations principle across the core modules, ensuring that no component exceeds 200 lines and that functions stay within the 20-30 line limit.

## Implementation Steps

1. **Component Size Audit**
   - Use tools to identify components exceeding 200 lines
   - Identify functions exceeding 30 lines
   - Prioritize components based on size and complexity
   - Create a list of components that need refactoring

2. **Refactoring Strategy for Large Components**
   - Identify logical boundaries for splitting components
   - Extract reusable sub-components
   - Apply the single responsibility principle
   - Use component composition to maintain functionality

3. **Refactoring Strategy for Large Functions**
   - Identify logical boundaries for splitting functions
   - Extract helper functions
   - Apply the single responsibility principle
   - Ensure proper error handling in split functions

4. **Component Decomposition Techniques**
   - Apply functional decomposition (by responsibility)
   - Apply UI pattern decomposition (by UI element)
   - Apply container/presentation separation
   - Extract custom hooks for logic

5. **Documentation Update**
   - Update component documentation
   - Document the refactoring process
   - Update README.md files

6. **Test Coverage Maintenance**
   - Ensure tests are updated for refactored components
   - Maintain or improve test coverage
   - Add tests for new components

## Refactoring Examples

### Before: Large Form Component

```typescript
// Before: 250+ lines
import React, { useState } from 'react';

export const ProductForm = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [category, setCategory] = useState(initialData?.category || '');
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [images, setImages] = useState(initialData?.images || []);
  const [errors, setErrors] = useState({});
  
  // Validation functions
  const validateName = () => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };
  
  // Many more validation functions...
  
  // Image handling functions
  const handleImageUpload = (event) => {
    // Complex image handling logic
    // ...
  };
  
  // More image handling functions...
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extensive validation
    // ...
    
    // Data processing
    // ...
    
    onSubmit({
      name,
      description,
      price,
      category,
      stock,
      images,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Extensive form fields */}
      {/* ... */}
    </form>
  );
};
```

### After: Decomposed Components

```typescript
// After: ProductForm.tsx (~100 lines)
import React, { useState } from 'react';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductPricing } from './ProductPricing';
import { ProductInventory } from './ProductInventory';
import { ProductImages } from './ProductImages';
import { useProductFormValidation } from '../hooks/useProductFormValidation';

export const ProductForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    stock: initialData?.stock || 0,
    images: initialData?.images || [],
  });
  
  const { errors, validateForm } = useProductFormValidation(formData);
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <ProductBasicInfo
        name={formData.name}
        description={formData.description}
        category={formData.category}
        onChange={updateFormData}
        errors={errors}
      />
      
      <ProductPricing
        price={formData.price}
        onChange={updateFormData}
        errors={errors}
      />
      
      <ProductInventory
        stock={formData.stock}
        onChange={updateFormData}
        errors={errors}
      />
      
      <ProductImages
        images={formData.images}
        onChange={updateFormData}
        errors={errors}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

```typescript
// ProductBasicInfo.tsx (~70 lines)
import React from 'react';

export const ProductBasicInfo = ({ name, description, category, onChange, errors }) => {
  return (
    <div className="product-basic-info">
      <h3>Basic Information</h3>
      
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          onBlur={() => validateName(name, onChange)}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      
      {/* More fields */}
    </div>
  );
};
```

## Verification Criteria
- No component exceeds 200 lines
- No function exceeds 30 lines
- Components follow the single responsibility principle
- Component composition used effectively
- Proper error handling maintained
- Test coverage maintained or improved

## Time Estimate
Approximately 3-4 days

## Dependencies
- Tasks 06-08: Refactoring of core components

## Risks
- May introduce bugs during refactoring
- May affect component functionality if not carefully decomposed
- May require significant changes to tests
