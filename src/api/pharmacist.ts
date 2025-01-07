// src/lib/api/pharmacist.ts
import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface PharmacistDetails {
    firstName: string;
    lastName: string;
    connected: boolean;
    pharmacist: PharmacistVO;
}
interface PharmacistVO {
    id: string;
    categoryAvailable: string;
    licenseDuration: string;
    experience: string;
    city: string;
    location: string;
    universityName: string;
    batch: string;
    contactNumber: string;
    categoryProvince: string;
}

export const usePharmasictApi = () => {
    const { getToken, logout } = useAuth();
    const { get, post, put, del } = useApi(getToken, logout);

    const getPharmasict = () => get<PharmacistDetails[]>('/api/pharmacist/v1/get-all');


    return {
        getPharmasict,
    };
};