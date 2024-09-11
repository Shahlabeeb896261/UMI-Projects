import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  // apiKey: "Your API key will come here",
  authDomain: "sports-buddy-d7cfa.firebaseapp.com",
  projectId: "sports-buddy-d7cfa",
  storageBucket: "sports-buddy-d7cfa.appspot.com",
  messagingSenderId: "1082038587423",
  appId: "1:1082038587423:web:0ef892b0c380871d7cc52a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let selectedCategoryId = null;
let selectedCityId = null;
let selectedAreaId = null;

// Initially the display of the admin login page will be block
document.getElementById("adminLoginForm").style.display = "flex";
document.getElementById("adminPanel").style.display = "none";

// When the admin login then display will be none
document.getElementById("adminLoginBtn").addEventListener("click", () => {
  document.getElementById("adminLoginForm").style.display = "flex";
});

// Admin Login
document.getElementById("adminLoginBtn").addEventListener("click", async () => {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  // Check if email and password fields are not empty
  if (email === "" || password === "") {
    alert("Please fill in both email and password fields.");
    return; // Exit function if fields are empty
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("adminLoginForm").style.display = "none";
    document.getElementById("adminPanel").style.display = "flex";
    loadCategories();
    loadCities();
    loadAreas();
    document.getElementById("adminEmail").value = "";
    document.getElementById("adminPassword").value = "";
  } catch (error) {
    alert("Error logging in: " + error.message);
  }
});

// Admin Sign Out
document
  .getElementById("signOutAdminBtn")
  .addEventListener("click", async () => {
    try {
      await signOut(auth);
      document.getElementById("adminPanel").style.display = "none";
      document.getElementById("adminLoginForm").style.display = "flex";
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  });

// Manage Sports Categories
document
  .getElementById("addCategoryBtn")
  .addEventListener("click", async () => {
    const categoryName = document.getElementById("categoryName").value;
    if (categoryName == "") {
      alert("Category Name Cannot be Empty!");
      return;
    }
    try {
      await addDoc(collection(db, "sports-categories"), {
        name: categoryName,
      });
      alert("Category added");
      loadCategories();
      document.getElementById("categoryName").value = "";
    } catch (error) {
      alert("Error adding category: " + error.message);
    }
  });

document
  .getElementById("updateCategoryBtn")
  .addEventListener("click", async () => {
    const newName = document.getElementById("updateCategoryName").value;
    if (newName == "") {
      alert("New Category Name Cannot be Empty!");
      return;
    }
    if (selectedCategoryId) {
      try {
        await updateDoc(doc(db, "sports-categories", selectedCategoryId), {
          name: newName,
        });
        alert("Category updated");
        document.getElementById("updateCategoryName").value = "";
        loadCategories();
        selectedCategoryId = null;
      } catch (error) {
        alert("Error updating category: " + error.message);
      }
    }
  });

// Manage Cities
document.getElementById("addCityBtn").addEventListener("click", async () => {
  const cityName = document.getElementById("cityName").value;
  if (cityName == "") {
    alert("City Name Cannot be Empty!");
    return;
  }
  try {
    await addDoc(collection(db, "cities"), { name: cityName });
    alert("City added");
    loadCities();
    document.getElementById("cityName").value = "";
  } catch (error) {
    alert("Error adding city: " + error.message);
  }
});

document.getElementById("updateCityBtn").addEventListener("click", async () => {
  const newName = document.getElementById("updateCityName").value;
  if (newName == "") {
    alert("New City Name Cannot be Empty!");
    return;
  }
  if (selectedCityId) {
    try {
      await updateDoc(doc(db, "cities", selectedCityId), {
        name: newName,
      });
      alert("City updated");
      document.getElementById("updateCityName").value = "";
      loadCities();
      selectedCityId = null;
    } catch (error) {
      alert("Error updating city: " + error.message);
    }
  }
});

// Manage Areas
document.getElementById("addAreaBtn").addEventListener("click", async () => {
  const areaName = document.getElementById("areaName").value;
  if (areaName == "") {
    alert("Area Name Cannot be Empty!");
    return;
  }
  try {
    await addDoc(collection(db, "areas"), { name: areaName });
    alert("Area added");
    loadAreas();
    document.getElementById("areaName").value = "";
  } catch (error) {
    alert("Error adding area: " + error.message);
  }
});

document.getElementById("updateAreaBtn").addEventListener("click", async () => {
  const newName = document.getElementById("updateAreaName").value;
  if (newName == "") {
    alert("New Area Name Cannot be Empty!");
    return;
  }
  if (selectedAreaId) {
    try {
      await updateDoc(doc(db, "areas", selectedAreaId), {
        name: newName,
      });
      alert("Area updated");
      document.getElementById("updateAreaName").value = "";
      loadAreas();
      selectedAreaId = null;
    } catch (error) {
      alert("Error updating area: " + error.message);
    }
  }
});

// Load Categories
async function loadCategories() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";
  try {
    document.getElementById("updateTriggerBtn").style.display = "none";
    const querySnapshot = await getDocs(collection(db, "sports-categories"));
    querySnapshot.forEach((docSnap) => {
      const li = document.createElement("li");
      li.textContent = docSnap.data().name;
      const div = document.createElement("div");

      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.addEventListener("click", () =>
        updateCategory(docSnap.id, docSnap.data().name)
      );
      updateBtn.addEventListener("click", () => {
        document.getElementById("updateTriggerBtn").style.display = "flex";
      });
      div.appendChild(updateBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        try {
          await deleteDoc(doc(db, "sports-categories", docSnap.id));
          alert("Category deleted");
          loadCategories();
        } catch (error) {
          alert("Error deleting category: " + error.message);
        }
      });
      div.appendChild(deleteBtn);
      li.appendChild(div);
      categoryList.appendChild(li);
    });
  } catch (error) {
    alert("Error loading categories: " + error.message);
  }
}

