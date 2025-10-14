// Simplified mock API for development
// This bypasses network issues and provides immediate functionality

import { Pet, User, Vaccine, Allergy, Lab } from '../types';

// Mock data
const mockUser: User = {
  id: 'dev-user-1',
  email: 'mattgardner26@gmail.com',
  firstName: 'Matt',
  lastName: 'Gardner',
  createdAt: new Date().toISOString(),
};

const mockPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Buddy',
    animalType: 'dog',
    breed: 'Golden Retriever',
    dateOfBirth: '2019-05-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pet-2',
    name: 'Whiskers',
    animalType: 'cat',
    breed: 'Persian',
    dateOfBirth: '2020-03-22',
    createdAt: new Date().toISOString(),
  },
];

const mockVaccines: Vaccine[] = [
  {
    id: 'vaccine-1',
    petId: 'pet-1',
    name: 'Rabies',
    dateAdministered: '2024-01-15',
    isScheduled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vaccine-2',
    petId: 'pet-1',
    name: 'DHPP',
    dateAdministered: '2024-12-15',
    isScheduled: true,
    createdAt: new Date().toISOString(),
  },
];

const mockAllergies: Allergy[] = [
  {
    id: 'allergy-1',
    petId: 'pet-1',
    name: 'Chicken',
    reactions: ['Hives', 'Itching'],
    severity: 'mild',
    createdAt: new Date().toISOString(),
  },
];

const mockLabs: Lab[] = [
  {
    id: 'lab-1',
    petId: 'pet-1',
    name: 'Blood Work',
    dosage: '2ml',
    instructions: 'Take with food twice daily',
    createdAt: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAuthAPI = {
  register: async (email: string, password: string) => {
    await delay(1000);
    return mockUser;
  },
  login: async (email: string, password: string) => {
    await delay(1000);
    return mockUser;
  },
};

export const mockPetsAPI = {
  getPets: async (userId: string) => {
    await delay(500);
    return mockPets;
  },
  addPet: async (petData: {
    userId: string;
    name: string;
    animalType: string;
    breed: string;
    dateOfBirth: string;
  }) => {
    await delay(1000);
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: petData.name,
      animalType: petData.animalType as 'dog' | 'cat' | 'bird',
      breed: petData.breed,
      dateOfBirth: petData.dateOfBirth,
      createdAt: new Date().toISOString(),
    };
    mockPets.push(newPet);
    return newPet;
  },
  deletePet: async (petId: string) => {
    await delay(500);
    const index = mockPets.findIndex(p => p.id === petId);
    if (index > -1) {
      mockPets.splice(index, 1);
    }
    return { success: true };
  },
};

export const mockRecordsAPI = {
  getRecords: async (petId: string, recordType: 'vaccines' | 'allergies' | 'labs') => {
    await delay(500);
    switch (recordType) {
      case 'vaccines':
        return mockVaccines.filter(v => v.petId === petId);
      case 'allergies':
        return mockAllergies.filter(a => a.petId === petId);
      case 'labs':
        return mockLabs.filter(l => l.petId === petId);
      default:
        return [];
    }
  },
};

export const mockVaccinesAPI = {
  addVaccine: async (vaccineData: {
    petId: string;
    name: string;
    dateAdministered: string;
    isScheduled: boolean;
  }) => {
    await delay(1000);
    const newVaccine: Vaccine = {
      id: `vaccine-${Date.now()}`,
      petId: vaccineData.petId,
      name: vaccineData.name,
      dateAdministered: vaccineData.dateAdministered,
      isScheduled: vaccineData.isScheduled,
      createdAt: new Date().toISOString(),
    };
    mockVaccines.push(newVaccine);
    return newVaccine;
  },
  deleteVaccine: async (vaccineId: string) => {
    await delay(500);
    const index = mockVaccines.findIndex(v => v.id === vaccineId);
    if (index > -1) {
      mockVaccines.splice(index, 1);
    }
    return { success: true };
  },
};

export const mockAllergiesAPI = {
  addAllergy: async (allergyData: {
    petId: string;
    name: string;
    reactions: string[];
    severity: 'mild' | 'severe';
  }) => {
    await delay(1000);
    const newAllergy: Allergy = {
      id: `allergy-${Date.now()}`,
      petId: allergyData.petId,
      name: allergyData.name,
      reactions: allergyData.reactions,
      severity: allergyData.severity,
      createdAt: new Date().toISOString(),
    };
    mockAllergies.push(newAllergy);
    return newAllergy;
  },
  deleteAllergy: async (allergyId: string) => {
    await delay(500);
    const index = mockAllergies.findIndex(a => a.id === allergyId);
    if (index > -1) {
      mockAllergies.splice(index, 1);
    }
    return { success: true };
  },
};

export const mockLabsAPI = {
  addLab: async (labData: {
    petId: string;
    name: string;
    dosage: string;
    instructions: string;
  }) => {
    await delay(1000);
    const newLab: Lab = {
      id: `lab-${Date.now()}`,
      petId: labData.petId,
      name: labData.name,
      dosage: labData.dosage,
      instructions: labData.instructions,
      createdAt: new Date().toISOString(),
    };
    mockLabs.push(newLab);
    return newLab;
  },
  deleteLab: async (labId: string) => {
    await delay(500);
    const index = mockLabs.findIndex(l => l.id === labId);
    if (index > -1) {
      mockLabs.splice(index, 1);
    }
    return { success: true };
  },
};
