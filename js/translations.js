document.addEventListener('DOMContentLoaded', function () {
  console.log('Checking i18nextHttpBackend availability:', typeof i18nextHttpBackend);
  if (typeof i18nextHttpBackend === 'undefined') {
    console.error('i18nextHttpBackend is not defined.');
  } else {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'sv';
    let jobs = []; // Cache for job data
    const isStudentPage = document.body.classList.contains('student-jobs-page'); // Check if it's the student jobs page

    i18next
      .use(i18nextHttpBackend)
      .init({
        lng: savedLanguage,
        fallbackLng: 'sv',
        debug: true,
        backend: {
          loadPath: './locales/{{lng}}/translation.json',
        },
      }, function (err, t) {
        if (err) {
          console.error('Something went wrong during the i18next initialization:', err);
          return;
        }
        updateContent();
        updateCurrentLanguageFlag(savedLanguage);
        fetchJobs(isStudentPage); // Fetch jobs initially with a condition based on the page type
      });


    function updateContent() {
      const elementsToUpdate = [
        { id: 'gobi_header', key: 'gobi_header' },
        { id: 'lang_herotext', key: 'lang_herotext' },
        { id: 'lang_studenthero', key: 'lang_studenthero' },
        { id: 'lang_herobtn_standard', key: 'lang_herobtn_standard' },
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
        { id: 'lang_process', key: 'lang_process' },
        { id: 'lang_values', key: 'lang_values' },
        { id: 'lang_apply_mobile', key: 'lang_apply_mobile' },
        { id: 'similar_jobs_header', key: 'similar_jobs_header' },
        { id: 'application_form_header', key: 'application_form_header' },
        { id: 'student_welcome_header', key: 'student_welcome_header' },
        { id: 'student_welcome_text', key: 'student_welcome_text' },
        { id: 'student_events_header', key: 'student_events_header' },
        { id: 'student_events_text', key: 'student_events_text' },
        { id: 'student_events_calendar', key: 'student_events_calendar' },
        { id: 'student_thesis_practice_header', key: 'student_thesis_practice_header' },
        { id: 'student_thesis_practice_intro', key: 'student_thesis_practice_intro' },
        { id: 'student_thesis_practice_details', key: 'student_thesis_practice_details' },
        { id: 'student_thesis_practice_apply', key: 'student_thesis_practice_apply' },
        { id: 'student_summer_clerk_header', key: 'student_summer_clerk_header' },
        { id: 'student_summer_clerk_intro', key: 'student_summer_clerk_intro' },
        { id: 'student_summer_clerk_training', key: 'student_summer_clerk_training' },
        { id: 'student_summer_clerk_apply', key: 'student_summer_clerk_apply' }
        // Add other elements here as needed
      ];
      
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

      // Safely update elements if they exist
      elementsToUpdate.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
        const translation = i18next.t(key);
      element.innerHTML = translation.replace(/\n/g, '<br>');
        }
      });

      // Re-render jobs if already fetched
      if (jobs.length > 0) {
        renderJobs(jobs);
      }
    }

    // Fetch student jobs
    function fetchJobs(isStudentPage) {
      const apiUrl = 'https://api.talentech.io/reachmee/feed/wistrand';
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (isStudentPage) {
            // Filter to include only 'Student' or 'Sommarjobb' jobs if on the student jobs page
            jobs = data.filter(job => 
                job.employment_level?.toLowerCase() === "student" || 
                job.employment_level?.toLowerCase() === "sommarjobb"
            );
          } else {
            // Include all jobs if on the general jobs page
            jobs = data;
          }
          renderJobs(jobs); // Render the appropriate jobs on the page
        })
        .catch((error) => {
          console.error('Error fetching jobs:', error);
        });
    }

    function renderJobs(jobList) {
      const jobListContainer = document.getElementById('jobList');
      if (jobListContainer) {
        jobListContainer.innerHTML = ''; // Clear existing jobs
        jobList.forEach((job) => {
          jobListContainer.insertAdjacentHTML('beforeend', buildJobCard(job));
        });
      }
    }

    function buildJobCard(job) {
      const jobDetailUrl = `job-details.html?jobId=${job.ad_id}`;
      const category = job.occupation_area || 'Wistrand';
      return `
        <div class="col-12 col-md-4 col-lg-4 mb-4">
          <a href="${jobDetailUrl}" style="text-decoration: none; color: inherit;" aria-label="${i18next.t('jobs_section.details')}">
            <div class="card h-100">
              <div class="card-body">
                <div class="card-category"><span>${category}</span></div>
                <div class="card-title">${job.title || i18next.t('jobs_section.untitled')}</div>
                <p class="card-text">${job.country || i18next.t('jobs_section.not_specified')}</p>
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
