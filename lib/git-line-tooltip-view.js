'use babel';

export default class GitLineTooltip {

  constructor(serializedState) {}

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.hide();
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  show(target, title) {
    // add a tooltip to the screen, around the target element,
    // which is a line number element
    this.tooltip = atom.tooltips.add(target, {
      title,
      trigger: 'manual'
    });

    // it is convenient for us to grab the actual tooltip element
    // after it is displayed, because we must update its position on scrolling.
    // to make this updating fast, we don't want to keep querying for .tooltip
    this.element = document.body.querySelector('.tooltip');
  }

  hide() {
    if (this.tooltip) this.tooltip.dispose();
    this.tooltip = null;
  }

  isVisible() {
    return this.tooltip != null;
  }
}
