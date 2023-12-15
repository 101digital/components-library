//index.ts
const loginWithEmailTemplateFunctions = require('./libraries/user-authentication-component/user-authentication-with-email-template.js');
const userProfileFunctions = require('./libraries/user-profile-component/user-profile-form-template.js');
const userProfileSummaryFunctions = require('./libraries/user-profile-component/user-profile-summary-template.js');
const financialProfileSummaryFunctions = require('./libraries/financial-profile-componenet/financial-profile-summary-template.js');
const buttonGroupFunctions = require('./libraries/template-componenet/button-group-template.js');
const loyaltyProfileCardFunctions = require('./libraries/loyalty-profile-componenet/loyalty-profile-card-template.js');
const settingsWithUserDetailsFunctions = require('./libraries/user-profile-component/user-settings-template.js');
const progressCirlcleFunctions = require('./libraries/deposit-component/progress-circle-component');
const accountAddFundsFunctions = require('./libraries/financial-profile-componenet/account-add-funds-template');

exports.getDataByComponentId = id => {
  switch (id) {
    case "user-profile-form-template":
      return userProfileFunctions;
    case "user-profile-summary-template":
      return userProfileSummaryFunctions;
    case "financial-profile-summary-template":
      return financialProfileSummaryFunctions;
    case "loyalty-profile-card-template":
      return loyaltyProfileCardFunctions;
    case "button-group-template":
      return buttonGroupFunctions;
    case "login-with-email-template":
      return loginWithEmailTemplateFunctions;
    case "settings-with-user-details-template":
      return settingsWithUserDetailsFunctions;
    case "progress-circle-template":
      return progressCirlcleFunctions;
    case "account-add-funds-template":
      return accountAddFundsFunctions

    default:
      break;
  }
};
