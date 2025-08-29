import React from 'react';
import { Download, FileText, BarChart, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../UI/Button';

const Reports: React.FC = () => {
  const { t } = useLanguage();

  const reportTypes = [
    {
      title: 'Trip Register',
      description: 'Complete list of all truck trips with timestamps and weights',
      icon: FileText,
      formats: ['CSV', 'XLSX']
    },
    {
      title: 'Royalty Register',
      description: 'Royalty compliance report with scan details and validations',
      icon: BarChart,
      formats: ['CSV', 'XLSX']
    },
    {
      title: 'Dispatch Register',
      description: 'All dispatch records with driver and delivery information',
      icon: TrendingUp,
      formats: ['CSV', 'XLSX']
    },
    {
      title: 'Order Ledger',
      description: 'Customer order status with financial summary',
      icon: FileText,
      formats: ['CSV', 'XLSX']
    },
    {
      title: 'Material Mix Report',
      description: 'Material-wise distribution and quantity analysis',
      icon: BarChart,
      formats: ['CSV', 'XLSX']
    },
    {
      title: 'Exceptions Report',
      description: 'All exceptions with severity and resolution status',
      icon: TrendingUp,
      formats: ['CSV', 'XLSX']
    }
  ];

  const handleExport = (reportType: string, format: string) => {
    // Mock export - in real implementation, this would call an API
    const filename = `${reportType.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
    
    // Create a mock CSV content for demonstration
    let csvContent = '';
    
    switch (reportType) {
      case 'Trip Register':
        csvContent = `Truck No,${t('truck_no')},Date,Time,Stage,Weight,Operator\nMH12AB1234,MH12AB1234,2025-01-27,08:30,Loading,7000,Operator 1\n`;
        break;
      case 'Royalty Register':
        csvContent = `Truck No,${t('truck_no')},Royalty Type,${t('royalty')},Scan Status,Date\nMH12AB1234,MH12AB1234,Valid,${t('royalty')},Valid,2025-01-27\n`;
        break;
      default:
        csvContent = `Report,${t('reports')},Generated On\n${reportType},${reportType},${new Date().toLocaleString()}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('reports')}</h1>
        <p className="text-gray-600 mt-1">Generate and export operational reports</p>
      </div>

      {/* Export Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Multilingual Export</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>All reports are exported with bilingual headers (English + {t('language') === 'en' ? 'Hindi/Marathi' : 'Selected Language'}) for better accessibility.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Export Formats</p>
                <div className="flex space-x-2">
                  {report.formats.map((format) => (
                    <Button
                      key={format}
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={() => handleExport(report.title, format)}
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">247</p>
            <p className="text-sm text-gray-600">Total Trips This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">89%</p>
            <p className="text-sm text-gray-600">Royalty Compliance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">3,240</p>
            <p className="text-sm text-gray-600">Total Tonnage (MT)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">12</p>
            <p className="text-sm text-gray-600">Open Exceptions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;