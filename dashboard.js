async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');

    if (!options.headers) {
        options.headers = {};
    }

    options.headers['Authorization'] = 'Bearer ' + token;

    const response = await fetch(url, options);

    if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
        window.location.href = '/login.html';
    }

    return response;
}

// Example usage: Fetch user data
fetchWithAuth('/api/users')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error fetching users:', error));
