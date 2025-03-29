# Component Refactoring Strategies

This document outlines the strategies we'll use to refactor oversized components in accordance with our architecture principles (PHAR-291).

## Size Limitations

- Components: Maximum 200 lines
- Functions: Maximum 30 lines

## Refactoring Strategies

### 1. Functional Decomposition

**Description:**  
Break down a component based on its functional responsibilities.

**When to use:**  
- Component has clearly separable functional parts
- Different sections of the component serve different purposes
- UI can be logically segmented by functionality

**Example:**
```tsx
// Before: Large monolithic component
function ProductDetail({ product }) {
  // 300+ lines of code with mixed responsibilities
  
  return (
    <div>
      <ProductHeader product={product} />
      <ProductGallery images={product.images} />
      <ProductDescription description={product.description} />
      <ProductPricing pricing={product.pricing} />
      <ProductReviews reviews={product.reviews} />
      <ProductRecommendations productId={product.id} />
    </div>
  );
}

// After: Decomposed into smaller components
function ProductDetail({ product }) {
  // Much less code, delegating to specialized components
  
  return (
    <div>
      <ProductHeader product={product} />
      <ProductGallery images={product.images} />
      <ProductDescription description={product.description} />
      <ProductPricing pricing={product.pricing} />
      <ProductReviews reviews={product.reviews} />
      <ProductRecommendations productId={product.id} />
    </div>
  );
}
```

### 2. Container/Presentation Pattern

**Description:**  
Separate data fetching and state management from UI rendering.

**When to use:**  
- Component mixes data fetching/state management with presentation
- Same UI could be reused with different data sources
- Testing would be simplified by separating concerns

**Example:**
```tsx
// Before: Mixed concerns
function UserProfile({ userId }) {
  // Data fetching logic
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [userId]);
  
  // UI rendering mixed with data logic
  if (loading) return <Loading />;
  if (!user) return <NotFound />;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* More complex UI rendering */}
    </div>
  );
}

// After: Separated concerns
// Container component
function UserProfileContainer({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!user) return <NotFound />;
  
  return <UserProfilePresentation user={user} />;
}

// Presentation component
function UserProfilePresentation({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* More complex UI rendering */}
    </div>
  );
}

// Custom hook for data fetching
function useUser(userId) {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setState({ user: data, loading: false, error: null });
      })
      .catch(error => {
        setState({ user: null, loading: false, error: error.message });
      });
  }, [userId]);
  
  return state;
}
```

### 3. Custom Hook Extraction

**Description:**  
Extract complex logic, state management, and side effects into custom hooks.

**When to use:**  
- Component has complex state management logic
- Logic could potentially be reused
- Side effects are complex and would benefit from isolation

**Example:**
```tsx
// Before: Logic embedded in component
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  
  // Complex cart logic
  const addItem = (product) => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      setItems(items.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }
  };
  
  const removeItem = (productId) => {
    setItems(items.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    setItems(items.map(item => 
      item.id === productId 
        ? { ...item, quantity } 
        : item
    ));
  };
  
  // Calculate total whenever items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);
  
  return (
    <div>
      {/* Cart UI */}
    </div>
  );
}

// After: Logic extracted to custom hook
function useShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  
  const addItem = (product) => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      setItems(items.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }
  };
  
  const removeItem = (productId) => {
    setItems(items.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    setItems(items.map(item => 
      item.id === productId 
        ? { ...item, quantity } 
        : item
    ));
  };
  
  // Calculate total whenever items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);
  
  return { items, total, addItem, removeItem, updateQuantity };
}

function ShoppingCart() {
  const { items, total, addItem, removeItem, updateQuantity } = useShoppingCart();
  
  return (
    <div>
      {/* Cart UI using hook values and functions */}
    </div>
  );
}
```

### 4. UI Pattern Decomposition

**Description:**  
Extract reusable UI patterns into separate components.

**When to use:**  
- UI patterns repeat across the component or application
- Visual elements follow a consistent pattern
- UI structure would benefit from componentization

