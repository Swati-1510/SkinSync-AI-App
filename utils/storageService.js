// in utils/storageService.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getApp } from "firebase/app"; 

// Initialize storage using the existing app instance
const storage = getStorage(getApp());

/**
 * Uploads a file from a local URI to Firebase Storage.
 * @param {string} uri - The local file path (e.g., from expo-image-picker).
 * @param {string} userId - The user's ID for folder structure.
 * @returns {string} The public download URL of the uploaded image.
 */
export const uploadPhoto = async (uri, userId) => {
  // 1. Fetch the image data from the local URI
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() { resolve(xhr.response); };
    xhr.onerror = function(e) { reject(new TypeError("Network request failed for image upload")); };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  // 2. Create the file path in storage (e.g., 'user_photos/USER_ID/TIMESTAMP.jpg')
  const fileExtension = uri.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `progress_photos/${userId}/${fileName}`);

  // 3. Upload the blob
  const uploadResult = await uploadBytes(storageRef, blob);
  
  // 4. Get the public download URL
  const downloadURL = await getDownloadURL(uploadResult.ref);

  // 5. Clean up the blob object
  blob.close();

  return downloadURL;
};