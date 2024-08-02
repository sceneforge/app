module.exports = async ({ github, context, core }) => {
  const { data: { draft, prerelease, name, assets } } = await github.rest.repos.getLatestRelease({
    owner: context.repo.owner,
    repo: "sceneforge",
  });
  core.exportVariable('draft', draft);
  core.exportVariable('prerelease', prerelease);
  core.exportVariable('name', name);
  const artifact = assets.find(({ name }) => name === 'sceneforge.tar.gz');
  core.exportVariable('artifact', artifact?.browser_download_url);
};
