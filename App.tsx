import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { User, Pet, Vaccine, Allergy, Medication, RecordType } from './types';
import { authAPI, petsAPI, recordsAPI, vaccinesAPI, allergiesAPI, medicationsAPI } from './services/api';

export default function App() {
  // Navigation ref
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'dev-user-1',
    email: 'mattgardner26@gmail.com',
    firstName: 'Matt',
    lastName: 'Gardner',
    createdAt: new Date().toISOString(),
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load pets from API when user is logged in
  useEffect(() => {
    if (currentUser) {
      loadPets();
    }
  }, [currentUser]);

  // Load medical records when a pet is selected
  useEffect(() => {
    if (selectedPet) {
      loadMedicalRecords();
    }
  }, [selectedPet]);

  const loadPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const petsData = await petsAPI.getPets(currentUser!.id);
      setPets(petsData);
    } catch (err) {
      console.error('Error loading pets:', err);
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalRecords = async () => {
    if (!selectedPet) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [vaccinesData, allergiesData, medicationsData] = await Promise.all([
        recordsAPI.getRecords(selectedPet.id, 'vaccines') as Promise<Vaccine[]>,
        recordsAPI.getRecords(selectedPet.id, 'allergies') as Promise<Allergy[]>,
        recordsAPI.getRecords(selectedPet.id, 'medications') as Promise<Medication[]>,
      ]);
      
      setVaccines(vaccinesData);
      setAllergies(allergiesData);
      setMedications(medicationsData);
    } catch (err) {
      console.error('Error loading medical records:', err);
      setError('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authAPI.register(email, password);
      console.log('✅ User registered:', user);
      setCurrentUser(user);
      // Navigate to dashboard after successful registration
      navigationRef.current?.navigate('Dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    navigationRef.current?.navigate('AddPet');
  };

  const handleSavePet = async (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newPet = await petsAPI.addPet({
        userId: currentUser!.id,
        name: pet.name,
        animalType: pet.animalType,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
      });
      setPets(prev => [...prev, newPet]);
      navigationRef.current?.goBack();
    } catch (err) {
      console.error('Error saving pet:', err);
      setError('Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddPet = () => {
    navigationRef.current?.goBack();
  };

  const handlePetPress = (pet: Pet) => {
    setSelectedPet(pet);
    navigationRef.current?.navigate('PetDetail', {
      pet,
      vaccines,
      allergies,
      medications,
      activeTab: 'vaccines', // Default to vaccines tab
    });
  };

  const handleBackToDashboard = () => {
    setSelectedPet(null);
    setVaccines([]);
    setAllergies([]);
    setMedications([]);
    navigationRef.current?.navigate('Dashboard');
  };

  const handleAddRecord = (petId: string, recordType: RecordType, activeTab: RecordType) => {
    switch (recordType) {
      case 'vaccines':
        navigationRef.current?.navigate('AddVaccine', {
          petId,
          petName: selectedPet?.name || '',
          activeTab,
        });
        break;
      case 'allergies':
        navigationRef.current?.navigate('AddAllergy', {
          petId,
          petName: selectedPet?.name || '',
          activeTab,
        });
        break;
      case 'medications':
        navigationRef.current?.navigate('AddMedication', {
          petId,
          petName: selectedPet?.name || '',
          activeTab,
        });
        break;
    }
  };

  const handleSaveVaccine = async (vaccine: Omit<Vaccine, 'id' | 'petId' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newVaccine = await vaccinesAPI.addVaccine({
        petId: selectedPet!.id,
        name: vaccine.name,
        dateAdministered: vaccine.dateAdministered,
        isScheduled: vaccine.isScheduled,
      });
      setVaccines(prev => [...prev, newVaccine]);
      // Navigate back to PetDetail with vaccines tab active
      navigationRef.current?.navigate('PetDetail', {
        pet: selectedPet!,
        vaccines: [...vaccines, newVaccine],
        allergies,
        medications,
        activeTab: 'vaccines',
      });
    } catch (err) {
      console.error('Error saving vaccine:', err);
      setError('Failed to save vaccine');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddVaccine = () => {
    navigationRef.current?.goBack();
  };

  const handleSaveAllergy = async (allergy: Omit<Allergy, 'id' | 'petId' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newAllergy = await allergiesAPI.addAllergy({
        petId: selectedPet!.id,
        name: allergy.name,
        reactions: allergy.reactions,
        severity: allergy.severity,
      });
      setAllergies(prev => [...prev, newAllergy]);
      // Navigate back to PetDetail with allergies tab active
      navigationRef.current?.navigate('PetDetail', {
        pet: selectedPet!,
        vaccines,
        allergies: [...allergies, newAllergy],
        medications,
        activeTab: 'allergies',
      });
    } catch (err) {
      console.error('Error saving allergy:', err);
      setError('Failed to save allergy');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddAllergy = () => {
    navigationRef.current?.goBack();
  };

  const handleSaveMedication = async (medication: Omit<Medication, 'id' | 'petId' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newMedication = await medicationsAPI.addMedication({
        petId: selectedPet!.id,
        name: medication.name,
        dosage: medication.dosage,
        instructions: medication.instructions,
      });
      setMedications(prev => [...prev, newMedication]);
      // Navigate back to PetDetail with medications tab active
      navigationRef.current?.navigate('PetDetail', {
        pet: selectedPet!,
        vaccines,
        allergies,
        medications: [...medications, newMedication],
        activeTab: 'medications',
      });
    } catch (err) {
      console.error('Error saving medication:', err);
      setError('Failed to save medication');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddMedication = () => {
    navigationRef.current?.goBack();
  };

  const handleEditRecord = (recordId: string, recordType: RecordType) => {
    // TODO: Implement edit functionality
    console.log('Edit record:', recordId, recordType);
  };

  const handleDeleteRecord = async (recordId: string, recordType: RecordType) => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete this ${recordType.slice(0, -1)}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              
              switch (recordType) {
                case 'vaccines':
                  await vaccinesAPI.deleteVaccine(recordId);
                  setVaccines(prev => prev.filter(v => v.id !== recordId));
                  break;
                case 'allergies':
                  await allergiesAPI.deleteAllergy(recordId);
                  setAllergies(prev => prev.filter(a => a.id !== recordId));
                  break;
                case 'medications':
                  await medicationsAPI.deleteMedication(recordId);
                  setMedications(prev => prev.filter(m => m.id !== recordId));
                  break;
              }
              
              // Reload records to ensure UI is updated
              if (selectedPet) {
                await loadMedicalRecords();
              }
            } catch (err) {
              console.error('Error deleting record:', err);
              setError('Failed to delete record');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeletePet = async (petId: string) => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              await petsAPI.deletePet(petId);
              setPets(prev => prev.filter(p => p.id !== petId));
              
              // If the deleted pet was selected, go back to dashboard
              if (selectedPet?.id === petId) {
                handleBackToDashboard();
              }
            } catch (err) {
              console.error('Error deleting pet:', err);
              setError('Failed to delete pet');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPets([]);
    setSelectedPet(null);
    setVaccines([]);
    setAllergies([]);
    setMedications([]);
    // Reset navigation stack to registration screen
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: 'Registration' }],
    });
  };

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator
        ref={navigationRef}
        currentUser={currentUser}
        pets={pets}
        vaccines={vaccines}
        allergies={allergies}
        medications={medications}
        onRegister={handleRegister}
        onAddPet={handleAddPet}
        onSavePet={handleSavePet}
        onCancelAddPet={handleCancelAddPet}
        onPetPress={handlePetPress}
        onBackToDashboard={handleBackToDashboard}
        onAddRecord={handleAddRecord}
        onSaveVaccine={handleSaveVaccine}
        onCancelAddVaccine={handleCancelAddVaccine}
        onSaveAllergy={handleSaveAllergy}
        onCancelAddAllergy={handleCancelAddAllergy}
        onSaveMedication={handleSaveMedication}
        onCancelAddMedication={handleCancelAddMedication}
        onDeleteRecord={handleDeleteRecord}
        onDeletePet={handleDeletePet}
        onLogout={handleLogout}
        selectedPet={selectedPet}
        showAddPet={false}
        showAddVaccine={false}
        showAddAllergy={false}
        showAddMedication={false}
        isLoading={loading}
        error={error}
      />
      
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
});