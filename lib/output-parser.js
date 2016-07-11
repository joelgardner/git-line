'use babel';

import GitLineView from './git-line-view';
import { CompositeDisposable } from 'atom';

export default {

  parseOutput (stdout) {
    const lines = stdout.split('\n');
    return {
      author: this.parseAuthor(lines[1]),
      email: this.parseAuthorEmail(lines[2]),
      commitDate: this.parseCommitDatetime(lines[3]),
      timezone: this.parseTimezone(lines[4])
    }
  },

  parseAuthor(line) {
    return line.split('author ')[1];
  },

  parseAuthorEmail(line) {
    return line.split('author-mail ')[1].replace(/<|>/g);
  },

  parseCommitDatetime(line) {
    // it seems like git blame's date output removes trailing zeros
    // which means we end up with dates like Jan 1 1974
    // unless we pad zeros up to 13 characters
    let millis = line.split('author-time ')[1];
    while(millis.length < 13) millis += '0';
    return new Date(parseInt(millis)).toLocaleString();
  },

  parseTimezone(line) {
    return line.split('author-tz ')[1];
  }
}
