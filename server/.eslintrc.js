const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  rules: {
    "import/prefer-default-export": OFF
  }
};