import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export type FirebaseClient = {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
};

function config() {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!apiKey || !projectId || !appId) return null;
    return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

export function firebaseConfigured() {
    return Boolean(config());
}

let client: FirebaseClient | null | undefined;

export function getFirebase(): FirebaseClient | null {
    if (client !== undefined) return client;
    const cfg = config();
    if (!cfg) {
        client = null;
        return null;
    }
    const app = getApps()[0] ?? initializeApp(cfg);
    client = {
        app,
        auth: getAuth(app),
        db: getFirestore(app),
        storage: getStorage(app),
    };
    return client;
}
