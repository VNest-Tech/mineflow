import React from 'react';
import { Truck, FileText, Package2, AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockChartData, mockTrucks, mockTruckProcesses } from '../../utils/mockData';
import KPICard from '../UI/KPICard';
import Badge from '../UI/Badge';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const kpis = [
    {
      title: t('total_trucks'),
      value: mockTrucks.length,
      icon: Truck,
      color: 'blue' as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: t('total_orders'),
      value: 145,
      icon: FileText,
      color: 'green' as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: t('royalty_compliance'),
      value: '87%',
      icon: Package2,
      color: 'yellow' as const,
      trend: { value: 3, isPositive: false }
    },
    {
      title: t('total_tonnage'),
      value: '2,450 MT',
      icon: TrendingUp,
      color: 'purple' as const,
      trend: { value: 15, isPositive: true }
    },
    {
      title: t('active_exceptions'),
      value: 8,
      icon: AlertTriangle,
      color: 'red' as const,
      trend: { value: 2, isPositive: false }
    }
  ];

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStageProgress = (currentStage: string) => {
    const stages = ['gate', 'loading', 'weigh_in', 'weigh_out', 'departed', 'delivered'];
    const currentIndex = stages.indexOf(currentStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
        <p className="text-gray-600 mt-1">Mining operations overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Active Truck Processes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Truck Processes</h3>
          <p className="text-sm text-gray-600">Real-time tracking of trucks in the system</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockTruckProcesses.map((process) => (
              <div key={process.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{process.truckNo}</h4>
                      <p className="text-sm text-gray-600">{process.driver.name}</p>
                    </div>
                  </div>
                  <Badge variant={process.isRoyalty ? 'success' : 'warning'}>
                    {process.isRoyalty ? t('royalty') : t('non_royalty')}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Current Stage: {process.currentStage.replace('_', ' ').toUpperCase()}</span>
                    <span>{Math.round(getStageProgress(process.currentStage))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(process.currentStage)}%` }}
                    />
                  </div>
                </div>

                {/* Stage Timeline */}
                <div className="space-y-2">
                  {process.stages.slice(0, 4).map((stage, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          stage.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <span className={stage.completed ? 'text-gray-900' : 'text-gray-500'}>
                          {stage.stage}
                        </span>
                        {process.isRoyalty && stage.royaltyCode && (
                          <Badge variant="info" size="sm">Scanned</Badge>
                        )}
                        {!process.isRoyalty && stage.videoUrl && (
                          <Badge variant="warning" size="sm">Video</Badge>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {formatTime(stage.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                {process.estimatedDeliveryTime && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Est. Delivery: {formatTime(process.estimatedDeliveryTime)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips per Day */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trips per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData.tripsPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Material Mix */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockChartData.materialMix}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {mockChartData.materialMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {mockChartData.materialMix.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Truck Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Truck Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('truck_no')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trips
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('net_weight')} (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders Served
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('exceptions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {truck.truckNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {truck.trips}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(truck.netWeight / 1000).toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {truck.ordersServed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      truck.exceptions === 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {truck.exceptions}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;