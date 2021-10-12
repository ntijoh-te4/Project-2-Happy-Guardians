async function getToken() {
    let token = '';
    const file = new XMLHttpRequest();
    await file.open('GET', '../api.key', false)
    file.onreadystatechange = function () {
        if(file.readyState === 4 && file.status === 200 || file.status == 0) {
            token = file.responseText;
        }
    }
    file.send(null);
    return token;
}

async function getRepositories(user) {
    return await fetch('https://api.github.com/users/' + user + '/repos', { method: 'GET', headers: { 'Authorization': 'token ' + await getToken() } })
        .then(result => result.json())
        .then(data => data);
}
