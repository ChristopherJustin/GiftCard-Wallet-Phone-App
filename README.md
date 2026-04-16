# GiftCard-Wallet-Phone-App
This project is a secure, offline-first mobile wallet for storing and managing gift cards, built using React Native and Supabase. The application emphasizes data security, reliability without internet connectivity, and seamless multi-device synchronization.

All user interactions occur locally using SQLite. The app remains fully functional without an internet connection and synchronizes with the backend when connectivity is restored.

A custom synchronization system records all local changes in a sync_queue table and asynchronously replicates them to the backend. This prevents UI blocking and ensures changes are never lost.

The app resolves multi-device conflicts using timestamp-based versioning (last_modified). The most recent update automatically wins, ensuring consistent data across devices.

Records are never immediately removed. Instead, deletions are marked with a deleted_at timestamp to ensure they propagate correctly across devices during sync.

Gift card numbers, PINs, and barcode data are encrypted on the client using TweetNaCl before being stored locally. Encryption keys are securely stored using Expo SecureStore.

Optional Face ID / Touch ID authentication protects access to decrypted card information. Users can sign in using email/password or Google OAuth through Supabase Auth.

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

2. Setup
cd apps/mobile
npm install
npx expo start -c
