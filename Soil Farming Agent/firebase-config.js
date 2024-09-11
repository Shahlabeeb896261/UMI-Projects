// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "Here your api key will come",
  authDomain: "soil-farming-agent-86d03.firebaseapp.com",
  projectId: "soil-farming-agent-86d03",
  storageBucket: "soil-farming-agent-86d03.appspot.com",
  messagingSenderId: "1069739062535",
  appId: "1:1069739062535:web:9f1f0751836c74b98001a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
