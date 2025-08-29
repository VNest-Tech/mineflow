import React, { useState } from 'react';
import { AlertTriangle, Copy, Clock, Camera, Scale } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockExceptions } from '../../utils/mockData';
import { Exception } from '../../types';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

const Exceptions: React.FC = () => {
  const { t } = useLanguage();
  const [exceptions] = useState<Exception[]>(mockExceptions);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    return status === 'resolved' ? 'success' : 'warning';
  };

  const getExceptionIcon = (issue: string) => {
    if (issue.toLowerCase().includes('duplicate')) return Copy;
    if (issue.toLowerCase().includes('expired')) return Clock;
    if (issue.toLowerCase().includes('media') || issue.toLowerCase().includes('video')) return Camera;
    if (issue.toLowerCase().includes('weight')) return Scale;
    return AlertTriangle;
  };

  const exceptionTypes = [
    { title: t('duplicate_pass'), count: 3, icon: Copy, color: 'text-red-600 bg-red-100' },
    { title: t('expired_pass'), count: 2, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { title: t('missing_media'), count: 2, icon: Camera, color: 'text-blue-600 bg-blue-100' },
    { title: t('abnormal_weight'), count: 1, icon: Scale, color: 'text-purple-600 bg-purple-100' },
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('exceptions')}</h1>
        <p className="text-gray-600 mt-1">Monitor and resolve operational exceptions</p>
      </div>

      {/* Exception Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exceptionTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{type.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{type.count}</p>
                </div>
                <div className={`${type.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exceptions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active {t('exceptions')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('truck_no')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dispatch_id')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exceptions.map((exception) => {
                const Icon = getExceptionIcon(exception.issue);
                return (
                  <tr key={exception.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{exception.issue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exception.truckNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exception.dispatchId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exception.stage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getSeverityVariant(exception.severity)}>
                        {exception.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(exception.status)}>
                        {exception.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(exception.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exception.status === 'open' && (
                        <Button variant="success" size="sm">
                          Resolve
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Exceptions;