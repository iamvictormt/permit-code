"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Copy,
  QrCode,
  Clock,
  User,
  Trash2,
  CheckCircle,
} from "lucide-react"
import { mockShareCodes, mockUsers } from "@/lib/mock-data"

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function ShareCodesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [newCode, setNewCode] = useState({
    user_id: "",
    purpose: "",
    expires_days: "7",
  })

  const codesWithUsers = mockShareCodes.map((code) => ({
    ...code,
    user: mockUsers.find((u) => u.id === code.user_id),
  }))

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const getExpirationStatus = (expiresAt: string) => {
    const now = new Date()
    const expDate = new Date(expiresAt)
    const diffDays = Math.ceil(
      (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays < 0) return { label: "Expired", variant: "destructive" as const }
    if (diffDays <= 3) return { label: `${diffDays}d remaining`, variant: "secondary" as const }
    return { label: `${diffDays}d remaining`, variant: "default" as const }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Share Codes</CardTitle>
              <CardDescription>
                Manage verification and share codes
              </CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New Code</DialogTitle>
                  <DialogDescription>
                    Create a share code for verification
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">User</Label>
                    <Select
                      value={newCode.user_id}
                      onValueChange={(value) =>
                        setNewCode({ ...newCode, user_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="e.g., Temporary access to IT department"
                      value={newCode.purpose}
                      onChange={(e) =>
                        setNewCode({ ...newCode, purpose: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Validity</Label>
                    <Select
                      value={newCode.expires_days}
                      onValueChange={(value) =>
                        setNewCode({ ...newCode, expires_days: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      Generated code
                    </p>
                    <p className="text-2xl font-mono font-bold text-foreground tracking-wider">
                      {generateCode()}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateOpen(false)}>
                    Create Code
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codesWithUsers.map((code) => {
              const expStatus = getExpirationStatus(code.expires_at)
              const expired = isExpired(code.expires_at)

              return (
                <Card
                  key={code.code}
                  className={`border-border ${expired ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-lg font-bold text-foreground">
                            {code.code}
                          </p>
                          <Badge variant={expStatus.variant} className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {expStatus.label}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyCode(code.code)}
                        disabled={expired}
                      >
                        {copiedCode === code.code ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {code.user?.full_name || "User not found"}
                        </span>
                      </div>

                      {code.purpose && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {code.purpose}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          Expires:{" "}
                          {new Date(code.expires_at).toLocaleDateString("en-GB")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {codesWithUsers.length === 0 && (
            <div className="text-center py-12">
              <QrCode className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No share codes created
              </p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create first code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
