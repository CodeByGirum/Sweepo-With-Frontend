# Team Collaboration Component

## Purpose
This component displays team members and collaboration status for a project. It is designed to be placed on the Error Detection Project Details page to enable team management directly from the data view.

## Usage

```tsx
import { TeamCollaborationCard } from "@/components/TeamCollaboration"

// Basic usage
<TeamCollaborationCard projectId="project-123" />

// With custom team members
const customTeamMembers = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Owner",
    lastActive: "Now"
  },
  // Add more team members as needed
]

<TeamCollaborationCard 
  projectId="project-123"
  teamMembers={customTeamMembers} 
/>
```

## Features

- Display team members with their roles and last active status
- Show user avatars with initials based on names
- Enable inviting new team members via email
- Gracefully handle long names and email addresses
- Mobile-responsive layout
- Consistent with the application's design system

## Component Structure

- **TeamCollaborationCard**: Main component that displays the team collaboration card
- **Member List**: Scrollable list of team members
- **Invite Form**: Form for inviting new team members

## Props

| Prop | Type | Description |
|------|------|-------------|
| projectId | string | The ID of the project to manage teams for |
| teamMembers | TeamMember[] | (Optional) Custom list of team members to display |

## Types

```typescript
type TeamMember = {
  id: string
  name: string
  email: string
  role: "Owner" | "Editor" | "Viewer"
  avatarUrl?: string
  lastActive?: string
}
```

## Future Enhancements

- Add real-time status indicators
- Implement role management
- Add team activity history
- Support for removing team members
- Integrate with notification system 