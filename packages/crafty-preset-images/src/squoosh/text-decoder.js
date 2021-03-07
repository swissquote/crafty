module.exports = {
  TextDecoder:
    typeof TextDecoder !== "undefined"
      ? TextDecoder
      : require("util").TextDecoder
};
