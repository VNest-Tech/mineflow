import React, { useState } from 'react';
import { Plus, Phone, MapPin, Camera, Video, QrCode, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockDispatches, mockOrders, mockTrucks, mockUsers } from '../../utils/mockData';
import { Dispatch } from '../../types';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const Dispatches: React.FC = () => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTruckRegModal, setShowTruckRegModal] = useState(false);
  const [isRoyalty, setIsRoyalty] = useState<boolean | null>(null);
  const [truckRegRoyalty, setTruckRegRoyalty] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [dispatches] = useState<Dispatch[]>(mockDispatches);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'in-transit': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddDispatch = () => {
    setIsRoyalty(null);
    setShowAddModal(true);
  };

  const handleTruckRegistration = () => {
    setTruckRegRoyalty(null);
    setCurrentStep(1);
    setShowTruckRegModal(true);
  };

  const drivers = mockUsers.filter(user => user.role === 'driver');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dispatches')}</h1>
          <p className="text-gray-600 mt-1">Manage truck dispatches and deliveries</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            icon={Plus}
            onClick={handleTruckRegistration}
          >
            Register Truck
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleAddDispatch}
          >
            {t('add')} Dispatch
          </Button>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dispatch_id')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('order_no')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('truck_no')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('driver')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dispatch.dispatchId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dispatch.orderNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dispatch.truckNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={dispatch.isRoyalty ? 'success' : 'warning'}>
                      {dispatch.isRoyalty ? t('royalty') : t('non_royalty')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="font-medium">{dispatch.driver.name}</div>
                      <div className="flex items-center text-gray-500">
                        <Phone className="h-3 w-3 mr-1" />
                        {dispatch.driver.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1 max-w-xs">
                      <div className="flex items-start text-gray-500">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{dispatch.deliveryAddress}</span>
                      </div>
                      <div className="text-gray-600">Contact: {dispatch.contactPerson}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(dispatch.netWeight / 1000).toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(dispatch.status)}>
                      {t(dispatch.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(dispatch.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Truck Registration Modal */}
      <Modal
        isOpen={showTruckRegModal}
        onClose={() => setShowTruckRegModal(false)}
        title="Register New Truck"
        size="lg"
      >
        <div className="space-y-6">
          {/* Step 1: Royalty Question */}
          {currentStep === 1 && truckRegRoyalty === null && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Is this truck Royalty or Non-Royalty?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                This determines the verification process for this truck throughout its operations.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="success"
                  onClick={() => setTruckRegRoyalty(true)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Royalty (Code Scan)
                </Button>
                <Button
                  variant="warning"
                  onClick={() => setTruckRegRoyalty(false)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Non-Royalty (Video Upload)
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Truck Details Form */}
          {currentStep === 1 && truckRegRoyalty !== null && (
            <form className="space-y-6">
              <div className={`p-4 rounded-lg ${truckRegRoyalty ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center mb-2">
                  {truckRegRoyalty ? (
                    <QrCode className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <Video className="h-5 w-5 text-yellow-600 mr-2" />
                  )}
                  <span className="font-medium text-gray-900">
                    {truckRegRoyalty ? 'Royalty Truck' : 'Non-Royalty Truck'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {truckRegRoyalty 
                    ? 'This truck will require royalty code scanning at Gate and Loading stages.'
                    : 'This truck will require video upload at Gate and Loading stages.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Truck Number *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MH12AB1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tare Weight (kg) *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 8500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity (MT) *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Contact *
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setTruckRegRoyalty(null)}>
                  Back
                </Button>
                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={() => setShowTruckRegModal(false)}>
                    {t('cancel')}
                  </Button>
                  <Button variant="primary" type="submit">
                    Register Truck
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Add Dispatch Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Dispatch"
        size="lg"
      >
        <div className="space-y-6">
          {/* Step 1: Royalty Question */}
          {isRoyalty === null && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Is this dispatch for a Royalty truck?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                This determines the verification process required during the truck's journey.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="success"
                  onClick={() => setIsRoyalty(true)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Yes - {t('royalty')}
                </Button>
                <Button
                  variant="warning"
                  onClick={() => setIsRoyalty(false)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  No - {t('non_royalty')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Form */}
          {isRoyalty !== null && (
            <form className="space-y-6">
              {/* Royalty-specific field */}
              {isRoyalty && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <QrCode className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Royalty Truck Process</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    This truck will require royalty code scanning at Gate and Loading stages.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Royalty Slip Scan *
                    </label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Non-royalty note */}
              {!isRoyalty && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Video className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Non-Royalty Truck Process</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    This truck will require video upload/livestream at Gate and Loading stages for verification.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('order_no')} *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select order</option>
                    {mockOrders.filter(order => order.status !== 'completed' && order.status !== 'cancelled').map(order => (
                      <option key={order.id} value={order.orderNo}>
                        {order.orderNo} - {order.customer}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('truck_no')} *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select truck</option>
                    {mockTrucks.filter(truck => truck.status === 'active').map(truck => (
                      <option key={truck.id} value={truck.truckNo}>
                        {truck.truckNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Driver *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select driver</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 XXXXX XXXXX"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Time *
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Load (MT) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 7.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('delivery_address')} *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter complete delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact_person')} *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contact person at delivery site"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setIsRoyalty(null)}>
                  Back
                </Button>
                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    {t('cancel')}
                  </Button>
                  <Button variant="primary" type="submit">
                    Create Dispatch
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dispatches;