// Load Cities
async function loadCities() {
  const cityList = document.getElementById("cityList");
  cityList.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "cities"));
    document.getElementById("upCtBtn").style.display = "none";
    querySnapshot.forEach((docSnap) => {
      const li = document.createElement("li");
      li.textContent = docSnap.data().name;

      const div = document.createElement("div");

      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.addEventListener("click", () =>
        updateCity(docSnap.id, docSnap.data().name)
      );
      updateBtn.addEventListener("click", () => {
        document.getElementById("upCtBtn").style.display = "flex";
      });
      div.appendChild(updateBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        try {
          await deleteDoc(doc(db, "cities", docSnap.id));
          alert("City deleted");
          loadCities();
        } catch (error) {
          alert("Error deleting city: " + error.message);
        }
      });
      div.appendChild(deleteBtn);
      li.appendChild(div);
      cityList.appendChild(li);
    });
  } catch (error) {
    alert("Error loading cities: " + error.message);
  }
}

// Load Areas
async function loadAreas() {
  const areaList = document.getElementById("areaList");
  areaList.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "areas"));
    document.getElementById("upManArBtn").style.display = "none";
    querySnapshot.forEach((docSnap) => {
      const li = document.createElement("li");
      li.textContent = docSnap.data().name;

      const div = document.createElement("div");

      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.addEventListener("click", () =>
        updateArea(docSnap.id, docSnap.data().name)
      );
      updateBtn.addEventListener("click", () => {
        document.getElementById("upManArBtn").style.display = "flex";
      });
      div.appendChild(updateBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        try {
          await deleteDoc(doc(db, "areas", docSnap.id));
          alert("Area deleted");
          loadAreas();
        } catch (error) {
          alert("Error deleting area: " + error.message);
        }
      });
      div.appendChild(deleteBtn);
      li.appendChild(div);
      areaList.appendChild(li);
    });
  } catch (error) {
    alert("Error loading areas: " + error.message);
  }
}

function updateCategory(id, name) {
  selectedCategoryId = id;
  document.getElementById("updateCategoryName").value = name;
}

function updateCity(id, name) {
  selectedCityId = id;
  document.getElementById("updateCityName").value = name;
}

function updateArea(id, name) {
  selectedAreaId = id;
  document.getElementById("updateAreaName").value = name;
}
