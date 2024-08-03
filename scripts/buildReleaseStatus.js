const { writeFile } = require('fs/promises');
const { join } = require('path');

module.exports = async ({ workspace, path }) => {
  const status = JSON.stringify({
    draft: process.env.RELEASE_DRAFT,
    prerelease: process.env.RELEASE_PRERELEASE,
    name: process.env.RELEASE_NAME,
    timestamp: new Date().toISOString(),
  }, null, 2);

  return await writeFile(join(workspace, path, 'release-status.json'), status, {
    encoding: 'utf8',
    flag: 'w',
  });
};
