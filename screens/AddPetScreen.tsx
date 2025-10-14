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
import { Pet } from '../types';

interface AddPetFormData {
  name: string;
  animalType: 'dog' | 'cat' | 'bird';
  breed: string;
  dateOfBirth: Date;
}

interface AddPetScreenProps {
  onSavePet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const PET_TYPES = [
  { value: 'dog', label: 'Dog', icon: '🐕' },
  { value: 'cat', label: 'Cat', icon: '🐱' },
  { value: 'bird', label: 'Bird', icon: '🐦' },
] as const;

export default function AddPetScreen({ onSavePet, onCancel }: AddPetScreenProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddPetFormData>({
    defaultValues: {
      name: '',
      animalType: 'dog',
      breed: '',
      dateOfBirth: new Date(),
    },
  });

  const selectedAnimalType = watch('animalType');
  const selectedDate = watch('dateOfBirth');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValue('dateOfBirth', selectedDate);
    }
  };

  const onSubmit = async (data: AddPetFormData) => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validate date is not in the future
    if (data.dateOfBirth > new Date()) {
      Alert.alert('Invalid Date', 'Birth date cannot be in the future.');
      setIsLoading(false);
      return;
    }

    // Validate date is not too far in the past (e.g., more than 30 years)
    const thirtyYearsAgo = new Date();
    thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
    if (data.dateOfBirth < thirtyYearsAgo) {
      Alert.alert('Invalid Date', 'Please enter a valid birth date.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onSavePet({
        name: data.name.trim(),
        animalType: data.animalType,
        breed: data.breed.trim(),
        dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
      });
      setIsLoading(false);
    }, 1000);
  };

  const getPetTypeIcon = (type: string) => {
    const petType = PET_TYPES.find(p => p.value === type);
    return petType?.icon || '🐾';
  };

  const getPetTypeColor = (type: string) => {
    switch (type) {
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
        <Text style={styles.headerTitle}>Add New Pet</Text>
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
        {/* Pet Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Type</Text>
          <View style={styles.petTypeContainer}>
            {PET_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.petTypeOption,
                  selectedAnimalType === type.value && styles.petTypeOptionSelected,
                  { borderColor: getPetTypeColor(type.value) }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setValue('animalType', type.value);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.petTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.petTypeLabel,
                  selectedAnimalType === type.value && styles.petTypeLabelSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pet Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Pet name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 20,
                message: 'Name must be less than 20 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={[styles.textInput, errors.name && styles.textInputError]}
                  placeholder="Enter pet's name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={20}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Breed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breed</Text>
          <Controller
            control={control}
            name="breed"
            rules={{
              required: 'Breed is required',
              minLength: {
                value: 2,
                message: 'Breed must be at least 2 characters',
              },
              maxLength: {
                value: 30,
                message: 'Breed must be less than 30 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={[styles.textInput, errors.breed && styles.textInputError]}
                  placeholder="Enter breed (e.g., Golden Retriever)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={30}
                />
                {errors.breed && (
                  <Text style={styles.errorText}>{errors.breed.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Birth Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.dateOfBirth && styles.dateButtonError]}
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
          {errors.dateOfBirth && (
            <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
          )}
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={[styles.previewAvatar, { backgroundColor: getPetTypeColor(selectedAnimalType) }]}>
              <Text style={styles.previewIcon}>{getPetTypeIcon(selectedAnimalType)}</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>
                {watch('name') || 'Pet Name'}
              </Text>
              <Text style={styles.previewType}>
                {PET_TYPES.find(p => p.value === selectedAnimalType)?.label} • {watch('breed') || 'Breed'}
              </Text>
              <Text style={styles.previewDate}>
                Born: {selectedDate.toLocaleDateString()}
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
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  petTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  petTypeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  petTypeOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  petTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  petTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  petTypeLabelSelected: {
    color: '#2c3e50',
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
    padding: 20,
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
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewIcon: {
    fontSize: 28,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  previewType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  previewDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
