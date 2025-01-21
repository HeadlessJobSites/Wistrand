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
      const elementsToUpdate = [
        { id: 'lang_herotext', key: 'lang_herotext' },
        { id: 'company_header', key: 'company_section.header' },
        { id: 'company_description', key: 'company_section.description' },
        { id: 'values_header', key: 'values_section.header' },
        { id: 'meet_employees_header', key: 'meet_employees.header' },
        { id: 'quote_text', key: 'quote_section.quote' },
        { id: 'quote_author', key: 'quote_section.author' },
        { id: 'quote_role', key: 'quote_section.role' },
        { id: 'our_process_header', key: 'our_process.header' },
        { id: 'delivered_by_text', key: 'social_section.delivered_by' },
        { id: 'share_on_social_text', key: 'social_section.share_on_social' },
        { id: 'navbar_jobs', key: 'navbar.jobs' },
        { id: 'navbar_meet_employees', key: 'navbar.meet_employees' },
        { id: 'navbar_students', key: 'navbar.students' },
        { id: 'navbar_recruitment_process', key: 'navbar.recruitment_process' },
        { id: 'navbar_login', key: 'navbar.login' },
        { id: 'navbar_apply', key: 'navbar.apply' },
        { id: 'navbar_home', key: 'navbar.home' },
        { id: 'apply_button', key: 'navbar.apply' },
        { id: 'apply_button_nav', key: 'navbar.apply' },
        { id: 'navbar_values', key: 'navbar.values' },
        { id: 'jobs_section_header', key: 'jobs_section.header' },
        { id: 'location_filter_label', key: 'jobs_section.location_filter' },
        { id: 'job_type_filter_label', key: 'jobs_section.job_type_filter' },
        { id: 'loadMore', key: 'jobs_section.load_more' },
      ];

      // Update the "Values" and "Recruitment Process" navigation links
      const valuesLink = document.getElementById('lang_values');
      if (valuesLink) {
        valuesLink.innerHTML = i18next.t('lang_values');
      }
      
      const processLink = document.getElementById('lang_process');
      if (processLink) {
        processLink.innerHTML = i18next.t('lang_process');
      }
      
      // Update the "Similar Jobs" header
      const similarJobsHeader = document.getElementById('similar_jobs_header');
      if (similarJobsHeader) {
        similarJobsHeader.innerHTML = i18next.t('similar_jobs_header');
      }

      // Update the "Application Form" header
      const applicationFormHeader = document.getElementById('application_form_header');
      if (applicationFormHeader) {
        applicationFormHeader.innerHTML = i18next.t('application_form_header');
      }
      
      // Job Section Translations
      const jobSectionUpdates = [
        { id: 'job_team_label', key: 'job_section.team_label' },
        { id: 'job_team_value', key: 'job_section.team_value' },
        { id: 'job_location_label', key: 'job_section.location_label' },
        { id: 'job_location_value', key: 'job_section.location_value' },
        { id: 'job_expiration_label', key: 'job_section.expiration_label' },
        { id: 'job_expiration_value', key: 'job_section.expiration_value' }
      ];
      
      jobSectionUpdates.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = i18next.t(key);
        }
      });

      // Update the "Submit Application" button
      const applyButtonSubmit = document.getElementById('apply_button_submit');
      if (applyButtonSubmit) {
        applyButtonSubmit.innerHTML = i18next.t('apply_button_submit');
      }

      // Safely update elements if they exist
      elementsToUpdate.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = i18next.t(key);
        }
      });

      // Update filter options dynamically if they exist
      const locationFilter = document.getElementById('locationFilter');
      const jobTypeFilter = document.getElementById('jobTypeFilter');
      if (locationFilter) {
        locationFilter.innerHTML = `<option value="All">${i18next.t('jobs_section.all_locations')}</option>`;
      }
      if (jobTypeFilter) {
        jobTypeFilter.innerHTML = `<option value="All">${i18next.t('jobs_section.all_job_types')}</option>`;
      }

      // Update team members / Carousel
      const teamMembers = i18next.t('values_section.team_members', { returnObjects: true });
      teamMembers.forEach((member, index) => {
        const roleElement = document.getElementById(`member_${index + 1}_role`);
        const descriptionElement = document.getElementById(`member_${index + 1}_description`);
        if (roleElement) roleElement.innerHTML = member.role;
        if (descriptionElement) descriptionElement.innerHTML = member.description;
      });

      // Update process steps dynamically
      const steps = i18next.t('our_process.steps', { returnObjects: true });
      const processStepsContainer = document.getElementById('process_steps');
      if (processStepsContainer) {
        processStepsContainer.innerHTML = ''; // Clear existing steps
        steps.forEach((step, index) => {
          const stepHTML = `
            <div class="col-md-4 col-sm-4 process-item">
              <div class="process-icon">
                <h3>${index + 1}</h3>
              </div>
              <div class="process-content">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
              </div>
            </div>
          `;
          processStepsContainer.insertAdjacentHTML('beforeend', stepHTML);
        });
      }

      // Update employees' information dynamically
      const employees = i18next.t('meet_employees.employees', { returnObjects: true });
      employees.forEach((employee, index) => {
        const nameElement = document.getElementById(`employee_${index + 1}_name`);
        const roleElement = document.getElementById(`employee_${index + 1}_role`);
        const aboutElement = document.getElementById(`employee_${index + 1}_about`);

        if (nameElement) nameElement.innerHTML = employee.name;
        if (roleElement) roleElement.innerHTML = employee.role;
        if (aboutElement) {
          aboutElement.innerHTML = `
            ${employee.q_and_a.about ? `<strong>${employee.q_and_a.about}</strong><br>${employee.q_and_a.about_answer}<br><br>` : ''}
            ${employee.q_and_a.culture ? `<strong>${employee.q_and_a.culture}</strong><br>${employee.q_and_a.culture_answer}<br><br>` : ''}
            ${employee.q_and_a.day ? `<strong>${employee.q_and_a.day}</strong><br>${employee.q_and_a.day_answer}<br><br>` : ''}
            ${employee.q_and_a.projects ? `<strong>${employee.q_and_a.projects}</strong><br>${employee.q_and_a.projects_answer}<br><br>` : ''}
            ${employee.q_and_a.balance ? `<strong>${employee.q_and_a.balance}</strong><br>${employee.q_and_a.balance_answer}<br><br>` : ''}
            ${employee.q_and_a.first_impressions ? `<strong>${employee.q_and_a.first_impressions}</strong><br>${employee.q_and_a.first_impressions_answer}<br>` : ''}
            ${employee.q_and_a.appreciation ? `<strong>${employee.q_and_a.appreciation}</strong><br>${employee.q_and_a.appreciation_answer}<br>` : ''}
          `;
        }
      });

      // Update Job Listings Section
      const jobListContainer = document.getElementById('jobList');
      if (jobListContainer) {
        jobListContainer.innerHTML = ''; // Clear current job cards

        const jobs = []; // Replace with your dynamic job data
        jobs.forEach((job) => {
          jobListContainer.insertAdjacentHTML('beforeend', buildJobCard(job));
        });
      }
    }

    // Function to build HTML for a job card
    function buildJobCard(job) {
      const jobDetailUrl = `job-details.html?jobId=${job.ad_id}`;
      const organizationUnitName =
        job.organizations && job.organizations.length > 1
          ? job.organizations[1].nameorgunit
          : job.organizations?.[0]?.nameorgunit || i18next.t('jobs_section.not_specified');
      const category = job.occupation_area || 'Wistrand';

      return `
        <div class="col-12 col-md-4 col-lg-4 mb-4">
          <a href="${jobDetailUrl}" class="" style="text-decoration: none; color: inherit;" aria-label="${i18next.t('jobs_section.details')}">
            <div class="card h-100">
              <div class="card-body">
                <div class="card-category"><span>${category}</span></div>
                <div class="card-title">${job.title || i18next.t('jobs_section.untitled')}</div>
                <p class="card-text">${job.country || i18next.t('jobs_section.not_specified')}</p>
                <a href="${jobDetailUrl}" class="stretched-link">
                  <img src="./files/arrow-right-thin.svg" class="stretched-link" alt="${i18next.t('jobs_section.details')}" style="">
                </a>
              </div>
            </div>
          </a>
        </div>`;
    }

    function changeLanguage(lng) {
      localStorage.setItem('selectedLanguage', lng);
      i18next.changeLanguage(lng, () => {
        updateContent();
        updateCurrentLanguageFlag(lng);
      });
    }

    function updateCurrentLanguageFlag(language) {
      const currentFlag = document.getElementById('currentLanguageFlag');
      if (currentFlag) {
        currentFlag.src = language === 'en' ? './files/en.svg' : './files/sv.svg';
        currentFlag.alt = language === 'en' ? 'English' : 'Swedish';
      }
    }

    document.getElementById('switch-to-en')?.addEventListener('click', function (e) {
      e.preventDefault();
      changeLanguage('en');
    });

    document.getElementById('switch-to-sv')?.addEventListener('click', function (e) {
      e.preventDefault();
      changeLanguage('sv');
    });
  }
});
