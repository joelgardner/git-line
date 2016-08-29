'use babel';

export default {

  parseOutput (stdout) {
    const lines = stdout.split('\n');
    return {
      hash: this.parseCommitHash(lines[0]),
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
    // git blame's date output needs some extra 0s on the end to make JS dates happy.
    // otherwise, we end up with dates like Jan 1 1974
    let millis = line.split('author-time ')[1];
    while(millis.length < 13) {
      millis += '0';
    }
    return new Date(parseInt(millis));
  },

  parseTimezone(line) {
    return line.split('author-tz ')[1];
  },

  parseCommitHash(line) {
    return line.split(' ')[0];
  }
}
