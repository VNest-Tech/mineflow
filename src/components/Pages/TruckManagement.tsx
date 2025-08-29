import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminService } from '../../services/adminService';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import type { Tables } from '../../lib/supabase';

interface TruckData {
  id: string;
  truck_no: string;
  driver_id: string | null;
  driver_name: string | null;
  current_status: 'available' | 'assigned' | 'maintenance' | 'offline';
  last_location: string | null;
  last_updated: string | null;
  capacity: number;
  fuel_level: number;
  maintenance_due: string | null;
}

export const TruckManagement: React.FC = () => {
  const { user, signOut } = useAuth();
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [drivers, setDrivers] = useState<Tables<'users'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddTruck, setShowAddTruck] = useState(false);
  const [showAssignTruck, setShowAssignTruck] = useState(false);
  const [showEditTruck, setShowEditTruck] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null);
  
  // Form states
  const [newTruck, setNewTruck] = useState({
    truck_no: '',
    capacity: 0,
    fuel_level: 100,
    current_status: 'available' as const,
    maintenance_due: '',
  });
  
  const [editTruck, setEditTruck] = useState({
    truck_no: '',
    capacity: 0,
    fuel_level: 100,
    current_status: 'available' as const,
    maintenance_due: '',
  });

  useEffect(() => {
    loadTruckData();
  }, []);

  const loadTruckData = async () => {
    try {
      setLoading(true);
      const [truckProcesses, driversData] = await Promise.all([
        AdminService.getAllTruckProcesses(),
        AdminService.getDrivers(),
      ]);
      
      // Transform truck processes into truck data
      const truckMap = new Map<string, TruckData>();
      
      truckProcesses.forEach((process) => {
        if (!truckMap.has(process.truck_no)) {
          truckMap.set(process.truck_no, {
            id: process.id,
            truck_no: process.truck_no,
            driver_id: process.driver_id,
            driver_name: process.users?.name || null,
            current_status: process.status === 'in_process' ? 'assigned' : 'available',
            last_location: null,
            last_updated: process.updated_at,
            capacity: 25, // Default capacity
            fuel_level: 85, // Default fuel level
            maintenance_due: null,
          });
        }
      });
      
      setTrucks(Array.from(truckMap.values()));
      setDrivers(driversData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load truck data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTruck = async () => {
    try {
      // Create a new truck process as a placeholder
      await AdminService.createTruckProcess({
        truck_no: newTruck.truck_no,
        dispatch_id: `TRUCK_${newTruck.truck_no}`,
        is_royalty: false,
        current_stage: 'gate',
        start_time: new Date().toISOString(),
        status: 'in_process',
      });
      
      setShowAddTruck(false);
      setNewTruck({
        truck_no: '',
        capacity: 0,
        fuel_level: 100,
        current_status: 'available',
        maintenance_due: '',
      });
      loadTruckData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add truck');
    }
  };

  const handleEditTruck = async () => {
    if (!selectedTruck) return;
    
    try {
      // Update truck process
      await AdminService.updateTruckProcess(selectedTruck.id, {
        truck_no: editTruck.truck_no,
        status: editTruck.current_status === 'assigned' ? 'in_process' : 'delivered',
      });
      
      setShowEditTruck(false);
      setSelectedTruck(null);
      loadTruckData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update truck');
    }
  };

  const handleAssignTruck = async (driverId: string) => {
    if (!selectedTruck) return;
    
    try {
      await AdminService.assignDriverToTruck(selectedTruck.id, driverId);
      setShowAssignTruck(false);
      setSelectedTruck(null);
      loadTruckData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign truck');
    }
  };

  const handleUnassignTruck = async (truckId: string) => {
    try {
      await AdminService.unassignDriverFromTruck(truckId);
      loadTruckData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unassign truck');
    }
  };

  const handleDeleteTruck = async (truckId: string) => {
    if (!confirm('Are you sure you want to delete this truck?')) return;
    
    try {
      await AdminService.deleteTruckProcess(truckId);
      loadTruckData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete truck');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'assigned': return 'blue';
      case 'maintenance': return 'yellow';
      case 'offline': return 'red';
      default: return 'gray';
    }
  };

  const getFuelColor = (level: number) => {
    if (level > 70) return 'green';
    if (level > 30) return 'yellow';
    return 'red';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading truck management...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Truck Management</h1>
              <p className="text-gray-600">Manage fleet operations and assignments</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowAddTruck(true)} variant="primary">
                Add New Truck
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

        {/* Truck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => (
            <div key={truck.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{truck.truck_no}</h3>
                  <p className="text-sm text-gray-500">Truck ID: {truck.id.slice(0, 8)}</p>
                </div>
                <Badge variant={getStatusColor(truck.current_status)}>
                  {truck.current_status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Driver:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {truck.driver_name || 'Unassigned'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="text-sm font-medium text-gray-900">{truck.capacity} tons</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fuel Level:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          getFuelColor(truck.fuel_level) === 'green' ? 'bg-green-500' :
                          getFuelColor(truck.fuel_level) === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${truck.fuel_level}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      getFuelColor(truck.fuel_level) === 'green' ? 'text-green-600' :
                      getFuelColor(truck.fuel_level) === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {truck.fuel_level}%
                    </span>
                  </div>
                </div>

                {truck.maintenance_due && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maintenance Due:</span>
                    <span className="text-sm font-medium text-red-600">
                      {new Date(truck.maintenance_due).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {truck.last_updated && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="text-sm text-gray-500">
                      {new Date(truck.last_updated).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200">
                {truck.driver_id ? (
                  <Button
                    onClick={() => handleUnassignTruck(truck.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Unassign
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedTruck(truck);
                      setShowAssignTruck(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Assign Driver
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setSelectedTruck(truck);
                    setEditTruck({
                      truck_no: truck.truck_no,
                      capacity: truck.capacity,
                      fuel_level: truck.fuel_level,
                      current_status: truck.current_status,
                      maintenance_due: truck.maintenance_due || '',
                    });
                    setShowEditTruck(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
                
                <Button
                  onClick={() => handleDeleteTruck(truck.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {trucks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first truck to the fleet.</p>
            <Button onClick={() => setShowAddTruck(true)} variant="primary">
              Add New Truck
            </Button>
          </div>
        )}
      </div>

      {/* Add Truck Modal */}
      <Modal
        isOpen={showAddTruck}
        onClose={() => setShowAddTruck(false)}
        title="Add New Truck"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Truck Number</label>
            <input
              type="text"
              value={newTruck.truck_no}
              onChange={(e) => setNewTruck({ ...newTruck, truck_no: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., MH12AB1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity (tons)</label>
            <input
              type="number"
              value={newTruck.capacity}
              onChange={(e) => setNewTruck({ ...newTruck, capacity: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Level (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newTruck.fuel_level}
              onChange={(e) => setNewTruck({ ...newTruck, fuel_level: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={newTruck.current_status}
              onChange={(e) => setNewTruck({ ...newTruck, current_status: e.target.value as any })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Due Date</label>
            <input
              type="date"
              value={newTruck.maintenance_due}
              onChange={(e) => setNewTruck({ ...newTruck, maintenance_due: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowAddTruck(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddTruck} variant="primary">
              Add Truck
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Truck Modal */}
      <Modal
        isOpen={showEditTruck}
        onClose={() => setShowEditTruck(false)}
        title="Edit Truck"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Truck Number</label>
            <input
              type="text"
              value={editTruck.truck_no}
              onChange={(e) => setEditTruck({ ...editTruck, truck_no: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity (tons)</label>
            <input
              type="number"
              value={editTruck.capacity}
              onChange={(e) => setEditTruck({ ...editTruck, capacity: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Level (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={editTruck.fuel_level}
              onChange={(e) => setEditTruck({ ...editTruck, fuel_level: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editTruck.current_status}
              onChange={(e) => setEditTruck({ ...editTruck, current_status: e.target.value as any })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Due Date</label>
            <input
              type="date"
              value={editTruck.maintenance_due}
              onChange={(e) => setEditTruck({ ...editTruck, maintenance_due: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowEditTruck(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleEditTruck} variant="primary">
              Update Truck
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Driver Modal */}
      <Modal
        isOpen={showAssignTruck}
        onClose={() => setShowAssignTruck(false)}
        title="Assign Driver to Truck"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Assign a driver to: <strong>{selectedTruck?.truck_no}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Driver</label>
            <select
              onChange={(e) => handleAssignTruck(e.target.value)}
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
            <Button onClick={() => setShowAssignTruck(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
