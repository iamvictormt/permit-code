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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, CheckCircle, XCircle, FileText, CreditCard, Globe } from "lucide-react"
import { mockDocuments, mockUsers } from "@/lib/mock-data"
import type { DocumentType } from "@/lib/types"

const documentTypeIcon = (type: DocumentType) => {
  switch (type) {
    case "PASSPORT":
      return <Globe className="w-4 h-4" />
    case "ID_CARD":
      return <CreditCard className="w-4 h-4" />
    case "EMPLOYEE_CARD":
      return <FileText className="w-4 h-4" />
  }
}

const documentTypeName = (type: DocumentType) => {
  switch (type) {
    case "PASSPORT":
      return "Passaporte"
    case "ID_CARD":
      return "RG/CNH"
    case "EMPLOYEE_CARD":
      return "Crachá"
  }
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all")

  const documentsWithUsers = mockDocuments.map((doc) => ({
    ...doc,
    user: mockUsers.find((u) => u.id === doc.user_id),
  }))

  const filteredDocuments = documentsWithUsers.filter((doc) => {
    const matchesSearch =
      doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && doc.verified) ||
      (verifiedFilter === "pending" && !doc.verified)
    return matchesSearch && matchesType && matchesVerified
  })

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Gerencie e verifique os documentos dos usuários
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou usuário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="PASSPORT">Passaporte</SelectItem>
                <SelectItem value="ID_CARD">RG/CNH</SelectItem>
                <SelectItem value="EMPLOYEE_CARD">Crachá</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Verificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="verified">Verificados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Documento</TableHead>
                  <TableHead className="hidden md:table-cell">Usuário</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Verificado em</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                          {documentTypeIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-mono text-sm font-medium text-foreground">
                            {doc.number}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {doc.user?.full_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {doc.user?.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="font-normal">
                        {documentTypeName(doc.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doc.verified ? (
                        <Badge className="bg-accent text-accent-foreground">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {doc.verified_at
                          ? new Date(doc.verified_at).toLocaleDateString("pt-BR")
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {!doc.verified && (
                            <DropdownMenuItem>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Verificar documento
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Ver documento
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="w-4 h-4 mr-2" />
                            Invalidar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum documento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
