"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Mail, RefreshCw, Clock, Check, UserPlus, UserMinus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { sendInvitation, acceptInvitation, declineInvitation } from "./actions"

type TeamMember = {
  id: string
  name: string
  email: string
  role: "Owner" | "Collaborator" | "Editor" | "Viewer"
  avatarUrl?: string
  status?: "Active" | "Pending" | "Accepted"
  invitedAt?: string
  acceptedAt?: string
}

type ReceivedInvitation = {
  id: string
  teamId: string
  teamName: string
  invitedBy: {
    name: string
    email: string
  }
  role: "Collaborator" | "Editor" | "Viewer"
  invitedAt: string
}

export default function TeamCollaboration() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("team")

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "Owner", status: "Active" },
    { id: "2", name: "Alice Smith", email: "alice@example.com", role: "Collaborator", status: "Active" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Collaborator", status: "Active" },
  ])

  const [pendingInvitations, setPendingInvitations] = useState<TeamMember[]>([
    {
      id: "p1",
      name: "",
      email: "pending@example.com",
      role: "Editor",
      status: "Pending",
      invitedAt: "2025-04-30T10:30:00Z",
    },
    {
      id: "p2",
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "Viewer",
      status: "Accepted",
      invitedAt: "2025-04-29T14:20:00Z",
      acceptedAt: "2025-04-30T09:15:00Z",
    },
  ])

  const [receivedInvitations, setReceivedInvitations] = useState<ReceivedInvitation[]>([
    {
      id: "r1",
      teamId: "team1",
      teamName: "Design Team",
      invitedBy: {
        name: "Sarah Parker",
        email: "sarah@example.com",
      },
      role: "Editor",
      invitedAt: "2025-04-30T15:45:00Z",
    },
    {
      id: "r2",
      teamId: "team2",
      teamName: "Marketing Team",
      invitedBy: {
        name: "David Lee",
        email: "david@example.com",
      },
      role: "Collaborator",
      invitedAt: "2025-04-29T11:20:00Z",
    },
  ])

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  const removePendingInvitation = (id: string) => {
    setPendingInvitations(pendingInvitations.filter((invitation) => invitation.id !== id))
  }

  const updateMemberRole = (id: string, role: TeamMember["role"]) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, role } : member)))
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getAvatarColor = (id: string) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500"]
    return colors[Number.parseInt(id.replace(/\D/g, "1")) % colors.length]
  }

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be a server action that sends an actual email
      await sendInvitation(inviteEmail, "I'd like to invite you to collaborate on this project.")

      // Add to pending invitations
      const newInvitation: TeamMember = {
        id: `p${Date.now()}`,
        name: "",
        email: inviteEmail,
        role: "Collaborator",
        status: "Pending",
        invitedAt: new Date().toISOString(),
      }

      setPendingInvitations([...pendingInvitations, newInvitation])
      setInviteEmail("")

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      })
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendInvitation = async (email: string) => {
    try {
      await sendInvitation(email, "I'd like to invite you to collaborate on this project.")
      toast({
        title: "Invitation resent",
        description: `The invitation to ${email} has been resent`,
      })
    } catch (error) {
      toast({
        title: "Failed to resend invitation",
        description: "There was an error resending the invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptInvitation = async (invitationId: string, teamName: string) => {
    try {
      await acceptInvitation(invitationId)

      // Remove from received invitations
      setReceivedInvitations(receivedInvitations.filter((inv) => inv.id !== invitationId))

      toast({
        title: "Invitation accepted",
        description: `You have joined the ${teamName} team`,
      })
    } catch (error) {
      toast({
        title: "Failed to accept invitation",
        description: "There was an error accepting the invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await declineInvitation(invitationId)

      // Remove from received invitations
      setReceivedInvitations(receivedInvitations.filter((inv) => inv.id !== invitationId))

      toast({
        title: "Invitation declined",
        description: "The invitation has been declined",
      })
    } catch (error) {
      toast({
        title: "Failed to decline invitation",
        description: "There was an error declining the invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <Card className="w-full max-w-md bg-zinc-900 text-white border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger value="team" className="data-[state=active]:bg-zinc-700">
              Team Members
            </TabsTrigger>
            <TabsTrigger value="invitations" className="data-[state=active]:bg-zinc-700">
              Invitations
              {pendingInvitations.length > 0 && <Badge className="ml-2 bg-zinc-600">{pendingInvitations.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-zinc-700">
              Received
              {receivedInvitations.length > 0 && (
                <Badge className="ml-2 bg-zinc-600">{receivedInvitations.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4 pt-4">
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-8 w-8 ${getAvatarColor(member.id)}`}>
                      {member.avatarUrl ? (
                        <AvatarImage src={member.avatarUrl || "/placeholder.svg"} alt={member.name} />
                      ) : (
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-zinc-400">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {member.role !== "Owner" && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                            >
                              {member.role} <span className="sr-only">Change role</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                            <DropdownMenuItem
                              className="hover:bg-zinc-700 focus:bg-zinc-700"
                              onClick={() => updateMemberRole(member.id, "Collaborator")}
                            >
                              Collaborator
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-zinc-700 focus:bg-zinc-700"
                              onClick={() => updateMemberRole(member.id, "Editor")}
                            >
                              Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-zinc-700 focus:bg-zinc-700"
                              onClick={() => updateMemberRole(member.id, "Viewer")}
                            >
                              Viewer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700"
                          onClick={() => removeTeamMember(member.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4 pt-4">
            <form onSubmit={handleSendInvitation} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button
                type="submit"
                disabled={!inviteEmail || isSubmitting}
                className="bg-zinc-100 text-zinc-900 hover:bg-white"
              >
                {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                <span className="sr-only">Send invitation</span>
              </Button>
            </form>

            <div className="space-y-2">
              {pendingInvitations
                .filter((inv) => inv.status === "Pending")
                .map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between py-2 px-3 bg-zinc-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-zinc-700">
                        <AvatarFallback className="text-zinc-400">
                          <Clock className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-zinc-300">{invitation.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5 border-zinc-600">
                            {invitation.role}
                          </Badge>
                          <p className="text-xs text-zinc-500">Invited {formatDate(invitation.invitedAt || "")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={() => resendInvitation(invitation.email)}
                        title="Resend invitation"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span className="sr-only">Resend</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={() => removePendingInvitation(invitation.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    </div>
                  </div>
                ))}

              {pendingInvitations
                .filter((inv) => inv.status === "Accepted")
                .map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between py-2 px-3 bg-zinc-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className={`h-8 w-8 ${getAvatarColor(invitation.id)}`}>
                        <AvatarFallback>{getInitials(invitation.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-zinc-300">{invitation.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs px-1 py-0 h-5 bg-green-600 text-white">Accepted</Badge>
                          <p className="text-xs text-zinc-500">{formatDate(invitation.acceptedAt || "")}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs bg-zinc-700 hover:bg-zinc-600"
                      onClick={() => {
                        // Add to team members
                        setTeamMembers([
                          ...teamMembers,
                          {
                            ...invitation,
                            status: "Active",
                          },
                        ])
                        // Remove from pending invitations
                        removePendingInvitation(invitation.id)
                        toast({
                          title: "Member added",
                          description: `${invitation.name} has been added to the team`,
                        })
                      }}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Add to team
                    </Button>
                  </div>
                ))}

              {pendingInvitations.length === 0 && (
                <div className="text-center py-8 text-zinc-500">No pending invitations</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="received" className="space-y-4 pt-4">
            <div className="space-y-2">
              {receivedInvitations.map((invitation) => (
                <div key={invitation.id} className="flex flex-col py-2 px-3 bg-zinc-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className={`h-8 w-8 ${getAvatarColor(invitation.teamId)}`}>
                        <AvatarFallback>{getInitials(invitation.teamName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-zinc-300">{invitation.teamName}</p>
                        <p className="text-xs text-zinc-500">
                          From {invitation.invitedBy.name} • {formatDate(invitation.invitedAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-5 border-zinc-600">
                      {invitation.role}
                    </Badge>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                    >
                      <UserMinus className="h-3.5 w-3.5 mr-1" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-zinc-100 text-zinc-900 hover:bg-white"
                      onClick={() => handleAcceptInvitation(invitation.id, invitation.teamName)}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}

              {receivedInvitations.length === 0 && (
                <div className="text-center py-8 text-zinc-500">No invitations received</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
