const _ = require("lodash");

const paragraphFormater = (description) => {
  description = description.trim();

  return description
    .toLowerCase()
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => _.capitalize(sentence.trim()))
    .join(" ");
};

const sentenceFormater = (sentence) => {
  sentence = sentence.trim();
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

module.exports = { paragraphFormater, sentenceFormater };
