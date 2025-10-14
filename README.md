# Novellia Pets - Pet Health Management App

A React Native iOS app for managing your pet's health records, built as part of the Novellia takehome assignment.

## Features

- **User Registration** - Create a new account with email and password
- **Form Validation** - Real-time validation using React Hook Form
- **Responsive Design** - Optimized for iOS iPhone
- **Error Handling** - Graceful error handling for user inputs

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- iOS Simulator (for testing)
- Expo CLI (installed globally with `npm install -g @expo/cli`)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both the API server and React Native app:
   ```bash
   make dev
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1 - Start API server
   make server
   
   # Terminal 2 - Start React Native app
   make client
   ```

3. Run on iOS simulator:
   ```bash
   make ios
   ```

### Available Commands

- `make install` - Install dependencies
- `make dev` - Start both API server and React Native app (with cleanup)
- `make dev-separate` - Start API server and React Native app separately (recommended)
- `make server` - Start only the API server
- `make client` - Start only the React Native app
- `make ios` - Start React Native app on iOS simulator
- `make stop` - Stop all running servers and free ports
- `make clean` - Clean and reinstall dependencies
- `make health` - Check API server health
- `make test-api` - Test API endpoints

## API Server

The app now includes a simple Express.js API server (`server.js`) that provides:

- **Authentication**: User registration and login
- **Pet Management**: CRUD operations for pets
- **Medical Records**: CRUD operations for vaccines, allergies, and labs
- **In-Memory Storage**: Data persists during server session
- **CORS Enabled**: Allows requests from the React Native app

### API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/pets?userId={id}` - Get user's pets
- `POST /api/pets` - Add new pet
- `DELETE /api/pets/:petId` - Delete pet
- `GET /api/records/:petId/:recordType` - Get medical records
- `POST /api/vaccines` - Add vaccine record
- `DELETE /api/vaccines/:vaccineId` - Delete vaccine record
- `POST /api/allergies` - Add allergy record
- `DELETE /api/allergies/:allergyId` - Delete allergy record
- `POST /api/labs` - Add lab record
- `DELETE /api/labs/:labId` - Delete lab record
- `GET /api/health` - Health check

### Project Structure

- `App.tsx` - Main application component
- `screens/RegistrationScreen.tsx` - User registration screen
- `app.json` - Expo configuration (iOS-only)
- `package.json` - Dependencies and scripts
- `assets/` - Images and static assets

### Dependencies

- **React Native** - The core framework
- **Expo** - Development platform and tools
- **TypeScript** - Type safety and better development experience
- **React Hook Form** - Form handling and validation
- **React Navigation** - Navigation between screens

### Current Implementation

#### Registration Screen

The registration screen includes:
- Email input with validation
- Password input with minimum length validation
- Confirm password input with matching validation
- Real-time form validation using React Hook Form
- Loading states and error handling
- Responsive design optimized for iOS

#### Dashboard Screen

The main dashboard includes:
- **Empty State**: When no pets exist, shows a friendly empty state with an "Add Your First Pet" button
- **Pet Grid**: Displays pets in a 2-column grid layout with:
  - Pet type icons (🐕 for dogs, 🐱 for cats, 🐦 for birds)
  - Pet name, type, and breed information
  - Color-coded borders based on pet type
  - **Haptic Feedback**: Medium impact feedback when pets are tapped
- **Add Pet Card**: When pets exist, shows an additional "Add new pet" card with:
  - Plus icon (+) and "Add new pet" title
  - Dashed border styling to distinguish from pet cards
  - Same size and layout as pet cards for consistency

#### Add Pet Screen

The pet registration form includes:
- **Pet Type Selection**: Visual buttons for Dog, Cat, and Bird with icons
- **Pet Name Field**: Text input with validation (2-20 characters)
- **Breed Field**: Text input with validation (2-30 characters)
- **Date Picker**: Native date picker for birth date selection
- **Form Validation**: Real-time validation with error messages
- **Live Preview**: Shows how the pet will appear in the dashboard
- **Haptic Feedback**: Consistent feedback for all interactions
- **Navigation**: Cancel and Save buttons with loading states

#### Pet Detail Screen

