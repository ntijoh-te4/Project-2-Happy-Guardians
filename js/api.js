async function readFile(file) {
    return await fetch(file)
        .then(response => response.text())
        .then(text => text)
}

async function getToken() {
    let response = await readFile('../api.key');
    return response;
}

async function isUserValid(user) {
    return await fetch('https://api.github.com/users/' + user, { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() } })
        .then(result => result.json())
        .then(data => data.message !== 'Not Found');
}

async function getRepositories(user) {
    return await fetch('https://api.github.com/users/' + user + '/repos', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() } })
        .then(result => result.json())
        .then(data => data);
}

async function getForks(user, repository) {
    return await fetch('https://api.github.com/repos/' + user + '/' + repository + '/forks', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }})
        .then(result => result.json())
        .then(data => data);
}

async function containsManifest(user, repository) {
    return await fetch('https://api.github.com/repos/' + user + '/' + repository + '/contents', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }})
        .then(result => result.json())
        .then(data => data.filter(file => file.name === '.manifest.json').length !== 0);
}

/*
 * Fungerar inte för tillfället, problem uppstår på andra förfrågningen
 *
 * Access to fetch at 'https://api.github.com/repos/itggot-TE4/smallest_of_two/contents/.manifest.json?ref=master' from origin 'http://localhost:5500' has been blocked by CORS policy: 
 * Request header field access-control-allow-origin is not allowed by Access-Control-Allow-Headers in preflight response.
 * 
 * TODO: Ändra headers i preflight responsen
 */
async function getManifest(user, repository) {
    const manifestUrl = await fetch('https://api.github.com/repos/' + user + '/' + repository + '/contents', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }})
        .then(result => result.json())
        .then(data => data.filter(file => file.name === '.manifest.json')[0].url);
    console.log(manifestUrl);
    return await fetch(manifestUrl, { method: 'GET', headers: { 'Authorization': 'token ' + await getToken(), 'Access-Control-Allow-Origin': '*' }})
        .then(result => result.json())
        .then(data => data);
}