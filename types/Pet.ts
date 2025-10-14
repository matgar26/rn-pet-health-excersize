export interface Pet {
  id: string;
  name: string;
  animalType: 'dog' | 'cat' | 'bird';
  breed: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  dateAdministered: string;
  isScheduled: boolean;
  createdAt: string;
}

export interface Allergy {
  id: string;
  petId: string;
  name: string;
  reactions: string[];
  severity: 'mild' | 'severe';
  createdAt: string;
}

export interface Lab {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  instructions: string;
  createdAt: string;
}

export type MedicalRecord = Vaccine | Allergy | Lab;
export type RecordType = 'vaccines' | 'allergies' | 'labs';
