document.addEventListener('DOMContentLoaded', function () {
  console.log('Checking i18nextHttpBackend availability:', typeof i18nextHttpBackend);
  if (typeof i18nextHttpBackend === 'undefined') {
    console.error('i18nextHttpBackend is not defined.');
  } else {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'sv';
    let jobs = []; // Cache for job data

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
        fetchJobs(); // Fetch jobs initially
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
        // Add other elements here as needed
      ];

      elementsToUpdate.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = i18next.t(key);
        }
      });

      // Re-render jobs if already fetched
      if (jobs.length > 0) {
        renderJobs(jobs);
      }
    }

    function fetchJobs() {
      const apiUrl = 'https://api.talentech.io/reachmee/feed/wistrand';
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          jobs = data; // Cache the jobs data
          renderJobs(jobs); // Render the jobs on the page
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
