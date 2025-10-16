// API base URL
const API_BASE_URL = 'http://192.168.6.92:3001/api';

console.log('🔗 API base URL configured:', API_BASE_URL);

// Helper function to make API requests
const makeApiRequest = async (endpoint: string, options: RequestInit) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 Making API request to: ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl, options);
    console.log(`✅ API response status:`, response.status);
    return response;
  } catch (error) {
    console.log(`❌ API request failed:`, error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Unable to connect to API server. Please ensure the server is running.');
  }
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await makeApiRequest('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    return data.user;
  },

  login: async (email: string, password: string) => {
    const response = await makeApiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    return data.user;
  },
};

// Pets API
export const petsAPI = {
  getPets: async (userId: string) => {
    const response = await makeApiRequest(`/pets?userId=${userId}`, {
      method: 'GET',
    });
    const data = await handleResponse(response);
    return data.pets || [];
  },

  addPet: async (petData: {
    userId: string;
    name: string;
    animalType: string;
    breed: string;
    dateOfBirth: string;
  }) => {
    const response = await makeApiRequest('/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });
    const data = await handleResponse(response);
    return data.pet;
  },

  deletePet: async (petId: string) => {
    const response = await makeApiRequest(`/pets/${petId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Medical Records API
export const recordsAPI = {
  getRecords: async (petId: string, recordType: 'vaccines' | 'allergies' | 'medications') => {
    const response = await makeApiRequest(`/records/${petId}/${recordType}`, {
      method: 'GET',
    });
    const data = await handleResponse(response);
    return data[recordType] || [];
  },
};

// Vaccines API
export const vaccinesAPI = {
  addVaccine: async (vaccineData: {
    petId: string;
    name: string;
    dateAdministered: string;
    isScheduled: boolean;
  }) => {
    const response = await makeApiRequest('/vaccines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vaccineData),
    });
    const data = await handleResponse(response);
    return data.vaccine;
  },

  deleteVaccine: async (vaccineId: string) => {
    const response = await makeApiRequest(`/vaccines/${vaccineId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Allergies API
export const allergiesAPI = {
  addAllergy: async (allergyData: {
    petId: string;
    name: string;
    reactions: string[];
    severity: 'mild' | 'severe';
  }) => {
    const response = await makeApiRequest('/allergies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allergyData),
    });
    const data = await handleResponse(response);
    return data.allergy;
  },

  deleteAllergy: async (allergyId: string) => {
    const response = await makeApiRequest(`/allergies/${allergyId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Medications API
export const medicationsAPI = {
  addMedication: async (medicationData: {
    petId: string;
    name: string;
    dosage: string;
    instructions: string;
  }) => {
    const response = await makeApiRequest('/medications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicationData),
    });
    const data = await handleResponse(response);
    return data.medication;
  },

  deleteMedication: async (medicationId: string) => {
    const response = await makeApiRequest(`/medications/${medicationId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await makeApiRequest('/health', {
      method: 'GET',
    });
    return handleResponse(response);
  },
};
