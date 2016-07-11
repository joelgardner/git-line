'use babel';

import GitLineView from './git-line-view';
import { CompositeDisposable } from 'atom';

export default {

  parseAuthor(line) {
    return line.split('author ')[1];
  }

  parseAuthorEmail(line) {
    return line.split('author-mail ')[1].replace(/<|>/g);
  }

  parseCommitDate(line) {
    const date = new Date() + parseInt(line.split('author-time ')[1]);
    return date.toLocalString();
  }

  parseTimezone(line) {
    return .split('author-tz ')[1]
  }
}
