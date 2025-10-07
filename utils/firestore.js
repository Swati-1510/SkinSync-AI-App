import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// --- ADD THIS TEMPORARY FIX ---
// This is the simplest way to ensure all functions are correctly seen in this file's scope.
const _query = query;
const _collection = collection;
const _where = where;
const _orderBy = orderBy;
// --- END OF TEMPORARY FIX ---
console.log("--- Is the 'db' object from Firebase Config valid? ---", db ? "Yes" : "No, it is undefined!");

// Function to get the starting date for the Weekly/Monthly view filter
export const getStartDate = (period) => {
    const d = new Date();
    // Subtract 7 days for Weekly, 30 days for Monthly (or a suitable value)
    d.setDate(d.getDate() - (period === 'Weekly' ? 7 : 30)); 
    return d.toISOString().split('T')[0]; // Return in 'YYYY-MM-DD' format
};


const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getTodaysLog = async (userId) => {
    if (!userId) return null;
    const dateStr = getTodayString();
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

    const dateStr = getTodayString();
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

export const saveJournalEntry = async (userId, content) => {
    try {
        const docRef = await addDoc(collection(db, "journalEntries"), {
            userId: userId,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            content: content,
            createdAt: new Date(), // Use a timestamp for sorting
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Firestore Save Error (Journal):", e);
        return { success: false, error: e };
    }
};

export const getJournalEntriesFromDB = async (userId) => {
    if (!userId) return [];
    try {
        const q = _query(
            _collection(db, "journalEntries"),
            _where("userId", "==", userId)
            // orderBy("date", "desc") // We'll keep this disabled for now to avoid index errors
        );
        const querySnapshot = await getDocs(q);

        const entries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : data.date, 
                entry: data.content,
            };
        });
        return entries;
    } catch (e) {
        console.error("Error fetching journal entries from DB:", e);
        return []; // Return an empty array on failure
    }
};

export const fetchLifestyleData = async (userId, period) => {
    if (!userId) return { dates: [], water: [], sleep: [] };
    
    try {
        const startDateStr = getStartDate(period);
        
        // --- Query Firestore for ALL daily logs for this user ---
        const q = _query(
            _collection(db, "dailyLogs"),
            _where("userId", "==", userId),
            _orderBy("date", "asc") // Order Ascending so charts draw correctly from oldest to newest
        );
        const querySnapshot = await getDocs(q);

        const logs = querySnapshot.docs.map(doc => doc.data());

        // --- Client-Side Filtering and Formatting Logic ---
        const dates = [];
        const water = [];
        const sleep = [];

        // 1. Filter logs to only include those in the current period (Weekly or Monthly)
        const relevantLogs = logs.filter(log => log.date >= startDateStr);
        
        // 2. Format the data for the charts
        relevantLogs.forEach(log => {
            // For the label, just use month/day format (e.g., '10/27')
            dates.push(log.date.substring(5).replace('-', '/')); 
            // Get the numeric values, defaulting to 0 if null/undefined
            water.push(log.waterIntake || 0);
            sleep.push(log.hoursSlept || 0);
        });

        // Return the final data structure
        return { dates, water, sleep };

    } catch (e) {
        console.error("Error fetching lifestyle data:", e);
        return { dates: [], water: [], sleep: [] };
    }
};