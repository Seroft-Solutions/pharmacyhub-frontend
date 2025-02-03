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
    id: string;
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
    // userId:string
}

export const usePharmacistApi = () => {
    const { getToken, logout } = useAuth();
    const { get, post, put, del } = useApi(getToken, logout);

    const getPharmacist = () => get<PharmacistDetails[]>('/api/pharmacist/v1/get-all');
    const checkUserExistence = (userId) => get(`/api/pharmacist/v1/CheckUserGroup/${userId}`);
    const AddUserInPharmacistGroup=(data,userId)=>post<PharmacistVO[]>(`/api/pharmacist/v1/add-info/${userId}`, data);



    return {
        getPharmacist,
        checkUserExistence,
        AddUserInPharmacistGroup
    };
};