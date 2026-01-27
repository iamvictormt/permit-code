"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import { getAllUsersWithDetails } from "@/lib/mock-data"
import type { UserWithDetails, AccountStatus, VerificationLevel } from "@/lib/types"

const verificationLevelBadge = (level: VerificationLevel) => {
  switch (level) {
    case "HIGH":
      return (
        <Badge className="bg-accent/10 text-accent border-0">
          <ShieldCheck className="w-3 h-3 mr-1" />
          High
        </Badge>
      )
    case "MEDIUM":
      return (
        <Badge className="bg-primary/10 text-primary border-0">
          <Shield className="w-3 h-3 mr-1" />
          Medium
        </Badge>
      )
    case "LOW":
      return (
        <Badge variant="secondary">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Low
        </Badge>
      )
  }
}

const statusBadge = (status: AccountStatus) => {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-accent text-accent-foreground">Active</Badge>
    case "SUSPENDED":
      return <Badge variant="secondary">Suspended</Badge>
    case "BLOCKED":
      return <Badge variant="destructive">Blocked</Badge>
  }
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const users = getAllUsersWithDetails()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || user.account_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewUser = (user: UserWithDetails) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users and their permissions
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Verification</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Documents</TableHead>
                  <TableHead className="hidden lg:table-cell">Created at</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {user.full_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {verificationLevelBadge(user.verification_level)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {statusBadge(user.account_status)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {user.documents.length} document(s)
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("en-GB")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information for the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">
                    {selectedUser.full_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedUser.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {statusBadge(selectedUser.account_status)}
                  {verificationLevelBadge(selectedUser.verification_level)}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Documents
                </h4>
                <div className="space-y-2">
                  {selectedUser.documents.length > 0 ? (
                    selectedUser.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {doc.type === "PASSPORT"
                              ? "Passport"
                              : doc.type === "ID_CARD"
                                ? "ID Card"
                                : "Employee Card"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.number}
                          </p>
                        </div>
                        <Badge
                          variant={doc.verified ? "default" : "secondary"}
                          className={
                            doc.verified
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }
                        >
                          {doc.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No documents registered
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Access Status
                </h4>
                <div className="space-y-2">
                  {selectedUser.statuses.length > 0 ? (
                    selectedUser.statuses.map((status) => (
                      <div
                        key={status.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {status.status_type === "EMPLOYEE"
                              ? "Employee"
                              : status.status_type === "CONTRACTOR"
                                ? "Contractor"
                                : "Visitor"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(status.start_date).toLocaleDateString(
                              "en-GB"
                            )}{" "}
                            -{" "}
                            {status.end_date
                              ? new Date(status.end_date).toLocaleDateString(
                                  "en-GB"
                                )
                              : "No end date"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            status.situation === "VALID"
                              ? "default"
                              : status.situation === "EXPIRED"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            status.situation === "VALID"
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }
                        >
                          {status.situation === "VALID"
                            ? "Valid"
                            : status.situation === "EXPIRED"
                              ? "Expired"
                              : "Revoked"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No status registered
                    </p>
                  )}
                </div>
              </div>

              {/* Share Codes */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Share Codes
                </h4>
                <div className="space-y-2">
                  {selectedUser.share_codes.length > 0 ? (
                    selectedUser.share_codes.map((code) => (
                      <div
                        key={code.code}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-mono font-medium text-foreground">
                            {code.code}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {code.purpose || "No description"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Expires on
                          </p>
                          <p className="text-xs font-medium text-foreground">
                            {new Date(code.expires_at).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No active codes
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
