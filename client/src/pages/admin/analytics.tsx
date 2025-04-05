import AdminLayout from "@/components/admin/admin-layout";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";

const AnalyticsPage = () => {
  return (
    <AdminLayout title="Download Analytics">
      <AnalyticsDashboard />
    </AdminLayout>
  );
};

export default AnalyticsPage;
