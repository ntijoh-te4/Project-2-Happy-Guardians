async function readFile(file) {
    return await fetch(file)
        .then(response => response.text())
        .then(text => text)
}

async function getToken() {
    let response = await readFile('../api.key');
    return response;
}

async function getRepositories(user) {
    return await fetch('https://api.github.com/users/' + user + '/repos', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() } })
        .then(result => result.json())
        .then(data => data);
}