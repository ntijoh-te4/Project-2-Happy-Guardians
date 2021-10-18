/* eslint-disable no-unused-vars */
/**
 * Gets file contents
 * @param {string} file File path
 * @returns {string} File contents
 */
async function readFile(file) {
  const result = await fetch(file);
  return result.text();
}

/**
 * Gets token from api.key
 * @returns {string} Token
 */
async function getToken() {
  return readFile('../api.key');
}

/**
 * Checks if user exists
 * @param {string} user Username
 * @returns {boolean} True / False
 */
async function isUserValid(user) {
  const response = await fetch(`https://api.github.com/users/${user}`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  return response.ok;
}

/**
 * Gets all repositories for specified user
 * @param {string} user Username
 * @returns {JSON[]} Array of repositories as JSON objects
 */
async function getRepositories(user) {
  const result = await fetch(`https://api.github.com/users/${user}/repos`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  return result.json();
}

/**
 * Gets all forks for specified repository
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {JSON[]} Array of repositories as JSON objects
 */
async function getForks(user, repository) {
  const result = await fetch(`https://api.github.com/repos/${user}/${repository}/forks`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  return result.json();
}

/**
 * Checks if specified repository contains .manifest.json
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {boolean} True / False
 */
async function containsManifest(user, repository) {
  const result = await fetch(`https://api.github.com/repos/${user}/${repository}/contents`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  const json = await result.json();
  return json.filter((file) => file.name === '.manifest.json').length !== 0;
}

/**
 * Get manifest file contents
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {JSON} Manifest as JSON object
 */
async function getManifest(user, repository) {
  let response = await fetch(`https://api.github.com/repos/${user}/${repository}/contents`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  let json = await response.json();
  const info = json.filter((file) => file.name === '.manifest.json')[0];

  response = await fetch(info.url, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  json = await response.json();
  return JSON.parse(atob(json.content.replace(/(\r\n|\n|\r)/gm, '')));
}

/**
 * Checks if specified repository contains solution file
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {boolean} True / False
 */
async function containsAssignmentSolution(user, repository) {
  const manifest = await getManifest(user, repository);

  const response = await fetch(`https://api.github.com/repos/${user}/${repository}/contents/${manifest.filePath}?ref=master`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  return response.ok;
}

/**
 * Gets assignment solution from specified repository
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {string} Assignment solution as string
 */
async function getAssignmentSolution(user, repository) {
  const manifest = await getManifest(user, repository);

  const response = await fetch(`https://api.github.com/repos/${user}/${repository}/contents/${manifest.filePath}?ref=master`, { method: 'GET', headers: { Authorization: `token ${await getToken()}` } });
  const json = await response.json();
  return atob(json.content.replace(/(\r\n|\n|\r)/gm, ''));
}

/**
 * Runs all tests for specified repository
 * @param {string} user Repository owner
 * @param {string} repository Repository name
 * @returns {JSON} JSON containing test names paired with a boolean based on if the test passed
 */
async function getAssignmentTests(user, repository) {
  const result = [];
  const manifest = await getManifest(user, repository);
  const solution = await getAssignmentSolution(user, repository);

  manifest.tests.forEach(async (test) => {
    const args = test.arguments.join(', ');
    // eslint-disable-next-line no-eval
    result.push(JSON.parse(`{"${test.description}":${await eval(`${solution}${manifest.functionName}(${args}) === ${test.expected};`)}}`));
  });

  return result;
}
