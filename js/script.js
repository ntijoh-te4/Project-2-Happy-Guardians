/* eslint-disable no-undef */
// eslint-disable-next-line import/extensions
import('./api.js');
const body = document.querySelector('body');
const box = document.querySelector('.row');
const searchInput = document.querySelector('input');
const form = document.querySelector('form#form');

/**
 * Displays index-page
 */
function showIndex() {
  box.innerHTML = '';

  const templateIndex = document.querySelector('.index');
  const cloneIndex = templateIndex.content.cloneNode(true);

  box.append(cloneIndex);
}

/**
 * Displays errormessage according to param
 * @param {string} errorMessage The error being displayed
 */
function showError(errorMessage) {
  box.innerHTML = '';

  const templateError = document.querySelector('.user-error');
  const cloneError = templateError.content.cloneNode(true);

  cloneError.querySelector('h3').textContent = errorMessage;

  box.append(cloneError);
}

/**
 * Displays repos of user containing .manifest.json
 * @param {string} username GitHub username
 */
// TODO: Ta bort att manifest-erroret visas någon millisekund innan resultatet
async function loopRepos(username) {
  box.innerHTML = '';

  const templateRepos = document.querySelector('.repos');
  const reposResult = await getRepositories(username);

  showError('No manifest.');

  await reposResult.forEach(async (repo) => {
    if (await containsManifest(username, repo.name)) {
      box.innerHTML = '';

      const cloneRepo = templateRepos.content.cloneNode(true);

      cloneRepo.querySelector('.card-title').textContent = repo.name;
      cloneRepo.querySelector('.fork-count').textContent = repo.forks_count;
      cloneRepo.querySelector('.git-link').href = repo.clone_url;

      box.appendChild(cloneRepo);
    }
  });
}

/**
 * Displays forks of a users repo if they contain manifest.json
 * @param {String} username GitHub username
 * @param {String} repository Repository name
 */
async function loopForks(username, repository) {
  box.innerHTML = '';

  const result = await getForks(username, repository);
  const templateFork = document.querySelector('.forks');

  await result.forEach(async (element) => {
    if (await containsManifest(username, element.name)) {
      const cloneFork = templateFork.content.cloneNode(true);

      cloneFork.querySelector('.card-title').textContent = element.full_name;
      cloneFork.querySelector('.git-link').href = element.clone_url;

      if (containsAssignmentSolution(element.owner.login, element.name)) {
        const studentCode = await getAssignmentSolution(element.owner.login, element.name);

        cloneFork.querySelector('code.javascript').textContent = studentCode;
        hljs.highlightElement(cloneFork.querySelector('code.javascript'));

        const testResults = await getAssignmentTests(element.owner.login, element.name);
        const testElement = cloneFork.querySelector('.tests');

        if (testResults.length !== 0) {
          testResults.forEach((test) => {
            const testRow = document.createElement('p');
            let message;

            if (Object.values(test)[0]) message = 'Passed';
            else message = 'Failed';
            testRow.textContent = `${Object.keys(test)[0]}: ${message}`;

            testElement.appendChild(testRow);
          });
        } else {
          const errorRow = document.createElement('p');

          errorRow.textContent = 'Unable to test assignment.';

          testElement.appendChild(errorRow);
        }
      }

      box.appendChild(cloneFork);
    }
  });
}

/**
 * Displays index-page on every reload
 */
window.onload = () => {
  showIndex();
};

/**
 * Displays index if search input is empty
 */
searchInput.addEventListener('input', () => { if (searchInput.value === '') showIndex(); });

/**
 * Searches after inputted user, displays the repos if user exists, otherwise an error message
 */
form.addEventListener('submit', async (event) => {
  box.innerHTML = '';
  event.preventDefault();

  if (await isUserValid(searchInput.value)) loopRepos(searchInput.value);
  else showError('Invalid username.');
});

/**
 * Listens after clicks on certain elements
 */
body.addEventListener('click', (event) => {
  let repoName;

  switch (event.target.className) {
    case 'material-icons clear':
      searchInput.value = '';
      showIndex();
      break;

    case 'fork-link orange-text':
      repoName = event.target.parentElement.parentElement.parentElement.querySelector('.card-title').textContent;
      loopForks(searchInput.value, repoName);
      break;

    default:
      break;
  }
});
