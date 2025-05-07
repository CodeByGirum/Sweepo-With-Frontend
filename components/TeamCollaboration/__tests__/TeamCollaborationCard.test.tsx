/**
 * Purpose: Tests for the TeamCollaborationCard component
 * Used in: Testing automation
 * Notes: Verifies that the component renders and functions correctly
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react"
import { TeamCollaborationCard } from "../TeamCollaborationCard"

// Mock the ScrollArea component since it might cause issues in tests
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>
}))

describe("TeamCollaborationCard", () => {
  it("renders the component with team members", () => {
    render(<TeamCollaborationCard projectId="test-project" />)

    // Check if the component renders correctly
    expect(screen.getByText("Team Collaboration")).toBeInTheDocument()
    expect(screen.getByText("John Smith")).toBeInTheDocument()
    expect(screen.getByText("Invite")).toBeInTheDocument()
  })

  it("shows the invite form when clicking the Invite button", () => {
    render(<TeamCollaborationCard projectId="test-project" />)

    // Click the invite button
    fireEvent.click(screen.getByText("Invite"))

    // Check if the invite form appears
    expect(screen.getByText("Invite team member by email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument()
    expect(screen.getByText("Send")).toBeInTheDocument()
  })

  it("validates email input when inviting a team member", () => {
    render(<TeamCollaborationCard projectId="test-project" />)

    // Open the invite form
    fireEvent.click(screen.getByText("Invite"))

    // Try to submit with an invalid email
    fireEvent.click(screen.getByText("Send"))

    // Check for error message
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()

    // Enter a valid email
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), {
      target: { value: "test@example.com" }
    })

    // Submit the form
    fireEvent.click(screen.getByText("Send"))

    // Check for success message
    expect(screen.getByText("Invitation sent!")).toBeInTheDocument()
  })

  it("displays custom team members when provided", () => {
    const teamMembers = [
      {
        id: "custom-1",
        name: "Custom User",
        email: "custom@example.com",
        role: "Editor" as const,
        lastActive: "Just now"
      }
    ]

    render(<TeamCollaborationCard projectId="test-project" teamMembers={teamMembers} />)

    // Check if the custom member is shown
    expect(screen.getByText("Custom User")).toBeInTheDocument()
    expect(screen.getByText("custom@example.com")).toBeInTheDocument()
    expect(screen.getByText("Editor")).toBeInTheDocument()
    expect(screen.getByText("Just now")).toBeInTheDocument()
  })
}) 