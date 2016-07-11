'use babel';

import GitLineView from './git-line-view';
import { CompositeDisposable } from 'atom';

export default {

  gitLineView: null,
  subscriptions: null,

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
      const exec = require('child_process').exec;
      const filePath = editor.buffer.file.path;
      const command = `git blame ${filePath} --line-porcelain -L ${editor.getCursorBufferPosition().row + 1},+1`;
      exec(command, { cwd: require('path').dirname(filePath) }, (error, stdout, stderr) => {
        if (error) return console.error(`exec error: ${error}`);
        // console.log(`stdout: ${stdout}\n\nstderr: ${stderr}`);

        // build an object of the parsed git blame output
        const parser = require('./output-parser');
        var output = this.parseOutput(stdout);

        // immediately show the tooltip on the line number
        this.gitLineView.show(
          editorView.querySelector('body /deep/ .line-number.cursor-line'),
          output.author + ' ' + output.
        );
      });
    }
  }
};
