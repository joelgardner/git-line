'use babel';

import GitLineView from './git-line-view';
import { CompositeDisposable } from 'atom';
import moment from 'moment';
import parser from './output-parser';
import Path from 'path';
import { exec } from 'child_process';

export default {

  gitLineView: null,
  subscriptions: null,
  githubUrl: getGithubUrl(),

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
        if (error) return console.error(`exec error: ${error}`);
        // console.log(`stdout: ${stdout}\n\nstderr: ${stderr}`);

        // immediately show the tooltip on the line number
        this.gitLineView.show(
          editorView.querySelector('body /deep/ .line-number.cursor-line'),
          this.message(parser.parseOutput(stdout))
        );
      });
    }
  },

  message(output) {
    let msg = `${output.author}, ${moment(output.commitDate).fromNow()}.`;
    if (output.author !== 'Not Committed Yet') msg += ` View on <a target="_blank" href="${this.githubUrl}/commit/${output.hash}">Github</a>.`;
    return msg;
  }
};

function getGithubUrl() {
  const git = atom.project.getRepositories()[0];
  return git.getOriginURL().replace('.git', '');
}
