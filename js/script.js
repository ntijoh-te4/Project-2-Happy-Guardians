import("./api.js");
const body = document.querySelector("body")
const box = document.querySelector(".row")
const input = document.querySelector("input")

window.onload = (event) => {
    showIndex();
};

function showIndex() {
    box.innerHTML = '';
    const template = document.querySelector('.index');
    const clone = template.content.cloneNode(true);
    box.append(clone);
}

function showError() {
    box.innerHTML = '';
    const template = document.querySelector('.user-error');
    const clone = template.content.cloneNode(true);
    box.append(clone);
}

async function loopRepos(username) {
    box.innerHTML = '';
    let result;
    await getRepositories(username).then((res) => result = res)       
    const template = document.querySelector(".repos");
    result.forEach(element => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card-title").textContent = element.name;
        clone.querySelector(".fork-count").textContent = element.forks_count;
        clone.querySelector(".git-link").href = element.clone_url;
        box.appendChild(clone);
    });
}

async function loopForks(username, repository) {
    box.innerHTML = '';
    let result;
    await getForks(username, repository).then((res) => result = res);   
    const template = document.querySelector(".forks");
    result.forEach(element => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card-title").textContent = element.full_name;
        clone.querySelector(".git-link").href = element.clone_url;
        console.log(element);
        box.appendChild(clone);
    });  
}

input.addEventListener('input', async (e) => {
    box.innerHTML = '';
    if (await isUserValid(input.value)) loopRepos(input.value);
    else if (input.value === "") showIndex();
    else showError();
});

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