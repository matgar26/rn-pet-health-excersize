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
import { Lab } from '../types';

interface AddLabFormData {
  name: string;
  dosage: string;
  instructions: string;
}

interface AddLabScreenProps {
  petName: string;
  onSaveLab: (lab: Omit<Lab, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const COMMON_LABS = [
  'Blood Work',
  'Urinalysis',
  'X-Ray',
  'Ultrasound',
  'Biopsy',
  'Culture Test',
  'Allergy Test',
  'Heartworm Test',
  'Fecal Test',
  'Other',
];

const COMMON_DOSAGES = [
  '1 tablet daily',
  '2 tablets twice daily',
  '1/2 tablet with food',
  '1 ml every 8 hours',
  '2.5 mg daily',
  '5 mg as needed',
  '10 mg twice daily',
  '15 mg with meals',
  'Other',
];

export default function AddLabScreen({ petName, onSaveLab, onCancel }: AddLabScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddLabFormData>({
    defaultValues: {
      name: '',
      dosage: '',
      instructions: '',
    },
  });

  const handleLabSelect = (labName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('name', labName);
  };

  const handleDosageSelect = (dosage: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('dosage', dosage);
  };

  const onSubmit = async (data: AddLabFormData) => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      onSaveLab({
        petId: '', // This will be set by the parent component
        name: data.name.trim(),
        dosage: data.dosage.trim(),
        instructions: data.instructions.trim(),
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
        <Text style={styles.headerTitle}>Add Lab Record</Text>
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
          <Text style={styles.petInfoText}>Adding lab record for</Text>
          <Text style={styles.petName}>{petName}</Text>
        </View>

        {/* Lab Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lab/Test Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Lab name is required',
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
                  placeholder="Enter lab or test name"
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

        {/* Common Labs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Labs/Tests</Text>
          <Text style={styles.sectionSubtitle}>Tap to select a common lab</Text>
          <View style={styles.labGrid}>
            {COMMON_LABS.map((lab) => (
              <TouchableOpacity
                key={lab}
                style={[
                  styles.labChip,
                  watch('name') === lab && styles.labChipSelected
                ]}
                onPress={() => handleLabSelect(lab)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.labChipText,
                  watch('name') === lab && styles.labChipTextSelected
                ]}>
                  {lab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dosage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dosage/Amount</Text>
          <Controller
            control={control}
            name="dosage"
            rules={{
              required: 'Dosage is required',
              minLength: {
                value: 2,
                message: 'Dosage must be at least 2 characters',
              },
              maxLength: {
                value: 30,
                message: 'Dosage must be less than 30 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={[styles.textInput, errors.dosage && styles.textInputError]}
                  placeholder="Enter dosage (e.g., 2.5 mg daily)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={30}
                />
                {errors.dosage && (
                  <Text style={styles.errorText}>{errors.dosage.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Common Dosages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Dosages</Text>
          <Text style={styles.sectionSubtitle}>Tap to select a common dosage</Text>
          <View style={styles.dosageGrid}>
            {COMMON_DOSAGES.map((dosage) => (
              <TouchableOpacity
                key={dosage}
                style={[
                  styles.dosageChip,
                  watch('dosage') === dosage && styles.dosageChipSelected
                ]}
                onPress={() => handleDosageSelect(dosage)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dosageChipText,
                  watch('dosage') === dosage && styles.dosageChipTextSelected
                ]}>
                  {dosage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Controller
            control={control}
            name="instructions"
            rules={{
              required: 'Instructions are required',
              minLength: {
                value: 10,
                message: 'Instructions must be at least 10 characters',
              },
              maxLength: {
                value: 200,
                message: 'Instructions must be less than 200 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={[styles.textArea, errors.instructions && styles.textAreaError]}
                  placeholder="Enter detailed instructions (e.g., Take twice a day for a week with food)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={200}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {watch('instructions')?.length || 0}/200 characters
                </Text>
                {errors.instructions && (
                  <Text style={styles.errorText}>{errors.instructions.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewIcon}>
              <Text style={styles.previewIconText}>🧪</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>
                {watch('name') || 'Lab Name'}
              </Text>
              <Text style={styles.previewDosage}>
                Dosage: {watch('dosage') || 'Enter dosage'}
              </Text>
              <Text style={styles.previewInstructions}>
                {watch('instructions') || 'Enter instructions'}
              </Text>
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
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 100,
  },
  textAreaError: {
    borderColor: '#e74c3c',
  },
  characterCount: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  labGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  labChipSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  labChipText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  labChipTextSelected: {
    color: '#ffffff',
  },
  dosageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dosageChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  dosageChipSelected: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  dosageChipText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  dosageChipTextSelected: {
    color: '#ffffff',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  previewDosage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  previewInstructions: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
