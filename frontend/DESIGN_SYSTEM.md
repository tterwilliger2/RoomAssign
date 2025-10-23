# Design System Documentation

## Overview

This document describes the shadcn/ui implementation for the Room Wizard application, providing a polished, consistent, and responsive interface that follows modern design best practices.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Icon library
- **class-variance-authority** - Variant management
- **tailwind-merge** - Utility class merging

## Design Principles

### 1. Consistency
- Unified color palette using CSS variables
- Consistent spacing and typography
- Standardized component patterns across all pages

### 2. Accessibility
- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Focus states on interactive elements

### 3. Responsiveness
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- Flexible layouts using CSS Grid and Flexbox
- Touch-friendly interactive elements

### 4. Visual Hierarchy
- Clear heading structure
- Strategic use of color and contrast
- Visual feedback for interactive states
- Progressive disclosure of information

## Color System

The application uses a comprehensive color system defined in CSS variables:

```css
--primary: 330 81% 51% (Pink/Magenta)
--secondary: 240 4.8% 95.9% (Light Gray)
--destructive: 0 84.2% 60.2% (Red)
--muted: 240 4.8% 95.9% (Subtle Gray)
```

### Brand Colors
- Primary gradient: Pink (#e91e63) to Purple (#8b5cf6)
- Background: Subtle gradient from pink-50 → purple-50 → indigo-50
- Accents: Used strategically to draw attention

## Component Library

### Core Components

1. **Button** (`/components/ui/button.tsx`)
   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon
   - Usage: All CTAs, navigation, form submissions

2. **Input** (`/components/ui/input.tsx`)
   - Consistent styling with focus states
   - File inputs with custom styling
   - Number inputs for configuration

3. **Card** (`/components/ui/card.tsx`)
   - Modular structure: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
   - Shadow and backdrop blur for depth
   - Usage: Content containers, info panels

4. **Label** (`/components/ui/label.tsx`)
   - Form field labels
   - Accessibility-focused

5. **Checkbox** (`/components/ui/checkbox.tsx`)
   - Custom styled with Lucide icons
   - Keyboard accessible

6. **Alert** (`/components/ui/alert.tsx`)
   - Variants: default, destructive, success
   - Used for feedback messages

7. **Badge** (`/components/ui/badge.tsx`)
   - Variants: default, secondary, destructive, outline
   - Usage: Status indicators, member chips

### Layout Component

**Layout** (`/components/Layout.tsx`)
- Consistent header with navigation
- Responsive navigation (desktop/mobile)
- Sticky header with backdrop blur
- Footer with copyright information
- Gradient background

## Page Implementations

### 1. Sign In Page (`/pages/SignIn.tsx`)
**Features:**
- Centered card layout
- Branded logo with gradient
- Form validation
- Error handling with Alert component
- Loading states
- Demo credentials display

**Responsive:**
- Full-width on mobile
- Max-width card on desktop
- Proper padding on all devices

### 2. Upload Page (`/pages/Upload.tsx`)
**Features:**
- Drag-and-drop file upload zone
- File preview
- Success feedback with Alert
- Sample data download card
- Icon-based visual communication

**Responsive:**
- Single column on mobile
- Optimized touch targets
- Responsive card layouts

### 3. Setup Page (`/pages/Setup.tsx`)
**Features:**
- Statistics cards showing total rooms, beds, and budget
- Grid layout for room configuration
- Checkbox with conditional budget input
- Badge indicators showing bed counts
- Clear visual hierarchy

**Responsive:**
- 1 column on mobile
- 3 columns for stats on tablet+
- Flexible room configuration grid

### 4. Run Page (`/pages/Run.tsx`)
**Features:**
- Visual feedback during optimization
- Animated states (ready, running, complete)
- Results display with icon-based cards
- Success alert
- Clear CTA to view blueprint

**Responsive:**
- Centered layout on all devices
- Responsive result cards
- Touch-friendly buttons

### 5. Blueprint Page (`/pages/Blueprint.tsx`)
**Features:**
- Drag-and-drop room assignment editor
- Color-coded capacity indicators
- Sticky staging zone on desktop
- Over-capacity warnings
- Real-time statistics
- Improved visual feedback for drag operations

**Responsive:**
- Single column on mobile
- 2 columns on tablet
- 3 columns + sidebar on desktop
- Staging zone becomes sticky on larger screens

### 6. Export Page (`/pages/ExportPage.tsx`)
**Features:**
- Clear export options
- Visual cards for PDF and CSV
- Informational tip card
- Consistent with overall design

**Responsive:**
- Single column on mobile
- 2 columns on tablet+

## Design Patterns

### Navigation Pattern
- Persistent header navigation
- Active state indication
- Icon + text on desktop
- Icon only on mobile collapsed state
- Smooth transitions

### Card Pattern
- Shadow + backdrop blur for depth
- Consistent padding (p-6)
- Clear header/content separation
- Hover effects for interactivity

### Form Pattern
- Label + Input pairing
- Error/success feedback below inputs
- Clear submit buttons
- Loading states

### Status Indication
- Badges for counts and statuses
- Alert components for messages
- Icon + text combinations
- Color-coded feedback

## Accessibility Features

1. **Semantic HTML**
   - Proper heading hierarchy (h1, h2, h3)
   - Form labels associated with inputs
   - Button types specified

2. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Focus visible on all focusable elements
   - Tab order follows visual flow

3. **Screen Reader Support**
   - ARIA labels where needed
   - Icon descriptions
   - Alert roles for notifications

4. **Color Contrast**
   - WCAG AA compliant
   - Multiple indicators (not just color)
   - Clear text on backgrounds

## Performance Optimizations

1. **Code Splitting**
   - Route-based code splitting
   - Lazy loading where appropriate

2. **CSS Optimizations**
   - Tailwind CSS purging unused styles
   - Critical CSS inlined
   - Backdrop blur for performance-friendly effects

3. **Image Optimization**
   - Icon sprites via Lucide React
   - SVG icons for scalability

## Future Enhancements

1. **Dark Mode**
   - Already configured in CSS variables
   - Theme toggle component needed
   - Persistent preference storage

2. **Animation**
   - Page transitions
   - Micro-interactions
   - Loading skeletons

3. **Advanced Components**
   - Toast notifications
   - Dialog/Modal system
   - Dropdown menus
   - Tooltips

4. **Accessibility**
   - Full keyboard navigation testing
   - Screen reader testing
   - Focus trap for modals

## Maintenance Guidelines

1. **Adding New Components**
   - Follow shadcn/ui patterns
   - Use consistent naming
   - Include TypeScript types
   - Document props and usage

2. **Styling Conventions**
   - Use Tailwind utilities first
   - CSS variables for theming
   - cn() utility for conditional classes
   - Component variants via CVA

3. **Responsive Design**
   - Mobile-first approach
   - Test on multiple screen sizes
   - Use Tailwind breakpoints consistently
   - Touch-friendly sizing (min 44x44px)

4. **Code Quality**
   - TypeScript strict mode
   - ESLint configuration
   - Prettier formatting
   - Component composition

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Accessibility](https://react.dev/learn/accessibility)
