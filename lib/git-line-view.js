'use babel';

import GitLineTooltipView from './git-line-tooltip-view';

export default class GitLineView {

  constructor(serializedState) {
    // create our view
    this.tooltipView = new GitLineTooltipView(serializedState);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.tooltipView.destroy();
  }

  show(target, title) {
    this.tooltipView.show(target, title);
  }

  hide() {
    this.destroy();
  }

  isVisible() {
    return this.tooltipView.isVisible();
  }

}
