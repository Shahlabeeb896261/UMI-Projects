import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  where,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query, 
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  // apiKey: "Your API key will come here",
  authDomain: "sports-buddy-d7cfa.firebaseapp.com",
  databaseURL: "https://sports-buddy-d7cfa-default-rtdb.firebaseio.com",
  projectId: "sports-buddy-d7cfa",
  storageBucket: "sports-buddy-d7cfa.appspot.com",
  messagingSenderId: "1082038587423",
  appId: "1:1082038587423:web:0ef892b0c380871d7cc52a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initially the display of the sportsEventManager will be none
document.getElementById("sportsEventsManager").style.display = "none";

// Initially the display of the login form will be none
document.getElementById("loginForm").style.display = "none";

// When click on the login button the registration form display will be none and the login form display will be block
document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("loginForm").style.display = "flex";
});

// Registration
document
  .getElementById("registerBtn")
  .addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful");
      document.getElementById("registrationForm").classList.add("hidden");
      document.getElementById("loginForm").classList.remove("hidden");
    } catch (error) {
      alert("Error registering: " + error.message);
    }
  });

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    // Check if email and password fields are not empty
    if (email === "" || password === "") {
      alert("Please fill in both email and password fields.");
      return; // Exit function if fields are empty
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("sportsEventsManager").style.display = "flex";
      loadEvents();
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
    } catch (error) {
      alert("Error logging in: " + error.message);
  
      // Ensure login form remains visible on error
      document.getElementById("loginForm").style.display = "flex";
      document.getElementById("sportsEventsManager").style.display = "none";
    }
  });
  
// When we logged in then the sportsEventsManager display will be block
document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "flex";
});

// Password Reset
document
  .getElementById("resetPasswordBtn")
  .addEventListener("click", async () => {
    const email = document.getElementById("resetEmail").value;
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
      document
        .getElementById("resetPasswordForm")
        .classList.add("hidden");
      document.getElementById("loginForm").classList.remove("hidden");
    } catch (error) {
      alert("Error resetting password: " + error.message);
    }
  });

// Navigation Event Listeners
document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("registrationForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
});

document.getElementById("showRegister").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registrationForm").style.display = "flex";
});

document
  .getElementById("showResetPassword")
  .addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("resetPasswordForm").style.display = "flex";
  });

document
  .getElementById("showLoginFromReset")
  .addEventListener("click", () => {
    document.getElementById("resetPasswordForm").style.display = "none";
    document.getElementById("loginForm").style.display = "flex";
  });

// Declare selectedEventId globally
let selectedEventId = null;

// Manage Sports Events
document
  .getElementById("addEventBtn")
  .addEventListener("click", async () => {
    const eventName = document.getElementById("eventName").value;

    // Check if the eventName field is empty
    if (eventName === "") {
        alert("Please Enter the event name");
        return;
    }
    const user = auth.currentUser; // Get the current logged-in user
    if (user) {
      try {
        await addDoc(collection(db, "sports-events"), {
          name: eventName,
          uid: user.uid, // Associate the event with the user's UID
        });
        alert("Event added");
        loadEvents();
        document.getElementById("eventName").value = "";
      } catch (error) {
        alert("Error adding event: " + error.message);
      }
    } else {
      alert("No user is currently logged in.");
    }
  });

// Function to load sports events and display them, filtered by user UID
async function loadEvents() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";  // Clear the current list of events
  try {
      // Hide the update section initially
      document.getElementById("updateSection").style.display = "none";

      // Get the currently logged-in user
      const user = auth.currentUser;
      if (user) {
          // Create a query to fetch events only for the current user, sorted by name
          const eventsQuery = query(
              collection(db, "sports-events"),
              where("uid", "==", user.uid),  // Filter by user UID
              orderBy("name")  // Sort by event name
          );

          // Get the documents according to the query
          const querySnapshot = await getDocs(eventsQuery);

          querySnapshot.forEach((eventDoc) => {
              const li = document.createElement("li");
              li.textContent = eventDoc.data().name;

              const div = document.createElement("div");
              div.classList.add("buttons");

              // Create and append the update button
              const updateBtn = document.createElement("button");
              updateBtn.textContent = "Update";
              updateBtn.addEventListener("click", () => {
                  updateEvent(eventDoc.id, eventDoc.data().name);
                  document.getElementById("updateSection").style.display = "flex";
              });
              div.appendChild(updateBtn);

              // Create and append the delete button
              const deleteBtn = document.createElement("button");
              deleteBtn.textContent = "Delete";
              deleteBtn.addEventListener("click", async () => {
                  try {
                      await deleteDoc(doc(db, "sports-events", eventDoc.id));
                      alert("Event deleted");
                      loadEvents();  // Reload events to reflect changes
                  } catch (error) {
                      alert("Error deleting event: " + error.message);
                  }
              });
              div.appendChild(deleteBtn);
              li.appendChild(div);

              eventList.appendChild(li);
          });
      } else {
          alert("No user is currently logged in.");
      }
  } catch (error) {
      alert("Error loading events: " + error.message);
  }
}

// Function to handle updating the selected event
function updateEvent(eventId, eventName) {
  selectedEventId = eventId;
  document.getElementById("updateEventName").value = eventName;
  document.getElementById("updateSection").classList.remove("hidden");
}

// Update Event button click handler to filter by user UID
document.getElementById("updateEventBtn").addEventListener("click", async () => {
  const newName = document.getElementById("updateEventName").value;
  const user = auth.currentUser;  // Get the current logged-in user
  if (selectedEventId && user) {
      try {
          await updateDoc(doc(db, "sports-events", selectedEventId), {
              name: newName,
              uid: user.uid  // Ensure the event still belongs to the current user
          });
          alert("Event updated");
          document.getElementById("updateSection").classList.add("hidden");
          document.getElementById("updateEventName").value = "";  // Clear the input field
          loadEvents();  // Reload events to reflect changes
          selectedEventId = null;  // Clear selected event ID
      } catch (error) {
          alert("Error updating event: " + error.message);
      }
  }
});

// Sign Out
document
  .getElementById("signOutBtn")
  .addEventListener("click", async () => {
    try {
      await signOut(auth);
      document.getElementById("sportsEventsManager").style.display =
        "none";
      document.getElementById("loginForm").style.display = "flex";
      document
        .getElementById("registrationForm")
        .classList.remove("hidden");
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  });

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("registrationForm").classList.add("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document
      .getElementById("sportsEventsManager")
      .classList.remove("hidden");
    loadEvents();
  } else {
    document
      .getElementById("sportsEventsManager")
      .classList.add("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document
      .getElementById("registrationForm")
      .classList.remove("hidden");
  }
});
