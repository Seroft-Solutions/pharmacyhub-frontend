# Exam Sidebar Component

A comprehensive sidebar component for the Pharmacy Hub exam preparation features. This component provides navigation for past papers, model papers, subject papers, and practice exams.

## Features

- **Responsive Design**: Automatically adapts between desktop and mobile views
- **Collapsible Sidebar**: Supports different collapsible modes (icon, offcanvas, none)
- **RBAC Integration**: Filters menu items based on user permissions and roles
- **Nested Navigation**: Supports multi-level menu items with expandable sections
- **Badges**: Display badges next to menu items (e.g., for "New" features)
- **Color Coding**: Assign different colors to different exam categories
- **Customizable**: Highly customizable through props and theming

## Usage

### Basic Usage

```tsx
import { ExamSidebar } from '@/features/exams/ui/components/sidebar';

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ExamSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
```

### Custom Menu Items

You can customize the menu items by passing your own array:

```tsx
import { ExamSidebar } from '@/features/exams/ui/components/sidebar';
import { FileText, Medal, BookOpen } from 'lucide-react';
import { ExamMenuItemType } from '@/features/exams/ui/components/sidebar/types';

const customMenuItems: ExamMenuItemType[] = [
  {
    id: "custom-item",
    label: "Custom Category",
    href: "/exam/custom",
    icon: FileText,
    type: 'main',
    roles: ['USER'],
    color: "purple",
    subItems: [
      {
        id: "sub-item-1",
        label: "Sub Item 1",
        href: "/exam/custom/sub1",
        icon: Medal,
        type: 'submenu',
        permissions: ['view_custom']
      },
      {
        id: "sub-item-2",
        label: "Sub Item 2",
        href: "/exam/custom/sub2",
        icon: BookOpen,
        type: 'submenu',
        permissions: ['view_custom']
      }
    ]
  }
];

export default function CustomExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ExamSidebar items={customMenuItems} />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
```

### Customizing Appearance

You can customize the appearance of the sidebar:

```tsx
<ExamSidebar
  collapsible="icon"     // 'icon', 'offcanvas', or 'none'
  variant="sidebar"      // 'sidebar', 'floating', or 'inset'
  side="left"            // 'left' or 'right'
  className="custom-bg"  // Additional classes
/>
```

## Menu Item Types

The sidebar uses the following types:

```typescript
// Represents an individual menu item
interface ExamMenuItemType {
  id: string;              // Unique identifier
  label: string;           // Display label
  href: string;            // URL to navigate to
  icon: LucideIcon;        // Lucide icon component
  type: 'main' | 'submenu'; // Item type
  permissions?: string[];  // Required permissions
  roles?: string[];        // Required roles
  subItems?: ExamMenuItemType[]; // Child items for nested navigation
  badge?: string | number; // Optional badge (e.g., "New")
  color?: string;          // Optional color (e.g., "blue", "green")
}
```

## Integration with RBAC

The sidebar is integrated with the application's Role-Based Access Control (RBAC) system. It will automatically filter menu items based on the user's permissions and roles.

## Responsive Behavior

- On desktop: The sidebar renders as a full sidebar with collapsible options
- On mobile: The sidebar renders as a Sheet component that can be toggled open/closed

## Demo

A full demo implementation is available in `ExamSidebarDemo.tsx` which shows how to use the sidebar in a complete layout with header and content.

## Future Enhancements

Potential enhancements for this component:

1. Add theme customization options
2. Support for more badge styles and positions
3. Add animation options for expanding/collapsing
4. Support for right-click context menus
5. Drag-and-drop reordering of items
