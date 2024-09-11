// importing the required method from firebase
import { auth, db } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Collecting the html content and adding the event listeners
document.getElementById("loginAdmin").addEventListener("click", loginAdmin);
document.getElementById("addSoilDetail").addEventListener("click", addSoilDetail);
document.getElementById("updateSoilButton").addEventListener("click", updateSoilDetail);
document.getElementById("addDistributorDetail").addEventListener("click", addDistributorDetail);
document.getElementById("updateDistributorButton").addEventListener("click", updateDistributorDetail);

// Intially setting the display none of the some hmtl content
let adminContent = document.getElementById('adminContent');
let updateSoilButton = document.getElementById('updateSoilButton');
let updateDistributorButton = document.getElementById('updateDistributorButton');

updateDistributorButton.style.display = "none";
updateSoilButton.style.display = "none";
adminContent.style.display = "none";

// Admin login function
async function loginAdmin() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Admin logged in successfully!");
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("adminContent").style.display = "flex";
    fetchSoilDetails();
    fetchDistributorDetails();
  } catch (error) {
    alert(error.message);
  }
}

// Add soil details
async function addSoilDetail() {
  const type = document.getElementById("soilType").value;
  const quality = document.getElementById("soilQuality").value;
  const recommendedCrops = document.getElementById("recommendedCrops").value;

  try {
    if (type == "" || quality == "" || recommendedCrops == "") {
      alert("Please Enter the all details");
    } else {
      await addDoc(collection(db, "soilDetails"), {
        type,
        quality,
        recommendedCrops,
      });
      alert("Soil detail added successfully!");
      clearSoilInputs();
      fetchSoilDetails();
    }
  } catch (error) {
    alert(error.message);
  }
}

// Fetch soil details
async function fetchSoilDetails() {
  const soilList = document.getElementById("soilList");
  soilList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "soilDetails"));
  querySnapshot.forEach((doc) => {
    const soil = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      Type: ${soil.type}, Quality: ${soil.quality}, Recommended Crops: ${soil.recommendedCrops}
      <div class="editDel">
        <button onclick="populateSoilFields('${doc.id}', '${soil.type}', '${soil.quality}', '${soil.recommendedCrops}')">Edit</button>
        <button onclick="deleteSoilDetail('${doc.id}')">Delete</button>
      </div>
    `;
    soilList.appendChild(li);
  });
}

// Populate soil fields for editing
function populateSoilFields(id, type, quality, recommendedCrops) {
  document.getElementById("editSoilId").value = id;
  document.getElementById("soilType").value = type;
  document.getElementById("soilQuality").value = quality;
  document.getElementById("recommendedCrops").value = recommendedCrops;
  document.getElementById("updateSoilButton").style.display = "inline-block";
}

// Update soil details
async function updateSoilDetail() {
  const id = document.getElementById("editSoilId").value;
  const type = document.getElementById("soilType").value;
  const quality = document.getElementById("soilQuality").value;
  const recommendedCrops = document.getElementById("recommendedCrops").value;

  if (id && type && quality && recommendedCrops) {
    try {
      const soilDoc = doc(db, "soilDetails", id);
      await updateDoc(soilDoc, { type, quality, recommendedCrops });
      alert("Soil detail updated successfully!");
      clearSoilInputs();
      fetchSoilDetails();
    } catch (error) {
      alert(error.message);
    }
  }
}

// Clear soil input fields
function clearSoilInputs() {
  document.getElementById("editSoilId").value = "";
  document.getElementById("soilType").value = "";
  document.getElementById("soilQuality").value = "";
  document.getElementById("recommendedCrops").value = "";
  document.getElementById("updateSoilButton").style.display = "none";
}

// Delete soil details
async function deleteSoilDetail(id) {
  try {
    await deleteDoc(doc(db, "soilDetails", id));
    alert("Soil detail deleted successfully!");
    fetchSoilDetails();
  } catch (error) {
    alert(error.message);
  }
}

// Add distributor details
async function addDistributorDetail() {
  const name = document.getElementById("distributorName").value;
  const contact = document.getElementById("distributorContact").value;
  const location = document.getElementById("distributorLocation").value;
  const seedsAvailable = document.getElementById("seedsAvailable").value;

  try {
    if (name == "" || contact == "" || location == "" || seedsAvailable == "") {
      alert("Please Enter the details");
    } else {
      await addDoc(collection(db, "distributorDetails"), {
        name,
        contact,
        location,
        seedsAvailable,
      });
      alert("Distributor detail added successfully!");
      clearDistributorInputs();
      fetchDistributorDetails();
    }
  } catch (error) {
    alert(error.message);
  }
}

// Fetch distributor details
async function fetchDistributorDetails() {
  const distributorList = document.getElementById("distributorList");
  distributorList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "distributorDetails"));
  querySnapshot.forEach((doc) => {
    const distributor = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      Name: ${distributor.name}, Contact: ${distributor.contact}, Location: ${distributor.location}, Seeds Available: ${distributor.seedsAvailable}
      <div class="editDel">
        <button onclick="populateDistributorFields('${doc.id}', '${distributor.name}', '${distributor.contact}', '${distributor.location}', '${distributor.seedsAvailable}')">Edit</button>
        <button onclick="deleteDistributorDetail('${doc.id}')">Delete</button>
      </div>
    `;
    distributorList.appendChild(li);
  });
}

