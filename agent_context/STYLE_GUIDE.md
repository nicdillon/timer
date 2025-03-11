# Style Guide for Visual Components

This guide establishes the visual styling conventions for building consistent, attractive, and mobile-friendly components in our Next.js app. Follow these rules to ensure a unified look and feel across the project.

## 1. Colors & Theme
- **Primary Color:** `#0070f3`
  - Use for primary buttons, links, and accent elements.
- **Secondary Color:** `#1c1c1e`
  - Use for headings, text, or subtle backgrounds.
- **Neutral Colors:**  
  - Light: `#f5f5f5`  
  - Dark: `#333333`
- **Background Colors:**  
  - Use soft neutral tones to let content stand out.

## 2. Typography
- **Font Family:**  
  Use a modern sans-serif stack, e.g.,  
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Headings:**  
  Establish a clear hierarchy:
  - `h1`: 2.5rem, bold  
  - `h2`: 2rem, bold  
  - `h3`: 1.75rem, semi-bold  
- **Body Text:**  
  Base font size should be 1rem with a line-height of 1.5 for readability.

## 3. Spacing & Layout
- **Grid System:**  
  Utilize a 12-column grid for responsive designs.
- **Consistent Spacing:**  
  Adopt consistent spacing increments (e.g., 8px, 16px, 24px) for margins and paddings.
- **Container Width:**  
  Use a max-width (e.g., 1200px) for content and center it on larger screens.

## 4. Buttons & Controls
- **Primary Button:**  
  - Background: Primary Color  
  - Text: White  
  - Padding: 0.5rem 1rem  
  - Border: None, with a slight border-radius for rounded corners.
- **Secondary Button:**  
  - Background: Transparent  
  - Border: 1px solid Primary Color  
  - Text: Primary Color

## 5. Form Elements
- **Input Fields:**  
  - Border: 1px solid #ccc  
  - Padding: 0.5rem  
  - Border-radius: 4px  
  - Focus State: Change border-color to Primary Color and add a subtle box-shadow.
- **Labels:**  
  Ensure labels are clearly associated with their inputs, with consistent spacing and font size.

## 6. Components & Layout Guidelines
- **Reusable Components:**  
  Build components to be modular and reusable. Keep styling scoped using CSS Modules or styled JSX.
- **Interaction States:**  
  Define clear hover, active, and focus states to provide visual feedback.
- **Responsive Design:**  
  Use media queries to ensure components adjust gracefully across devices.

## 7. Utility Classes
- Develop utility classes for common styles such as margins, paddings, and text alignment. Consider a naming convention like BEM or a utility-first approach if not using a dedicated framework.

## 8. Global Styles
- Base styles (resets, typography, default element styles) are defined in the global stylesheet (`a.css`).

*Follow this guide closely when developing new visual components to maintain consistency across the app.*
