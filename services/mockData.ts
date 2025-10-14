import { Pet } from '../types';

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    animalType: 'dog',
    breed: 'Golden Retriever',
    dateOfBirth: '2020-03-15',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Whiskers',
    animalType: 'cat',
    breed: 'Persian',
    dateOfBirth: '2019-07-22',
    createdAt: '2023-01-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Tweety',
    animalType: 'bird',
    breed: 'Canary',
    dateOfBirth: '2021-11-08',
    createdAt: '2023-02-01T09:15:00Z',
  },
];

export const getMockPets = (): Pet[] => {
  // Return a random subset of pets for testing
  const shuffled = [...mockPets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
};
