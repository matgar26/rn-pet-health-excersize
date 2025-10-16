const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
let users = [];
let pets = [];
let vaccines = [];
let allergies = [];
let medications = [];

// Helper function to generate IDs
const generateId = () => Date.now().toString();

// Helper function to find user by email
const findUserByEmail = (email) => users.find(user => user.email === email);

// Helper function to find pets by user ID
const findPetsByUserId = (userId) => pets.filter(pet => pet.userId === userId);

// Helper function to find medical records by pet ID
const findRecordsByPetId = (petId, recordType) => {
  switch (recordType) {
    case 'vaccines':
      return vaccines.filter(record => record.petId === petId);
    case 'allergies':
      return allergies.filter(record => record.petId === petId);
    case 'medications':
      return medications.filter(record => record.petId === petId);
    default:
      return [];
  }
};

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if user already exists
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Create new user
  const emailParts = email.split('@')[0];
  const firstName = emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
  const lastName = 'User';

  const newUser = {
    id: generateId(),
    email,
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  res.status(201).json({ user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user });
});

// Pet endpoints
app.get('/api/pets', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const userPets = findPetsByUserId(userId);
  res.json({ pets: userPets });
});

app.post('/api/pets', (req, res) => {
  const { userId, name, animalType, breed, dateOfBirth } = req.body;
  
  if (!userId || !name || !animalType || !breed || !dateOfBirth) {
    return res.status(400).json({ error: 'All pet fields are required' });
  }

  const newPet = {
    id: generateId(),
    userId,
    name,
    animalType,
    breed,
    dateOfBirth,
    createdAt: new Date().toISOString(),
  };

  pets.push(newPet);
  res.status(201).json({ pet: newPet });
});

app.delete('/api/pets/:petId', (req, res) => {
  const { petId } = req.params;
  
  const petIndex = pets.findIndex(pet => pet.id === petId);
  if (petIndex === -1) {
    return res.status(404).json({ error: 'Pet not found' });
  }

  // Remove pet
  pets.splice(petIndex, 1);
  
  // Remove all medical records for this pet
  vaccines = vaccines.filter(vaccine => vaccine.petId !== petId);
  allergies = allergies.filter(allergy => allergy.petId !== petId);
  medications = medications.filter(medication => medication.petId !== petId);

  res.json({ message: 'Pet deleted successfully' });
});

// Medical record endpoints
app.get('/api/records/:petId/:recordType', (req, res) => {
  const { petId, recordType } = req.params;
  
  if (!['vaccines', 'allergies', 'medications'].includes(recordType)) {
    return res.status(400).json({ error: 'Invalid record type' });
  }

  const records = findRecordsByPetId(petId, recordType);
  res.json({ [recordType]: records });
});

// Vaccine endpoints
app.post('/api/vaccines', (req, res) => {
  const { petId, name, dateAdministered, isScheduled } = req.body;
  
  if (!petId || !name || !dateAdministered || typeof isScheduled !== 'boolean') {
    return res.status(400).json({ error: 'All vaccine fields are required' });
  }

  const newVaccine = {
    id: generateId(),
    petId,
    name,
    dateAdministered,
    isScheduled,
    createdAt: new Date().toISOString(),
  };

  vaccines.push(newVaccine);
  res.status(201).json({ vaccine: newVaccine });
});

app.delete('/api/vaccines/:vaccineId', (req, res) => {
  const { vaccineId } = req.params;
  
  const vaccineIndex = vaccines.findIndex(vaccine => vaccine.id === vaccineId);
  if (vaccineIndex === -1) {
    return res.status(404).json({ error: 'Vaccine not found' });
  }

  vaccines.splice(vaccineIndex, 1);
  res.json({ message: 'Vaccine deleted successfully' });
});

// Allergy endpoints
app.post('/api/allergies', (req, res) => {
  const { petId, name, reactions, severity } = req.body;
  
  if (!petId || !name || !reactions || !severity) {
    return res.status(400).json({ error: 'All allergy fields are required' });
  }

  const newAllergy = {
    id: generateId(),
    petId,
    name,
    reactions,
    severity,
    createdAt: new Date().toISOString(),
  };

  allergies.push(newAllergy);
  res.status(201).json({ allergy: newAllergy });
});

app.delete('/api/allergies/:allergyId', (req, res) => {
  const { allergyId } = req.params;
  
  const allergyIndex = allergies.findIndex(allergy => allergy.id === allergyId);
  if (allergyIndex === -1) {
    return res.status(404).json({ error: 'Allergy not found' });
  }

  allergies.splice(allergyIndex, 1);
  res.json({ message: 'Allergy deleted successfully' });
});

// Medication endpoints
app.post('/api/medications', (req, res) => {
  const { petId, name, dosage, instructions } = req.body;
  
  if (!petId || !name || !dosage || !instructions) {
    return res.status(400).json({ error: 'All medication fields are required' });
  }

  const newMedication = {
    id: generateId(),
    petId,
    name,
    dosage,
    instructions,
    createdAt: new Date().toISOString(),
  };

  medications.push(newMedication);
  res.status(201).json({ medication: newMedication });
});

app.delete('/api/medications/:medicationId', (req, res) => {
  const { medicationId } = req.params;
  
  const medicationIndex = medications.findIndex(medication => medication.id === medicationId);
  if (medicationIndex === -1) {
    return res.status(404).json({ error: 'Medication not found' });
  }

  medications.splice(medicationIndex, 1);
  res.json({ message: 'Medication deleted successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Novellia Pets API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🐕 Mock data loaded: ${pets.length} pets for ${users.length} users`);
});
