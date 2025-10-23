# Component Usage Guide

Quick reference for using shadcn/ui components in the Room Wizard application.

## Import Pattern

All components use the `@/` alias for imports:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Layout } from '@/components/Layout'
```

## Button

### Variants
```tsx
// Primary (default)
<Button>Click me</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Link
<Button variant="link">Link</Button>
```

### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### With Icons (Lucide React)
```tsx
import { Upload } from 'lucide-react'

<Button>
  <Upload className="mr-2 h-4 w-4" />
  Upload File
</Button>
```

### States
```tsx
// Loading
<Button disabled>Loading...</Button>

// Full width
<Button className="w-full">Full Width</Button>
```

## Input

### Basic Input
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

### Number Input
```tsx
<Input
  type="number"
  min="0"
  value={count}
  onChange={(e) => setCount(Number(e.target.value))}
/>
```

### File Input
```tsx
<Input
  type="file"
  accept=".csv"
  onChange={(e) => setFile(e.target.files?.[0] || null)}
/>
```

## Card

### Basic Card
```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Card with Icon
```tsx
import { Settings } from 'lucide-react'

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Settings className="h-5 w-5 text-primary" />
      Settings
    </CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Styled Card (glass effect)
```tsx
<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
  {/* content */}
</Card>
```

## Label

```tsx
import { Label } from '@/components/ui/label'

<Label htmlFor="input-id">Label Text</Label>

// With helper text
<div className="space-y-1">
  <Label htmlFor="input-id">Label Text</Label>
  <p className="text-sm text-muted-foreground">Helper text</p>
</div>
```

## Checkbox

```tsx
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

<div className="flex items-center gap-2">
  <Checkbox
    id="agree"
    checked={agreed}
    onChange={(e: any) => setAgreed(e.target.checked)}
  />
  <Label htmlFor="agree" className="cursor-pointer">
    I agree to the terms
  </Label>
</div>
```

## Alert

### Success Alert
```tsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'

<Alert variant="success">
  <CheckCircle2 className="h-4 w-4" />
  <AlertDescription>
    Operation completed successfully!
  </AlertDescription>
</Alert>
```

### Error Alert
```tsx
import { AlertCircle } from 'lucide-react'

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>
    {error}
  </AlertDescription>
</Alert>
```

### Info Alert
```tsx
<Alert>
  <AlertDescription>
    This is an informational message.
  </AlertDescription>
</Alert>
```

## Badge

### Variants
```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Usage Examples
```tsx
// Status indicator
<Badge variant="secondary">3/10</Badge>

// Count
<Badge>{count} items</Badge>

// Warning
<Badge variant="destructive">Over Capacity</Badge>
```

## Layout

Wrap your page content with the Layout component for consistent header/footer:

```tsx
import { Layout } from '@/components/Layout'

export function MyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Your page content */}
      </div>
    </Layout>
  )
}
```

The Layout provides:
- Sticky header with navigation
- Responsive nav menu
- Logout functionality
- Gradient background
- Footer

## Common Patterns

### Page Header
```tsx
<div>
  <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
  <p className="text-muted-foreground mt-2">
    Page description
  </p>
</div>
```

### Loading State
```tsx
const [loading, setLoading] = useState(false)

<Button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

### Form with Validation
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
  
  {error && (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}
  
  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

### Statistics Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card className="shadow-lg">
    <CardContent className="pt-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">Label</p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

### Responsive Grid
```tsx
// 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* card content */}
    </Card>
  ))}
</div>
```

### Icon + Text Button
```tsx
import { Upload } from 'lucide-react'

<Button>
  <Upload className="mr-2 h-4 w-4" />
  Upload File
</Button>
```

### Conditional Rendering with Animation
```tsx
{showContent && (
  <div className="animate-in fade-in slide-in-from-top-1">
    {/* content */}
  </div>
)}
```

## Utility Functions

### cn() - Class Name Utility
```tsx
import { cn } from '@/lib/utils'

// Merge and deduplicate classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  "other-class"
)}>
  Content
</div>
```

## Color Classes

### Text Colors
- `text-primary` - Brand pink
- `text-secondary` - Gray
- `text-muted-foreground` - Subtle text
- `text-destructive` - Red/error

### Background Colors
- `bg-primary` - Brand pink
- `bg-secondary` - Light gray
- `bg-muted` - Very light gray
- `bg-destructive` - Red

### Gradients
```tsx
// Brand gradient
<div className="bg-gradient-to-r from-pink-600 to-purple-600">
  
// Background gradient
<div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
```

## Icons (Lucide React)

Common icons used in the app:

```tsx
import {
  Upload,
  Download,
  Settings,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  DoorOpen,
  Users,
  Bed,
  FileImage,
  FileSpreadsheet,
  LogOut,
  LayoutDashboard,
  Trophy,
  Clock,
  GripVertical
} from 'lucide-react'

// Usage
<Upload className="h-4 w-4" />           // Small
<Upload className="h-5 w-5" />           // Medium
<Upload className="h-6 w-6" />           // Large
<Upload className="h-4 w-4 text-primary" /> // Colored
```

## Responsive Breakpoints

```tsx
// Tailwind breakpoints
sm:    // 640px+
md:    // 768px+
lg:    // 1024px+
xl:    // 1280px+
2xl:   // 1400px+

// Example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Best Practices

1. **Always use Layout** for consistent page structure
2. **Use semantic HTML** (proper heading hierarchy)
3. **Include icons** for visual clarity
4. **Show loading states** during async operations
5. **Provide feedback** with Alerts for success/error
6. **Make it responsive** - test on mobile
7. **Use consistent spacing** - gap-2, gap-4, gap-6
8. **Leverage variants** - don't create custom styles unnecessarily

## Common Mistakes to Avoid

❌ **Don't**
```tsx
// Custom button styles
<button className="bg-pink-500 text-white px-4 py-2 rounded">

// Inline styles
<div style={{ color: 'red' }}>

// Hardcoded colors
<div className="bg-[#e91e63]">
```

✅ **Do**
```tsx
// Use Button component
<Button>Click me</Button>

// Use Tailwind classes
<div className="text-destructive">

// Use design tokens
<div className="bg-primary">
```

## Questions?

Refer to:
- `/frontend/DESIGN_SYSTEM.md` - Full design system documentation
- `/SHADCN_IMPLEMENTATION.md` - Implementation details
- [shadcn/ui docs](https://ui.shadcn.com/) - Official documentation
