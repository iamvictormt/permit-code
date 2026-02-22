'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, CheckCircle, XCircle, Pencil, Trash2, Plug } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  account_status: string;
  document_type: string;
  document_number: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    documentType: 'passport',
    documentNumber: '',
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Verification State
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    message?: string;
    user?: { fullName: string };
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    documentType: '',
    documentNumber: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Alert Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
    actionLabel: string;
    variant: 'default' | 'destructive';
  }>({
    open: false,
    title: '',
    description: '',
    action: () => {},
    actionLabel: '',
    variant: 'default',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        // Format dates for input[type=date]
        const formattedUsers = data.map((u: any) => ({
          ...u,
          date_of_birth: u.date_of_birth ? new Date(u.date_of_birth).toISOString().split('T')[0] : '',
        }));
        setUsers(formattedUsers);
      }
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleToggleStatus = (user: User) => {
    const isActivating = user.account_status !== 'ACTIVE';
    setConfirmDialog({
      open: true,
      title: isActivating ? 'Activate user?' : 'Inactivate user?',
      description: `Are you sure you want to ${isActivating ? 'activate' : 'inactivate'} ${user.full_name}?`,
      actionLabel: isActivating ? 'Activate' : 'Inactivate',
      variant: isActivating ? 'default' : 'destructive',
      action: async () => {
        const newStatus = isActivating ? 'ACTIVE' : 'INACTIVE';
        try {
          const res = await fetch(`/api/admin/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_status: newStatus }),
          });
          if (res.ok) fetchUsers();
        } catch (err) {
          console.error('Failed to update status');
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleDeleteUser = (user: User) => {
    setConfirmDialog({
      open: true,
      title: 'Delete user?',
      description: `Are you sure you want to delete ${user.full_name}? This action cannot be undone.`,
      actionLabel: 'Delete',
      variant: 'destructive',
      action: async () => {
        try {
          const res = await fetch(`/api/admin/users/${user.id}`, {
            method: 'DELETE',
          });
          if (res.ok) fetchUsers();
        } catch (err) {
          console.error('Failed to delete user');
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);
    setIsRegistering(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (res.ok) {
        setRegSuccess(true);
        setRegForm({
          fullName: '',
          email: '',
          dateOfBirth: '',
          documentType: 'passport',
          documentNumber: '',
        });
        fetchUsers();
      } else {
        setRegError(data.error || 'Registration failed');
      }
    } catch (err) {
      setRegError('An error occurred during registration');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShareCodeMask = (value: string) => {
    // Remove non-alphanumeric chars and uppercase
    const cleaned = value
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 9);
    // Add spaces every 3 chars
    let masked = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 3 === 0) masked += ' ';
      masked += cleaned[i];
    }
    setVerifyCode(masked);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerifyResult(null);

    try {
      const res = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareCode: verifyCode }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch (err) {
      setVerifyResult({ valid: false, message: 'Verification error' });
    } finally {
      setIsVerifying(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.full_name,
      email: user.email,
      dateOfBirth: user.date_of_birth,
      documentType: user.document_type,
      documentNumber: user.document_number,
    });
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditError('');
    setIsSavingEdit(true);

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        setEditError(data.error || 'Update failed');
      }
    } catch (err) {
      setEditError('An error occurred during update');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-12">

      {/* Share Code Verification Section */}
      <section className="border-4 border-govuk-black p-6">
        <h2 className="text-2xl font-bold mb-4">Verify Share Code</h2>
        <form onSubmit={handleVerify} className="space-y-4 max-w-[400px]">
          <div>
            <Label htmlFor="shareCode" className="font-bold">
              Enter 9-character share code
            </Label>
            <Input
              id="shareCode"
              value={verifyCode}
              onChange={(e) => handleShareCodeMask(e.target.value)}
              placeholder="XXX XXX XXX"
              className="mt-1 font-mono"
            />
          </div>
          <Button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Checking...' : 'Check validity'}
          </Button>
        </form>

        {verifyResult && (
          <div
            className={`mt-6 p-4 border-l-8 ${verifyResult.valid ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {verifyResult.valid ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
              <span className={`font-bold text-xl ${verifyResult.valid ? 'text-green-700' : 'text-red-700'}`}>{verifyResult.valid ? 'Valid Code' : 'Invalid Code'}</span>
            </div>
            {verifyResult.valid ? (
              <div>
                <p className="text-lg">This code is valid and belongs to:</p>
                <p className="text-2xl font-bold mt-1">{verifyResult.user?.fullName}</p>
              </div>
            ) : (
              <p className="text-lg font-medium text-red-700">{verifyResult.message}</p>
            )}
          </div>
        )}
      </section>

      {/* User Registration Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Register New User</h2>
        <form
          onSubmit={handleRegister}
          className="max-w-[600px] space-y-6 bg-govuk-grey-3 p-8 border border-govuk-grey-2"
        >
          {regError && (
            <div className="bg-red-50 border-2 border-red-600 p-4 mb-4 text-red-700 font-bold">{regError}</div>
          )}
          {regSuccess && (
            <div className="bg-green-50 border-2 border-green-600 p-4 mb-4 text-green-700 font-bold">
              User registered successfully!
            </div>
          )}

          <div>
            <Label htmlFor="fullName" className="font-bold mb-1 block">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={regForm.fullName}
              onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="font-bold mb-1 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={regForm.email}
              onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="dob" className="font-bold mb-1 block">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={regForm.dateOfBirth}
              onChange={(e) => setRegForm({ ...regForm, dateOfBirth: e.target.value })}
              required
            />
          </div>

          <div>
            <Label className="font-bold mb-2 block">Identity Document</Label>
            <RadioGroup
              value={regForm.documentType}
              onValueChange={(val) => setRegForm({ ...regForm, documentType: val })}
              className="space-y-2 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passport" id="doc-passport" />
                <Label htmlFor="doc-passport">Passport</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="national_id" id="doc-id" />
                <Label htmlFor="doc-id">National ID Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biometric_card" id="doc-biometric" />
                <Label htmlFor="doc-biometric">Biometric Card</Label>
              </div>
            </RadioGroup>
            <Label htmlFor="docNumber" className="font-bold mb-1 block">
              Document Number
            </Label>
            <Input
              id="docNumber"
              value={regForm.documentNumber}
              onChange={(e) => setRegForm({ ...regForm, documentNumber: e.target.value })}
              required
            />
          </div>

          <Button type="submit" disabled={isRegistering} className="w-full bg-[#00703c] hover:bg-[#005a30] text-white">
            {isRegistering ? 'Registering...' : 'Register User'}
          </Button>
        </form>
      </section>

      {/* User Management List */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-govuk-black text-left">
                <th className="py-2 pr-4 font-bold">Name / Email</th>
                <th className="py-2 pr-4 font-bold">Document</th>
                <th className="py-2 pr-4 font-bold">Status</th>
                <th className="py-2 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-govuk-blue" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-govuk-grey-1">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-govuk-grey-2">
                    <td className="py-4 pr-4">
                      <div className="font-bold">{user.full_name}</div>
                      <div className="text-sm text-govuk-grey-1">{user.email}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-sm uppercase font-medium">{user.document_type}</div>
                      <div className="font-mono">{user.document_number}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded ${user.account_status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {user.account_status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-3">
                      {/* <button
                        onClick={() => openEditModal(user)}
                        className="text-govuk-blue hover:text-govuk-blue/80 inline-flex items-center gap-1 text-sm font-medium"
                      >
                        <Pencil className="w-3 h-3" /> Alterar
                      </button> */}
                       <button
                        onClick={() => openEditModal(user)}
                        className="text-govuk-blue hover:text-govuk-blue/80 inline-flex items-center gap-1 text-sm font-medium cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button> 
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="text-govuk-blue hover:text-govuk-blue/80 inline-flex items-center gap-1 text-sm font-medium cursor-pointer"
                      >
                        <Plug className="w-3 h-3" /> {user.account_status === 'ACTIVE' ? 'Inactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 text-sm font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
            {editError && (
              <div className="bg-red-50 border-2 border-red-600 p-3 text-red-700 font-bold text-sm">{editError}</div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-fullName" className="font-bold">
                Full Name
              </Label>
              <Input
                id="edit-fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email" className="font-bold">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-dob" className="font-bold">
                Date of Birth
              </Label>
              <Input
                id="edit-dob"
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-bold">Identity Document</Label>
              <RadioGroup
                value={editForm.documentType}
                onValueChange={(val) => setEditForm({ ...editForm, documentType: val })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passport" id="edit-doc-passport" />
                  <Label htmlFor="edit-doc-passport">Passport</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="national_id" id="edit-doc-id" />
                  <Label htmlFor="edit-doc-id">National ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="biometric_card" id="edit-doc-biometric" />
                  <Label htmlFor="edit-doc-biometric">Biometric</Label>
                </div>
              </RadioGroup>
              <Input
                value={editForm.documentNumber}
                onChange={(e) => setEditForm({ ...editForm, documentNumber: e.target.value })}
                required
                className="mt-1"
                placeholder="Document Number"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEdit} className="bg-[#00703c] hover:bg-[#005a30]">
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Custom Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog.action}
              className={
                confirmDialog.variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              {confirmDialog.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
