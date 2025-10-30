# Design System - Laundry POS Frontend

## Color Palette

### Primary Colors
- **Primary Blue:** `#008aff` - Main brand color, used for buttons, links, and primary actions
- **Secondary:** `#ffffff` (White) and `#000000` (Black) - Used for text and backgrounds
- **Tertiary Green:** `#17c100` - Used for success states, positive indicators, and completed actions

### Color Usage Guidelines

#### Primary Blue (#008aff)
- Call-to-action buttons
- Active links and navigation
- Primary form submit buttons
- Important highlights
- Icons that need emphasis

#### Secondary Colors
- **White (#ffffff):** 
  - Background color
  - Card backgrounds
  - Contrast text (when on dark backgrounds)
  
- **Black (#000000):**
  - Primary text color
  - Headings
  - Secondary information

#### Tertiary Green (#17c100)
- Success messages
- Completed order status
- Positive indicators
- Confirmation states
- "Delivered" status badges

## Typography
- **Font Family:** System default (or Material-UI default)
- **Primary Text:** Black (#000000)
- **Secondary Text:** Gray variants
- **Headings:** Bold, black

## Components Styling

### Buttons
- **Primary Button:** 
  - Background: #008aff
  - Text: White
  - Hover: Slightly darker blue
  
- **Success Button:**
  - Background: #17c100
  - Text: White
  - Used for positive actions

- **Secondary Button:**
  - Background: White
  - Border: #008aff
  - Text: #008aff

### Cards
- **Background:** White (#ffffff)
- **Border:** Light gray
- **Shadow:** Subtle elevation

### Status Badges
- **Received:** Blue (#008aff)
- **Washing:** Light blue
- **Ironing:** Yellow/Orange
- **Ready:** Purple
- **Delivered:** Green (#17c100)
- **Paid:** Green (#17c100)
- **Unpaid:** Red
- **Partially Paid:** Orange

### Navigation
- **Active Link:** #008aff
- **Hover State:** Lighter blue
- **Background:** White or light gray

## UI Components

### Dashboard Stats Cards
- Use gradient backgrounds with primary blue
- Include icons in white or primary blue
- Numbers in bold black

### Forms
- Input borders: Gray
- Focus border: #008aff
- Error states: Red
- Success states: #17c100

### Tables
- Header background: Light gray or white
- Row hover: Very light blue tint
- Borders: Light gray
- Active row: Light blue background

## Implementation

### Material-UI Theme
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#008aff',
    },
    secondary: {
      main: '#17c100',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
});
```

## Accessibility
- Ensure sufficient contrast ratios
- Provide alternative text for icons
- Support keyboard navigation
- Maintain focus indicators

## Responsive Design
- Mobile-first approach
- Breakpoints: 600px, 960px, 1280px
- Flexible layouts for all screen sizes

