//index.ts
const userProfileFunctions = require('./libraries/user-profile-component/user-profile-form-template.js');
const userProfileSummaryFunctions = require('./libraries/user-profile-component/user-profile-summary-template.js');
const financialProfileSummaryFunctions = require('./libraries/financial-profile-componenet/financial-profile-summary-template.js');
const buttonGroupFunctions = require('./libraries/template-componenet/button-group-template.js');

exports.getDataByComponentId = id => {
  switch (id) {
    case "user-profile-form-template":
      return userProfileFunctions;
    case "user-profile-summary-template":
      return userProfileSummaryFunctions;
    case "financial-profile-summary-template":
      return financialProfileSummaryFunctions;
    case "button-group-template":
      return buttonGroupFunctions;
    default:
      break;
  }
};
