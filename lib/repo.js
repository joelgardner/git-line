'use babel';

export default {
  parseHttpUrl() {
    const repos = atom.project.getRepositories();

    // if this isn't a repo, i'm just gonna die
    if (!repos || !repos.length || !repos[0]) {
      console.log("git-line: Unable to get origin, is this actually a git repo?");
      return;
    }

    // ask atom for the repo url
    let origin = repos[0].getOriginURL();
    if (!origin) return;

    // if this is ssh-cloned, remove the ssh creds
    if (origin.indexOf('https://') === -1) {
      origin = 'https://' + origin.replace('git@', '').replace(':', '/');
    }

    // at this point we know the URL is valid for both https and ssh cloned repos
    const originUrl = origin.replace('.git', '');

    // check the origin's host.  if bitbucket, we have some formatting to do
    if (originUrl.indexOf('@bitbucket') !== -1) {
      // we want everything after the @
      return "https://" + originUrl.split('@')[1];
    }

    // github is easy: its origins are of the form: https://github.com/joelgardner/git-line.git
    // so we only need to remove the .git, which we already did
    return originUrl;
  },

  errorIsFatal(error) {
    // it is not fatal, if the file isn't yet tracked by git
    // we can just say that in the tooltip.  any other errors, however, are fatal
    return error && error.message.indexOf('fatal: no such path') === -1;
  }
}
