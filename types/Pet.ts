export interface Pet {
  id: string;
  name: string;
  animalType: 'dog' | 'cat' | 'bird';
  breed: string;
  dateOfBirth: string;
  createdAt: string;
}