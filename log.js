 var winston = require('winston');
 var logger = new(winston.Logger)({
     transports: [
      new(winston.transports.Console)(),
      new(winston.transports.File)({
             format: '%m',
             filename: '1.csv',
             json: false,
             formatter: formatter

         })
    ]
 });

 function formatter(args) {
     var logMessage = args.message;
     return logMessage;
 }

 logger.log('info', 'Hello distributed log files!');
 logger.info('Hello again distributed logs');