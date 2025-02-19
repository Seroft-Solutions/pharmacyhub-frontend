// src/lib/api/pharmacist.ts
import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface PharmacistDetails {
    firstName: string;
    lastName: string;
    connected: boolean;
    pharmacist: PharmacistVO;
}
export interface PharmacistVO {
    id: number;
    categoryAvailable: string;
    licenseDuration: string;
    experience: string;
    city: string;
    area: string;
    universityName: string;
    batch: string;
    contactNumber: string;
    timePreference:string;
    previousPharmacyName: string
    currentJobStatus: string
    userId:string
}

export interface PharmacistsConnectionsDTO {
    pharmacistId: number;
    userId?: string;
    connectionStatusEnum?: string;
    notes?: string;
    userGroup?: string;
}
export const usePharmacistApi = () => {
    const { getToken, logout } = useAuth();
    const { get, post, put, del } = useApi(getToken, logout);

    const getPharmacist = () => get<PharmacistDetails[]>('/api/pharmacist/v1/get-all');
    const AddUserInPharmacistGroup=(data)=>post<PharmacistVO[]>(`/api/pharmacist/v1/add-info`, data);
    const connectWithPharmacist = (data: PharmacistsConnectionsDTO) =>
        post('/api/pharmacist/v1/connect', data);

    const approveStatus = (id) =>
        post(`/api/pharmacist/v1/approveStatus/${id}`);

    const rejectStatus = (id) =>
        post(`/api/pharmacist/v1/rejectStatus/${id}`);
    const getPharmacistRequests = () => get<PharmacistDetails[]>('/api/pharmacist/v1/get-all-pending-requests');

    const getAllConnections = () => get<PharmacistDetails[]>('/api/pharmacist/v1/get-all-connections');


    return {
        getPharmacist,
        AddUserInPharmacistGroup,
        connectWithPharmacist,
        getPharmacistRequests,
        rejectStatus,
        approveStatus,
        getAllConnections// Add this line
    };
};