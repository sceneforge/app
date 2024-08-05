module.exports = async ({ github, core }) => {
  const draft = process.env.RELEASE_DRAFT;
  const name = process.env.RELEASE_NAME;
  const prerelease = process.env.RELEASE_PRERELEASE;
  const artifact = process.env.RELEASE_ARTIFACT;

  const errors = [];

  if (draft !== "false" || draft !== false) {
    errors.push({
      title: "Draft release found",
      message: "Draft release found for the release",
    });
  }

  if (/^v([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(name) === false) {
    errors.push({
      title: "Invalid release name",
      message: "Release name must follow the semantic versioning format with no pre-release or build metadata",
    });
  }

  if (prerelease !== "false" || prerelease !== false) {
    errors.push({
      title: "Pre-release found",
      message: "Pre-release found for the release",
    });
  }

  if (artifact === undefined || artifact === null || artifact === "") {
    errors.push({
      title: "Artifact not found",
      message: "The release must have an artifact URL linked to it",
    });
  }

  try {
    const result = await fetch("https://app.sceneforge.org/.release-status.json");
    const currentReleaseStatus = await result.json();

    if (
      typeof currentReleaseStatus === "object"
      && currentReleaseState !== null
      && "name" in currentReleaseState
      && typeof currentReleaseState.name === "string"
    ) {
      if (currentReleaseState.name === name) {
        errors.push({
          title: "Already released",
          message: "The release has already been published",
        });
      }
    }
  } catch (error) {
    errors.push({
      title: "Current Release Status not found",
      message: `Unable to find the current release status: ${typeof error === "object" && "message" in error ? error.message : error}`,
    });
  }

  if (errors.length > 0) {
    core.summary.addHeading("Release validation failed", 2);

    for (const error of errors) {
      core.error(error.title);
      core.summary.addDetails(error.title, error.message);
    }

    core.summary.write();

    core.setFailed("Release validation failed");
  }
}