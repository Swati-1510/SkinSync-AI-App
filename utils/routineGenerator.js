
// THE "PANTRY" - Our Database of Recommended Products

const PRODUCTS = {
    // Cleansers
    gentleCleanser: { id: 'p1', name: 'CeraVe Hydrating Cleanser' },
    foamingCleanser: { id: 'p2', name: 'La Roche-Posay Foaming Cleanser' },

    // Treatments
    vitaminC: { id: 'p3', name: 'Timeless 20% Vitamin C + E Ferulic Acid Serum', tip: 'A powerful antioxidant for brightness and protection.' },
    salicylicAcid: { id: 'p4', name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', tip: 'Clinically proven to unclog pores and fight breakouts.' },
    glycolicAcid: { id: 'p5', name: 'The Ordinary Glycolic Acid 7% Toning Solution', tip: 'An AHA that exfoliates the skin surface for radiance.' },
    hydratingSerum: { id: 'p6', name: 'The Ordinary Hyaluronic Acid 2% + B5', tip: 'Helps your skin attract and hold on to moisture.' },
    retinol: { id: 'p7', name: 'CeraVe Resurfacing Retinol Serum', tip: 'Excellent for targeting fine lines and uneven texture.' },
    
    // Moisturizers & SPF
    simpleMoisturizer: { id: 'p8', name: 'CeraVe Moisturizing Cream', tip: 'With ceramides to support your skin\'s natural barrier.' },
    lightMoisturizer: { id: 'p9', name: 'Neutrogena Hydro Boost Water Gel', tip: 'A lightweight, oil-free option for hydration.' },
    spf50: { id: 'p10', name: 'Supergoop! Unseen Sunscreen SPF 50', tip: 'The most important step to protect your skin every day.' },
};


// THE "RECIPE BOOK" - The Main Logic Function
// This function takes the user's quiz answers (their skinProfile)
// and returns a personalized AM and PM routine.
export const generateRoutine = (skinProfile) => {
    
    // Start with an empty routine object
    const routine = {
        am: [],
        pm: []
    };

    // Safety check: if there's no profile, return the empty routine
    if (!skinProfile) {
        return routine;
    }

    // --- RULE 1: DETERMINE THE CLEANSER ---
    // base this on the user's answer to the first question of step 1.
    const skinTypeAnswer = skinProfile.step1_q0;
    if (skinTypeAnswer === 'A bit tight, dry, or even flaky.') {
        // Dry Skin -> Gentle Cleanser
        routine.am.push({ step: 1, title: 'Cleanse', product: PRODUCTS.gentleCleanser });
        routine.pm.push({ step: 1, title: 'Cleanse', product: PRODUCTS.gentleCleanser });
    } else {
        // Normal, Combo, or Oily Skin -> Foaming Cleanser
        routine.am.push({ step: 1, title: 'Cleanse', product: PRODUCTS.foamingCleanser });
        routine.pm.push({ step: 1, title: 'Cleanse', product: PRODUCTS.foamingCleanser });
    }

    // --- RULE 2: DETERMINE THE "TREAT" STEP ---
    // will recommend a different treatment for AM and PM.
    const mainGoal = skinProfile.step3_q0 || '';
    const mainConcern = skinProfile.step2_q0 || [];

    // AM Treatment (Focus on protection and brightness)
    if (mainGoal.includes('bright, radiant')) {
        routine.am.push({ step: 2, title: 'Treat', product: PRODUCTS.vitaminC });
    } else {
        routine.am.push({ step: 2, title: 'Treat', product: PRODUCTS.hydratingSerum });
    }

    // PM Treatment (Focus on repair and targeting concerns)
    if (mainConcern.includes('Pimples & Breakouts')) {
        routine.pm.push({ step: 2, title: 'Treat', product: PRODUCTS.salicylicAcid });
    } else if (mainConcern.includes('Fine Lines')) {
        routine.pm.push({ step: 2, title: 'Treat', product: PRODUCTS.retinol });
    } else if (mainConcern.includes('Dullness')) {
        routine.pm.push({ step: 2, title: 'Treat', product: PRODUCTS.glycolicAcid });
    } else {
        routine.pm.push({ step: 2, title: 'Treat', product: PRODUCTS.hydratingSerum });
    }

    // --- RULE 3: DETERMINE THE MOISTURIZER ---
    // base this on skin type again.
    if (skinTypeAnswer === 'Shiny or greasy all over.') {
        // Oily Skin -> Lightweight Moisturizer
        routine.am.push({ step: 3, title: 'Moisturize', product: PRODUCTS.lightMoisturizer });
        routine.pm.push({ step: 3, title: 'Moisturize', product: PRODUCTS.lightMoisturizer });
    } else {
        // All other types -> Standard Moisturizer
        routine.am.push({ step: 3, title: 'Moisturize', product: PRODUCTS.simpleMoisturizer });
        routine.pm.push({ step: 3, title: 'Moisturize', product: PRODUCTS.simpleMoisturizer });
    }

    // --- RULE 4: ALWAYS ADD SPF TO THE AM ROUTINE ---
    // This is a non-negotiable step.
    routine.am.push({ step: 4, title: 'Protect', product: PRODUCTS.spf50 });


    // --- RETURN THE FINAL, PERSONALIZED ROUTINE ---
    return routine;
};