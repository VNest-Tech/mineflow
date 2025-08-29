import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Pages/Dashboard';
import Trucks from './components/Pages/Trucks';
import Orders from './components/Pages/Orders';
import Dispatches from './components/Pages/Dispatches';
import Materials from './components/Pages/Materials';
import Exceptions from './components/Pages/Exceptions';
import Reports from './components/Pages/Reports';
import DriverDashboard from './components/Pages/DriverDashboard';
import { AdminDashboard } from './components/Pages/AdminDashboard';
import TruckProcess from './components/Pages/TruckProcess';
import LoginForm from './components/Auth/LoginForm';

function AppContent() {
  const { user, driverProfile, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading MineFlow...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show driver dashboard if user is a driver
  if (driverProfile?.role === 'driver') {
    return <DriverDashboard />;
  }

  // Show admin dashboard for other roles
  return <AdminDashboard />;
}

function LegacyAdminDashboard() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { driverProfile } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'trucks': return <Trucks />;
      case 'orders': return <Orders />;
      case 'dispatches': return <Dispatches />;
      case 'materials': return <Materials />;
      case 'exceptions': return <Exceptions />;
      case 'reports': return <Reports />;
      case 'truck-process': return <TruckProcess />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          userRole={driverProfile?.role || 'admin'}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;