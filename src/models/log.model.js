import colors from 'colors';

function Log(text='', title='', isError=false) {
  (function print() {
    function formatPrint(str) {
      console.log(`MZ: ${str}`);
    }

    switch(process.env.MZ_LOG_LEVEL) {
      case 'DEBUG':
        if (isError) {
          formatPrint(`${title}`.red);
          formatPrint(`${text}`.gray);
        } else {
          if (title.length > 0) formatPrint(`${title}`.cyan);
          formatPrint(`${text}`.dim);
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
