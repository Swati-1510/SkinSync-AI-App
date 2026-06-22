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

<img width="540" height="1170" alt="a30b3c89-ef74-47b2-856b-4a1eb4f9df2c" src="https://github.com/user-attachments/assets/2e709502-bc92-479e-865c-1a77b0e837b2" /> <img width="738" height="1600" alt="03fbe091-8020-4d35-869b-e17b4e94f888" src="https://github.com/user-attachments/assets/9afebcb6-f4d2-49be-9c26-5a2636d232c2" />
<img width="738" height="1600" alt="b4ef53a3-8ffc-4c2a-b6c3-7b0693f9eb1d" src="https://github.com/user-attachments/assets/52118235-2022-456c-86cb-05a1483c67f3" />
<img width="738" height="1600" alt="37fb3593-b6b8-4397-bd6a-5e8fdd86d502" src="https://github.com/user-attachments/assets/aaac5cc3-bd02-4963-ab97-caa52bddb8e8" />
<img width="738" height="1600" alt="dda3c338-4048-4cc4-9dfc-1c4d7ea04c80" src="https://github.com/user-attachments/assets/7db2e447-17a7-4fb1-9bb5-935cef894148" />
<img width="435" height="1600" alt="caa524db-96d2-4da6-b777-89c6c47c5827" src="https://github.com/user-attachments/assets/46ab4d44-f701-4a93-be7d-7ff1ba9831ec" />
<img width="519" height="1600" alt="cae80133-029e-4701-a4f0-aa06ab1f2d31" src="https://github.com/user-attachments/assets/420a48c6-bb70-43a6-ad81-c737303fe41f" />
<img width="540" height="1316" alt="e7e52685-c8ec-4f73-83d5-d7a5336bcfcd" src="https://github.com/user-attachments/assets/2ba15c3f-49b4-4d4b-95c5-8a34e003a571" />
<img width="738" height="1600" alt="f6755cb7-e2ee-4f68-bf2e-d6d495179186" src="https://github.com/user-attachments/assets/6be22cb7-1fa1-425a-9c41-c5ec039c211c" />
<img width="738" height="1600" alt="29f463a6-d594-40e4-99f4-6fc2f0dbb40d" src="https://github.com/user-attachments/assets/0354f85f-e470-4868-87b2-ac2e41691c35" />
<img width="738" height="1600" alt="385bff73-730b-445d-9dd0-cf0ab08273b4" src="https://github.com/user-attachments/assets/8c4583ad-eed9-41c1-ac53-858629898d11" />
<img width="738" height="1600" alt="cfe24c3c-5898-41fd-b26f-240c84753a8b" src="https://github.com/user-attachments/assets/b201f8cb-d1dc-4d36-9da0-d2c936c4b85c" />
<img width="738" height="1600" alt="4d104ac6-a81b-4a0f-b5cb-e9fd9d72d44c" src="https://github.com/user-attachments/assets/0b543424-df88-46c2-bd46-e7238bd4dd00" />
<img width="540" height="1500" alt="659fbda2-cb3f-43b8-99ab-3c6e9080f968" src="https://github.com/user-attachments/assets/089ccc3c-60aa-4ba5-9762-b66310010e40" />
<img width="540" height="1479" alt="25007955-4808-418c-ac4f-1901bb41bdcf" src="https://github.com/user-attachments/assets/e9e2fa0c-7133-48b2-8e95-0c22b840e5b2" />





Get started

1. Clone the Repository

git clone [https://github.com/Swati-1510/SkinSync-AI-App.git](https://github.com/Swati-1510/SkinSync-AI-App.git)
cd SkinSync-AI-App


2. Install Dependencies

npm install


3. Set Up Environment Variables

This project requires API keys for Firebase and Google Cloud.

Create a file named .env in the root of the project.


Important: In your Google Cloud Project, you must enable the following APIs:

Generative Language API (for Gemini)

Cloud Vision API (for OCR)

4. Start the App

npx expo start

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
