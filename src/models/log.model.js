import colors from 'colors';

function Log(text, title, isError=false) {
  this.text = text;
  this.title = title;


  (function print() {
    function formatPrint(str) {
      console.log(`MZ: ${str}`);
    }

    switch(process.env.MZ_LOG_LEVEL) {
      case 'DEBUG':
        if (isError) {
          formatPrint(`${this.title}`.red);
          formatPrint(`${this.text}`.gray);
        } else {
          formatPrint(`${this.title}`.cyan);
          formatPrint(`${this.text}`.dim);
        }
        break;
      
      default:
        break;
    }
  })();
}

Log.prototype = Object.create(Log.prototype);
Log.prototype.constructor = Log;

module.exports = Log;
