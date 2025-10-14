// API endpoints to try in order
const API_ENDPOINTS = [
  'http://localhost:3001/api',
  'http://127.0.0.1:3001/api',
  'http://192.168.6.92:3001/api',
];

// Helper function to try multiple endpoints
const makeApiRequest = async (endpoint: string, options: RequestInit) => {
  for (const baseUrl of API_ENDPOINTS) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.log(`Failed to connect to ${baseUrl}:`, error instanceof Error ? error.message : 'Unknown error');
      continue;
    }
  }
  throw new Error('Unable to connect to API server. Please ensure the server is running.');
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
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await makeApiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

// Pets API
export const petsAPI = {
  getPets: async (userId: string) => {
    const response = await makeApiRequest(`/pets?userId=${userId}`, {
      method: 'GET',
    });
    return handleResponse(response);
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
    return handleResponse(response);
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
  getRecords: async (petId: string, recordType: 'vaccines' | 'allergies' | 'labs') => {
    const response = await makeApiRequest(`/records/${petId}/${recordType}`, {
      method: 'GET',
    });
    return handleResponse(response);
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
    return handleResponse(response);
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
    return handleResponse(response);
  },

  deleteAllergy: async (allergyId: string) => {
    const response = await makeApiRequest(`/allergies/${allergyId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Labs API
export const labsAPI = {
  addLab: async (labData: {
    petId: string;
    name: string;
    dosage: string;
    instructions: string;
  }) => {
    const response = await makeApiRequest('/labs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(labData),
    });
    return handleResponse(response);
  },

  deleteLab: async (labId: string) => {
    const response = await makeApiRequest(`/labs/${labId}`, {
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
