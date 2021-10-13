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
        .then(data => data)
}

async function loopResult() {
    let result;
    await getRepositories("olantig").then((res) => result = res)       
    const template = document.querySelector(".repos");
    const box = document.querySelector(".row")
    result.forEach(element => {
        const clone = template.content.cloneNode(true);
        box.content = '';
        clone.querySelector(".card-title").textContent = element.name;
        clone.querySelector(".fork-count").textContent = element.forks_count;
        console.log(element);
        box.appendChild(clone);
    });
    return result;
}

console.log("connected")

console.log(getRepositories("ntijoh-nikki-andersson"));

console.log(loopResult());