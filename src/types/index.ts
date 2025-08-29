export interface Truck {
  id: string;
  truckNo: string;
  isRoyalty: boolean;
  arrivalTime: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  currentStage: string;
  status: 'active' | 'inactive';
  trips: number;
  ordersServed: number;
  exceptions: number;
  media: string[];
}

export interface Order {
  id: string;
  orderNo: string;
  customer: string;
  material: string;
  orderedQty: number;
  deliveredQty: number;
  pendingQty: number;
  advance: number;
  balance: number;
  status: 'pending' | 'partial' | 'completed' | 'cancelled';
  rate: number;
}

export interface Dispatch {
  id: string;
  dispatchId: string;
  orderNo: string;
  truckNo: string;
  isRoyalty: boolean;
  driver: {
    name: string;
    phone: string;
  };
  deliveryAddress: string;
  contactPerson: string;
  netWeight: number;
  stage: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
}

export interface Exception {
  id: string;
  truckNo: string;
  dispatchId: string;
  stage: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface TruckStage {
  stage: string;
  timestamp: string;
  operator: string;
  media?: string[];
  completed: boolean;
  royaltyCode?: string;
  videoUrl?: string;
  notes?: string;
}

export type Language = 'en' | 'hi' | 'mr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'operator' | 'dispatcher' | 'driver' | 'auditor';
  avatar?: string;
  phone?: string;
  truckAssigned?: string;
}

export interface TruckProcess {
  id: string;
  truckNo: string;
  dispatchId: string;
  isRoyalty: boolean;
  currentStage: 'gate' | 'loading' | 'weigh_in' | 'weigh_out' | 'departed' | 'delivered';
  stages: TruckStage[];
  driver: {
    id: string;
    name: string;
    phone: string;
  };
  startTime: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryProof?: {
    photo: string;
    video?: string;
    timestamp: string;
    location?: string;
  };
  status: 'in_process' | 'delivered' | 'exception';
}