// Populate distributor fields for editing
function populateDistributorFields(
  id,
  name,
  contact,
  location,
  seedsAvailable
) {
  document.getElementById("editDistributorId").value = id;
  document.getElementById("distributorName").value = name;
  document.getElementById("distributorContact").value = contact;
  document.getElementById("distributorLocation").value = location;
  document.getElementById("seedsAvailable").value = seedsAvailable;
  document.getElementById("updateDistributorButton").style.display =
    "inline-block";
}

// Update distributor details
async function updateDistributorDetail() {
  const id = document.getElementById("editDistributorId").value;
  const name = document.getElementById("distributorName").value;
  const contact = document.getElementById("distributorContact").value;
  const location = document.getElementById("distributorLocation").value;
  const seedsAvailable = document.getElementById("seedsAvailable").value;

  if (id && name && contact && location && seedsAvailable) {
    try {
      const distributorDoc = doc(db, "distributorDetails", id);
      await updateDoc(distributorDoc, {
        name,
        contact,
        location,
        seedsAvailable,
      });
      alert("Distributor detail updated successfully!");
      clearDistributorInputs();
      fetchDistributorDetails();
    } catch (error) {
      alert(error.message);
    }
  }
}

// Clear distributor input fields
function clearDistributorInputs() {
  document.getElementById("editDistributorId").value = "";
  document.getElementById("distributorName").value = "";
  document.getElementById("distributorContact").value = "";
  document.getElementById("distributorLocation").value = "";
  document.getElementById("seedsAvailable").value = "";
  document.getElementById("updateDistributorButton").style.display = "none";
}

// Delete distributor details
async function deleteDistributorDetail(id) {
  try {
    await deleteDoc(doc(db, "distributorDetails", id));
    alert("Distributor detail deleted successfully!");
    fetchDistributorDetails();
  } catch (error) {
    alert(error.message);
  }
}

// Attach functions to window object to make them globally accessible
window.loginAdmin = loginAdmin;
window.addSoilDetail = addSoilDetail;
window.addDistributorDetail = addDistributorDetail;
window.updateSoilDetail = updateSoilDetail;
window.updateDistributorDetail = updateDistributorDetail;
window.deleteSoilDetail = deleteSoilDetail;
window.deleteDistributorDetail = deleteDistributorDetail;
window.populateSoilFields = populateSoilFields;
window.populateDistributorFields = populateDistributorFields;
