const config = require("config");
const bunyan = require("bunyan");
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: 'long' });
const formatErr = bformat({ outputMode: 'long' }, process.stderr);

const streams = [
  {
    stream: formatOut,
    level: config.get("logger.level") || "debug",
  },
  {
    stream: formatErr,
    level: "warn",
  },
];

if (config.get("logger.toFile")) {
  streams.push({
    level: config.get("logger.level") || "debug",
    path: config.get("logger.dirLogFile"),
  });
}

const logger = bunyan.createLogger({
  name: config.get("logger.name"),
  src: true,
  streams,
});

module.exports = logger;
