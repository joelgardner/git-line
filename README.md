# git-line package

An Atom package that displays `git blame` information about the currently selected line.

### Usage
Use the keyboard combo `ctrl+alt+cmd+b` to activate a tooltip anchored on the line number in the gutter.  If you do not have line numbers enabled, the tooltip will display in the very top right of the Atom window.  If the line is part of a pushed commit, you may follow a link to view it on Github.

### Issues
- When the cursored line is scrolled offscreen (i.e., not visible), no tooltip will appear.  Future plans to fix could be to place the tooltip in a position with its anchor-arrow indicating the line is above or below the visible lines.

### Demo
![Yay](http://i.giphy.com/ZsScWCgdmeSk0.gif "ctrl+alt+cmd+b")
[View demo video](https://www.youtube.com/watch?v=UIL7kGqO0ZM) (turning on CC is helpful)

#### Atom package
[https://atom.io/packages/git-line](https://atom.io/packages/git-line)

#### Changes
- 0.5.0
 - Fixed issue for Bitbucket repos where the host text is "Github", and opens an incorrect commit URL on Bitbucket
- 0.4.0
 - Fixed bug that displayed git error when a file was untracked by git
 - Fixed bug with ssh-cloned repos where Github link was unresponsive
 - Fixed bug causing error when the project is not a git repo
