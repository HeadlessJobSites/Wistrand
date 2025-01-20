document.addEventListener('DOMContentLoaded', function () {
  i18next
    .use(i18nextHttpBackend)  // Use the backend plugin available globally
    .init({
      lng: 'en', // Default language
      fallbackLng: 'en',
      debug: true,
      backend: {
        loadPath: '/locales/{{lng}}/translation.json'  // Path to the translation files
      }
    }, function(err, t) {
      // Initialize your application after translations have been loaded
      updateContent();
    });

  function updateContent() {
    document.getElementById('welcome_message').innerHTML = i18next.t('welcome_message');
    document.getElementById('description').innerHTML = i18next.t('description');
  }

  function changeLanguage(lng) {
    i18next.changeLanguage(lng, () => {
      updateContent();
    });
  }

  // Add language change event listeners if needed
  document.getElementById('switch-to-en').addEventListener('click', function () {
    changeLanguage('en');
  });
  document.getElementById('switch-to-sv').addEventListener('click', function () {
    changeLanguage('sv');
  });
});
