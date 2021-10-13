import("./api.js");
const box = document.querySelector(".row")
const input = document.querySelector("input")

window.onload = (event) => {
    const template = document.querySelector('.index')
    const clone = template.content.cloneNode(true);
    box.append(clone);
};

async function loopRepos(username) {
    let result;
    await getRepositories(username).then((res) => result = res)       
    const template = document.querySelector(".repos");
    result.forEach(element => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card-title").textContent = element.name;
        clone.querySelector(".fork-count").textContent = element.forks_count;
        clone.querySelector(".git-link").href = element.clone_url;
        console.log(element);
        box.appendChild(clone);
    });
}

async function loopForks() {
    let result;
    await getForks("olantig", "wu1920-projekt2").then((res) => result = res);   
    const template = document.querySelector(".forks");
    result.forEach(element => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card-title").textContent = element.full_name;
        clone.querySelector(".git-link").href = element.clone_url;
        console.log(element);
        box.appendChild(clone);
    });  
}

input.addEventListener('input', (e) => {
    box.innerHTML = '';
    loopRepos(input.value)
});

box.addEventListener('click', (e) => {

});