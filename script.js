/* =========================================================
   SITE CONFIG — edit these in ONE place.
   ========================================================= */

// 1) Business name. Change it here and it updates the nav,
//    hero, about text, footer, and the browser tab title.
const BUSINESS_NAME = "V.C Painting LLC";

// 2) Where business inquiries should go.
const CONTACT = {
  // Your inbox. Shown on the page and used by the "mailto" fallback.
  email: "hello@vcpainting.com",

  // To receive form submissions straight to your inbox, paste a
  // Formspree endpoint here. It looks like: "https://formspree.io/f/abcdwxyz"
  //
  // How to get one (free, ~2 minutes, no server needed):
  //   1. Go to https://formspree.io and sign up with the email above.
  //   2. Create a new form and copy its endpoint URL.
  //   3. Paste it between the quotes below and re-deploy.
  //
  // Until this is filled in, the form falls back to opening the
  // visitor's email app with the message pre-filled to you.
  formspreeEndpoint: "",
};

/* =========================================================
   Below here you usually don't need to edit anything.
   ========================================================= */

// Apply the business name everywhere it appears.
document.querySelectorAll(".business-name").forEach((el) => {
  el.textContent = BUSINESS_NAME;
});
document.title = BUSINESS_NAME + " — Interior & Exterior Painting";

// Apply the contact email everywhere it appears.
document.querySelectorAll(".contact-email").forEach((el) => {
  el.textContent = CONTACT.email;
  el.setAttribute("href", "mailto:" + CONTACT.email);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// ---- Contact form submission ----
function showNote(message, type) {
  const note = document.getElementById("form-note");
  if (!note) return;
  note.textContent = message;
  note.hidden = false;
  note.classList.remove("note-error", "note-success");
  note.classList.add(type === "error" ? "note-error" : "note-success");
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  // Path A: Formspree configured -> send the inquiry by email via fetch.
  if (CONTACT.formspreeEndpoint) {
    const btn = document.getElementById("quote-submit");
    const original = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }
    try {
      const res = await fetch(CONTACT.formspreeEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        showNote("Thanks! Your request has been sent — we'll be in touch soon.", "success");
      } else {
        showNote("Sorry, something went wrong. Please email us directly at " + CONTACT.email + ".", "error");
      }
    } catch (err) {
      showNote("Network error. Please email us directly at " + CONTACT.email + ".", "error");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = original;
      }
    }
    return false;
  }

  // Path B: Fallback -> open the visitor's email app, pre-filled to you.
  const name = (data.get("name") || "").toString();
  const email = (data.get("email") || "").toString();
  const phone = (data.get("phone") || "").toString();
  const message = (data.get("message") || "").toString();
  const subject = encodeURIComponent("Quote request — " + BUSINESS_NAME);
  const body = encodeURIComponent(
    "Name: " + name +
    "\nEmail: " + email +
    "\nPhone: " + phone +
    "\n\n" + message
  );
  window.location.href = "mailto:" + CONTACT.email + "?subject=" + subject + "&body=" + body;
  showNote("Opening your email app… if nothing happens, email us at " + CONTACT.email + ".", "success");
  return false;
}
