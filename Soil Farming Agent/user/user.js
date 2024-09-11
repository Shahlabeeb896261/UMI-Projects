// import some method which is required 
import { auth, db } from "../firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.getElementById('loginForm').style.display = "none";
document.getElementById('resetPasswordForm').style.display = "none";
document.getElementById('loggedInContent').style.display = "none";

// Function to toggle form visibility
function showForm(formIdToShow) {
  if(formIdToShow === 'loginForm') {
    document.getElementById('loginForm').style.display = "flex";
    document.getElementById('resetPasswordForm').style.display = "none";
    document.getElementById('registrationForm').style.display = "none";
  }
  if(formIdToShow === 'registrationForm') {
    document.getElementById('loginForm').style.display = "none";
    document.getElementById('registrationForm').style.display = "flex";
  }
  if(formIdToShow === 'resetPasswordForm') {
    document.getElementById('resetPasswordForm').style.display = "flex";
    document.getElementById('loginForm').style.display = "none";
  }
  const forms = ['registrationForm', 'loginForm', 'resetPasswordForm'];
  forms.forEach(formId => {
    document.getElementById(formId).classList.toggle('hidden', formId !== formIdToShow);
    document.getElementById(formId).classList.toggle('visible', formId === formIdToShow);
  });
}

// Function to register user
function registerUser() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("User registered successfully!");
      showForm('loginForm'); // Switch to login form after registration
    })
    .catch(error => {
      alert(error.message);
    });
}

// Function to login user
function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("User logged in successfully!");
      document.getElementById('loggedInContent').style.display = 'block'; // Show logged-in content
      document.getElementById('loginForm').style.display = "none";
      fetchSoilAndDistributorDetails(); // Fetch details upon login
    })
    .catch(error => {
      alert(error.message);
    });
}

// Function to reset password
function resetPassword() {
  const email = document.getElementById('resetEmail').value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
      showForm('loginForm'); // Switch to login form after sending reset email
    })
    .catch(error => {
      alert(error.message);
    });
}

// Function to fetch and display soil and distributor details
async function fetchSoilAndDistributorDetails() {
  await viewSoilDetails();
  await viewDistributorDetails();
}

// Fetch soil details
async function viewSoilDetails() {
  const soilList = document.getElementById('soilList');
  soilList.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'soilDetails'));
    querySnapshot.forEach(doc => {
      const soil = doc.data();
      const li = document.createElement('li');
      li.textContent = `Type: ${soil.type}, Quality: ${soil.quality}, Recommended Crops: ${soil.recommendedCrops}`;
      soilList.appendChild(li);
    });
  } catch (error) {
    alert("Error fetching soil details: " + error.message);
  }
}

// Fetch distributor details
async function viewDistributorDetails() {
  const distributorList = document.getElementById('distributorList');
  distributorList.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'distributorDetails'));
    querySnapshot.forEach(doc => {
      const distributor = doc.data();
      const li = document.createElement('li');
      li.textContent = `Name: ${distributor.name}, Contact: ${distributor.contact}, Location: ${distributor.location}, Seeds Available: ${distributor.seedsAvailable}`;
      distributorList.appendChild(li);
    });
  } catch (error) {
    alert("Error fetching distributor details: " + error.message);
  }
}

// Event listeners for form switches
document.getElementById('showLogin').addEventListener('click', () => showForm('loginForm'));
document.getElementById('showRegister').addEventListener('click', () => showForm('registrationForm'));
document.getElementById('showResetPassword').addEventListener('click', () => showForm('resetPasswordForm'));
document.getElementById('showLoginFromReset').addEventListener('click', () => showForm('loginForm'));

// Attach functions to buttons
document.getElementById('registerBtn').addEventListener('click', registerUser);
document.getElementById('loginBtn').addEventListener('click', loginUser);
document.getElementById('resetPasswordBtn').addEventListener('click', resetPassword);

// Automatically fetch details if user is already logged in
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('loggedInContent').style.display = 'none'; // Show logged-in content
    fetchSoilAndDistributorDetails(); // Fetch details if logged in
  }
});