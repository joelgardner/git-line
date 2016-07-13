'use babel';

export default {
  parseHttpUrl() {
    const repos = atom.project.getRepositories();

    // if this isn't a repo, i'm just gonna die
    if (!repos || !repos.length) {
      return;
    }

    // ask atom for the repo url
    let origin = repos[0].getOriginURL();
    if (!origin) return;

    // if this is ssh-cloned, remove the ssh creds
    if (origin.indexOf('https://') === -1) {
      origin = 'https://' + origin.replace('git@', '').replace(':', '/');
    }

    // always remove .git
    return origin.replace('.git', '');
  },

  errorIsFatal(error) {
    // it is not fatal, if the file isn't yet tracked by git
    // we can just say that in the tooltip.  any other errors, however, are fatal
    return error && error.message.indexOf('fatal: no such path') === -1;
  }
}
