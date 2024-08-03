const download = require("./download.js");

module.exports = async ({ github, context, core }) => {
  const package = "sceneforge.tar.gz";

  const { data: { draft, prerelease, name, assets } } = await github.rest.repos.getLatestRelease({
    owner: context.repo.owner,
    repo: "sceneforge",
  });

  core.exportVariable('draft', draft);
  core.exportVariable('prerelease', prerelease);

  console.log("DEBUG: draft", draft);
  console.log("DEBUG: prerelease", prerelease);

  core.exportVariable('name', name);

  console.log("DEBUG: name", name);

  const artifact = assets.find(({ name }) => name === package)?.browser_download_url;

  core.exportVariable('artifact', artifact);

  console.log("DEBUG: draft", draft);

  if (artifact) {
    const result = await download(artifact, package);

    core.exportVariable('artifact_path', result.path);
    core.exportVariable('artifact_size', result.size);
    core.exportVariable('artifact_basename', result.basename);
    core.exportVariable('artifact_filename', result.filename);

    console.log("DEBUG: artifact_path", result.path);
    console.log("DEBUG: artifact_size", result.size);
    console.log("DEBUG: artifact_basename", result.basename);
    console.log("DEBUG: artifact_filename", result.filename);
  }
};
