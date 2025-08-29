import { Truck, Order, Dispatch, Material, Category, Exception } from '../types';
import { TruckProcess, User } from '../types';

export const mockTrucks: Truck[] = [
  {
    id: '1',
    truckNo: 'MH12AB1234',
    isRoyalty: true,
    arrivalTime: '2025-01-27T08:30:00Z',
    grossWeight: 15500,
    tareWeight: 8500,
    netWeight: 7000,
    currentStage: 'Weigh Out',
    status: 'active',
    trips: 12,
    ordersServed: 8,
    exceptions: 0,
    media: ['truck1-1.jpg', 'truck1-2.jpg']
  },
  {
    id: '2',
    truckNo: 'MH14CD5678',
    isRoyalty: false,
    arrivalTime: '2025-01-27T09:15:00Z',
    grossWeight: 18200,
    tareWeight: 9200,
    netWeight: 9000,
    currentStage: 'Weigh Out',
    status: 'active',
    trips: 8,
    ordersServed: 6,
    exceptions: 1,
    media: ['truck2-1.jpg']
  },
  {
    id: '3',
    truckNo: 'MH16EF9012',
    isRoyalty: true,
    arrivalTime: '2025-01-27T07:45:00Z',
    grossWeight: 16800,
    tareWeight: 8800,
    netWeight: 8000,
    currentStage: 'Delivered',
    status: 'inactive',
    trips: 15,
    ordersServed: 12,
    exceptions: 0,
    media: ['truck3-1.jpg', 'truck3-2.jpg', 'truck3-3.jpg']
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'राम शर्मा',
    email: 'ram.sharma@company.com',
    role: 'driver',
    phone: '+91 9876543210',
    truckAssigned: 'MH12AB1234'
  },
  {
    id: '2',
    name: 'अभय पटेल',
    email: 'abhay.patel@company.com',
    role: 'driver',
    phone: '+91 9876543211',
    truckAssigned: 'MH14CD5678'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    phone: '+91 9876543212'
  }
];

export const mockTruckProcesses: TruckProcess[] = [
  {
    id: '1',
    truckNo: 'MH12AB1234',
    dispatchId: 'DSP001',
    isRoyalty: true,
    currentStage: 'weigh_out',
    driver: {
      id: '1',
      name: 'राम शर्मा',
      phone: '+91 9876543210'
    },
    startTime: '2025-01-27T08:30:00Z',
    estimatedDeliveryTime: '2025-01-27T14:30:00Z',
    stages: [
      {
        stage: 'Gate',
        timestamp: '2025-01-27T08:30:00Z',
        operator: 'Security Guard',
        completed: true,
        royaltyCode: 'ROY123456789',
        media: ['gate-scan.jpg']
      },
      {
        stage: 'Loading',
        timestamp: '2025-01-27T08:45:00Z',
        operator: 'Loader Operator',
        completed: true,
        media: ['loading-1.jpg', 'loading-2.jpg']
      },
      {
        stage: 'Weigh In',
        timestamp: '2025-01-27T09:15:00Z',
        operator: 'Weighbridge Operator',
        completed: true,
        notes: 'Gross Weight: 15.5 MT'
      },
      {
        stage: 'Weigh Out',
        timestamp: '2025-01-27T09:30:00Z',
        operator: 'Weighbridge Operator',
        completed: true,
        notes: 'Net Weight: 7.0 MT'
      },
      {
        stage: 'Departed',
        timestamp: '2025-01-27T09:45:00Z',
        operator: 'Gate Security',
        completed: true
      },
      {
        stage: 'Delivered',
        timestamp: '',
        operator: '',
        completed: false
      }
    ],
    status: 'in_process'
  },
  {
    id: '2',
    truckNo: 'MH14CD5678',
    dispatchId: 'DSP002',
    isRoyalty: false,
    currentStage: 'loading',
    driver: {
      id: '2',
      name: 'अभय पटेल',
      phone: '+91 9876543211'
    },
    startTime: '2025-01-27T09:15:00Z',
    estimatedDeliveryTime: '2025-01-27T15:15:00Z',
    stages: [
      {
        stage: 'Gate',
        timestamp: '2025-01-27T09:15:00Z',
        operator: 'Security Guard',
        completed: true,
        videoUrl: 'gate-video-001.mp4',
        media: ['gate-video-thumb.jpg']
      },
      {
        stage: 'Loading',
        timestamp: '2025-01-27T09:30:00Z',
        operator: 'Loader Operator',
        completed: true,
        videoUrl: 'loading-video-001.mp4',
        media: ['loading-video-thumb.jpg']
      },
      {
        stage: 'Weigh In',
        timestamp: '',
        operator: '',
        completed: false
      },
      {
        stage: 'Weigh Out',
        timestamp: '',
        operator: '',
        completed: false
      },
      {
        stage: 'Departed',
        timestamp: '',
        operator: '',
        completed: false
      },
      {
        stage: 'Delivered',
        timestamp: '',
        operator: '',
        completed: false
      }
    ],
    status: 'in_process'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD001',
    customer: 'ABC Construction Pvt Ltd',
    material: 'Stone Aggregate 20mm',
    orderedQty: 500,
    deliveredQty: 350,
    pendingQty: 150,
    advance: 50000,
    balance: 25000,
    status: 'partial',
    rate: 150
  },
  {
    id: '2',
    orderNo: 'ORD002',
    customer: 'XYZ Builders',
    material: 'Stone Dust',
    orderedQty: 300,
    deliveredQty: 300,
    pendingQty: 0,
    advance: 30000,
    balance: 0,
    status: 'completed',
    rate: 100
  },
  {
    id: '3',
    orderNo: 'ORD003',
    customer: 'PQR Infrastructure',
    material: 'Laterite Stone',
    orderedQty: 750,
    deliveredQty: 0,
    pendingQty: 750,
    advance: 75000,
    balance: 112500,
    status: 'pending',
    rate: 250
  }
];

