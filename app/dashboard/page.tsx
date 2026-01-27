"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileCheck,
  QrCode,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react"
import { mockUsers, mockDocuments, mockUserStatuses, mockShareCodes } from "@/lib/mock-data"
import Link from "next/link"

export default function DashboardPage() {
  const activeUsers = mockUsers.filter((u) => u.account_status === "ACTIVE").length
  const verifiedDocs = mockDocuments.filter((d) => d.verified).length
  const activeCodes = mockShareCodes.length
  const pendingVerifications = mockDocuments.filter((d) => !d.verified).length

  const recentUsers = mockUsers.slice(0, 5)
  const expiringSoon = mockUserStatuses.filter(
    (s) => s.situation === "VALID" && s.end_date
  ).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Users"
          value={activeUsers}
          description={`${mockUsers.length} total`}
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Verified Documents"
          value={verifiedDocs}
          description={`${mockDocuments.length} total`}
          icon={FileCheck}
          variant="accent"
        />
        <StatsCard
          title="Active Codes"
          value={activeCodes}
          description="Share codes"
          icon={QrCode}
          variant="default"
        />
        <StatsCard
          title="Pending Verification"
          value={pendingVerifications}
          description="Documents awaiting"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/users">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      user.account_status === "ACTIVE"
                        ? "default"
                        : user.account_status === "SUSPENDED"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {user.account_status === "ACTIVE"
                      ? "Active"
                      : user.account_status === "SUSPENDED"
                        ? "Suspended"
                        : "Blocked"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Expiring Soon</CardTitle>
              <CardDescription>Status with upcoming expiration date</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/users">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringSoon.length > 0 ? (
                expiringSoon.map((status) => {
                  const user = mockUsers.find((u) => u.id === status.user_id)
                  return (
                    <div
                      key={status.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-warning-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {user?.full_name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {status.status_type === "EMPLOYEE"
                              ? "Employee"
                              : status.status_type === "CONTRACTOR"
                                ? "Contractor"
                                : "Visitor"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">
                          Expires on
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {status.end_date
                            ? new Date(status.end_date).toLocaleDateString("en-GB")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No status expiring soon</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          <CardDescription>Quickly access the main features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/users">
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/documents">
                <FileCheck className="w-5 h-5" />
                <span>Verify Documents</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/share-codes">
                <QrCode className="w-5 h-5" />
                <span>Generate Code</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
