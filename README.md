# git-line package

An Atom package that displays `git blame` information about the currently selected line.

Use the keyboard combo `ctrl+alt+cmd+b` to activate a tooltip anchored on the line number in the gutter.  If you do not have line numbers enabled, the tooltip will display in the very top right of the Atom window.

Issues:
- When the cursored line is scrolled offscreen (i.e., not visible), no tooltip will appear.  Future plans to fix could be to place the tooltip in a position with its anchor-arrow indicating the line is above or below the visible lines.

![TODO: add a screenshot](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
