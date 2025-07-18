let doctors = [];

// Fetch data from doctors.json
fetch("data/doctors.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load doctors.json");
    }
    return response.json();
  })
  .then(data => {
    doctors = data;
    // Check current page and load appropriate data
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
      // On homepage, initially show no results until search or show all is clicked
      document.getElementById("results").innerHTML = `<p style="text-align:center; font-size:18px; color:#999;">Use the filters above to find a doctor.</p>`;
    } else if (window.location.pathname.endsWith("all-doctors.html")) {
      displayAllDoctors(); // Call a new function to display all doctors
    }
  })
  .catch(error => {
    console.error("❌ Error loading JSON:", error);
    const resultDiv = document.getElementById("results");
    if (resultDiv) {
      resultDiv.innerHTML = `
        <p style="text-align:center; color:red;">Error loading doctors data. Please try again later.</p>
      `;
    }
  });

// Search and display doctors (for index.html)
function searchDoctors() {
  const locationSelect = document.getElementById("locationSelect");
  const departmentSelect = document.getElementById("departmentSelect");
  const resultDiv = document.getElementById("results");

  // Only proceed if these elements exist.
  if (!locationSelect || !departmentSelect || !resultDiv) {
    return;
  }

  const location = locationSelect.value;
  const department = departmentSelect.value;

  resultDiv.innerHTML = "";

  if (doctors.length === 0) {
    resultDiv.innerHTML = `<p style="text-align:center; color:gray;">Loading doctors data... please wait</p>`;
    return;
  }

  const filtered = doctors.filter(doc =>
    (location === "" || doc.location === location) &&
    (department === "" || doc.department === department)
  );

  if (filtered.length === 0) {
    resultDiv.innerHTML = `<p style="text-align:center; font-size:18px; color:#999;">😕 No doctors found matching your search criteria.</p>`;
    return;
  }

  filtered.forEach(doc => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <img src="${doc.image}" alt="${doc.name}" class="doctor-img" />
      <h3>🧑‍⚕️ ${doc.name}</h3>
      <p><strong>Specialization:</strong> ${doc.department}</p>
      <p><strong>Location:</strong> ${doc.location}</p>
      <p><strong>Time:</strong> ${doc.time || "9:00 AM - 2:00 PM"}</p>
      <button onclick="openAppointmentForm('${doc.name}')">Book Appointment</button>
    `;
    resultDiv.appendChild(card);
  });
}

// Function to display ALL doctors (for all-doctors.html)
function displayAllDoctors() {
  const resultDiv = document.getElementById("results");

  if (!resultDiv) {
    return;
  }

  resultDiv.innerHTML = "";

  if (doctors.length === 0) {
    resultDiv.innerHTML = `<p style="text-align:center; color:gray;">Loading doctors data... please wait</p>`;
    return;
  }

  doctors.forEach(doc => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <img src="${doc.image}" alt="${doc.name}" class="doctor-img" />
      <h3>🧑‍⚕️ ${doc.name}</h3>
      <p><strong>Specialization:</strong> ${doc.department}</p>
      <p><strong>Location:</strong> ${doc.location}</p>
      <p><strong>Time:</strong> ${doc.time || "9:00 AM - 2:00 PM"}</p>
      <button onclick="openAppointmentForm('${doc.name}')">Book Appointment</button>
    `;
    resultDiv.appendChild(card);
  });
}


// Appointment modal handling (common to all pages)
function openAppointmentForm(doctorName) {
  const modal = document.getElementById("appointmentModal");
  const nameField = document.getElementById("doctorName");
  if (modal && nameField) {
    nameField.value = doctorName;
    modal.style.display = "flex";
  }
}

function closeForm() {
  const modal = document.getElementById("appointmentModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Handle form submit (common to all pages)
const appointmentForm = document.getElementById("appointmentForm");
if (appointmentForm) {
  appointmentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("✅ Appointment booked successfully!");
    closeForm();
    appointmentForm.reset();
  });
}