export const mockDispatches: Dispatch[] = [
  {
    id: '1',
    dispatchId: 'DSP001',
    orderNo: 'ORD001',
    truckNo: 'MH12AB1234',
    isRoyalty: true,
    driver: { name: 'राम शर्मा', phone: '+91 9876543210' },
    deliveryAddress: 'Plot No. 45, Industrial Area, Pune',
    contactPerson: 'Sunil Patil',
    netWeight: 7000,
    stage: 'Loading',
    status: 'in-transit',
    createdAt: '2025-01-27T08:30:00Z'
  },
  {
    id: '2',
    dispatchId: 'DSP002',
    orderNo: 'ORD002',
    truckNo: 'MH14CD5678',
    isRoyalty: false,
    driver: { name: 'अभय पटेल', phone: '+91 9876543211' },
    deliveryAddress: 'Site No. 12, Highway Project, Mumbai',
    contactPerson: 'Ravi Kumar',
    netWeight: 9000,
    stage: 'Weigh Out',
    status: 'in-transit',
    createdAt: '2025-01-27T09:15:00Z'
  }
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Stone Products', code: 'SP', description: 'All types of stone materials', active: true },
  { id: '2', name: 'Sand & Soil', code: 'SS', description: 'Sand and soil materials', active: true },
  { id: '3', name: 'Building Materials', code: 'BM', description: 'Construction building materials', active: true }
];

export const mockMaterials: Material[] = [
  { id: '1', code: 'SA20', name: 'Stone Aggregate 20mm', category: 'Stone Products', uom: 'MT', active: true },
  { id: '2', code: 'SA40', name: 'Stone Aggregate 40mm', category: 'Stone Products', uom: 'MT', active: true },
  { id: '3', code: 'SD', name: 'Stone Dust', category: 'Stone Products', uom: 'MT', active: true },
  { id: '4', code: 'LS', name: 'Laterite Stone', category: 'Stone Products', uom: 'MT', active: true },
  { id: '5', code: 'RS', name: 'River Sand', category: 'Sand & Soil', uom: 'MT', active: true }
];

export const mockExceptions: Exception[] = [
  {
    id: '1',
    truckNo: 'MH14CD5678',
    dispatchId: 'DSP002',
    stage: 'Loading',
    issue: 'Missing Video Upload',
    severity: 'medium',
    status: 'open',
    createdAt: '2025-01-27T09:15:00Z'
  },
  {
    id: '2',
    truckNo: 'MH18GH3456',
    dispatchId: 'DSP005',
    stage: 'Gate',
    issue: 'Expired Royalty Pass',
    severity: 'high',
    status: 'open',
    createdAt: '2025-01-27T10:30:00Z'
  }
];

export const mockChartData = {
  tripsPerDay: [
    { day: 'Mon', trips: 24 },
    { day: 'Tue', trips: 32 },
    { day: 'Wed', trips: 28 },
    { day: 'Thu', trips: 35 },
    { day: 'Fri', trips: 29 },
    { day: 'Sat', trips: 22 },
    { day: 'Sun', trips: 18 }
  ],
  materialMix: [
    { name: 'Stone Aggregate 20mm', value: 35, color: '#3B82F6' },
    { name: 'Stone Dust', value: 25, color: '#10B981' },
    { name: 'Laterite Stone', value: 20, color: '#F59E0B' },
    { name: 'Stone Aggregate 40mm', value: 15, color: '#EF4444' },
    { name: 'River Sand', value: 5, color: '#8B5CF6' }
  ],
  royaltyCompliance: [
    { name: 'Valid Scans', value: 75, color: '#10B981' },
    { name: 'Invalid Scans', value: 15, color: '#EF4444' },
    { name: 'Duplicate Scans', value: 10, color: '#F59E0B' }
  ]
};