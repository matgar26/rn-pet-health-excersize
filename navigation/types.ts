import { Pet, Vaccine, Allergy, Lab, RecordType } from '../types';

export type RootStackParamList = {
  Registration: undefined;
  Dashboard: undefined;
  PetDetail: {
    pet: Pet;
    vaccines: Vaccine[];
    allergies: Allergy[];
    labs: Lab[];
  };
  AddPet: undefined;
  AddVaccine: {
    petId: string;
    petName: string;
  };
  AddAllergy: {
    petId: string;
    petName: string;
  };
  AddLab: {
    petId: string;
    petName: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
