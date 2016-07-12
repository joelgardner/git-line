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

    // subscribe to any events that should hide the tooltip
    const events = ['click', 'keypress'];
    events.forEach(eventType => {
      document.addEventListener(eventType, handleDismissal);
    });

    // handler for clicks or keypresses
    const handleDismissal = e => {

      // if we clicked the github link on the tooltip itself, leave it displayed
      if (e.target.className === 'git-line-github-link') return;

      // hide the tooltip and unhook our dismissal event listeners
      this.hide();
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleDismissal);
      });
    }

  }

  hide() {
    this.destroy();
  }

  isVisible() {
    return this.tooltipView.isVisible();
  }

}
