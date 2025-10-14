import { Vaccine } from './Vaccine';
import { Allergy } from './Allergy';
import { Lab } from './Lab';

export type MedicalRecord = Vaccine | Allergy | Lab;
export type RecordType = 'vaccines' | 'allergies' | 'labs';
