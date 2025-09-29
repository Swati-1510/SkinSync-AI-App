// in utils/aiService.js
import fetch from 'cross-fetch';

// --- Global Configuration ---
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
// ====================================================================
// FUNCTION 1: Generate the full, personalized routine
// ====================================================================
export const generateDynamicRoutineFromAI = async (skinProfile) => {
    console.log("--- AISERVICE: Getting AI Routine ---");

    if (!GEMINI_API_KEY) {
        console.error("--- AISERVICE: ERROR! API key is missing. ---");
        throw new Error("Gemini API key is not configured.");
    }

    const prompt = `
        You are an expert esthetician. Based on this user's skin profile: ${JSON.stringify(skinProfile)},
        generate a simple AM and PM skincare routine.
        For each step, recommend ONE specific, real product.
        Format your response as a valid JSON object ONLY, with this structure:
        { "am": [{"step": 1, "title": "Cleanse", "productName": "Product Name Here", "tip": "A short tip"}], "pm": [...] }
    `;

    const requestBody = {
        "contents": [{ "parts": [{ "text": prompt }] }],
        // --- ADDED THIS LINE for more reliable JSON output ---
        "generationConfig": { "responseMimeType": "application/json" }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("--- AISERVICE: ERROR from Gemini API (Routine)! ---", errorBody);
            throw new Error("Failed to get a valid routine response from the AI.");
        }

        const result = await response.json();
        
        if (!result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
            console.error("--- AISERVICE: ERROR! Invalid response structure from Gemini (Routine). ---", result);
            throw new Error("AI returned an unexpected response format for routine.");
        }

        const rawJsonString = result.candidates[0].content.parts[0].text;
        
        // --- ADDED a final safety check for parsing ---
        try {
            return JSON.parse(rawJsonString);
        } catch (parseError) {
            console.error("--- AISERVICE: FAILED TO PARSE JSON (Routine)! ---", parseError);
            console.error("   - Raw String from AI:", rawJsonString);
            throw new Error("AI response was not valid JSON.");
        }

    } catch (error) {
        console.error("--- AISERVICE: CATCH BLOCK ERROR (Routine)! ---", error);
        throw error;
    }
};

// ====================================================================
// FUNCTION 2: Generate a single, personalized coach tip
// ====================================================================
export const getAiCoachTip = async (skinProfile) => {
    // This function is already well-written and robust with its default fallbacks.
    // No major changes needed. The code is good.
    console.log("--- AISERVICE: Getting AI Coach Tip ---");
    
    if (!GEMINI_API_KEY) {
        return "Remember to wear sunscreen today!";
    }

    const prompt = `
        You are a friendly and encouraging AI Skincare Coach.
        Based on this user's primary skin concern, which is "${skinProfile.step2_q0[0]}", 
        and their main goal, which is "${skinProfile.step3_q0}", 
        write ONE short, helpful, and positive tip as a plain string.
    `;

    const requestBody = {
        "contents": [{ "parts": [{ "text": prompt }] }]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            return "Always be gentle with your skin!";
        }

        const result = await response.json();
        const tipText = result.candidates[0].content.parts[0].text;
        return tipText.trim().replace(/"/g, '');

    } catch (error) {
        return "Drinking plenty of water is great for your skin's hydration!";
    }
};

