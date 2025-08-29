import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Clock, CheckCircle, AlertCircle, Phone, Navigation, LogOut, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { DriverService, DeliveryProofData } from '../../services/driverService';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import type { Tables } from '../../lib/supabase';

interface DriverStats {
  completedToday: number;
  totalCompleted: number;
  inProgress: number;
  exceptions: number;
}

const DriverDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, driverProfile, signOut } = useAuth();
  
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState<string | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [deliveryVideo, setDeliveryVideo] = useState<File | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [myDispatches, setMyDispatches] = useState<(Tables<'truck_processes'> & {
    truck_stages: Tables<'truck_stages'>[];
    delivery_proofs?: Tables<'delivery_proofs'>[];
  })[]>([]);
  
  const [stats, setStats] = useState<DriverStats>({
    completedToday: 0,
    totalCompleted: 0,
    inProgress: 0,
    exceptions: 0
  });

  useEffect(() => {
    if (user && driverProfile) {
      loadDriverData();
    }
  }, [user, driverProfile]);

  const loadDriverData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [dispatches, driverStats] = await Promise.all([
        DriverService.getDriverDispatches(user.id),
        DriverService.getDriverStats(user.id)
      ]);
      
      setMyDispatches(dispatches);
      setStats(driverStats);
    } catch (err) {
      console.error('Error loading driver data:', err);
      setError('Failed to load driver data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_process': return 'text-blue-600 bg-blue-100';
      case 'exception': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCurrentStageDisplay = (stage: string) => {
    const stageMap: Record<string, string> = {
      'gate': 'At Gate',
      'loading': 'Loading',
      'weigh_in': 'Weighing In',
      'weigh_out': 'Weighing Out',
      'departed': 'En Route',
      'delivered': 'Delivered'
    };
    return stageMap[stage] || stage;
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  const handleMarkDelivered = (dispatchId: string) => {
    setSelectedDispatch(dispatchId);
    setShowDeliveryModal(true);
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispatch || !deliveryPhoto) return;

    try {
      setSubmitting(true);
      setError('');

      // Get current location
      const location = await DriverService.getCurrentLocation();
      const locationString = location ? `${location.lat}, ${location.lng}` : undefined;

      const proofData: DeliveryProofData = {
        photo: deliveryPhoto,
        video: deliveryVideo || undefined,
        notes: deliveryNotes,
        location: locationString
      };

      // Upload delivery proof
      await DriverService.uploadDeliveryProof(selectedDispatch, proofData);

      // Update dispatch status
      await DriverService.updateDispatchStatus(selectedDispatch, 'delivered', 'delivered');

      // Refresh data
      await loadDriverData();

      // Reset form
      setShowDeliveryModal(false);
      setDeliveryPhoto(null);
      setDeliveryVideo(null);
      setDeliveryNotes('');
      setSelectedDispatch(null);
    } catch (err) {
      console.error('Error submitting delivery:', err);
      setError('Failed to submit delivery. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Early return if no driver profile
  if (!driverProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Driver Profile Found</h3>
          <p className="text-gray-600">Please contact your administrator to set up your driver account.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading driver dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Profile and Logout */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {driverProfile.name}</h1>
            <p className="text-blue-100 mt-1">Driver Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Truck Assigned</p>
              <p className="text-xl font-bold">{driverProfile.truck_assigned || 'Not Assigned'}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" icon={User} className="text-white hover:bg-blue-500">
                Profile
              </Button>
              <Button variant="ghost" size="sm" icon={LogOut} onClick={handleSignOut} className="text-white hover:bg-blue-500">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.exceptions}</p>
              <p className="text-sm text-gray-600">Exceptions</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Dispatches */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Dispatches</h3>
          <p className="text-sm text-gray-600">Track your assigned deliveries</p>
        </div>
        <div className="p-6">
          {myDispatches.length === 0 ? (
            <div className="text-center py-8">
              <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Dispatches</h3>
              <p className="text-gray-600">You don't have any active dispatches at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myDispatches.map((dispatch) => (
                <div key={dispatch.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Navigation className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Dispatch {dispatch.dispatch_id}</h4>
                        <p className="text-sm text-gray-600">Truck: {dispatch.truck_no}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={dispatch.is_royalty ? 'success' : 'warning'}>
                        {dispatch.is_royalty ? t('royalty') : t('non_royalty')}
                      </Badge>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dispatch.status)}`}>
                        {getCurrentStageDisplay(dispatch.current_stage)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Started: {formatTime(dispatch.start_time)}</span>
                    </div>
                    {dispatch.estimated_delivery_time && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Est. Delivery: {formatTime(dispatch.estimated_delivery_time)}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((dispatch.truck_stages.filter(s => s.completed).length / dispatch.truck_stages.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(dispatch.truck_stages.filter(s => s.completed).length / dispatch.truck_stages.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" icon={Phone}>
                        Call Support
                      </Button>
                      <Button variant="ghost" size="sm" icon={MapPin}>
                        View Route
                      </Button>
                    </div>
                    
                    {dispatch.current_stage === 'departed' && dispatch.status === 'in_process' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        icon={CheckCircle}
                        onClick={() => handleMarkDelivered(dispatch.id)}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mark Delivered Modal */}
      <Modal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        title="Mark Delivery Complete"
        size="md"
      >
        <form onSubmit={handleDeliverySubmit} className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Delivery Confirmation</span>
            </div>
            <p className="text-sm text-green-700">
              Please upload delivery proof to complete this dispatch.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Photo * (Required)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setDeliveryPhoto(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Take a photo of the delivered material at the site
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Video (Optional)
            </label>
            <input
              type="file"
              accept="video/*"
              capture="environment"
              onChange={(e) => setDeliveryVideo(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Record a short video of the delivery
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Notes
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any additional notes about the delivery..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeliveryModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              type="submit" 
              icon={CheckCircle}
              loading={submitting}
              disabled={submitting}
            >
              Confirm Delivery
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DriverDashboard;