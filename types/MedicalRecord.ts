import { Vaccine } from './Vaccine';
import { Allergy } from './Allergy';
import { Medication } from './Medication';

export type MedicalRecord = Vaccine | Allergy | Medication;
export type RecordType = 'vaccines' | 'allergies' | 'medications';
