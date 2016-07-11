'use babel';

export default class GitLineTooltip {

  constructor(serializedState) {
    this.offset = 0;
    this.element = null;
    this.tooltip = null;
    this.scrollWatcher = null;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.hide();
    //this.element.remove();
    this.element = null;
  }

  show(target, title) {
    // add a tooltip to the screen, around the target element,
    // which is a line number element
    this.tooltip = atom.tooltips.add(target, {
      title,
      trigger: 'manual'
    });

    const editor = atom.workspace.getActiveTextEditor(),
          editorView = atom.views.getView(editor);

    // it is convenient for us to grab the actual tooltip element
    // after it is displayed, because we must update its position on scrolling.
    // to make this updating fast, we don't want to keep querying for .tooltip
    this.element = document.body.querySelector('.tooltip');
    this.offset = editorView.getScrollTop() + parseFloat(this.element.style.top.replace('px', ''));

    // we must manually push the tooltip around
    // as the code editor actually scrolls via translate3d css transform
    // which screws up our tooltip's ability to move with its target in the usual browsery way
    this.scrollWatcher = editorView.onDidChangeScrollTop(o => {
      let diff = this.offset - o;
      this.element.style.top = diff + 'px';
    });
  }

  hide() {
    // hide our tooltip and null out the reference
    if (this.tooltip) this.tooltip.dispose();
    this.tooltip = null;

    // unhook the the scroll event handler
    if (this.scrollWatcher) this.scrollWatcher.dispose();
    this.scrollWatcher = null;
  }

  isVisible() {
    return this.tooltip != null;
  }
}
