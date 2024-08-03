const { join } = require("path");
const download = require("./download.js");

module.exports = async ({ github, context, core, workspace }) => {
  const package = "sceneforge.tar.gz";

  const { data: { draft, prerelease, name, assets } } = await github.rest.repos.getLatestRelease({
    owner: context.repo.owner,
    repo: "sceneforge",
  });

  core.exportVariable('RELEASE_DRAFT', draft);
  console.log("DEBUG: RELEASE_DRAFT", draft);

  core.exportVariable('RELEASE_PRERELEASE', prerelease);
  console.log("DEBUG: RELEASE_PRERELEASE", prerelease);

  core.exportVariable('RELEASE_NAME', name);
  console.log("DEBUG: RELEASE_NAME", name);

  const artifact = assets.find(({ name }) => name === package)?.browser_download_url;

  core.exportVariable('RELEASE_ARTIFACT', artifact);
  console.log("DEBUG: RELEASE_ARTIFACT", artifact);

  if (artifact) {
    const result = await download(artifact, join(workspace, package));

    core.exportVariable('RELEASE_ARTIFACT_PATH', result.path);
    console.log("DEBUG: RELEASE_ARTIFACT_PATH", result.path);

    core.exportVariable('RELEASE_ARTIFACT_SIZE', result.size);
    console.log("DEBUG: RELEASE_ARTIFACT_SIZE", result.size);

    core.exportVariable('RELEASE_ARTIFACT_BASENAME', result.basename);
    console.log("DEBUG: RELEASE_ARTIFACT_BASENAME", result.basename);

    core.exportVariable('RELEASE_ARTIFACT_FILENAME', result.filename);
    console.log("DEBUG: RELEASE_ARTIFACT_FILENAME", result.filename);
  }
};
