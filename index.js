//index.ts
const userProfileFunctions = require('./libraries/user-profile-component/user-profile-form-template.js');
const userProfileSummaryFunctions = require('./libraries/user-profile-component/user-profile-summary-template.js');
const financialProfileSummaryFunctions = require('./libraries/financial-profile-componenet/financial-profile-summary-template.js');

exports.getDataByComponentId = id => {
  switch (id) {
    case "user-profile-form-component":
      return userProfileFunctions;
    case "user-profile-summary-component":
      return userProfileSummaryFunctions;
    case "financial-profile-summary-component":
      return financialProfileSummaryFunctions;
    default:
      break;
  }
};
