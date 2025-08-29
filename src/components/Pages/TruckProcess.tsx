import React, { useState } from 'react';
import { 
  QrCode, 
  Video, 
  Camera, 
  Scale, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Play
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockTruckProcesses } from '../../utils/mockData';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const TruckProcess: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [isRoyalty, setIsRoyalty] = useState<boolean>(false);

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStageIcon = (stage: string, completed: boolean) => {
    const iconClass = completed ? 'text-green-600' : 'text-gray-400';
    
    switch (stage.toLowerCase()) {
      case 'gate':
        return <QrCode className={`h-5 w-5 ${iconClass}`} />;
      case 'loading':
        return <Upload className={`h-5 w-5 ${iconClass}`} />;
      case 'weigh in':
      case 'weigh out':
        return <Scale className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <CheckCircle className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const handleStageAction = (processId: string, stage: string, royalty: boolean) => {
    setSelectedProcess(processId);
    setCurrentStage(stage);
    setIsRoyalty(royalty);
    setShowStageModal(true);
  };

  const handleStageComplete = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would update the stage status
    console.log('Stage completed:', currentStage, 'for process:', selectedProcess);
    setShowStageModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Truck Process Monitoring</h1>
        <p className="text-gray-600 mt-1">Real-time tracking of truck operations and stages</p>
      </div>

      {/* Active Processes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTruckProcesses.map((process) => (
          <div key={process.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-blue-600">{process.truckNo.slice(-4)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{process.truckNo}</h3>
                  <p className="text-sm text-gray-600">{process.driver.name}</p>
                </div>
              </div>
              <Badge variant={process.isRoyalty ? 'success' : 'warning'}>
                {process.isRoyalty ? t('royalty') : t('non_royalty')}
              </Badge>
            </div>

            {/* Stage Timeline */}
            <div className="space-y-4">
              {process.stages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStageIcon(stage.stage, stage.completed)}
                    <div>
                      <p className={`font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {stage.stage}
                      </p>
                      {stage.completed && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(stage.timestamp)}</span>
                          {stage.operator && <span>• {stage.operator}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Verification Indicators */}
                    {stage.completed && process.isRoyalty && stage.royaltyCode && (
                      <Badge variant="success" size="sm">
                        <QrCode className="h-3 w-3 mr-1" />
                        Scanned
                      </Badge>
                    )}
                    {stage.completed && !process.isRoyalty && stage.videoUrl && (
                      <Badge variant="warning" size="sm">
                        <Video className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    )}
                    {stage.completed && stage.media && stage.media.length > 0 && (
                      <Badge variant="info" size="sm">
                        <Camera className="h-3 w-3 mr-1" />
                        {stage.media.length}
                      </Badge>
                    )}

                    {/* Action Button */}
                    {!stage.completed && index === process.stages.findIndex(s => !s.completed) && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStageAction(process.id, stage.stage, process.isRoyalty)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round((process.stages.filter(s => s.completed).length / process.stages.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(process.stages.filter(s => s.completed).length / process.stages.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stage Completion Modal */}
      <Modal
        isOpen={showStageModal}
        onClose={() => setShowStageModal(false)}
        title={`Complete ${currentStage} Stage`}
        size="md"
      >
        <form onSubmit={handleStageComplete} className="space-y-6">
          <div className={`p-4 rounded-lg ${isRoyalty ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="flex items-center mb-2">
              {isRoyalty ? (
                <QrCode className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <Video className="h-5 w-5 text-yellow-600 mr-2" />
              )}
              <span className="font-medium text-gray-900">
                {isRoyalty ? 'Royalty Verification Required' : 'Video Upload Required'}
              </span>
            </div>
            <p className="text-sm text-gray-700">
              {isRoyalty 
                ? 'Scan the royalty code to verify compliance for this stage.'
                : 'Upload a video or start livestream to document this stage.'
              }
            </p>
          </div>

          {/* Royalty Code Scanning */}
          {isRoyalty && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Royalty Code *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter or scan royalty code"
                  required
                />
                <Button variant="secondary" type="button" icon={QrCode}>
                  Scan
                </Button>
              </div>
            </div>
          )}

          {/* Video Upload for Non-Royalty */}
          {!isRoyalty && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video *
                </label>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">OR</p>
                <Button variant="warning" type="button" icon={Play}>
                  Start Live Stream
                </Button>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Weight Entry for Weighing Stages */}
          {(currentStage.toLowerCase().includes('weigh')) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter weight"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operator Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Operator name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any additional notes for this stage..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowStageModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" icon={CheckCircle}>
              Complete Stage
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TruckProcess;