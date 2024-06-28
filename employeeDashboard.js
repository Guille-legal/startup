document.addEventListener('DOMContentLoaded', () => {
    // Top navigation links
    document.getElementById('dashboardLink').addEventListener('click', () => showSection('dashboardContent'));
    document.getElementById('researchLink').addEventListener('click', () => showSection('researchContent'));
    document.getElementById('projectsLink').addEventListener('click', () => showSection('projectsContent'));
    document.getElementById('settingsLink').addEventListener('click', () => showSection('settingsContent'));
    document.getElementById('permissionsLink').addEventListener('click', () => showSection('permissionsContent'));
    document.getElementById('editContentLink').addEventListener('click', () => showSection('editContentContent'));
    document.getElementById('profileLink').addEventListener('click', () => showSection('profileContent'));
    document.getElementById('notificationsLink').addEventListener('click', () => showSection('notificationsContent'));
    document.getElementById('logoutLink').addEventListener('click', logout);

    // Sidebar links
    document.getElementById('dashboardOverview').addEventListener('click', () => showSection('dashboardContent'));
    document.getElementById('research').addEventListener('click', () => showSection('researchContent'));
    document.getElementById('projects').addEventListener('click', () => showSection('projectsContent'));
    document.getElementById('settings').addEventListener('click', () => showSection('settingsContent'));
    document.getElementById('permissions').addEventListener('click', () => showSection('permissionsContent'));
    document.getElementById('editContent').addEventListener('click', () => showSection('editContentContent'));

    // Edit Content sections
    document.getElementById('editCaseLaw').addEventListener('click', () => loadSection('Case-Law'));
    document.getElementById('editRegulations').addEventListener('click', () => loadSection('Regulations'));
    document.getElementById('editDirectives').addEventListener('click', () => loadSection('Directives'));
    document.getElementById('editDecisions').addEventListener('click', () => loadSection('Decisions'));

    // Add folder and document buttons
    document.getElementById('addFolderButton').addEventListener('click', addFolder);
    document.getElementById('addDocumentButton').addEventListener('click', () => showUploadForm(currentSection, currentFolder));
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function logout() {
    // Clear any stored tokens or session data
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Edit Content Functions
let currentSection = '';
let currentFolder = '';

function loadSection(section) {
    currentSection = section;
    const sectionContent = document.getElementById('editContentDetails');
    sectionContent.style.display = 'block';
    sectionContent.querySelector('#selectedCategory').innerText = section;
    fetchFoldersAndDocuments(section);
}

function fetchFoldersAndDocuments(section) {
    fetch(`/api/content/${section}`)
        .then(response => response.json())
        .then(data => {
            const sectionContent = document.getElementById(`${section.toLowerCase()}-content`);
            sectionContent.innerHTML = '';
            data.forEach(item => {
                if (item.isFolder) {
                    const folderDiv = document.createElement('div');
                    folderDiv.innerText = `${item.name} (Folder)`;
                    folderDiv.addEventListener('click', () => selectFolder(item.name));
                    sectionContent.appendChild(folderDiv);
                } else {
                    sectionContent.innerHTML += `<div>${item.name} (Document)</div>`;
                }
            });
        });
}

function selectFolder(folderName) {
    currentFolder = folderName;
    document.getElementById('selectedCategory').innerText = `${currentSection} - ${folderName}`;
}

function addFolder() {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        fetch('/api/content/create-folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: currentSection, name: folderName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Folder created successfully');
                fetchFoldersAndDocuments(currentSection);
            } else {
                alert('Error creating folder');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function showUploadForm(section, folder) {
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.style.display = 'block';
    uploadForm.onsubmit = function(event) {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        formData.append('category', section);
        formData.append('folder', folder);

        fetch('/api/content/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'File uploaded successfully') {
                alert('Document uploaded successfully');
                uploadForm.reset();
                uploadForm.style.display = 'none';
                fetchFoldersAndDocuments(section);
            } else {
                alert('Error uploading document');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
}
