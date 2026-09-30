const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const modalBackdrop = $("#modalBackdrop");
const reportForm = $("#reportForm");
const successState = $("#successState");
const modalTitle = $("#modalTitle");
const generatedCase = $("#generatedCase");
const reportLocationBtn = $("#reportLocationBtn");

function openReportModal(category = "") {
  modalBackdrop.classList.add("show");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  successState.classList.remove("show");
  reportForm.style.display = "block";
  if (category) {
    $("#reportCategory").value = category;
    modalTitle.textContent = `Report a ${category.toLowerCase()} problem`;
  } else {
    $("#reportCategory").value = "";
    modalTitle.textContent = "Report a problem";
  }
  setTimeout(() => $("#reportCategory").focus(), 50);
}

function closeReportModal() {
  modalBackdrop.classList.remove("show");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

["heroReportBtn", "navReportBtn", "bottomReportBtn"].forEach(id => {
  const button = document.getElementById(id);
  if (button) button.addEventListener("click", () => openReportModal());
});

$("#modalClose").addEventListener("click", closeReportModal);
$("#successClose").addEventListener("click", closeReportModal);

modalBackdrop.addEventListener("click", e => {
  if (e.target === modalBackdrop) closeReportModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalBackdrop.classList.contains("show")) closeReportModal();
});

$$(".category-card").forEach(card => {
  card.addEventListener("click", () => openReportModal(card.dataset.category));
});

reportForm.addEventListener("submit", e => {
  e.preventDefault();

  const category = $("#reportCategory").value;
  const title = $("#reportTitle").value.trim();
  const location = $("#reportLocation").value.trim();

  if (!category || !title || !location) return;

  const prefix = category === "Education" ? "EDU" : category === "Healthcare" ? "HLT" : "CIV";
  const number = Math.floor(1000 + Math.random() * 8999);
  generatedCase.textContent = `${prefix}-${number}`;

  reportForm.style.display = "none";
  successState.classList.add("show");
});

const filters = $$(".filter");
const caseCards = $$(".case-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");

    const value = filter.dataset.filter;
    caseCards.forEach(card => {
      card.classList.toggle("hidden", value !== "all" && card.dataset.type !== value);
    });
  });
});

$$(".case-view").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.case;
    showToast(`Opening case ${id} — prototype view`);
  });
});

$$(".support-btn").forEach(button => {
  button.addEventListener("click", () => {

    const caseCard = button.closest(".case-card");
    const supportNumber = $(".support-number", caseCard);

    let currentSupporters = Number(supportNumber.textContent);

    if (button.classList.contains("supporting")) {

      currentSupporters--;
      supportNumber.textContent = currentSupporters;

      button.classList.remove("supporting");
      button.textContent = "Support ♡";

      showToast("Your support was removed.");

    } else {

      currentSupporters++;
      supportNumber.textContent = currentSupporters;

      button.classList.add("supporting");
      button.textContent = "Supporting ✓";

      showToast("You are now supporting this case!");
    }
  });
});

$("#communityBtn").addEventListener("click", () => {
  document.querySelector("#cases").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    const civicFilter = $('[data-filter="civic"]');
    civicFilter.click();
  }, 500);
});

$("#locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("Location is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    () => showToast("Location detected for this prototype."),
    () => showToast("Location permission was not granted.")
  );
});

$("#loginBtn").addEventListener("click", () => {
  showToast("Sign-in screen will connect to the Flask backend later.");
});

$("#mobileMenuBtn").addEventListener("click", () => {
  const nav = $(".nav-links");
  const isOpen = nav.classList.toggle("mobile-open");
  if (isOpen) {
    nav.style.display = "flex";
    nav.style.position = "absolute";
    nav.style.top = "68px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "#fff";
    nav.style.padding = "18px 5vw";
    nav.style.flexDirection = "column";
    nav.style.gap = "16px";
    nav.style.borderBottom = "1px solid #e5e7ee";
  } else {
    nav.removeAttribute("style");
  }
});

function showToast(message) {
  const toast = $("#toast");
  $("p", toast).textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
 // healthcare
  const viewBtn = document.querySelector(".case-view[data-case='HLT-0042']");
  const healthModal = document.getElementById("healthModal");
  const closeHealth = healthModal.querySelector(".case-close");
  viewBtn.addEventListener("click", () => {
    healthModal.style.display = "block";
  });

  closeHealth.addEventListener("click", () => {
    healthModal.style.display = "none";
  });
 
  window.addEventListener("click", (e) => {
    if (e.target === healthModal) {
      healthModal.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Civic streetlight
  const viewCivicBtn = document.querySelector(".case-view[data-case='CIV-1019']");
  const civicModal = document.getElementById("civicModal");
  const closeCivic = civicModal.querySelector(".case-close");

  viewCivicBtn.addEventListener("click", () => {
    civicModal.style.display = "block";
  });

  closeCivic.addEventListener("click", () => {
    civicModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === civicModal) {
      civicModal.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Civic Pothole C
  const viewPotholeBtn = document.querySelector(".case-view[data-case='CIV-1024']");
  const civicModal1024 = document.getElementById("civicModal1024");
  const closePothole = civicModal1024.querySelector(".case-close");

  viewPotholeBtn.addEventListener("click", () => {
    civicModal1024.style.display = "block";
  });

  closePothole.addEventListener("click", () => {
    civicModal1024.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === civicModal1024) {
      civicModal1024.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Education
  const viewEduBtn = document.querySelector(".case-view[data-case='EDU-0087']");
  const eduModal = document.getElementById("eduModal");
  const closeEdu = eduModal.querySelector(".case-close");

  viewEduBtn.addEventListener("click", () => {
    eduModal.style.display = "block";
  });

  closeEdu.addEventListener("click", () => {
    eduModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === eduModal) {
      eduModal.style.display = "none";
    }
  });
});


function useCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const locationInput = document.getElementById("reportLocation");

            if (locationInput) {
                locationInput.value =
                    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            }
        },
        function(error) {
            alert("Unable to get your location. Please allow location access.");
        }
    );
}