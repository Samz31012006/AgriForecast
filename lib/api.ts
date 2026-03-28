import { db, auth } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";

export interface PredictRequest {
  region: string;
  soil_type: string;
  crop: string;
  rainfall_mm: number;
  temperature_celsius: number;
  fertilizer_used: boolean;
  irrigation_used: boolean;
  weather_condition: string;
  days_to_harvest: number;
}

export interface PredictResponse {
  yield_prediction: number;
  price_prediction: number;
  price_trend: string;
  advisory: string;
}

export async function predict(data: PredictRequest): Promise<PredictResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // Get the current user's ID token for authentication
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to perform predictions.");
  }
  const token = await user.getIdToken();

  const response = await fetch(`${apiUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch prediction. The service might be unavailable.");
  }

  return response.json();
}

// Persists a prediction result to Firestore for historical tracking
export async function saveToHistory(request: PredictRequest, response: PredictResponse) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const newEntry = {
      userId: user.uid,
      createdAt: Timestamp.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + " IST",
      ...request,
      ...response,
      variety: "(Sarson)", // Default for now
      status: "verified"
    };

    await addDoc(collection(db, "predictions"), newEntry);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
}

// Retrieves user-specific predictions from Firestore
export async function getHistory() {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    // Note: orderBy("createdAt", "desc") requires a composite index in Firestore.
    // Removing temporarily to fix existing runtime errors. 
    const q = query(
      collection(db, "predictions"),
      where("userId", "==", user.uid)
      // orderBy("createdAt", "desc") 
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort manually on client to avoid index requirement for now
    return results.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
  } catch (error) {
    console.error("Error fetching from Firestore:", error);
    return [];
  }
}
