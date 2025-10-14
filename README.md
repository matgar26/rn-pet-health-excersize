# Novellia Pets MVP

A React Native iOS app for managing pet medical records, built as a takehome assignment.

## Features

- **User Registration** - Email and password authentication
- **Pet Management** - Add, edit, and delete pets
- **Medical Records** - Track vaccines, allergies, and lab results
- **Vaccine Reminders** - Schedule future vaccines and track past ones
- **Responsive Design** - Clean, modern UI with haptic feedback
- **Native Navigation** - Smooth transitions and gestures

## Quick Start

1. Install dependencies:
   ```bash
   make install
   ```

2. Start the development environment:
   ```bash
   make dev
   ```

3. Run on iOS simulator:
   ```bash
   make ios
   ```

## Available Commands

- `make install` - Install dependencies
- `make dev` - Start both API server and React Native app
- `make ios` - Start React Native app on iOS simulator
- `make clean` - Clean and reinstall dependencies
- `make stop` - Stop all running servers and free ports
- `make health` - Check API server health

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Hook Form** for form handling
- **React Navigation** for navigation
- **Express.js** API server
- **Haptic feedback** for better UX

## Project Structure

```
├── App.tsx                 # Main app component
├── navigation/             # Navigation configuration
├── screens/               # React Native screens
├── services/              # API and data services
├── types/                 # TypeScript type definitions
├── server.js              # Express.js API server
└── Makefile               # Development commands
```

## Development Notes

- The app automatically logs in as `mattgardner26@gmail.com` for development
- All data is stored in memory during the server session
- The API server runs on port 3001
- React Native app runs on port 8081