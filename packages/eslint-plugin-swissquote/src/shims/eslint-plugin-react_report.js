'use strict';

// Replacing https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/util/report.js
// as it's depending on semver and doing a version check on a
// very old version of ESLint that we 100% certainly don't have


module.exports = function report(context, message, messageId, data) {
  context.report(
    Object.assign(
      messageId ? { messageId } : { message },
      data
    )
  );
};
