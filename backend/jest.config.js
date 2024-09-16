/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  verbose: true,
  forceExit: true,
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};

module.exports = config;
