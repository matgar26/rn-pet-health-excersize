import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import RegistrationScreen from './screens/RegistrationScreen';
import DashboardScreen from './screens/DashboardScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import AddPetScreen from './screens/AddPetScreen';
import AddVaccineScreen from './screens/AddVaccineScreen';
import AddAllergyScreen from './screens/AddAllergyScreen';
import AddLabScreen from './screens/AddLabScreen';
import { User, Pet, Vaccine, Allergy, Lab, RecordType } from './types/Pet';
import { authAPI, petsAPI, recordsAPI, vaccinesAPI, allergiesAPI, labsAPI } from './services/api';

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
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await petsAPI.getPets(currentUser.id);
      setPets(response.pets);
    } catch (error) {
      console.error('Error loading pets:', error);
      Alert.alert('Error', 'Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalRecords = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const [vaccinesResponse, allergiesResponse, labsResponse] = await Promise.all([
        recordsAPI.getRecords(selectedPet.id, 'vaccines'),
        recordsAPI.getRecords(selectedPet.id, 'allergies'),
        recordsAPI.getRecords(selectedPet.id, 'labs'),
      ]);

      setVaccines(vaccinesResponse.records);
      setAllergies(allergiesResponse.records);
      setLabs(labsResponse.records);
    } catch (error) {
      console.error('Error loading medical records:', error);
      Alert.alert('Error', 'Failed to load medical records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.register(email, password);
      setCurrentUser(response.user);
      Alert.alert(
        'Success!',
        'Account created successfully! Welcome to Novellia Pets.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setShowAddPet(true);
  };

  const handleSavePet = async (petData: Omit<Pet, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await petsAPI.addPet({
        userId: currentUser.id,
        name: petData.name,
        animalType: petData.animalType,
        breed: petData.breed,
        dateOfBirth: petData.dateOfBirth,
      });

      setPets(prevPets => [...prevPets, response.pet]);
      setShowAddPet(false);
      Alert.alert('Success!', `${response.pet.name} has been added to your pets.`);
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again.');
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
  };

  const handleAddRecord = (type: RecordType) => {
    if (type === 'vaccines') {
      setShowAddVaccine(true);
    } else if (type === 'allergies') {
      setShowAddAllergy(true);
    } else if (type === 'labs') {
      setShowAddLab(true);
    } else {
      Alert.alert('Coming Soon', `Add ${type} functionality will be implemented next!`);
    }
  };

  const handleSaveVaccine = async (vaccineData: Omit<Vaccine, 'id' | 'createdAt'>) => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await vaccinesAPI.addVaccine({
        petId: selectedPet.id,
        name: vaccineData.name,
        dateAdministered: vaccineData.dateAdministered,
        isScheduled: vaccineData.isScheduled,
      });

      setVaccines(prevVaccines => [...prevVaccines, response.vaccine]);
      setShowAddVaccine(false);
      Alert.alert('Success!', `${response.vaccine.name} vaccine record has been added.`);
    } catch (error) {
      console.error('Error adding vaccine:', error);
      Alert.alert('Error', 'Failed to add vaccine record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddVaccine = () => {
    setShowAddVaccine(false);
  };

  const handleSaveAllergy = async (allergyData: Omit<Allergy, 'id' | 'createdAt'>) => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await allergiesAPI.addAllergy({
        petId: selectedPet.id,
        name: allergyData.name,
        reactions: allergyData.reactions,
        severity: allergyData.severity,
      });

      setAllergies(prevAllergies => [...prevAllergies, response.allergy]);
      setShowAddAllergy(false);
      Alert.alert('Success!', `${response.allergy.name} allergy record has been added.`);
    } catch (error) {
      console.error('Error adding allergy:', error);
      Alert.alert('Error', 'Failed to add allergy record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddAllergy = () => {
    setShowAddAllergy(false);
  };

  const handleSaveLab = async (labData: Omit<Lab, 'id' | 'createdAt'>) => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      const response = await labsAPI.addLab({
        petId: selectedPet.id,
        name: labData.name,
        dosage: labData.dosage,
        instructions: labData.instructions,
      });

      setLabs(prevLabs => [...prevLabs, response.lab]);
      setShowAddLab(false);
      Alert.alert('Success!', `${response.lab.name} lab record has been added.`);
    } catch (error) {
      console.error('Error adding lab:', error);
      Alert.alert('Error', 'Failed to add lab record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddLab = () => {
    setShowAddLab(false);
  };

  const handleEditRecord = (type: RecordType, recordId: string) => {
    Alert.alert('Coming Soon', `Edit ${type} functionality will be implemented next!`);
  };

  const handleDeleteRecord = async (type: RecordType, recordId: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              if (type === 'vaccines') {
                await vaccinesAPI.deleteVaccine(recordId);
                setVaccines(prev => prev.filter(v => v.id !== recordId));
              } else if (type === 'allergies') {
                await allergiesAPI.deleteAllergy(recordId);
                setAllergies(prev => prev.filter(a => a.id !== recordId));
              } else if (type === 'labs') {
                await labsAPI.deleteLab(recordId);
                setLabs(prev => prev.filter(l => l.id !== recordId));
              }
              
              Alert.alert('Deleted', 'Record has been deleted.');
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('Error', 'Failed to delete record. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeletePet = async (petId: string) => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet and all associated records?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await petsAPI.deletePet(petId);
              
              // Remove pet from local state
              setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
              
              // Clear medical records for this pet
              setVaccines([]);
              setAllergies([]);
              setLabs([]);
              
              // Go back to dashboard
              setSelectedPet(null);
              
              Alert.alert('Pet Deleted', 'The pet and all associated records have been deleted.');
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // For development, just reset pets but keep user logged in
            setPets([]);
            setSelectedPet(null);
            setVaccines([]);
            setAllergies([]);
            setLabs([]);
            Alert.alert('Logged Out', 'You have been logged out. (Development mode - user remains logged in)');
          }
        }
      ]
    );
  };

  // Show loading screen
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (showAddLab) {
    return (
      <View style={styles.container}>
        <AddLabScreen
          petName={selectedPet?.name || ''}
          onSaveLab={handleSaveLab}
          onCancel={handleCancelAddLab}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (showAddAllergy) {
    return (
      <View style={styles.container}>
        <AddAllergyScreen
          petName={selectedPet?.name || ''}
          onSaveAllergy={handleSaveAllergy}
          onCancel={handleCancelAddAllergy}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (showAddVaccine) {
    return (
      <View style={styles.container}>
        <AddVaccineScreen
          petName={selectedPet?.name || ''}
          onSaveVaccine={handleSaveVaccine}
          onCancel={handleCancelAddVaccine}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (showAddPet) {
    return (
      <View style={styles.container}>
        <AddPetScreen
          onSavePet={handleSavePet}
          onCancel={handleCancelAddPet}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (selectedPet) {
    return (
      <View style={styles.container}>
        <PetDetailScreen
          pet={selectedPet}
          vaccines={vaccines}
          allergies={allergies}
          labs={labs}
          onAddRecord={handleAddRecord}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
          onDeletePet={handleDeletePet}
          onBack={handleBackToDashboard}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardScreen
        user={currentUser!}
        pets={pets}
        onAddPet={handleAddPet}
        onPetPress={handlePetPress}
        onLogout={handleLogout}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});