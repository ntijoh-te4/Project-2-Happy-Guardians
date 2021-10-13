var promise = import("./api.js");
const box = document.querySelector(".row")

window.onload = (event) => {
    const template = document.querySelector('.index')
    const clone = template.content.cloneNode(true);
    box.append(clone);
};

async function loopRepos() {
    let result;
    await getRepositories("olantig").then((res) => result = res)       
    const template = document.querySelector(".repos");
    result.forEach(element => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card-title").textContent = element.name;
        clone.querySelector(".fork-count").textContent = element.forks_count;
        console.log(element);
        box.appendChild(clone);
    });
}
