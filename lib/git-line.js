'use babel';

import GitLineView from './git-line-view';
import { CompositeDisposable } from 'atom';

export default {

  gitLineView: null,
  modalPanel: null,
  subscriptions: null,
  toolTipDisposable: null,
  scrollWatcher: null,
  tipEl: null,
  offset: 0,

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
    this.scrollWatcher.dispose();
    this.toolTipDisposable.dispose();
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
    if (this.toolTipDisposable) {
      this.toolTipDisposable.dispose();
      this.toolTipDisposable = null;
      this.scrollWatcher.dispose();
      this.scrollWatcher = null;
    }
    else {
      const editor = atom.workspace.getActiveTextEditor(),
            editorView = atom.views.getView(editor),
            lineNumberEl = editorView.querySelector('body /deep/ .line-number.cursor-line');

      // we must manually push the tooltip around
      // as the code editor actually scrolls via translate3d css transform
      // which screws up our tooltip's ability to move with its target
      this.scrollWatcher = editorView.onDidChangeScrollTop(o => {
        let diff = this.offset - o;
        this.tipEl.style.top = diff + 'px';
      });

      // create and immediately display our tooltip
      this.toolTipDisposable = atom.tooltips.add(lineNumberEl, {
        title: 'Written by Joel DerpmcGerpSplerpMan100, 4 days ago',
        trigger: 'manual',
        placement: 'right'
      });

      // we need to get the offset of the tooltip from the top of the window
      // but we don't know it until it's actually in the DOM
      // so grab it now and get its value for top, this is how we'll keep
      // it scrolling with the editor/gutter
      // TODO: make this better and stop cheating (look to see how Tooltip.js lays it out)
      this.tipEl = document.body.querySelector('.tooltip');
      this.offset = editorView.getScrollTop() + parseFloat(this.tipEl.style.top.replace('px', ''));
    }

    return null;
  }

};
