import { ReactNode } from "react";
import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#111]">
      <AdminSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <AdminHeader title={title} />
        <main>{children}</main>
        
        <footer className="mt-auto bg-[#222] py-4 px-6 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Anime Kingdom. All rights reserved.
          <div className="mt-1">
            <span>Made with </span>
            <span className="text-[#ff3a3a]">♥</span>
            <span> by anime fans</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
