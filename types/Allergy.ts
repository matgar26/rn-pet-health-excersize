export interface Allergy {
  id: string;
  petId: string;
  name: string;
  reactions: string[];
  severity: 'mild' | 'severe';
  createdAt: string;
}
