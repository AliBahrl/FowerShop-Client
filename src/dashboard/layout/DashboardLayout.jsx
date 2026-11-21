import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
  const { canEdit } = useAuth();

  return (
    <div className="flex min-h-screen ">
      <DashboardSidebar />
      <main className="flex-1 p-6 mt-10">
        {!canEdit && (
          <div className="mb-4 px-4 py-2 bg-pink-50 text-blue-800 border border-purple-200 rounded-lg text-sm">
            Onlyfor View "cant Edit or Delete or Add any product the user only for view"
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;