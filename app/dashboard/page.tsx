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
          title="Usuários Ativos"
          value={activeUsers}
          description={`${mockUsers.length} total`}
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Documentos Verificados"
          value={verifiedDocs}
          description={`${mockDocuments.length} total`}
          icon={FileCheck}
          variant="accent"
        />
        <StatsCard
          title="Códigos Ativos"
          value={activeCodes}
          description="Códigos de compartilhamento"
          icon={QrCode}
          variant="default"
        />
        <StatsCard
          title="Pendente de Verificação"
          value={pendingVerifications}
          description="Documentos aguardando"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Usuários Recentes</CardTitle>
              <CardDescription>Últimos usuários cadastrados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/users">
                Ver todos
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
                      ? "Ativo"
                      : user.account_status === "SUSPENDED"
                        ? "Suspenso"
                        : "Bloqueado"}
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
              <CardTitle className="text-base font-semibold">Expirando em Breve</CardTitle>
              <CardDescription>Status com data de expiração próxima</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/users">
                Ver todos
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
                            {user?.full_name || "Usuário"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {status.status_type === "EMPLOYEE"
                              ? "Funcionário"
                              : status.status_type === "CONTRACTOR"
                                ? "Terceirizado"
                                : "Visitante"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">
                          Expira em
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {status.end_date
                            ? new Date(status.end_date).toLocaleDateString("pt-BR")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum status expirando em breve</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/users">
                <Users className="w-5 h-5" />
                <span>Gerenciar Usuários</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/documents">
                <FileCheck className="w-5 h-5" />
                <span>Verificar Documentos</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/share-codes">
                <QrCode className="w-5 h-5" />
                <span>Gerar Código</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/dashboard/settings">
                <AlertTriangle className="w-5 h-5" />
                <span>Configurações</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
