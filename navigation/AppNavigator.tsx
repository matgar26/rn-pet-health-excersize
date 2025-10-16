import React, { forwardRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { User, Pet, Vaccine, Allergy, Medication, RecordType } from '../types';

// Import screens
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import AddPetScreen from '../screens/AddPetScreen';
import AddVaccineScreen from '../screens/AddVaccineScreen';
import AddAllergyScreen from '../screens/AddAllergyScreen';
import AddMedicationScreen from '../screens/AddMedicationScreen';

// Define the navigation parameter types
export type RootStackParamList = {
  Registration: undefined;
  Dashboard: undefined;
  PetDetail: {
    pet: Pet;
    vaccines: Vaccine[];
    allergies: Allergy[];
    medications: Medication[];
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
  AddMedication: {
    petId: string;
    petName: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

// Custom transition animations
const slideFromRight: any = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress,
      },
    };
  },
};

const slideFromBottom: any = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },
};

const fadeIn: any = {
  cardStyleInterpolator: ({ current }: any) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
};

interface AppNavigatorProps {
  currentUser: User | null;
  pets: Pet[];
  vaccines: Vaccine[];
  allergies: Allergy[];
  medications: Medication[];
  onRegister: (email: string, password: string) => Promise<void>;
  onAddPet: () => void;
  onSavePet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  onCancelAddPet: () => void;
  onPetPress: (pet: Pet) => void;
  onBackToDashboard: () => void;
  onAddRecord: (petId: string, recordType: RecordType, activeTab: RecordType) => void;
  onSaveVaccine: (vaccine: Omit<Vaccine, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancelAddVaccine: () => void;
  onSaveAllergy: (allergy: Omit<Allergy, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancelAddAllergy: () => void;
  onSaveMedication: (medication: Omit<Medication, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancelAddMedication: () => void;
  onDeleteRecord: (recordId: string, recordType: RecordType) => Promise<void>;
  onDeletePet: (petId: string) => Promise<void>;
  onLogout: () => void;
  selectedPet: Pet | null;
  showAddPet: boolean;
  showAddVaccine: boolean;
  showAddAllergy: boolean;
  showAddMedication: boolean;
  isLoading: boolean;
  error: string | null;
}

const AppNavigator = forwardRef<NavigationContainerRef<any>, AppNavigatorProps>(({
  currentUser,
  pets,
  vaccines,
  allergies,
  medications,
  onRegister,
  onAddPet,
  onSavePet,
  onCancelAddPet,
  onPetPress,
  onBackToDashboard,
  onAddRecord,
  onSaveVaccine,
  onCancelAddVaccine,
  onSaveAllergy,
  onCancelAddAllergy,
  onSaveMedication,
  onCancelAddMedication,
  onDeleteRecord,
  onDeletePet,
  onLogout,
  selectedPet,
  showAddPet,
  showAddVaccine,
  showAddAllergy,
  showAddMedication,
  isLoading,
  error,
}, ref) => {
  return (
    <NavigationContainer ref={ref}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...slideFromRight,
        }}
        initialRouteName={currentUser ? "Dashboard" : "Registration"}
      >
        <Stack.Screen 
          name="Registration"
          options={fadeIn}
        >
          {() => (
            <RegistrationScreen
              onRegister={onRegister}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {() => (
            <DashboardScreen
              user={currentUser!}
              pets={pets}
              onAddPet={onAddPet}
              onPetPress={onPetPress}
              onLogout={onLogout}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="PetDetail"
          options={slideFromRight}
        >
          {() => (
            <PetDetailScreen
              key={`${selectedPet?.id}-${vaccines.length}-${allergies.length}-${medications.length}`}
              pet={selectedPet!}
              vaccines={vaccines}
              allergies={allergies}
              medications={medications}
              onBack={onBackToDashboard}
              onAddRecord={onAddRecord}
              onEditRecord={() => {}} // TODO: Implement edit functionality
              onDeleteRecord={onDeleteRecord}
              onDeletePet={onDeletePet}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="AddPet"
          options={slideFromBottom}
        >
          {() => (
            <AddPetScreen
              onSavePet={onSavePet}
              onCancel={onCancelAddPet}
              isLoading={isLoading}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="AddVaccine"
          options={slideFromBottom}
        >
          {({ route }) => (
            <AddVaccineScreen
              petId={route.params?.petId || ''}
              petName={route.params?.petName || ''}
              onSaveVaccine={onSaveVaccine}
              onCancel={onCancelAddVaccine}
              isLoading={isLoading}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="AddAllergy"
          options={slideFromBottom}
        >
          {({ route }) => (
            <AddAllergyScreen
              petId={route.params?.petId || ''}
              petName={route.params?.petName || ''}
              onSaveAllergy={onSaveAllergy}
              onCancel={onCancelAddAllergy}
              isLoading={isLoading}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="AddMedication"
          options={slideFromBottom}
        >
          {({ route }) => (
            <AddMedicationScreen
              petId={route.params?.petId || ''}
              petName={route.params?.petName || ''}
              onSaveMedication={onSaveMedication}
              onCancel={onCancelAddMedication}
              isLoading={isLoading}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
});

AppNavigator.displayName = 'AppNavigator';

export default AppNavigator;