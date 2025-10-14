import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Vaccine } from '../types/Pet';

interface AddVaccineFormData {
  name: string;
  dateAdministered: Date;
  isScheduled: boolean; // true for future/scheduled vaccines, false for past vaccines
}

interface AddVaccineScreenProps {
  petName: string;
  onSaveVaccine: (vaccine: Omit<Vaccine, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const COMMON_VACCINES = [
  'Rabies',
  'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)',
  'Bordetella (Kennel Cough)',
  'Lyme Disease',
  'Canine Influenza',
  'Leptospirosis',
  'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
  'FeLV (Feline Leukemia)',
  'FIV (Feline Immunodeficiency Virus)',
  'Other',
];

export default function AddVaccineScreen({ petName, onSaveVaccine, onCancel }: AddVaccineScreenProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddVaccineFormData>({
    defaultValues: {
      name: '',
      dateAdministered: new Date(),
      isScheduled: false,
    },
  });

  const selectedDate = watch('dateAdministered');
  const isScheduled = watch('isScheduled');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValue('dateAdministered', selectedDate);
    }
  };

  const handleVaccineTypeSelect = (scheduled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('isScheduled', scheduled);
  };

  const handleVaccineSelect = (vaccineName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('name', vaccineName);
  };

  const onSubmit = async (data: AddVaccineFormData) => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.dateAdministered);
    selectedDate.setHours(0, 0, 0, 0);

    // Validate based on vaccine type
    if (!data.isScheduled && selectedDate > today) {
      Alert.alert('Invalid Date', 'Past vaccination date cannot be in the future.');
      setIsLoading(false);
      return;
    }

    if (data.isScheduled && selectedDate < today) {
      Alert.alert('Invalid Date', 'Scheduled vaccination date cannot be in the past.');
      setIsLoading(false);
      return;
    }

    // Validate date is not too far in the past (e.g., more than 20 years)
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
    if (selectedDate < twentyYearsAgo) {
      Alert.alert('Invalid Date', 'Please enter a valid vaccination date.');
      setIsLoading(false);
      return;
    }

    // Validate future date is not too far ahead (e.g., more than 2 years)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    if (data.isScheduled && selectedDate > twoYearsFromNow) {
      Alert.alert('Invalid Date', 'Scheduled vaccination date cannot be more than 2 years in the future.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onSaveVaccine({
        petId: '', // This will be set by the parent component
        name: data.name.trim(),
        dateAdministered: data.dateAdministered.toISOString().split('T')[0],
        isScheduled: data.isScheduled,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onCancel();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Vaccine</Text>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        {/* Pet Info */}
        <View style={styles.petInfo}>
          <Text style={styles.petInfoText}>Adding vaccine record for</Text>
          <Text style={styles.petName}>{petName}</Text>
        </View>

        {/* Vaccine Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vaccine Type</Text>
          <View style={styles.vaccineTypeContainer}>
            <TouchableOpacity
              style={[
                styles.vaccineTypeOption,
                !isScheduled && styles.vaccineTypeOptionSelected,
                { borderColor: '#e74c3c' }
              ]}
              onPress={() => handleVaccineTypeSelect(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.vaccineTypeIcon}>✅</Text>
              <Text style={[
                styles.vaccineTypeLabel,
                !isScheduled && styles.vaccineTypeLabelSelected
              ]}>
                Past Vaccine
              </Text>
              <Text style={styles.vaccineTypeSubtitle}>Already administered</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.vaccineTypeOption,
                isScheduled && styles.vaccineTypeOptionSelected,
                { borderColor: '#f39c12' }
              ]}
              onPress={() => handleVaccineTypeSelect(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.vaccineTypeIcon}>📅</Text>
              <Text style={[
                styles.vaccineTypeLabel,
                isScheduled && styles.vaccineTypeLabelSelected
              ]}>
                Scheduled Vaccine
              </Text>
              <Text style={styles.vaccineTypeSubtitle}>Future appointment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vaccine Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vaccine Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Vaccine name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 50,
                message: 'Name must be less than 50 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={[styles.textInput, errors.name && styles.textInputError]}
                  placeholder="Enter vaccine name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={50}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Common Vaccines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Vaccines</Text>
          <Text style={styles.sectionSubtitle}>Tap to select a common vaccine</Text>
          <View style={styles.vaccineGrid}>
            {COMMON_VACCINES.map((vaccine) => (
              <TouchableOpacity
                key={vaccine}
                style={[
                  styles.vaccineChip,
                  watch('name') === vaccine && styles.vaccineChipSelected
                ]}
                onPress={() => handleVaccineSelect(vaccine)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.vaccineChipText,
                  watch('name') === vaccine && styles.vaccineChipTextSelected
                ]}>
                  {vaccine}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isScheduled ? 'Scheduled Date' : 'Date Administered'}
          </Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.dateAdministered && styles.dateButtonError]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateButtonText}>
              {selectedDate.toLocaleDateString()}
            </Text>
            <Text style={styles.dateButtonIcon}>📅</Text>
          </TouchableOpacity>
          {errors.dateAdministered && (
            <Text style={styles.errorText}>{errors.dateAdministered.message}</Text>
          )}
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewIcon}>
              <Text style={styles.previewIconText}>💉</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>
                {watch('name') || 'Vaccine Name'}
              </Text>
              <Text style={styles.previewDate}>
                Administered: {selectedDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={isScheduled ? new Date(new Date().getFullYear() + 2, 11, 31) : new Date()}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}
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
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  petInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  petInfoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vaccineTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vaccineTypeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  vaccineTypeOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  vaccineTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  vaccineTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  vaccineTypeLabelSelected: {
    color: '#2c3e50',
  },
  vaccineTypeSubtitle: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  textInputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  vaccineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vaccineChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  vaccineChipSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  vaccineChipText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  vaccineChipTextSelected: {
    color: '#ffffff',
  },
  dateButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonError: {
    borderColor: '#e74c3c',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  dateButtonIcon: {
    fontSize: 20,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewIconText: {
    fontSize: 20,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
