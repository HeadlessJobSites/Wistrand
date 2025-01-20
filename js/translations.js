document.addEventListener('DOMContentLoaded', function () {
  console.log('Checking i18nextHttpBackend availability:', typeof i18nextHttpBackend);
  if (typeof i18nextHttpBackend === 'undefined') {
    console.error('i18nextHttpBackend is not defined.');
  } else {
    i18next
      .use(i18nextHttpBackend)  // Use the backend plugin available globally
      .init({
        lng: 'sv', // Default language
        fallbackLng: 'sv',
        debug: true,
        backend: {
          loadPath: './locales/{{lng}}/translation.json'  // Path to the translation files
        }
      }, function(err, t) {
        if (err) {
          console.error('Something went wrong during the i18next initialization:', err);
          return;
        }
        // Initialize your application after translations have been loaded
        updateContent();
      });

function updateContent() {
  // Update the hero text
  document.getElementById('lang_herotext').innerHTML = i18next.t('lang_herotext');

  // Update the button text based on the number of positions (this part assumes you have a way to determine the number of jobs, e.g., from a variable)
  let positionsCount = 5;  // You would dynamically set this based on data fetched
  const btnText = positionsCount === 1 ? 
                  i18next.t('hero_button.one') : 
                  (positionsCount > 1 ? 
                   i18next.t('hero_button.other', { count: positionsCount }) : 
                   i18next.t('hero_button.default'));

  document.getElementById('lang_herobtn_default').textContent = btnText;
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
  }
});
