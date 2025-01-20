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

        // Update the current flag icon based on the saved language
        updateCurrentLanguageFlag(savedLanguage);
      });

    function updateContent() {
      document.getElementById('lang_herotext').innerHTML = i18next.t('lang_herotext');
      document.getElementById('company_header').innerHTML = i18next.t('company_section.header');
      document.getElementById('company_description').innerHTML = i18next.t('company_section.description');
      document.getElementById('values_header').innerHTML = i18next.t('values_section.header');
      document.getElementById('meet_employees_header').innerHTML = i18next.t('meet_employees.header');
      document.getElementById('quote_text').innerHTML = i18next.t('quote_section.quote');
      document.getElementById('quote_author').innerHTML = i18next.t('quote_section.author');
      document.getElementById('quote_role').innerHTML = i18next.t('quote_section.role');
      document.getElementById('our_process_header').innerHTML = i18next.t('our_process.header');
      document.getElementById('delivered_by_text').innerHTML = i18next.t('social_section.delivered_by');
      document.getElementById('share_on_social_text').innerHTML = i18next.t('social_section.share_on_social');
      document.getElementById('navbar_jobs').innerHTML = i18next.t('navbar.jobs');
      document.getElementById('navbar_meet_employees').innerHTML = i18next.t('navbar.meet_employees');
      document.getElementById('navbar_students').innerHTML = i18next.t('navbar.students');
      document.getElementById('navbar_recruitment_process').innerHTML = i18next.t('navbar.recruitment_process');
      document.getElementById('navbar_login').innerHTML = i18next.t('navbar.login');
      document.getElementById('navbar_cms_law').innerHTML = i18next.t('navbar.cms_law');

      // Update Job Listings Section
      document.getElementById('jobs_section_header').innerHTML = i18next.t('jobs_section.header');
      document.getElementById('location_filter_label').innerHTML = i18next.t('jobs_section.location_filter');
      document.getElementById('job_type_filter_label').innerHTML = i18next.t('jobs_section.job_type_filter');
      document.getElementById('loadMore').innerHTML = i18next.t('jobs_section.load_more');

      // Update filter options dynamically
      $('#locationFilter').html(<option value="All">${i18next.t('jobs_section.all_locations')}</option>);
      $('#jobTypeFilter').html(<option value="All">${i18next.t('jobs_section.all_job_types')}</option>);

      // Job card building function
      function buildJobCard(job) {
        const jobDetailUrl = job-details.html?jobId=${job.ad_id};
        const organizationUnitName = job.organizations && job.organizations.length > 1
          ? job.organizations[1].nameorgunit
          : job.organizations?.[0]?.nameorgunit || i18next.t('jobs_section.not_specified');
        const category = job.occupation_area || 'Wistrand'; // Use occupation_area or default to 'Wistrand'

        return 
          <div class="col-12 col-md-4 col-lg-4 mb-4">
            <a href="${jobDetailUrl}" class="" style="text-decoration: none; color: inherit;" aria-label="${i18next.t('jobs_section.details')}">
              <div class="card h-100">
                <div class="card-body">
                  <div class="card-category"><span>${category}</span></div>
                  <div class="card-title">${job.title}</div>
                  <p class="card-text">${job.country || i18next.t('jobs_section.not_specified')}</p>
                  <a href="${jobDetailUrl}" class="stretched-link">
                    <img src="./files/arrow-right-thin.svg" class="stretched-link" alt="${i18next.t('jobs_section.details')}" style="">
                  </a>
                </div>
              </div>
            </a>
          </div>;
      }

      // Update the button text based on the number of positions
      let positionsCount = 5; // Dynamically set this based on data fetched
      const btnText = positionsCount === 1
        ? i18next.t('hero_button.one')
        : (positionsCount > 1
          ? i18next.t('hero_button.other', { count: positionsCount })
          : i18next.t('hero_button.default'));
      document.getElementById('lang_herobtn_default').textContent = btnText;

      // Update team members / Carousel
      const teamMembers = i18next.t('values_section.team_members', { returnObjects: true });
      teamMembers.forEach((member, index) => {
        document.getElementById(member_${index + 1}_role).innerHTML = member.role;
        document.getElementById(member_${index + 1}_description).innerHTML = member.description;
      });

      // Update process steps dynamically
      const steps = i18next.t('our_process.steps', { returnObjects: true });
      const processStepsContainer = document.getElementById('process_steps');
      processStepsContainer.innerHTML = ''; // Clear existing steps

      steps.forEach((step, index) => {
        const stepHTML = 
          <div class="col-md-4 col-sm-4 process-item">
            <div class="process-icon">
              <h3>${index + 1}</h3>
            </div>
            <div class="process-content">
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </div>
          </div>
        ;
        processStepsContainer.insertAdjacentHTML('beforeend', stepHTML);
      });

      // Update employees' information dynamically
      const employees = i18next.t('meet_employees.employees', { returnObjects: true });
      employees.forEach((employee, index) => {
        document.getElementById(employee_${index + 1}_name).innerHTML = employee.name;
        document.getElementById(employee_${index + 1}_role).innerHTML = employee.role;
        document.getElementById(employee_${index + 1}_about).innerHTML = 
          ${employee.q_and_a.about ? <strong>${employee.q_and_a.about}</strong><br>${employee.q_and_a.about_answer}<br><br> : ''}
          ${employee.q_and_a.culture ? <strong>${employee.q_and_a.culture}</strong><br>${employee.q_and_a.culture_answer}<br><br> : ''}
          ${employee.q_and_a.day ? <strong>${employee.q_and_a.day}</strong><br>${employee.q_and_a.day_answer}<br><br> : ''}
          ${employee.q_and_a.projects ? <strong>${employee.q_and_a.projects}</strong><br>${employee.q_and_a.projects_answer}<br><br> : ''}
          ${employee.q_and_a.balance ? <strong>${employee.q_and_a.balance}</strong><br>${employee.q_and_a.balance_answer}<br><br> : ''}
          ${employee.q_and_a.first_impressions ? <strong>${employee.q_and_a.first_impressions}</strong><br>${employee.q_and_a.first_impressions_answer}<br> : ''}
          ${employee.q_and_a.appreciation ? <strong>${employee.q_and_a.appreciation}</strong><br>${employee.q_and_a.appreciation_answer}<br> : ''}
        ;
      });
    }

    // Function to update the current language flag
    function updateCurrentLanguageFlag(language) {
      const currentFlag = document.getElementById('currentLanguageFlag');
      if (language === 'en') {
        currentFlag.src = './files/en.svg';
        currentFlag.alt = 'English';
      } else if (language === 'sv') {
        currentFlag.src = './files/sv.svg';
        currentFlag.alt = 'Swedish';
      }
    }

    // Add event listeners for language change via flags
    document.getElementById('switch-to-en').addEventListener('click', function (e) {
      e.preventDefault();
      changeLanguage('en');
    });

    document.getElementById('switch-to-sv').addEventListener('click', function (e) {
      e.preventDefault();
      changeLanguage('sv');
    });
  }
});
