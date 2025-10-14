import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Pet, Vaccine, Allergy, Lab, RecordType } from '../types/Pet';

interface PetDetailScreenProps {
  pet: Pet;
  vaccines: Vaccine[];
  allergies: Allergy[];
  labs: Lab[];
  onAddRecord: (type: RecordType) => void;
  onEditRecord: (type: RecordType, recordId: string) => void;
  onDeleteRecord: (type: RecordType, recordId: string) => void;
  onDeletePet: (petId: string) => void;
  onBack: () => void;
}

export default function PetDetailScreen({
  pet,
  vaccines,
  allergies,
  labs,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onDeletePet,
  onBack,
}: PetDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<RecordType>('vaccines');
  const [showMenu, setShowMenu] = useState(false);

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

  const handleTabPress = (tab: RecordType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleAddRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAddRecord(activeTab);
  };

  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMenu(true);
  };

  const handleDeletePet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowMenu(false);
    
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This action cannot be undone and will also delete all associated medical records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDeletePet(pet.id);
          }
        }
      ]
    );
  };

  const getCurrentRecords = () => {
    switch (activeTab) {
      case 'vaccines':
        return vaccines;
      case 'allergies':
        return allergies;
      case 'labs':
        return labs;
      default:
        return [];
    }
  };

  const getUpcomingVaccines = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return vaccines.filter(vaccine => 
      vaccine.isScheduled && new Date(vaccine.dateAdministered) >= today
    ).sort((a, b) => new Date(a.dateAdministered).getTime() - new Date(b.dateAdministered).getTime());
  };

  const getPastVaccines = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return vaccines.filter(vaccine => 
      !vaccine.isScheduled || new Date(vaccine.dateAdministered) < today
    ).sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime());
  };

  const getTabIcon = (type: RecordType) => {
    switch (type) {
      case 'vaccines':
        return '💉';
      case 'allergies':
        return '⚠️';
      case 'labs':
        return '🧪';
      default:
        return '📋';
    }
  };

  const getTabTitle = (type: RecordType) => {
    switch (type) {
      case 'vaccines':
        return 'Vaccines';
      case 'allergies':
        return 'Allergies';
      case 'labs':
        return 'Labs';
      default:
        return 'Records';
    }
  };

  const renderVaccineItem = ({ item }: { item: Vaccine }) => {
    const isUpcoming = item.isScheduled && new Date(item.dateAdministered) >= new Date();
    const isOverdue = item.isScheduled && new Date(item.dateAdministered) < new Date();
    
    return (
      <TouchableOpacity
        style={[
          styles.recordCard,
          isUpcoming && styles.upcomingCard,
          isOverdue && styles.overdueCard
        ]}
        onPress={() => onEditRecord('vaccines', item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.recordHeader}>
          <View style={styles.recordNameContainer}>
            <Text style={styles.recordName}>{item.name}</Text>
            {isUpcoming && <Text style={styles.upcomingBadge}>📅 Upcoming</Text>}
            {isOverdue && <Text style={styles.overdueBadge}>⚠️ Overdue</Text>}
          </View>
          <TouchableOpacity
            onPress={() => onDeleteRecord('vaccines', item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.recordDate}>
          {item.isScheduled ? 'Scheduled: ' : 'Administered: '}{new Date(item.dateAdministered).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAllergyItem = ({ item }: { item: Allergy }) => (
    <TouchableOpacity
      style={[styles.recordCard, { borderLeftColor: item.severity === 'severe' ? '#e74c3c' : '#f39c12' }]}
      onPress={() => onEditRecord('allergies', item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.recordName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => onDeleteRecord('allergies', item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.recordDetails}>
        Reactions: {item.reactions.join(', ')}
      </Text>
      <Text style={[styles.severityText, { color: item.severity === 'severe' ? '#e74c3c' : '#f39c12' }]}>
        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderLabItem = ({ item }: { item: Lab }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() => onEditRecord('labs', item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.recordName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => onDeleteRecord('labs', item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.recordDetails}>Dosage: {item.dosage}</Text>
      <Text style={styles.recordInstructions}>{item.instructions}</Text>
    </TouchableOpacity>
  );

  const renderRecordItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'vaccines':
        return renderVaccineItem({ item });
      case 'allergies':
        return renderAllergyItem({ item });
      case 'labs':
        return renderLabItem({ item });
      default:
        return null;
    }
  };

  const renderVaccineSections = () => {
    const upcomingVaccines = getUpcomingVaccines();
    const pastVaccines = getPastVaccines();
    const totalVaccines = upcomingVaccines.length + pastVaccines.length;

    if (totalVaccines === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.recordsSection}>
        <View style={styles.recordsHeader}>
          <Text style={styles.recordsTitle}>
            {getTabTitle(activeTab)} ({totalVaccines})
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddRecord}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Vaccines */}
        {upcomingVaccines.length > 0 && (
          <View style={styles.vaccineSection}>
            <Text style={styles.vaccineSectionTitle}>
              📅 Upcoming ({upcomingVaccines.length})
            </Text>
            <FlatList
              data={upcomingVaccines}
              renderItem={renderVaccineItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Past Vaccines */}
        {pastVaccines.length > 0 && (
          <View style={styles.vaccineSection}>
            <Text style={styles.vaccineSectionTitle}>
              ✅ Past ({pastVaccines.length})
            </Text>
            <FlatList
              data={pastVaccines}
              renderItem={renderVaccineItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>{getTabIcon(activeTab)}</Text>
      <Text style={styles.emptyStateTitle}>No {getTabTitle(activeTab)} Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeTab === 'vaccines' && "Track your pet's vaccination history and schedule future appointments"}
        {activeTab === 'allergies' && "Record any allergies or adverse reactions"}
        {activeTab === 'labs' && "Keep track of lab work and medications"}
      </Text>
      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={handleAddRecord}
        activeOpacity={0.8}
      >
        <Text style={styles.addRecordButtonText}>Add {getTabTitle(activeTab).slice(0, -1)}</Text>
      </TouchableOpacity>
    </View>
  );

  const currentRecords = getCurrentRecords();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pet.name}</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <Text style={styles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Pet Avatar */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: getPetTypeColor(pet.animalType) }]}>
          <Text style={styles.avatarIcon}>{getPetIcon(pet.animalType)}</Text>
        </View>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petDetails}>
          {pet.animalType.charAt(0).toUpperCase() + pet.animalType.slice(1)} • {pet.breed}
        </Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['vaccines', 'allergies', 'labs'] as RecordType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, activeTab === tab && styles.activeTabIcon]}>
              {getTabIcon(tab)}
            </Text>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {getTabTitle(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'vaccines' ? (
          renderVaccineSections()
        ) : currentRecords.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.recordsSection}>
            <View style={styles.recordsHeader}>
              <Text style={styles.recordsTitle}>
                {getTabTitle(activeTab)} ({currentRecords.length})
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddRecord}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentRecords}
              renderItem={renderRecordItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.recordsList}
            />
          </View>
        )}
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuItemButton}
                onPress={handleDeletePet}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>🗑️</Text>
                <Text style={styles.menuItemText}>Delete Pet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 24,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    marginBottom: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarIcon: {
    fontSize: 48,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    // Icon color stays the same
  },
  tabText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#3498db',
  },
  content: {
    flex: 1,
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
    fontSize: 20,
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
  addRecordButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addRecordButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordsSection: {
    flex: 1,
    padding: 20,
  },
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordsList: {
    paddingBottom: 20,
  },
  vaccineSection: {
    marginBottom: 24,
  },
  vaccineSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  upcomingCard: {
    borderLeftColor: '#f39c12',
    backgroundColor: '#fef9e7',
  },
  overdueCard: {
    borderLeftColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  recordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
  },
  upcomingBadge: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '600',
    backgroundColor: '#fef9e7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  overdueBadge: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600',
    backgroundColor: '#fdf2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  recordDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  recordInstructions: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  severityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 34, // Safe area for iPhone
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  menuItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
});
