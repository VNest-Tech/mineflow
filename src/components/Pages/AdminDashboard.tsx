import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminService } from '../../services/adminService';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import KPICard from '../UI/KPICard';
import Modal from '../UI/Modal';
import type { Tables } from '../../lib/supabase';

interface DashboardStats {
  totalProcesses: number;
  totalDrivers: number;
  activeProcesses: number;
}

export const AdminDashboard: React.FC = () => {
  const { user, signOut, driverProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [truckProcesses, setTruckProcesses] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<Tables<'users'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateProcess, setShowCreateProcess] = useState(false);
  const [showCreateDriver, setShowCreateDriver] = useState(false);
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  
  // Form states
  const [newProcess, setNewProcess] = useState({
    truck_no: '',
    dispatch_id: '',
    is_royalty: false,
    current_stage: 'gate',
    start_time: new Date().toISOString().slice(0, 16),
    estimated_delivery_time: '',
  });
  
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    truck_assigned: '',
    role: 'driver' as const,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, processesData, driversData] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getAllTruckProcesses(),
        AdminService.getDrivers(),
      ]);
      
      setStats(statsData);
      setTruckProcesses(processesData);
      setDrivers(driversData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProcess = async () => {
    try {
      await AdminService.createTruckProcess({
        ...newProcess,
        status: 'in_process',
        estimated_delivery_time: newProcess.estimated_delivery_time || null,
      });
      setShowCreateProcess(false);
      setNewProcess({
        truck_no: '',
        dispatch_id: '',
        is_royalty: false,
        current_stage: 'gate',
        start_time: new Date().toISOString().slice(0, 16),
        estimated_delivery_time: '',
      });
      loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create process');
    }
  };

  const handleCreateDriver = async () => {
    try {
      // Note: This creates a profile entry, but you'll need to create the auth user separately
      await AdminService.createUser({
        ...newDriver,
        id: crypto.randomUUID(), // Temporary ID, will be updated when auth user is created
      });
      setShowCreateDriver(false);
      setNewDriver({
        name: '',
        email: '',
        phone: '',
        truck_assigned: '',
        role: 'driver',
      });
      loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create driver');
    }
  };

  const handleAssignDriver = async (driverId: string) => {
    if (!selectedProcess) return;
    
    try {
      await AdminService.assignDriverToTruck(selectedProcess.id, driverId);
      setShowAssignDriver(false);
      setSelectedProcess(null);
      loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign driver');
    }
  };

  const handleDeleteProcess = async (processId: string) => {
    if (!confirm('Are you sure you want to delete this process?')) return;
    
    try {
      await AdminService.deleteTruckProcess(processId);
      loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete process');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_process': return 'blue';
      case 'delivered': return 'green';
      case 'exception': return 'red';
      default: return 'gray';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'gate': return 'gray';
      case 'loading': return 'yellow';
      case 'weigh_in': return 'blue';
      case 'weigh_out': return 'purple';
      case 'departed': return 'orange';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MineFlow Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {driverProfile?.name || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user?.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Total Processes"
              value={stats.totalProcesses.toString()}
              change="+12%"
              changeType="positive"
            />
            <KPICard
              title="Active Drivers"
              value={stats.totalDrivers.toString()}
              change="+5%"
              changeType="positive"
            />
            <KPICard
              title="Active Processes"
              value={stats.activeProcesses.toString()}
              change="+8%"
              changeType="positive"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setShowCreateProcess(true)} variant="primary">
            Create New Process
          </Button>
          <Button onClick={() => setShowCreateDriver(true)} variant="secondary">
            Add New Driver
          </Button>
        </div>

        {/* Truck Processes Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Truck Processes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispatch ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Truck No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {truckProcesses.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {process.dispatch_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {process.truck_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {process.users?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStageColor(process.current_stage)}>
                        {process.current_stage}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(process.status)}>
                        {process.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedProcess(process);
                          setShowAssignDriver(true);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Assign Driver
                      </Button>
                      <Button
                        onClick={() => handleDeleteProcess(process.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Drivers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Truck Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {driver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.truck_assigned || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={driver.truck_assigned ? 'green' : 'gray'}>
                        {driver.truck_assigned ? 'Assigned' : 'Available'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Process Modal */}
      <Modal
        isOpen={showCreateProcess}
        onClose={() => setShowCreateProcess(false)}
        title="Create New Truck Process"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Truck Number</label>
            <input
              type="text"
              value={newProcess.truck_no}
              onChange={(e) => setNewProcess({ ...newProcess, truck_no: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dispatch ID</label>
            <input
              type="text"
              value={newProcess.dispatch_id}
              onChange={(e) => setNewProcess({ ...newProcess, dispatch_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Stage</label>
            <select
              value={newProcess.current_stage}
              onChange={(e) => setNewProcess({ ...newProcess, current_stage: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="gate">Gate</option>
              <option value="loading">Loading</option>
              <option value="weigh_in">Weigh In</option>
              <option value="weigh_out">Weigh Out</option>
              <option value="departed">Departed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              value={newProcess.start_time}
              onChange={(e) => setNewProcess({ ...newProcess, start_time: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Delivery Time</label>
            <input
              type="datetime-local"
              value={newProcess.estimated_delivery_time}
              onChange={(e) => setNewProcess({ ...newProcess, estimated_delivery_time: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newProcess.is_royalty}
              onChange={(e) => setNewProcess({ ...newProcess, is_royalty: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Is Royalty</label>
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowCreateProcess(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreateProcess} variant="primary">
              Create Process
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Driver Modal */}
      <Modal
        isOpen={showCreateDriver}
        onClose={() => setShowCreateDriver(false)}
        title="Add New Driver"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newDriver.email}
              onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={newDriver.phone}
              onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Truck Assigned</label>
            <input
              type="text"
              value={newDriver.truck_assigned}
              onChange={(e) => setNewDriver({ ...newDriver, truck_assigned: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave empty if not assigned"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowCreateDriver(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreateDriver} variant="primary">
              Add Driver
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Driver Modal */}
      <Modal
        isOpen={showAssignDriver}
        onClose={() => setShowAssignDriver(false)}
        title="Assign Driver to Process"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Assign a driver to: <strong>{selectedProcess?.dispatch_id}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Driver</label>
            <select
              onChange={(e) => handleAssignDriver(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a driver...</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.truck_assigned || 'No truck assigned'})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowAssignDriver(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
