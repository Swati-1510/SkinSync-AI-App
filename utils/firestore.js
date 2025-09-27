import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
console.log("--- Is the 'db' object from Firebase Config valid? ---", db ? "Yes" : "No, it is undefined!");

const getTodaysDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getTodaysLog = async (userId) => {
    if (!userId) return null;
    const dateStr = getTodaysDateString();
    const docId = `${userId}_${dateStr}`;
    const docRef = doc(db, 'dailyLogs', docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateTodaysLog = async (userId, dataToUpdate) => {
    console.log("--- FIRESTORE: updateTodaysLog CALLED ---");
    console.log("   - User ID Received:", userId);
    console.log("   - Data to Save:", dataToUpdate);

    if (!userId) {
        console.error("--- FIRESTORE: FAILED at Step 1: No userId provided. ---");
        return;
    }

    const dateStr = getTodaysDateString();
    const docId = `${userId}_${dateStr}`;
    console.log("--- FIRESTORE: Step 2: Generated Document ID is:", docId);

    const docRef = doc(db, 'dailyLogs', docId);
    console.log("--- FIRESTORE: Step 3: Document reference created. About to try saving...");

    try {
        await setDoc(docRef, { 
            userId: userId, 
            date: dateStr, 
            ...dataToUpdate 
        }, { merge: true });

        console.log("--- FIRESTORE: SUCCESS at Step 4! Data should be saved. ---");

    } catch (error) {
        console.error("--- FIRESTORE: FAILED at Step 4: An error occurred while saving! ---");
        console.error("   - Firestore Error Code:", error.code);
        console.error("   - Firestore Error Message:", error.message);
    }
};