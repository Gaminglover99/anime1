import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import LoadingAnime from "@/components/ui/loading-anime";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserManagement = () => {
  const { toast } = useToast();
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  const [userToChangeStatus, setUserToChangeStatus] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("User");
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      return await apiRequest("PATCH", `/api/users/${userId}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${selectedRole}.`,
      });
      
      setUserToChangeRole(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update user status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
      return await apiRequest("PATCH", `/api/users/${userId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      
      toast({
        title: "Status updated",
        description: `User status has been updated to ${selectedStatus}.`,
      });
      
      setUserToChangeStatus(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChangeRole = (user: User) => {
    setSelectedRole(user.role);
    setUserToChangeRole(user);
  };

  const handleChangeStatus = (user: User) => {
    setSelectedStatus(user.status);
    setUserToChangeStatus(user);
  };

  const confirmRoleChange = () => {
    if (userToChangeRole) {
      updateRoleMutation.mutate({ userId: userToChangeRole.id, role: selectedRole });
    }
  };

  const confirmStatusChange = () => {
    if (userToChangeStatus) {
      updateStatusMutation.mutate({ userId: userToChangeStatus.id, status: selectedStatus });
    }
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("DELETE", `/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      
      toast({
        title: "User deleted",
        description: `User has been permanently deleted.`,
      });
      
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingAnime />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">User Management</h1>
      </div>

      <div className="bg-[#222] rounded-lg overflow-hidden shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-[#222]">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{user.username}</div>
                      <div className="text-xs text-gray-400">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${user.role === 'Admin' ? 'bg-purple-700' : 'bg-blue-700'} text-white`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                  <Button 
                    size="sm"
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                    onClick={() => handleChangeRole(user)}
                  >
                    Role
                  </Button>
                  <Button
                    size="sm"
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                    onClick={() => handleChangeStatus(user)}
                  >
                    {user.status === 'Active' ? 'Block' : 'Unblock'}
                  </Button>
                  <Button
                    size="sm"
                    className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users && users.length > 0 ? (
          <div className="border-t border-gray-700 px-6 py-3 text-gray-400 text-sm">
            Showing {users.length} users
          </div>
        ) : (
          <div className="border-t border-gray-700 px-6 py-3 text-gray-400 text-sm">
            No users found
          </div>
        )}
      </div>

      {/* Role Change Dialog */}
      <Dialog open={!!userToChangeRole} onOpenChange={() => setUserToChangeRole(null)}>
        <DialogContent className="bg-[#222] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription className="text-gray-400">
              Change the role for user: {userToChangeRole?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUserToChangeRole(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white border-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmRoleChange}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Alert Dialog */}
      <AlertDialog open={!!userToChangeStatus} onOpenChange={() => setUserToChangeStatus(null)}>
        <AlertDialogContent className="bg-[#222] text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToChangeStatus?.status === 'Active' ? 'Block User' : 'Unblock User'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {userToChangeStatus?.status === 'Active'
                ? `Are you sure you want to block ${userToChangeStatus?.username}? They will no longer be able to log in.`
                : `Are you sure you want to unblock ${userToChangeStatus?.username}? They will be able to log in again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={`${selectedStatus === 'Active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              onClick={confirmStatusChange}
            >
              {selectedStatus === 'Active' ? 'Unblock' : 'Block'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="bg-[#222] text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete User Permanently
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete {userToDelete?.username}? 
              This action is irreversible and will permanently remove the user 
              account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="flex items-center p-4 mb-4 text-sm text-red-500 rounded-lg bg-gray-800">
              <svg className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span className="sr-only">Warning</span>
              <div>
                <span className="font-medium">Warning:</span> This will delete all user data including:
                <ul className="mt-1.5 ml-4 list-disc list-inside">
                  <li>Account information</li>
                  <li>User preferences</li> 
                  <li>Watch history</li>
                  <li>Comments</li>
                </ul>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteUser}
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