The pet detail view includes:
- **Pet Avatar**: Large circular icon at the top (placeholder for future photo upload)
- **Pet Information**: Name, type, and breed display
- **Tabbed Interface**: Three tabs for different medical record types:
  - **Vaccines** (💉): Track vaccination history
  - **Allergies** (⚠️): Record allergies and reactions
  - **Labs** (🧪): Manage lab work and medications
- **Empty States**: Custom empty states for each record type with add buttons
- **Record Management**: View, edit, and delete medical records
- **Add Vaccine Records**: Complete form for adding vaccine records
- **Add Allergy Records**: Complete form for adding allergy records
- **Add Lab Records**: Complete form for adding lab/medication records
- **Pet Management**: Three-dot menu with delete pet option
- **Haptic Feedback**: Consistent feedback for all interactions
- **Navigation**: Back button to return to dashboard

#### Add Vaccine Screen

The vaccine record form includes:
- **Pet Context**: Shows which pet the vaccine is being added for
- **Vaccine Type Selection**: Choose between Past Vaccine (already administered) or Scheduled Vaccine (future appointment)
- **Vaccine Name Field**: Text input with validation (2-50 characters)
- **Common Vaccines**: Quick-select chips for common vaccines (Rabies, DHPP, etc.)
- **Date Picker**: Native date picker with smart validation based on vaccine type
- **Smart Validation**: Past vaccines can't be in future, scheduled vaccines can't be in past
- **Form Validation**: Real-time validation with error messages
- **Live Preview**: Shows how the vaccine record will appear
- **Haptic Feedback**: Consistent feedback for all interactions
- **Navigation**: Cancel and Save buttons with loading states

#### Vaccine Reminder System

The vaccine management includes:
- **Upcoming Vaccines**: Shows scheduled vaccines with upcoming dates
- **Past Vaccines**: Shows administered vaccines in chronological order
- **Visual Indicators**: Color-coded cards and badges for upcoming/overdue vaccines
- **Overdue Detection**: Automatically identifies overdue scheduled vaccines
- **Smart Sorting**: Upcoming vaccines sorted by date, past vaccines by most recent
- **Section Headers**: Clear separation between upcoming and past vaccines

#### Add Allergy Screen

The allergy record form includes:
- **Pet Context**: Shows which pet the allergy is being added for
- **Allergy Name Field**: Text input with validation (2-50 characters)
- **Reactions Selection**: Multi-select chips for common reactions (Hives, Rash, Swelling, etc.)
- **Severity Selection**: Visual buttons for Mild (⚠️) and Severe (🚨) severity levels
- **Form Validation**: Real-time validation with error messages
- **Live Preview**: Shows how the allergy record will appear with color-coded severity
- **Haptic Feedback**: Consistent feedback for all interactions
- **Navigation**: Cancel and Save buttons with loading states

#### Add Lab Screen

The lab record form includes:
- **Pet Context**: Shows which pet the lab record is being added for
- **Lab Name Field**: Text input with validation (2-50 characters)
- **Common Labs**: Quick-select chips for common tests (Blood Work, X-Ray, etc.)
- **Dosage Field**: Text input with validation (2-30 characters)
- **Common Dosages**: Quick-select chips for common dosages (1 tablet daily, etc.)
- **Instructions Field**: Multi-line text area with validation (10-200 characters)
- **Character Counter**: Real-time character count for instructions
- **Form Validation**: Real-time validation with error messages
- **Live Preview**: Shows how the lab record will appear
- **Haptic Feedback**: Consistent feedback for all interactions
- **Navigation**: Cancel and Save buttons with loading states

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser (for testing)

### Future Features (To Be Implemented)

- Pet management (add, edit, delete pets)
- Medical record tracking (vaccines, allergies, labs)
- Dashboard to view all pets
- User authentication
- Data persistence
- Backend API integration

### Development Notes

- **Development Mode**: The app automatically logs in as `mattgardner26@gmail.com` for faster development
- The app currently uses in-memory storage for simplicity
- Form validation is handled client-side
- The UI is designed to be intuitive and user-friendly
- Error handling provides clear feedback to users
- To enable registration screen, set `currentUser` to `null` in `App.tsx`