// ====================================================================
// FUNCTION 3: Get AI Product Recommendations
// ====================================================================
export const getAiProductRecommendations = async (skinProfile) => {
    // This function is also well-written and robust. No major changes needed.
    // The code is good.
    console.log("--- AISERVICE: Getting AI Product Recommendations ---");

    if (!GEMINI_API_KEY) {
        return [];
    }

    const prompt = `
        You are a skincare product recommendation expert.
        Based on this user's skin profile: ${JSON.stringify(skinProfile)},
        recommend exactly 4 real, popular products.
        Format your response as a valid JSON object ONLY, like this:
        { "products": [{"brand": "Brand Name", "name": "Full Product Name", "rating": 4.5, "tag": "✅ Good for Acne"}] }
    `;

    const requestBody = {
        "contents": [{ "parts": [{ "text": prompt }] }],
        "generationConfig": { "responseMimeType": "application/json" }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            return [];
        }

        const result = await response.json();
        const rawJsonString = result.candidates[0].content.parts[0].text;
        
        try {
            const parsedJson = JSON.parse(rawJsonString);
            return parsedJson.products || [];
        } catch (parseError) {
            console.error("--- AISERVICE: FAILED TO PARSE JSON (Products)! ---", parseError);
            console.error("   - Raw String from AI:", rawJsonString);
            return []; // Return empty array if parsing fails
        }

    } catch (error) {
        return [];
    }
};

export const analyzeProductByBarcode = async (barcode, skinProfile) => {
    console.log(`--- AISERVICE: Analyzing barcode: ${barcode} ---`);

    // --- PART 1: Barcode -> Ingredient List (from OpenFoodFacts) ---
    let ingredients;
    let productName;
    try {
        console.log("   - Fetching product data from OpenFoodFacts...");
        const productResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,ingredients_text_en`);
        const productData = await productResponse.json();

        // Check if the product was found and has ingredients
        if (productData.status === 0 || !productData.product?.ingredients_text_en) {
            console.error("OpenFoodFacts Error: Product not found or has no ingredient list.");
            return { error: "Product not found in our database or it lacks an ingredient list. Try scanning another product." };
        }

        ingredients = productData.product.ingredients_text_en;
        productName = productData.product.product_name || "Unknown Product";
        console.log(`   - Found Product: ${productName}`);

    } catch (error) {
        console.error("Error fetching data from OpenFoodFacts:", error);
        return { error: "Could not connect to the product database. Please check your internet connection." };
    }

    // --- PART 2: Ingredient List -> AI Analysis (from Gemini) ---
    try {
        console.log("   - Sending ingredients to Gemini for analysis...");
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API key is not configured.");
        }
        
        const prompt = `
            You are a skincare ingredient analysis expert for an app called SkinSync AI.
            A user with this skin profile is asking about a product: ${JSON.stringify(skinProfile)}.
            The product is called "${productName}".
            The ingredients are: "${ingredients}".

            Your task is to:
            1.  Analyze this ingredient list based on the user's specific skin profile.
            2.  Provide a simple, one-word verdict from these three options ONLY: "Good Match", "Use with Caution", or "Not Recommended".
            3.  Provide a simple, one-sentence analysis explaining your verdict.
            4.  Identify and list up to 3 "Notable Ingredients" (either good or bad) and explain in one simple sentence why each is notable for this specific user.

            Format your response as a valid JSON object ONLY, with this structure:
            {
                "productName": "${productName}",
                "verdict": "Good Match",
                "analysis": "This product appears to be a good fit for your skin goals.",
                "notableIngredients": [
                    {"name": "Niacinamide", "reason": "Excellent for controlling oil and minimizing pores."},
                    {"name": "Fragrance", "reason": "Can be a potential irritant for your sensitive skin."}
                ]
            }
        `;
        
        const requestBody = {
            "contents": [{ "parts": [{ "text": prompt }] }],
            "generationConfig": { "responseMimeType": "application/json" }
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Gemini API Error:", errorBody);
            throw new Error("The AI analysis service is currently unavailable.");
        }

        const result = await response.json();

        if (!result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
            console.error("Invalid response structure from Gemini.");
            throw new Error("The AI returned an unexpected response format.");
        }

        const rawJsonString = result.candidates[0].content.parts[0].text;
        console.log("   - AI Analysis Received.");
        return JSON.parse(rawJsonString);

    } catch (error) {
        console.error("Error in AI analysis service:", error);
        // We pass the error message to the UI to display it
        return { error: error.message || "An unexpected error occurred during AI analysis." };
    }
};