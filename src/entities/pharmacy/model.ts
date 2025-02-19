export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  licenseNumber?: string;
  registrationNumber: string;
  phoneNumber: string;
  email: string;
  ownerId: string;
  managerId?: string;
  status: PharmacyStatus;
  createdAt: string;
  updatedAt: string;
}

export type PharmacyStatus = 'active' | 'pending' | 'suspended' | 'closed';

export const PHARMACY_STATUS: Record<PharmacyStatus, string> = {
  active: 'Active',
  pending: 'Pending Approval',
  suspended: 'Suspended',
  closed: 'Closed'
};

export interface PharmacyLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PharmacyWithDetails extends Pharmacy {
  location: PharmacyLocation;
  ownerDetails: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  managerDetails?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}