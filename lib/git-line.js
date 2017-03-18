'use babel';

import GitLineView from './git-line-view';
import { CompositeDisposable } from 'atom';
import moment from 'moment';
import parser from './output-parser';
import Path from 'path';
import { exec } from 'child_process';
import { parseHttpUrl, errorIsFatal } from './repo';

export default {

  gitLineView: null,
  subscriptions: null,
  githubUrl: parseHttpUrl(),

  activate(state) {
    this.gitLineView = new GitLineView(state.gitLineViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-line:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.gitLineView.destroy();
  },

  serialize() {
    return {
      gitLineViewState: this.gitLineView.serialize()
    };
  },

  toggle() {

    // if we have a current disposable, dispose it
    if (this.gitLineView.isVisible()) {
      this.gitLineView.hide();
    }
    else {
      const editor = atom.workspace.getActiveTextEditor(),
            editorView = atom.views.getView(editor);

      // use child_process to call out to git and get the git blame info for this line.
      const filePath = editor.buffer.file.path;
      const cmdText = `git blame ${filePath} --line-porcelain -L ${editor.getCursorBufferPosition().row + 1},+1`;
      exec(cmdText, { cwd: Path.dirname(filePath) }, (error, stdout, stderr) => {

        if (errorIsFatal(error)) {
          return console.error(`exec error: ${error}`);
        }

        // TODO: if the currently selected line is not on the screen (ie it's scrolled offscreen),
        // we can only cry and shake our fists for now.  fix it maybe by adding the tooltip
        // to the bottom or top of the gutter to indicate that it is scrolled away
        const lineNumberEl =  editorView.querySelector('body /deep/ .line-number.cursor-line');
        if (!lineNumberEl) return;

        // immediately show the tooltip on the line number
        this.gitLineView.show(
          lineNumberEl,

          // if the output was an error, we're guaranteed that it's because
          // this file isn't tracked in git yet, so just say that
          error ? 'This file is yet not tracked.' : this.message(parser.parseOutput(stdout))
        );
      });
    }
  },

  message(output) {
    let msg = `${output.author}, ${moment(output.commitDate).fromNow()}.`;
    const isGithub = this.githubUrl.indexOf('github') !== -1;
    const commit = isGithub ? 'commit' : 'commits';
    const serviceName = isGithub ? 'Github' : 'Web';

    return (
      output.author === 'Not Committed Yet'
        ? msg
        : msg + ` View on <a target="_blank" class="git-line-github-link" rel="noopener noreferrer" href="${this.githubUrl}/${commit}/${output.hash}">${serviceName}</a>.`
    );
  }

};
