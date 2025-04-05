import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserSession } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SessionManagement = () => {
  const { toast } = useToast();
  const [sessionToTerminate, setSessionToTerminate] = useState<UserSession | null>(null);

  // Fetch sessions
  const { data: sessions, isLoading } = useQuery<UserSession[]>({
    queryKey: ["/api/user-sessions"],
  });

  // Terminate session
  const terminateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/user-sessions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-sessions"] });
      
      toast({
        title: "Session terminated",
        description: "The user session has been successfully terminated.",
      });
      
      setSessionToTerminate(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to terminate session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTerminate = (session: UserSession) => {
    setSessionToTerminate(session);
  };

  const confirmTerminate = () => {
    if (sessionToTerminate) {
      terminateMutation.mutate(sessionToTerminate.id);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-4">User Sessions</h1>
        <div className="bg-[#222] rounded-lg overflow-hidden shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Device Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-[#222]">
              {sessions?.map((session) => (
                <tr key={session.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {session.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {session.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {session.deviceInfo || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDateTime(session.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDateTime(session.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded flex items-center"
                      onClick={() => handleTerminate(session)}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                      Terminate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions && sessions.length > 0 ? (
            <div className="border-t border-gray-700 px-6 py-3 text-gray-400 text-sm">
              Showing {sessions.length} sessions
            </div>
          ) : (
            <div className="border-t border-gray-700 px-6 py-3 text-gray-400 text-sm">
              No sessions found
            </div>
          )}
        </div>
        
        <div className="bg-[#222] mt-6 rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Session Management</h2>
          <p className="text-sm text-gray-300 mb-4">
            User sessions track active users and their device information. Terminating a session will log the user out from that device.
          </p>
          
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-md p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <p className="text-sm text-red-200">Suspicious activity can be identified by unusual IP addresses or login times.</p>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!sessionToTerminate} onOpenChange={() => setSessionToTerminate(null)}>
        <AlertDialogContent className="bg-[#222] text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate User Session</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to terminate this session? The user will be logged out from the device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmTerminate}
            >
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionManagement;
