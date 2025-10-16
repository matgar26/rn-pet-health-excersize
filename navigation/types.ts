import { Pet, Vaccine, Allergy, Medication, RecordType } from '../types';

export type RootStackParamList = {
  Registration: undefined;
  Dashboard: undefined;
  PetDetail: {
    pet: Pet;
    vaccines: Vaccine[];
    allergies: Allergy[];
    medications: Medication[];
    activeTab?: RecordType;
  };
  AddPet: undefined;
  AddVaccine: {
    petId: string;
    petName: string;
    activeTab: RecordType;
  };
  AddAllergy: {
    petId: string;
    petName: string;
    activeTab: RecordType;
  };
  AddMedication: {
    petId: string;
    petName: string;
    activeTab: RecordType;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
