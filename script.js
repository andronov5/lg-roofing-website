const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const estimateSection = document.querySelector('#estimate');
const serviceSelect = document.querySelector('#service');
const estimateForm = document.querySelector('#estimate-form');
const result = document.querySelector('#form-result');

const closeMenu = () => {
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('[data-service]').forEach((button) => {
  button.addEventListener('click', () => {
    serviceSelect.value = button.dataset.service;
    estimateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => serviceSelect.focus(), 600);
  });
});

document.querySelectorAll('.accordion details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const buildMessage = (data) => {
  const details = data.get('details')?.trim() || 'No additional details yet.';
  return [
    'Hi LG Roofing, I would like to request an estimate.',
    '',
    `Name: ${data.get('name').trim()}`,
    `My phone: ${data.get('phone').trim()}`,
    `Property ZIP: ${data.get('zip').trim()}`,
    `Service: ${data.get('service')}`,
    `Details: ${details}`,
  ].join('\n');
};

estimateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!estimateForm.reportValidity()) return;

  const data = new FormData(estimateForm);
  const message = buildMessage(data);
  const smsLink = `sms:+17204354421?&body=${encodeURIComponent(message)}`;

  result.classList.add('is-visible');
  result.innerHTML = `
    <strong>Your request is ready.</strong><br>
    On a phone, open the prepared message. On a computer, copy it and call LG Roofing.
    <div>
      <a class="button button--orange" href="${smsLink}">Open text message</a>
      <button type="button" id="copy-request">Copy request</button>
    </div>
  `;

  result.querySelector('#copy-request').addEventListener('click', async (buttonEvent) => {
    const button = buttonEvent.currentTarget;
    try {
      await navigator.clipboard.writeText(message);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Select and copy below';
      result.insertAdjacentHTML('beforeend', `<textarea aria-label="Prepared request">${message}</textarea>`);
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});
