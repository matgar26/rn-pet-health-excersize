import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { User, Pet, Vaccine, Allergy, Lab, RecordType } from '../types';

// Import screens
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import AddPetScreen from '../screens/AddPetScreen';
import AddVaccineScreen from '../screens/AddVaccineScreen';
import AddAllergyScreen from '../screens/AddAllergyScreen';
import AddLabScreen from '../screens/AddLabScreen';

// Define the navigation parameter types
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

const Stack = createStackNavigator<RootStackParamList>();

// Custom transition animations
const slideFromRight: StackNavigationOptions = {
  cardStyleInterpolator: ({ current, layouts }) => {
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
      },
    };
  },
};

const slideFromBottom: StackNavigationOptions = {
  cardStyleInterpolator: ({ current, layouts }) => {
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

const fadeIn: StackNavigationOptions = {
  cardStyleInterpolator: ({ current }) => {
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
  labs: Lab[];
  onRegister: (email: string, password: string) => Promise<void>;
  onAddPet: () => void;
  onSavePet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  onCancelAddPet: () => void;
  onPetPress: (pet: Pet) => void;
  onBackToDashboard: () => void;
  onAddRecord: (petId: string, recordType: RecordType) => void;
  onSaveVaccine: (vaccine: Omit<Vaccine, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancelAddVaccine: () => void;
  onSaveAllergy: (allergy: Omit<Allergy, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancelAddAllergy: () => void;
  onSaveLab: (lab: Omit<Lab, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancelAddLab: () => void;
  onDeletePet: (petId: string) => Promise<void>;
  onLogout: () => void;
  selectedPet: Pet | null;
  showAddPet: boolean;
  showAddVaccine: boolean;
  showAddAllergy: boolean;
  showAddLab: boolean;
  isLoading: boolean;
  error: string | null;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentUser,
  pets,
  vaccines,
  allergies,
  labs,
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
  onSaveLab,
  onCancelAddLab,
  onDeletePet,
  onLogout,
  selectedPet,
  showAddPet,
  showAddVaccine,
  showAddAllergy,
  showAddLab,
  isLoading,
  error,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...slideFromRight,
        }}
      >
        {!currentUser ? (
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
        ) : (
          <>
            <Stack.Screen name="Dashboard">
              {() => (
                <DashboardScreen
                  user={currentUser}
                  pets={pets}
                  onAddPet={onAddPet}
                  onPetPress={onPetPress}
                  onLogout={onLogout}
                />
              )}
            </Stack.Screen>

            {selectedPet && (
              <Stack.Screen 
                name="PetDetail"
                options={slideFromRight}
              >
                {() => (
                  <PetDetailScreen
                    pet={selectedPet}
                    vaccines={vaccines}
                    allergies={allergies}
                    labs={labs}
                    onBack={onBackToDashboard}
                    onAddRecord={onAddRecord}
                    onEditRecord={() => {}} // TODO: Implement edit functionality
                    onDeleteRecord={() => {}} // TODO: Implement delete functionality
                    onDeletePet={onDeletePet}
                  />
                )}
              </Stack.Screen>
            )}

            {showAddPet && (
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
            )}

            {showAddVaccine && (
              <Stack.Screen 
                name="AddVaccine"
                options={slideFromBottom}
              >
                {() => (
                  <AddVaccineScreen
                    petId={selectedPet?.id || ''}
                    petName={selectedPet?.name || ''}
                    onSaveVaccine={onSaveVaccine}
                    onCancel={onCancelAddVaccine}
                    isLoading={isLoading}
                  />
                )}
              </Stack.Screen>
            )}

            {showAddAllergy && (
              <Stack.Screen 
                name="AddAllergy"
                options={slideFromBottom}
              >
                {() => (
                  <AddAllergyScreen
                    petId={selectedPet?.id || ''}
                    petName={selectedPet?.name || ''}
                    onSaveAllergy={onSaveAllergy}
                    onCancel={onCancelAddAllergy}
                    isLoading={isLoading}
                  />
                )}
              </Stack.Screen>
            )}

            {showAddLab && (
              <Stack.Screen 
                name="AddLab"
                options={slideFromBottom}
              >
                {() => (
                  <AddLabScreen
                    petId={selectedPet?.id || ''}
                    petName={selectedPet?.name || ''}
                    onSaveLab={onSaveLab}
                    onCancel={onCancelAddLab}
                    isLoading={isLoading}
                  />
                )}
              </Stack.Screen>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;