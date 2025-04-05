import AdminLayout from "@/components/admin/admin-layout";
import SessionManagement from "@/components/admin/session-management";

const UserSessionsPage = () => {
  return (
    <AdminLayout title="User Sessions">
      <SessionManagement />
    </AdminLayout>
  );
};

export default UserSessionsPage;
