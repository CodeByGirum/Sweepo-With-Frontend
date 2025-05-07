/**
 * Purpose: Display team members and collaboration status for a project
 * Used on: /errordetection/[project_id]
 * Notes: Handles team collaboration UI under the project dashboard
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Check,
  ChevronDown, 
  Clock, 
  Mail,
  MoreHorizontal, 
  Pencil,
  Shield, 
  UserMinus, 
  UserPlus, 
  Users,
  X
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

type TeamMember = {
  id: string
  name: string
  email: string
  role: "Owner" | "Editor" | "Viewer"
  avatarUrl?: string
  lastActive?: string
  status?: "Active" | "Pending" | "Invited"
}

interface TeamCollaborationCardProps {
  projectId: string
  teamMembers?: TeamMember[]
}

export function TeamCollaborationCard({ 
  projectId, 
  teamMembers = defaultTeamMembers 
}: TeamCollaborationCardProps) {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteSent, setInviteSent] = useState(false)
  const [error, setError] = useState("")
  const [pendingInvites, setPendingInvites] = useState<string[]>(["demo.user@example.com"])

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Function to handle invites
  const handleInvite = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      setError("Please enter a valid email")
      return
    }

    // In a real app, you would call an API here
    setInviteSent(true)
    setError("")
    
    // Add to pending invites
    setPendingInvites([...pendingInvites, inviteEmail])
    
    setTimeout(() => {
      setInviteSent(false)
      setInviteEmail("")
      setShowInvite(false)
    }, 2000)
  }

  // Function to accept invite
  const acceptInvite = (email: string) => {
    // Create a new member from the invite
    const newMember = {
      id: `new-${Date.now()}`,
      name: email.split('@')[0], // Use part before @ as name
      email: email,
      role: "Viewer" as const,
      lastActive: "Just now",
      status: "Active" as const
    }
    
    setMembers([...members, newMember])
    setPendingInvites(pendingInvites.filter(invite => invite !== email))
  }

  // Function to decline invite
  const declineInvite = (email: string) => {
    setPendingInvites(pendingInvites.filter(invite => invite !== email))
  }

  // Function to update member role
  const updateMemberRole = (memberId: string, newRole: "Owner" | "Editor" | "Viewer") => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
  }

  // Function to remove a member
  const removeMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId))
  }

  return (
    <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
      <CardHeader className="border-b border-[#2a2a2a] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <CardTitle className="text-sm font-medium">Team Collaboration</CardTitle>
          </div>
          <Button
            onClick={() => setShowInvite(!showInvite)}
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-[#3a3a3a] transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {showInvite && (
          <div className="mb-4 p-3 bg-[#1a1a1a] rounded-md border border-[#2a2a2a]">
            <div className="flex gap-2 items-center">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-8 text-xs bg-[#1e1e1e] border-[#3a3a3a] focus:border-[#4a4a4a] text-white flex-1"
              />
              <Button 
                onClick={handleInvite}
                size="sm" 
                className="h-8 px-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-xs text-white"
              >
                {inviteSent ? <Check className="h-3 w-3" /> : "Invite"}
              </Button>
            </div>
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>
        )}

        {pendingInvites.length > 0 && (
          <div className="mb-4 p-2 bg-[#1a1a1a] rounded-md border border-[#2a2a2a]">
            <p className="text-xs text-gray-400 mb-2 px-1">Pending Invites</p>
            <div className="space-y-2">
              {pendingInvites.map((email) => (
                <div key={email} className="flex items-center justify-between p-1 bg-[#1e1e1e] rounded">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-300 truncate">{email}</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => acceptInvite(email)} 
                      className="p-1 rounded hover:bg-green-900/30 text-green-400 transition-colors"
                      title="Accept invite"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => declineInvite(email)} 
                      className="p-1 rounded hover:bg-red-900/30 text-red-400 transition-colors"
                      title="Decline invite"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <ScrollArea className="max-h-[220px] overflow-y-auto overflow-x-hidden" type="always">
          <div className="space-y-2">
            {members.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400">No team members yet</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-1.5 px-1.5 bg-[#1a1a1a] rounded-md">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center bg-[#2a2a2a] text-white text-xs font-medium">
                      {getInitials(member.name)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium truncate">{member.name}</p>
                      <p className="text-xs text-gray-400 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-xs px-1.5 py-0.5 h-5 rounded-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] text-gray-300 transition-colors flex items-center">
                          {member.role}
                          <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1e1e1e] border border-[#3a3a3a] text-white w-24">
                        <DropdownMenuRadioGroup 
                          value={member.role} 
                          onValueChange={(value) => updateMemberRole(member.id, value as "Owner" | "Editor" | "Viewer")}
                        >
                          <DropdownMenuRadioItem 
                            value="Owner" 
                            className="text-xs cursor-pointer hover:bg-[#2a2a2a]"
                          >
                            Owner
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem 
                            value="Editor" 
                            className="text-xs cursor-pointer hover:bg-[#2a2a2a]"
                          >
                            Editor
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem 
                            value="Viewer" 
                            className="text-xs cursor-pointer hover:bg-[#2a2a2a]"
                          >
                            Viewer
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-300 transition-colors">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1e1e1e] border border-[#3a3a3a] text-white w-36">
                        {member.lastActive && (
                          <>
                            <div className="px-2 py-1 text-xs text-gray-400">
                              Active: {member.lastActive}
                            </div>
                            <DropdownMenuSeparator className="bg-[#3a3a3a]" />
                          </>
                        )}
                        <DropdownMenuItem 
                          className="text-xs cursor-pointer hover:bg-[#2a2a2a] text-red-400"
                          onClick={() => removeMember(member.id)}
                        >
                          Remove member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Sample data for demonstration
const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Owner",
    lastActive: "Now",
    status: "Active"
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Editor",
    lastActive: "5m ago",
    status: "Active"
  },
  {
    id: "3",
    name: "Michael Williams",
    email: "michael.williams@example.com",
    role: "Viewer",
    lastActive: "1h ago",
    status: "Active"
  },
  {
    id: "4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    role: "Viewer",
    lastActive: "3h ago",
    status: "Active"
  }
] 