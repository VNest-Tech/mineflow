import React, { useState } from 'react';
import { Eye, Clock, Weight, FileImage } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockTrucks } from '../../utils/mockData';
import { TruckStage } from '../../types';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const Trucks: React.FC = () => {
  const { t } = useLanguage();
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  const mockTruckStages: TruckStage[] = [
    { stage: 'Gate', timestamp: '2025-01-27T08:30:00Z', operator: 'Security Guard', completed: true, media: ['gate-1.jpg'] },
    { stage: 'Loading', timestamp: '2025-01-27T08:45:00Z', operator: 'Loader Operator', completed: true, media: ['loading-1.jpg', 'loading-2.jpg'] },
    { stage: 'Weigh In', timestamp: '2025-01-27T09:15:00Z', operator: 'Weighbridge Operator', completed: true },
    { stage: 'Weigh Out', timestamp: '2025-01-27T09:30:00Z', operator: 'Weighbridge Operator', completed: false },
    { stage: 'Departed', timestamp: '', operator: '', completed: false },
    { stage: 'Delivered', timestamp: '', operator: '', completed: false }
  ];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const selectedTruck = mockTrucks.find(truck => truck.id === selectedTruckId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('trucks')}</h1>
          <p className="text-gray-600 mt-1">Monitor truck operations and stages</p>
        </div>
      </div>

      {/* Trucks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrucks.map((truck) => (
          <div key={truck.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{truck.truckNo}</h3>
              <Badge variant={truck.isRoyalty ? 'success' : 'warning'}>
                {truck.isRoyalty ? t('royalty') : t('non_royalty')}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{t('arrival_time')}: {formatTime(truck.arrivalTime)}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Weight className="h-4 w-4 mr-2" />
                <span>{t('net_weight')}: {(truck.netWeight / 1000).toFixed(1)} MT</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('current_stage')}:</span>
                <Badge variant="info">{truck.currentStage}</Badge>
              </div>

              {truck.media.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <FileImage className="h-4 w-4 mr-2" />
                  <span>{truck.media.length} media files</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                icon={Eye}
                onClick={() => setSelectedTruckId(truck.id)}
                className="w-full justify-center"
              >
                {t('view')} Timeline
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Truck Timeline Modal */}
      <Modal
        isOpen={selectedTruckId !== null}
        onClose={() => setSelectedTruckId(null)}
        title={selectedTruck ? `${selectedTruck.truckNo} - Stage Timeline` : ''}
        size="lg"
      >
        {selectedTruck && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type: </span>
                  <Badge variant={selectedTruck.isRoyalty ? 'success' : 'warning'}>
                    {selectedTruck.isRoyalty ? t('royalty') : t('non_royalty')}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">{t('net_weight')}: </span>
                  <span className="font-medium">{(selectedTruck.netWeight / 1000).toFixed(1)} MT</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {mockTruckStages.map((stage, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {stage.completed ? '✓' : index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{stage.stage}</h4>
                      {stage.completed && (
                        <span className="text-xs text-gray-500">
                          {formatTime(stage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    {stage.completed && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-600">Operator: {stage.operator}</p>
                        {stage.media && stage.media.length > 0 && (
                          <div className="mt-2 flex space-x-2">
                            {stage.media.map((media, mediaIndex) => (
                              <div key={mediaIndex} className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
                                <FileImage className="h-4 w-4 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Trucks;