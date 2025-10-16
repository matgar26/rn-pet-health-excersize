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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import * as Haptics from 'expo-haptics';
import { Medication } from '../types';

interface AddMedicationFormData {
  name: string;
  dosage: string;
  instructions: string;
}

interface AddMedicationScreenProps {
  petId: string;
  petName: string;
  onSaveMedication: (medication: Omit<Medication, 'id' | 'petId' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DOSAGE_OPTIONS = [
  '1 mg daily',
  '2.5 mg twice daily',
  '5 mg with meals',
  '10 mg as needed',
  '15 mg every 8 hours',
  '20 mg at bedtime',
  '25 mg weekly',
  '50 mg monthly',
  '100 mg once daily',
  'Other',
];

const INSTRUCTION_OPTIONS = [
  'Take with food',
  'Take on empty stomach',
  'Take with water',
  'Take at bedtime',
  'Take in the morning',
  'Take twice daily',
  'Take as needed',
  'Take with meals',
  'Take every 8 hours',
  'Other',
];

export default function AddMedicationScreen({ petId, petName, onSaveMedication, onCancel, isLoading: externalLoading }: AddMedicationScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddMedicationFormData>({
    defaultValues: {
      name: '',
      dosage: '',
      instructions: '',
    },
  });

  const selectedDosage = watch('dosage');
  const selectedInstructions = watch('instructions');

  const onSubmit = async (data: AddMedicationFormData) => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await onSaveMedication({
        name: data.name,
        dosage: data.dosage,
        instructions: data.instructions,
      });
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'Failed to save medication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDosageSelect = (dosage: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('dosage', dosage);
  };

  const handleInstructionsSelect = (instructions: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('instructions', instructions);
  };

  const isFormValid = watch('name') && watch('dosage') && watch('instructions');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onCancel();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Add Medication</Text>
        
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isFormValid || isLoading || externalLoading}
        >
          <Text style={[styles.saveButtonText, !isFormValid && styles.saveButtonTextDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Pet Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For {petName}</Text>
          </View>

          {/* Medication Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medication Name</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Medication name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.textInput, errors.name && styles.textInputError]}
                  placeholder="Enter medication name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* Dosage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dosage</Text>
            <View style={styles.optionsGrid}>
              {DOSAGE_OPTIONS.map((dosage) => (
                <TouchableOpacity
                  key={dosage}
                  style={[
                    styles.optionChip,
                    selectedDosage === dosage && styles.optionChipSelected,
                  ]}
                  onPress={() => handleDosageSelect(dosage)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionChipText,
                    selectedDosage === dosage && styles.optionChipTextSelected
                  ]}>
                    {dosage}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedDosage === 'Other' && (
              <Controller
                control={control}
                name="dosage"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter custom dosage"
                    value={value === 'Other' ? '' : value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                )}
              />
            )}
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.optionsGrid}>
              {INSTRUCTION_OPTIONS.map((instruction) => (
                <TouchableOpacity
                  key={instruction}
                  style={[
                    styles.optionChip,
                    selectedInstructions === instruction && styles.optionChipSelected,
                  ]}
                  onPress={() => handleInstructionsSelect(instruction)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionChipText,
                    selectedInstructions === instruction && styles.optionChipTextSelected
                  ]}>
                    {instruction}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedInstructions === 'Other' && (
              <Controller
                control={control}
                name="instructions"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter custom instructions"
                    value={value === 'Other' ? '' : value}
                    onChangeText={onChange}
                    autoCapitalize="sentences"
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
            )}
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewIcon}>
                <Text style={styles.previewIconText}>💊</Text>
              </View>
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>{watch('name') || 'Medication Name'}</Text>
                <Text style={styles.previewSubtitle}>{watch('dosage') || 'Dosage'}</Text>
                <Text style={styles.previewInstructions}>{watch('instructions') || 'Instructions'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 16,
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
    color: '#3498db',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#7f8c8d',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionChipSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 3,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  optionChipText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: '#1976d2',
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewIconText: {
    fontSize: 24,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  previewInstructions: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});
