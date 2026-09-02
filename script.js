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

reportLocationBtn.addEventListener("click", () => {

  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser.");
    return;
  }

  reportLocationBtn.textContent = "⌛ Detecting location...";
  reportLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(

    async position => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        console.log(data);

        $("#reportLocation").value = data.display_name;

        showToast("Location detected successfully!");

      } catch (error) {

        console.error(error);

        $("#reportLocation").value =
          `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        showToast(
          "Coordinates detected, but the address could not be loaded."
        );

      } finally {

        reportLocationBtn.textContent =
          "📍 Use my current location";

        reportLocationBtn.disabled = false;

      }

    },

    error => {

      console.error(error);

      let message = "Unable to detect your location.";

      if (error.code === 1) {
        message = "Location permission was denied.";
      } else if (error.code === 2) {
        message = "Location information is unavailable.";
      } else if (error.code === 3) {
        message = "Location request timed out.";
      }

      showToast(message);

      reportLocationBtn.textContent =
        "📍 Use my current location";

      reportLocationBtn.disabled = false;

    }

  );

});
