# GiftCard-Wallet-Phone-App
This project is a secure, offline-first mobile wallet for storing and managing gift cards, built using React Native and Supabase. The application emphasizes data security, reliability without internet connectivity, and seamless multi-device synchronization.

# Tech stack
* React Native + Expo
* TypeScript
* SQLite (expo-sqlite)
* Supabase (PostgreSQL + Auth0)
* Client-side encryption (TweetNaCl)
* Expo SecureStore
* Expo Local Authentication (Face ID / Touch ID)

# Features
* Offline-First Mobile Architecture
* Queue-Based Sync Engine
* Conflict Resolution
* Soft Delete Synchronization
* End-to-End Encryption for Sensitive Data
* Biometric Security
* OAuth Authentication
* Real-Time Barcode Rendering

# Local set up
1. Clone the repo
git clone https://github.com/ChristopherJustin/AI-Recipe-Finder.git
cd apps/mobile

2. Setup
cd cd apps/mobile
npm install
npx expo start -c
