import axios from 'axios';

interface PharmacistData {
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  qualification: string;
  experience: number;
  gender: string;
}

const API_BASE_URL = '/api/pharmacists'; // Assuming a base URL for pharmacist endpoints

// Create a new pharmacist profile
export const createPharmacist = async (data: PharmacistData) => {
  try {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all pharmacist profiles
export const getAllPharmacists = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a single pharmacist profile by ID
export const getPharmacistById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a pharmacist profile
export const updatePharmacist = async (id: string, data: PharmacistData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a pharmacist profile
export const deletePharmacist = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
