import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { User, Pet, Vaccine, Allergy, Lab, RecordType } from './types';
// Use mock API for now to avoid network issues
import { 
  mockAuthAPI as authAPI, 
  mockPetsAPI as petsAPI, 
  mockRecordsAPI as recordsAPI, 
  mockVaccinesAPI as vaccinesAPI, 
  mockAllergiesAPI as allergiesAPI, 
  mockLabsAPI as labsAPI 
} from './services/mockApi';

// DEVELOPMENT MODE: Automatically logged in as mattgardner26@gmail.com
// To enable registration screen, set currentUser to null in useState

export default function App() {
  // For development, automatically log in with test user
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'dev-user-1',
    email: 'mattgardner26@gmail.com',
    firstName: 'Matt',
    lastName: 'Gardner',
    createdAt: new Date().toISOString(),
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showAddPet, setShowAddPet] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAddLab, setShowAddLab] = useState(false);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
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
      
      const [vaccinesData, allergiesData, labsData] = await Promise.all([
        recordsAPI.getRecords(selectedPet.id, 'vaccines') as Promise<Vaccine[]>,
        recordsAPI.getRecords(selectedPet.id, 'allergies') as Promise<Allergy[]>,
        recordsAPI.getRecords(selectedPet.id, 'labs') as Promise<Lab[]>,
      ]);
      
      setVaccines(vaccinesData);
      setAllergies(allergiesData);
      setLabs(labsData);
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
      setCurrentUser(user);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setShowAddPet(true);
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
      setShowAddPet(false);
    } catch (err) {
      console.error('Error saving pet:', err);
      setError('Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddPet = () => {
    setShowAddPet(false);
  };

  const handlePetPress = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handleBackToDashboard = () => {
    setSelectedPet(null);
    setVaccines([]);
    setAllergies([]);
    setLabs([]);
  };

  const handleAddRecord = (petId: string, recordType: RecordType) => {
    switch (recordType) {
      case 'vaccines':
        setShowAddVaccine(true);
        break;
      case 'allergies':
        setShowAddAllergy(true);
        break;
      case 'labs':
        setShowAddLab(true);
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
      setShowAddVaccine(false);
    } catch (err) {
      console.error('Error saving vaccine:', err);
      setError('Failed to save vaccine');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddVaccine = () => {
    setShowAddVaccine(false);
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
      setShowAddAllergy(false);
    } catch (err) {
      console.error('Error saving allergy:', err);
      setError('Failed to save allergy');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddAllergy = () => {
    setShowAddAllergy(false);
  };

  const handleSaveLab = async (lab: Omit<Lab, 'id' | 'petId' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newLab = await labsAPI.addLab({
        petId: selectedPet!.id,
        name: lab.name,
        dosage: lab.dosage,
        instructions: lab.instructions,
      });
      setLabs(prev => [...prev, newLab]);
      setShowAddLab(false);
    } catch (err) {
      console.error('Error saving lab:', err);
      setError('Failed to save lab');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddLab = () => {
    setShowAddLab(false);
  };

  const handleEditRecord = (recordId: string, recordType: RecordType) => {
    // TODO: Implement edit functionality
    console.log('Edit record:', recordId, recordType);
  };

  const handleDeleteRecord = async (recordId: string, recordType: RecordType) => {
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
        case 'labs':
          await labsAPI.deleteLab(recordId);
          setLabs(prev => prev.filter(l => l.id !== recordId));
          break;
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record');
    } finally {
      setLoading(false);
    }
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
    // In development mode, keep the user logged in
    // setCurrentUser(null);
    console.log('Logout pressed (disabled in dev mode)');
  };

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator
        currentUser={currentUser}
        pets={pets}
        vaccines={vaccines}
        allergies={allergies}
        labs={labs}
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
        onSaveLab={handleSaveLab}
        onCancelAddLab={handleCancelAddLab}
        onDeletePet={handleDeletePet}
        onLogout={handleLogout}
        selectedPet={selectedPet}
        showAddPet={showAddPet}
        showAddVaccine={showAddVaccine}
        showAddAllergy={showAddAllergy}
        showAddLab={showAddLab}
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