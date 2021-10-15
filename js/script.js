import("./api.js");
const body = document.querySelector("body")
const box = document.querySelector(".row")
const input = document.querySelector("input")
const form = document.querySelector("form#form")

window.onload = (event) => {
    showIndex();
};

function showIndex() {
    box.innerHTML = '';
    const template = document.querySelector('.index');
    const clone = template.content.cloneNode(true);
    box.append(clone);
}

function showError(error_message) {
    box.innerHTML = '';
    const template = document.querySelector('.user-error');
    const clone = template.content.cloneNode(true);
    clone.querySelector('h3').textContent = error_message;
    box.append(clone);
}

// TODO: Den visar manifest-erroret någon millisekund, ta bort det
async function loopRepos(username) {
    box.innerHTML = '';
    const template = document.querySelector(".repos");
    let result = await getRepositories(username);
    showError('No manifest.');
    await result.forEach(async element => {
        if (await containsManifest(username, element.name)) {
            console.log(element)
            box.innerHTML = '';
            const clone = template.content.cloneNode(true);
            clone.querySelector(".card-title").textContent = element.name;
            clone.querySelector(".fork-count").textContent = element.forks_count;
            clone.querySelector(".git-link").href = element.clone_url;
            box.appendChild(clone);
        }
    });
}

async function loopForks(username, repository) {
    box.innerHTML = '';
    let result = await getForks(username, repository); 
    const template = document.querySelector(".forks");
    await result.forEach(async element => {
        if (await containsManifest(username, element.name)) {
            const clone = template.content.cloneNode(true);
            clone.querySelector(".card-title").textContent = element.full_name;
            clone.querySelector(".git-link").href = element.clone_url;
            box.appendChild(clone);
        }
    });  
}

form.addEventListener('submit', async (e) => {
    box.innerHTML = '';
    e.preventDefault();
    if (await isUserValid(input.value)) loopRepos(input.value);
    else showError("Invalid username.");
});

input.addEventListener('input', (e) => {if (input.value === '') showIndex();});

body.addEventListener('click', (e) => {
    if (e.target.id === "close") {
        input.value = "";
        showIndex();
    }
    if (e.target.className === "fork-link orange-text") {
        const repoName = e.target.parentElement.parentElement.parentElement.querySelector(".card-title").textContent;
        loopForks(input.value, repoName);
        console.log("aa")
    }
});