**Example:**
```tsx
// Before: Repeated UI patterns
function ProductList({ products }) {
  return (
    <div className="grid">
      {products.map(product => (
        <div key={product.id} className="card">
          <div className="card-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="card-content">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="card-price">${product.price}</div>
            <div className="card-actions">
              <button className="btn primary">Add to Cart</button>
              <button className="btn secondary">View Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// After: Extracted UI components
function ProductList({ products }) {
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="card">
      <CardImage src={product.image} alt={product.name} />
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <CardPrice value={product.price} />
        <CardActions>
          <Button variant="primary">Add to Cart</Button>
          <Button variant="secondary">View Details</Button>
        </CardActions>
      </CardContent>
    </div>
  );
}
```

### 5. State Management Splitting

**Description:**  
Split large state stores into domain-specific stores.

**When to use:**  
- Store manages multiple domains or concerns
- Different parts of the state are used by different components
- State updates would be more efficient if separated

**Example:**
```tsx
// Before: Monolithic store
// userStore.ts
import { create } from 'zustand';

interface UserState {
  // User profile
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // User preferences
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  
  // User shopping cart
  cart: CartItem[];
  cartTotal: number;
  
  // User orders
  orders: Order[];
  orderHistory: OrderHistory;
  
  // Actions for all the above domains
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  fetchOrders: () => Promise<void>;
  // Many more actions...
}

export const useUserStore = create<UserState>((set, get) => ({
  // Implementations of all state and actions
}));

// After: Split into domain-specific stores
// userProfileStore.ts
export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,
  
  fetchProfile: async () => {
    // Implementation
  },
  
  updateProfile: async (data) => {
    // Implementation
  }
}));

// userPreferencesStore.ts
export const useUserPreferencesStore = create<UserPreferencesState>((set) => ({
  theme: 'light',
  language: 'en',
  notifications: defaultNotificationSettings,
  
  setTheme: (theme) => {
    // Implementation
  },
  
  setLanguage: (language) => {
    // Implementation
  },
  
  updateNotifications: (settings) => {
    // Implementation
  }
}));

// shoppingCartStore.ts
export const useShoppingCartStore = create<ShoppingCartState>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product) => {
    // Implementation
  },
  
  removeItem: (productId) => {
    // Implementation
  },
  
  updateQuantity: (productId, quantity) => {
    // Implementation
  }
}));

// orderStore.ts
export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  orderHistory: {},
  
  fetchOrders: async () => {
    // Implementation
  }
}));
```

## Implementation Process

### Step 1: Analyze Component

- Review component code to understand its structure and responsibilities
- Identify logical sections or functional areas
- Look for repeated patterns or UI elements
- Note any complex logic that could be extracted

### Step 2: Plan Refactoring Approach

- Select appropriate refactoring strategy or combination of strategies
- Sketch out the target component structure
- Identify which parts will be extracted into new components

### Step 3: Create New Components

- Start with the smallest, most isolated parts
- Build up to higher-level components
- Ensure proper prop interfaces for each component

### Step 4: Update Tests

- Adjust existing tests to match new component structure
- Add tests for new components
- Verify that all functionality is covered

### Step 5: Verify Functionality

- Ensure the refactored components maintain all original functionality
- Check for any edge cases or regressions
- Validate that the application works correctly with the changes

## Common Pitfalls to Avoid

1. **Prop Drilling:**
   - Avoid passing props through multiple layers of components
   - Consider context or state management for deeply nested data

2. **Over-Componentization:**
   - Don't create components that are too small or have no clear purpose
   - Each component should have a meaningful, well-defined responsibility

3. **Incomplete Refactoring:**
   - Ensure all related functionality is moved when extracting components
   - Update all references to maintain consistency

4. **Premature Optimization:**
   - Focus on separation of concerns first, then optimize performance
   - Use React.memo or useMemo only when performance issues are identified

5. **Unclear Interfaces:**
   - Define clear prop interfaces for each component
   - Document component purpose and usage
