Welcome to SkinSync AI 🤖✨

This is a complete, all-in-one skincare coach built with React Native for a final-year BSc Computer Science project. It's not just a basic app; it's a full-stack solution that uses Google's Gemini AI and Firebase to provide a truly personalized user experience.

Key Features

🧠 Personalized Onboarding: A comprehensive, multi-step quiz to capture a user's unique skin type, concerns, and goals.

🗓️ AI-Powered Routines: Connects to the Google Gemini AI API to generate fully personalized AM/PM routines with real product recommendations based on the user's profile.

🏠 Home Hub: A dynamic dashboard featuring a daily AI Coach Tip (also from Gemini) and a Daily Log to track water intake and sleep, which is saved to Firestore.

🔍 Smart Explore Page: An AI-powered search where users can find product recommendations by name, brand, or even a skin concern like "acne."

📱 Hybrid Barcode Scanner: Scans a product and checks two public databases (Open Beauty Facts & Open Food Facts).

If found, it sends the ingredients to the Gemini AI for a personalized analysis ("Good Match," "Use with Caution," etc.).

If not found, it activates the fallback...

📸 OCR "Scan from Photo" Feature:

Solves the "Product Not Found" dead end.

Uses expo-image-picker to let the user take a photo of the ingredient list.

Sends the photo to Google Cloud Vision API (OCR) to read the text.

Sends the extracted text to the Gemini AI for a final analysis.

📊 Progress & Journal: A dedicated module to log daily check-ins and write journal notes to track skin progress over time.

👤 Full Backend Support: Secure user authentication (Email/Password & Google) and all data persistence handled by Firebase (Auth & Firestore).

Tech Stack

Frontend: React Native (with Expo)

Navigation: Expo Router

Styling: Tailwind CSS (NativeWind)

Backend & Database: Firebase (Auth, Firestore)

AI: Google Gemini AI (for analysis & recommendations)

OCR: Google Cloud Vision API

Data: Open Beauty Facts API, Open Food Facts API

Builds: EAS (Expo Application Services)

Get started

1. Clone the Repository

git clone [https://github.com/YourUsername/SkinSync-AI-App.git](https://github.com/YourUsername/SkinSync-AI-App.git)
cd SkinSync-AI-App


2. Install Dependencies

npm install


3. Set Up Environment Variables

This project requires API keys for Firebase and Google Cloud.

Create a file named .env in the root of the project.

Add your keys in the following format:

# Your Firebase project's web app config object (as a JSON string)
EXPO_PUBLIC_FIREBASE_CONFIG='{"apiKey": "...", "authDomain": "...", ...}'

# Your Google Cloud API Key (for both Gemini and Cloud Vision)
EXPO_PUBLIC_GEMINI_API_KEY="AIza..."


Important: In your Google Cloud Project, you must enable the following APIs:

Generative Language API (for Gemini)

Cloud Vision API (for OCR)

4. Start the App

npx expo start

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
