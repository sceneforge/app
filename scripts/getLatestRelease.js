export default async ({ github, context, core }) => {
  const download = import(`${github.workspace}/scripts/download.js`);

  const package = 'sceneforge.tar.gz';

  const { data: { draft, prerelease, name, assets } } = await github.rest.repos.getLatestRelease({
    owner: context.repo.owner,
    repo: "sceneforge",
  });

  core.exportVariable('draft', draft);
  core.exportVariable('prerelease', prerelease);

  core.exportVariable('name', name);

  const artifact = assets.find(({ name }) => name === package)?.browser_download_url;

  core.exportVariable('artifact', artifact);

  if (artifact) {
    const result = await download(artifact?.browser_download_url, package);
  }

  console.log("DEBUG: draft", draft);
  console.log("DEBUG: prerelease", prerelease);
  console.log("DEBUG: name", name);
  console.log("DEBUG: artifact", artifact);
  console.log("DEBUG: result", result);
};
