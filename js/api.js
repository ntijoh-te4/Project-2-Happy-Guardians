/**
 * Gets file contents
 * @param {string} file File path
 * @returns {string} File contents
 */
async function readFile(file) {
    return await fetch(file)
        .then(response => response.text())
        .then(text => text)
}

/**
 * Gets token from api.key
 * @returns {string} Token
 */
async function getToken() {
    let response = await readFile('../api.key');
    return response;
}

/**
 * Checks if user exists
 * @param {string} user Username
 * @returns {boolean} True / False
 */
async function isUserValid(user) {
    return await fetch('https://api.github.com/users/' + user, { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() } })
        .then(result => result.json())
        .then(data => data.message !== 'Not Found');
}

/**
 * Gets all repositories for specified user
 * @param {string} user Username
 * @returns {JSON[]} Array of repositories as JSON objects
 */
async function getRepositories(user) {
    return await fetch('https://api.github.com/users/' + user + '/repos', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() } })
        .then(result => result.json())
        .then(data => data);
}

/**
 * Gets all forks for specified repository
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {JSON[]} Array of repositories as JSON objects
 */
async function getForks(user, repository) {
    return await fetch('https://api.github.com/repos/' + user + '/' + repository + '/forks', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }})
        .then(result => result.json())
        .then(data => data);
}

/**
 * Checks if specified repository contains .manifest.json
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {boolean} True / False
 */
async function containsManifest(user, repository) {
    return await fetch('https://api.github.com/repos/' + user + '/' + repository + '/contents', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }})
        .then(result => result.json())
        .then(data => data.filter(file => file.name === '.manifest.json').length !== 0);
}

/**
 * Get manifest file contents
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {JSON} Manifest as JSON object
 */
async function getManifest(user, repository) {
    let response = await fetch('https://api.github.com/repos/' + user + '/' + repository + '/contents', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }});
    let json = await response.json();
    let info = json.filter(file => file.name === '.manifest.json')[0];

    response = await fetch(info.url, { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }});
    json = await response.json();
    return JSON.parse(atob(json.content.replace(/(\r\n|\n|\r)/gm, '')));
}