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
import { Allergy } from '../types';

interface AddAllergyFormData {
  name: string;
  reactions: string[];
  severity: 'mild' | 'severe';
}

interface AddAllergyScreenProps {
  petName: string;
  onSaveAllergy: (allergy: Omit<Allergy, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const COMMON_REACTIONS = [
  'Hives',
  'Rash',
  'Swelling',
  'Itching',
  'Redness',
  'Vomiting',
  'Diarrhea',
  'Difficulty Breathing',
  'Lethargy',
  'Loss of Appetite',
  'Other',
];

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', color: '#f39c12', icon: '⚠️' },
  { value: 'severe', label: 'Severe', color: '#e74c3c', icon: '🚨' },
] as const;

export default function AddAllergyScreen({ petName, onSaveAllergy, onCancel }: AddAllergyScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddAllergyFormData>({
    defaultValues: {
      name: '',
      reactions: [],
      severity: 'mild',
    },
  });

  const selectedSeverity = watch('severity');

  const handleReactionToggle = (reaction: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedReactions(prev => {
      const newReactions = prev.includes(reaction)
        ? prev.filter(r => r !== reaction)
        : [...prev, reaction];
      
      setValue('reactions', newReactions);
      return newReactions;
    });
  };

  const handleSeveritySelect = (severity: 'mild' | 'severe') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue('severity', severity);
  };

  const onSubmit = async (data: AddAllergyFormData) => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validate that at least one reaction is selected
    if (data.reactions.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one reaction.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onSaveAllergy({
        petId: '', // This will be set by the parent component
        name: data.name.trim(),
        reactions: data.reactions,
        severity: data.severity,
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
        <Text style={styles.headerTitle}>Add Allergy</Text>
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
          <Text style={styles.petInfoText}>Adding allergy record for</Text>
          <Text style={styles.petName}>{petName}</Text>
        </View>

        {/* Allergy Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergy Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Allergy name is required',
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
                  placeholder="Enter allergy name (e.g., Chicken, Pollen)"
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

        {/* Reactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reactions</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          <View style={styles.reactionsGrid}>
            {COMMON_REACTIONS.map((reaction) => (
              <TouchableOpacity
                key={reaction}
                style={[
                  styles.reactionChip,
                  selectedReactions.includes(reaction) && styles.reactionChipSelected
                ]}
                onPress={() => handleReactionToggle(reaction)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.reactionChipText,
                  selectedReactions.includes(reaction) && styles.reactionChipTextSelected
                ]}>
                  {reaction}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedReactions.length === 0 && (
            <Text style={styles.errorText}>Please select at least one reaction</Text>
          )}
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Severity</Text>
          <View style={styles.severityContainer}>
            {SEVERITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.severityOption,
                  selectedSeverity === option.value && styles.severityOptionSelected,
                  { borderColor: option.color }
                ]}
                onPress={() => handleSeveritySelect(option.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.severityIcon}>{option.icon}</Text>
                <Text style={[
                  styles.severityLabel,
                  selectedSeverity === option.value && styles.severityLabelSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={[
            styles.previewCard,
            { borderLeftColor: selectedSeverity === 'severe' ? '#e74c3c' : '#f39c12' }
          ]}>
            <View style={styles.previewIcon}>
              <Text style={styles.previewIconText}>⚠️</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>
                {watch('name') || 'Allergy Name'}
              </Text>
              <Text style={styles.previewReactions}>
                {selectedReactions.length > 0 
                  ? selectedReactions.join(', ')
                  : 'Select reactions'
                }
              </Text>
              <Text style={[
                styles.previewSeverity,
                { color: selectedSeverity === 'severe' ? '#e74c3c' : '#f39c12' }
              ]}>
                {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}
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
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  reactionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reactionChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  reactionChipSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  reactionChipText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  reactionChipTextSelected: {
    color: '#ffffff',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  severityOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  severityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  severityLabelSelected: {
    color: '#2c3e50',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f39c12',
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
  previewReactions: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  previewSeverity: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
