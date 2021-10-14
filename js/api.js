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

async function getManifest(user, repository) {
    let response = await fetch('https://api.github.com/repos/' + user + '/' + repository + '/contents', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }});
    let json = await response.json();
    let info = json.filter(file => file.name === '.manifest.json')[0];

    response = await fetch(info.url, { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() }});
    json = await response.json();
    return JSON.parse(atob(json.content.replace(/(\r\n|\n|\r)/gm, '')));
}