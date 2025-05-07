# Data Cleaning Workstation Components

This module provides a modern, interactive UI for data cleaning operations with a dockable chat assistant.

## Overview

The Data Cleaning Workstation is a comprehensive UI system for:
- Visualizing data quality issues
- Cleaning data with one-click actions
- Getting AI assistance through a dockable chat panel

## Key Features

- **Modern Dark Theme UI**: Designed for extended use with minimal eye strain
- **Dockable Chat Panel**: Can be positioned on left, right, or bottom
- **Resizable Panels**: Chat and sidebar panels can be resized by dragging
- **Collapsible Sidebar**: Toggle sidebar visibility for more table space
- **Highlighted Issues**: Color-coded cells based on issue type
- **One-Click Cleaning**: Quick actions for common data issues
- **Animations**: Smooth transitions and feedback for all interactions

## Usage

### Basic Implementation

```tsx
// In your page component
import { CleaningDashboard } from '@/components/cleaning-dashboard'

export default function CleanDataPage({ params }: { params: { fileid: string } }) {
  return <CleaningDashboard fileId={params.fileid} />
}
```

### Component Structure

The cleaning dashboard is composed of several components:

- `CleaningDashboard`: Main container component
- `DashboardHeader`: Top navigation bar
- `DashboardSidebar`: Collapsible left sidebar with dataset selection and issues
- `DataTable`: Central table displaying data with highlighting
- `CleaningActions`: Action buttons for data cleaning operations
- `ChatPanelContainer`: Container for the dockable chat panel
- `ChatPanel`: The actual chat interface with messages
- `ChatInput`: Input field for sending messages
- `ContextInput`: Add context to improve assistant responses

## Customization

### Theme Customization

The dashboard uses Tailwind CSS with a dark theme by default. Main colors can be customized in your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Change the primary accent color
          // Add other shades as needed
        },
      },
    },
  },
}
```

### Layout Adjustment

You can adjust the default layout by modifying the initial state values:

```tsx
// In your component
const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Start with collapsed sidebar
const [dockPosition, setDockPosition] = useState<DockPosition>("bottom") // Start with bottom-docked chat
const [showChat, setShowChat] = useState(false) // Start with hidden chat
```

## API

### CleaningDashboard Props

| Prop | Type | Description |
|------|------|-------------|
| fileId | string | ID of the file to load and clean |

### State Configuration

The dashboard manages multiple states internally:

- Data display state (sorting, filtering)
- UI layout state (sidebar, chat position)
- Cleaning operations state (actions, history)
- Chat conversation state (messages, context)

## Animations

The component includes various animations for a polished user experience:

- Fade in/out for components
- Slide animations for panels
- Scale animations for interactive elements
- Staggered animations for table rows

Import the animation styles to enable these effects:

```tsx
import '@/components/cleaning-dashboard/animations.css'
```

## Accessibility

The dashboard is designed with accessibility in mind:

- Keyboard navigation for all interactive elements
- ARIA labels for UI controls
- Sufficient color contrast for readability
- Screen reader support for key elements

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Integration with Backend

The dashboard connects to your data cleaning API using the `GetIssues` function. Make sure this function is properly implemented in your utils.

## Performance Considerations

For large datasets:
- Consider implementing virtualization
- Use filtering to reduce the visible data
- Enable pagination for better performance

## Contributing

When adding features or fixing bugs:
1. Follow the existing component structure and naming conventions
2. Add appropriate animations for new interactive elements
3. Ensure all new components are properly typed
4. Include tests for any new functionality

## License

This component is part of the main application and is subject to the same license terms. 