export interface License {
  id: string;
  number: string;
  type: LicenseType;
  issuedTo: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  status: LicenseStatus;
  documents: LicenseDocument[];
  createdAt: string;
  updatedAt: string;
}

export type LicenseType = 'pharmacy' | 'pharmacist' | 'pharmacy-manager' | 'proprietor' | 'salesman';

export const LICENSE_TYPES: Record<LicenseType, string> = {
  pharmacy: 'Pharmacy License',
  pharmacist: 'Pharmacist License',
  'pharmacy-manager': 'Pharmacy Manager License',
  proprietor: 'Proprietor License',
  salesman: 'Salesman License'
};

export type LicenseStatus = 'active' | 'pending' | 'expired' | 'suspended' | 'revoked';

export const LICENSE_STATUS: Record<LicenseStatus, string> = {
  active: 'Active',
  pending: 'Pending Approval',
  expired: 'Expired',
  suspended: 'Suspended',
  revoked: 'Revoked'
};

export interface LicenseDocument {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface LicenseApplication {
  id: string;
  licenseType: LicenseType;
  applicantId: string;
  applicantType: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  documents: LicenseDocument[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}