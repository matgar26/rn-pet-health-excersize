import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pet, Vaccine, Allergy, Lab, RecordType } from '../types';

// Define navigation state
interface NavigationState {
  currentScreen: 'Registration' | 'Dashboard' | 'PetDetail' | 'AddPet' | 'AddVaccine' | 'AddAllergy' | 'AddLab';
  selectedPet: Pet | null;
  showAddPet: boolean;
  showAddVaccine: boolean;
  showAddAllergy: boolean;
  showAddLab: boolean;
}

interface NavigationContextType {
  navigationState: NavigationState;
  navigateToDashboard: () => void;
  navigateToPetDetail: (pet: Pet) => void;
  navigateToAddPet: () => void;
  navigateToAddVaccine: (petId: string, petName: string) => void;
  navigateToAddAllergy: (petId: string, petName: string) => void;
  navigateToAddLab: (petId: string, petName: string) => void;
  navigateBack: () => void;
  closeModals: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentScreen: 'Dashboard', // Start with Dashboard since we auto-login
    selectedPet: null,
    showAddPet: false,
    showAddVaccine: false,
    showAddAllergy: false,
    showAddLab: false,
  });

  const navigateToDashboard = () => {
    setNavigationState({
      currentScreen: 'Dashboard',
      selectedPet: null,
      showAddPet: false,
      showAddVaccine: false,
      showAddAllergy: false,
      showAddLab: false,
    });
  };

  const navigateToPetDetail = (pet: Pet) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'PetDetail',
      selectedPet: pet,
    }));
  };

  const navigateToAddPet = () => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'AddPet',
      showAddPet: true,
    }));
  };

  const navigateToAddVaccine = (petId: string, petName: string) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'AddVaccine',
      showAddVaccine: true,
    }));
  };

  const navigateToAddAllergy = (petId: string, petName: string) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'AddAllergy',
      showAddAllergy: true,
    }));
  };

  const navigateToAddLab = (petId: string, petName: string) => {
    setNavigationState(prev => ({
      ...prev,
      currentScreen: 'AddLab',
      showAddLab: true,
    }));
  };

  const navigateBack = () => {
    setNavigationState(prev => {
      switch (prev.currentScreen) {
        case 'PetDetail':
          return {
            ...prev,
            currentScreen: 'Dashboard',
            selectedPet: null,
          };
        case 'AddPet':
          return {
            ...prev,
            currentScreen: 'Dashboard',
            showAddPet: false,
          };
        case 'AddVaccine':
        case 'AddAllergy':
        case 'AddLab':
          return {
            ...prev,
            currentScreen: 'PetDetail',
            showAddVaccine: false,
            showAddAllergy: false,
            showAddLab: false,
          };
        default:
          return prev;
      }
    });
  };

  const closeModals = () => {
    setNavigationState(prev => ({
      ...prev,
      showAddPet: false,
      showAddVaccine: false,
      showAddAllergy: false,
      showAddLab: false,
    }));
  };

  const value: NavigationContextType = {
    navigationState,
    navigateToDashboard,
    navigateToPetDetail,
    navigateToAddPet,
    navigateToAddVaccine,
    navigateToAddAllergy,
    navigateToAddLab,
    navigateBack,
    closeModals,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
