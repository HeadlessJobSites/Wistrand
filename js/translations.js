document.addEventListener('DOMContentLoaded', function () {
  console.log('Checking i18nextHttpBackend availability:', typeof i18nextHttpBackend);
  if (typeof i18nextHttpBackend === 'undefined') {
    console.error('i18nextHttpBackend is not defined.');
  } else {
    // Retrieve the saved language from localStorage or default to 'sv'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'sv';

    i18next
      .use(i18nextHttpBackend) // Use the backend plugin available globally
      .init({
        lng: savedLanguage, // Use the saved language
        fallbackLng: 'sv',
        debug: true,
        backend: {
          loadPath: './locales/{{lng}}/translation.json' // Path to the translation files
        }
      }, function (err, t) {
        if (err) {
          console.error('Something went wrong during the i18next initialization:', err);
          return;
        }
        // Initialize your application after translations have been loaded
        updateContent();
      });

    function updateContent() {
      document.getElementById('lang_herotext').innerHTML = i18next.t('lang_herotext');
      document.getElementById('company_header').innerHTML = i18next.t('company_section.header');
      document.getElementById('company_description').innerHTML = i18next.t('company_section.description');
      document.getElementById('values_header').innerHTML = i18next.t('values_section.header');

      // Update the button text based on the number of positions (this part assumes you have a way to determine the number of jobs, e.g., from a variable)
      let positionsCount = 5; // You would dynamically set this based on data fetched
      const btnText = positionsCount === 1
        ? i18next.t('hero_button.one')
        : (positionsCount > 1
          ? i18next.t('hero_button.other', { count: positionsCount })
          : i18next.t('hero_button.default'));

      document.getElementById('lang_herobtn_default').textContent = btnText;

      // Update team members / Carousel
      const teamMembers = i18next.t('values_section.team_members', { returnObjects: true });
      teamMembers.forEach((member, index) => {
        document.getElementById(`member_${index + 1}_role`).innerHTML = member.role;
        document.getElementById(`member_${index + 1}_description`).innerHTML = member.description;
      });
    }

    function changeLanguage(lng) {
      // Save the selected language to localStorage
      localStorage.setItem('selectedLanguage', lng);

      // Change the language in i18next
      i18next.changeLanguage(lng, () => {
        updateContent();
      });
    }

    // Add language change event listeners
    document.getElementById('switch-to-en').addEventListener('click', function () {
      changeLanguage('en');
    });
    document.getElementById('switch-to-sv').addEventListener('click', function () {
      changeLanguage('sv');
    });
  }
});
