document.addEventListener('DOMContentLoaded', function () {
    // Check user type
    const userType = localStorage.getItem('userType');
    if (userType === 'employee') {
        // Show employee-specific features
        document.getElementById('employeeFeatures').style.display = 'block';
    }

    // Load user projects
    loadUserProjects();

    // Load research sections
    loadResearchSections();

    // Event listeners for navigation
    document.getElementById('profileLink').addEventListener('click', showProfile);
    document.getElementById('notificationsLink').addEventListener('click', showNotifications);
    document.getElementById('dashboardOverviewLink').addEventListener('click', showSection.bind(null, 'dashboardOverview'));
    document.getElementById('researchLink').addEventListener('click', showSection.bind(null, 'research'));
    document.getElementById('projectsLink').addEventListener('click', showSection.bind(null, 'projects'));
    document.getElementById('settingsLink').addEventListener('click', showSection.bind(null, 'settings'));

    // Load user profile data into settings
    loadUserProfile();
});

async function loadUserProjects() {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`/api/projects/${userId}`);
    const projects = await response.json();
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = project.name;
        projectsList.appendChild(li);
    });
}

async function loadResearchSections() {
    const researchSections = ['Case-Law', 'Regulations', 'Directives', 'Decisions'];
    const researchList = document.getElementById('researchSections');
    researchList.innerHTML = '';
    researchSections.forEach(section => {
        const div = document.createElement('div');
        div.textContent = section;
        div.classList.add('research-item');
        div.addEventListener('click', () => {
            // Handle section click
            loadResearchSectionContent(section);
        });
        researchList.appendChild(div);
    });
}

async function loadResearchSectionContent(section) {
    // Load content for the selected research section
    console.log(`Loading content for ${section}`);
    // Implement the logic to load the specific section content
}

function showProfile() {
    const profileModal = document.getElementById('profileModal');
    profileModal.style.display = 'block';
}

function closeProfileModal() {
    const profileModal = document.getElementById('profileModal');
    profileModal.style.display = 'none';
}

function showNotifications() {
    const notificationsModal = document.getElementById('notificationsModal');
    notificationsModal.style.display = 'block';
}

function closeNotificationsModal() {
    const notificationsModal = document.getElementById('notificationsModal');
    notificationsModal.style.display = 'none';
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

async function updateProfile(event) {
    event.preventDefault();
    const userId = localStorage.getItem('userId');
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const isPublicProfile = document.getElementById('isPublicProfile').checked;

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ firstName, lastName, email, isPublicProfile })
    });

    if (response.ok) {
        alert('Profile updated successfully.');
        closeProfileModal();
    } else {
        alert('Error updating profile.');
    }
}

async function loadUserProfile() {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        const user = await response.json();
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
        document.getElementById('isPublicProfile').checked = user.isPublicProfile;
    } else {
        console.error('Error fetching user profile.');
    }
}
