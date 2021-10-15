/* eslint-disable no-undef */
// eslint-disable-next-line import/extensions
import('./api.js');
const body = document.querySelector('body');
const box = document.querySelector('.row');
const input = document.querySelector('input');
const form = document.querySelector('form#form');

function showIndex() {
  box.innerHTML = '';
  const template = document.querySelector('.index');
  const clone = template.content.cloneNode(true);
  box.append(clone);
}

window.onload = () => {
  showIndex();
};

function showError(errorMessage) {
  box.innerHTML = '';
  const template = document.querySelector('.user-error');
  const clone = template.content.cloneNode(true);
  clone.querySelector('h3').textContent = errorMessage;
  box.append(clone);
}

// TODO: Den visar manifest-erroret någon millisekund, ta bort det
async function loopRepos(username) {
  box.innerHTML = '';
  const template = document.querySelector('.repos');
  const result = await getRepositories(username);
  showError('No manifest.');
  await result.forEach(async (element) => {
    if (await containsManifest(username, element.name)) {
      box.innerHTML = '';
      const clone = template.content.cloneNode(true);
      clone.querySelector('.card-title').textContent = element.name;
      clone.querySelector('.fork-count').textContent = element.forks_count;
      clone.querySelector('.git-link').href = element.clone_url;
      box.appendChild(clone);
    }
  });
}

async function loopForks(username, repository) {
  box.innerHTML = '';
  let code;
  const result = await getForks(username, repository);
  const template = document.querySelector('.forks');
  await result.forEach(async (element) => {
    if (await containsManifest(username, element.name)) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.card-title').textContent = element.full_name;
      clone.querySelector('.git-link').href = element.clone_url;
      if (containsAssignmentSolution(element.owner.login, element.name)) {
        code = await getAssignmentSolution(element.owner.login, element.name);
        const codeEachLine = code.split('\n');
        codeEachLine.forEach((line) => {
          const row = document.createElement('p');
          row.innerHTML = line.replaceAll(' ', '&nbsp;');
          clone.querySelector('code').appendChild(row);
        });
      }
      const manifest = await getManifest(element.owner.login, element.name);
      await manifest.tests.forEach((test) => {
        const codeTests = clone.querySelector('.tests');
        const testRow = document.createElement('p');
        testRow.textContent = `Test "${test.description}":`; // TODO: passed or not
        codeTests.appendChild(testRow);
      });
      box.appendChild(clone);
    }
  });
}

form.addEventListener('submit', async (e) => {
  box.innerHTML = '';
  e.preventDefault();
  if (await isUserValid(input.value)) loopRepos(input.value);
  else showError('Invalid username.');
});

input.addEventListener('input', () => { if (input.value === '') showIndex(); });

body.addEventListener('click', (e) => {
  if (e.target.id === 'close') {
    input.value = '';
    showIndex();
  }
  if (e.target.className === 'fork-link orange-text') {
    const repoName = e.target.parentElement.parentElement.parentElement.querySelector('.card-title').textContent;
    loopForks(input.value, repoName);
  }
});
