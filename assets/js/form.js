/* =========================================================
   Contact form · EmailJS integration + validation
   Replace the placeholders below with your real IDs.
   ========================================================= */
(function () {
  const CONFIG = {
    PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
    SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID'
  };

  const form = document.querySelector('#contact-form');
  if (!form) return;
  const msg = form.querySelector('.form__msg');
  const btn = form.querySelector('button[type="submit"]');

  // Initialize EmailJS if the SDK is present
  if (window.emailjs && CONFIG.PUBLIC_KEY && CONFIG.PUBLIC_KEY.indexOf('YOUR_') !== 0) {
    try { emailjs.init(CONFIG.PUBLIC_KEY); } catch(e){}
  }

  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    phone: v => /^[0-9+\-\s()]{7,15}$/.test(v.trim()) || 'Please enter a valid phone number.',
    message: v => v.trim().length >= 10 || 'Please tell us a little more about your project.',
    consent: v => v === true || 'Please accept the terms to continue.'
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = ''; msg.className = 'form__msg';

    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      project: form.project.value,
      budget: form.budget.value,
      message: form.message.value,
      consent: form.consent.checked
    };

    for (const [key, fn] of Object.entries(validators)) {
      const res = fn(data[key]);
      if (res !== true) { msg.textContent = res; msg.classList.add('error'); return; }
    }

    btn.disabled = true;
    const orig = btn.textContent;
    btn.textContent = 'Sending…';

    try {
      if (window.emailjs && CONFIG.SERVICE_ID.indexOf('YOUR_') !== 0) {
        await emailjs.send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, data);
      } else {
        // Fallback demo: pretend to send
        await new Promise(r => setTimeout(r, 900));
      }
      msg.textContent = '✓ Thank you. Our design team will contact you within 24 hours.';
      msg.classList.add('success');
      form.reset();
      window.SW && window.SW.toast && window.SW.toast('Consultation request received', 'success');
    } catch (err) {
      msg.textContent = 'Something went wrong. Please call us at +91 84462 13222.';
      msg.classList.add('error');
      window.SW && window.SW.toast && window.SW.toast('Please try again', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });
})();
