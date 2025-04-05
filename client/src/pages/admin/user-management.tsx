import AdminLayout from "@/components/admin/admin-layout";
import UserManagement from "@/components/admin/user-management";

const UserManagementPage = () => {
  return (
    <AdminLayout title="User Management">
      <UserManagement />
    </AdminLayout>
  );
};

export default UserManagementPage;
