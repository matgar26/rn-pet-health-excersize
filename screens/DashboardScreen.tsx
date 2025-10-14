import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Pet, User } from '../types/Pet';

interface DashboardScreenProps {
  user: User;
  pets: Pet[];
  onAddPet: () => void;
  onPetPress: (pet: Pet) => void;
  onLogout: () => void;
}

export default function DashboardScreen({ user, pets, onAddPet, onPetPress, onLogout }: DashboardScreenProps) {
  const [showSettings, setShowSettings] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPetIcon = (animalType: string) => {
    switch (animalType) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐱';
      case 'bird':
        return '🐦';
      default:
        return '🐾';
    }
  };

  const getPetTypeColor = (animalType: string) => {
    switch (animalType) {
      case 'dog':
        return '#3498db';
      case 'cat':
        return '#e74c3c';
      case 'bird':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const handlePetPress = (pet: Pet) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to pet detail screen
    onPetPress(pet);
  };

  const renderPetCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity 
      style={[styles.petCard, { borderLeftColor: getPetTypeColor(item.animalType) }]}
      onPress={() => handlePetPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.petIconContainer}>
        <Text style={styles.petIcon}>{getPetIcon(item.animalType)}</Text>
      </View>
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petType}>{item.animalType.charAt(0).toUpperCase() + item.animalType.slice(1)}</Text>
        <Text style={styles.petBreed}>{item.breed}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAddPetCard = () => (
    <TouchableOpacity 
      style={[styles.petCard, styles.addPetCard]}
      onPress={handleAddPetPress}
      activeOpacity={0.7}
    >
      <View style={styles.addPetIconContainer}>
        <Text style={styles.addPetIcon}>+</Text>
      </View>
      <View style={styles.petInfo}>
        <Text style={styles.addPetTitle}>Add new pet</Text>
        <Text style={styles.addPetSubtitle}>Tap to add</Text>
      </View>
    </TouchableOpacity>
  );

  const handleAddPetPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddPet();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🐾</Text>
      <Text style={styles.emptyStateTitle}>No Pets Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Add your first pet to start tracking their health records
      </Text>
      <TouchableOpacity 
        style={styles.addPetButton} 
        onPress={handleAddPetPress}
        activeOpacity={0.8}
      >
        <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSettings(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <View style={styles.userInitials}>
              <Text style={styles.userInitialsText}>{getInitials(user.firstName, user.lastName)}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowSettings(false);
              onLogout();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.firstName}!</Text>
          <Text style={styles.subGreeting}>Manage your pets' health</Text>
        </View>
        <TouchableOpacity 
          style={styles.userInitialsButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowSettings(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.userInitialsText}>{getInitials(user.firstName, user.lastName)}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {pets.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.petsSection}>
            <Text style={styles.sectionTitle}>Your Pets ({pets.length})</Text>
            <FlatList
              data={[...pets, { id: 'add-pet', isAddCard: true }] as (Pet | { id: string; isAddCard: boolean })[]}
              renderItem={({ item }) => 
                'isAddCard' in item ? renderAddPetCard() : renderPetCard({ item: item as Pet })
              }
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.petsGrid}
            />
          </View>
        )}
      </View>

      {renderSettingsModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subGreeting: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 2,
  },
  userInitialsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitialsText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addPetButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addPetButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  petsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  petsGrid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  petCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  petIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  petIcon: {
    fontSize: 32,
  },
  petInfo: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 12,
    color: '#95a5a6',
  },
  addPetCard: {
    borderLeftColor: '#95a5a6',
    borderStyle: 'dashed',
    backgroundColor: '#f8f9fa',
  },
  addPetIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  addPetIcon: {
    fontSize: 32,
    color: '#95a5a6',
    fontWeight: '300',
  },
  addPetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 4,
  },
  addPetSubtitle: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    fontSize: 24,
    color: '#7f8c8d',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
