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

    // any click (unless it is inside the tooltip), pane change, keypress
    this.hookupDismissalTrigger();
  }

  hookupDismissalTrigger() {

    var dismissTooltip = e => {
      if (e.target.className === 'git-line-github-link') return;
      this.hide();
      document.removeEventListener('click', dismissTooltip);
      document.removeEventListener('keypress', dismissTooltip);
    }
    document.addEventListener('click', dismissTooltip);
    document.addEventListener('keypress', dismissTooltip);
  }


  hide() {
    this.destroy();
  }

  isVisible() {
    return this.tooltipView.isVisible();
  }

}
