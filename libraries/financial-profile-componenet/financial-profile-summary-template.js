// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import React, { useEffect } from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import { useWallet } from 'react-native-dashboard-component';
import useMergeStyles from './styles';
`;

// State Details
const StateDetails = `
  const styles = useMergeStyles();
  const { walletDetails, fetchWalletDetails, paging } = useWallet();
  const savingAccount = walletDetails?walletDetails.find((account) => account.bankAccount.accountSubType === 'SavingAccount-i'):null;
`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions =(initialValuesCode,functionCode) => `
  useEffect(() => {
    fetchWalletDetails(paging.pageNumber, paging.pageSize, 'DEPOSIT_WALLET');
  }, []);
`;

// Fields Components
const FieldsComponents =(detailsField) => `
// Your subtitle component code
const SubtitleComponent = ({ label }) => (
  <View style={styles.userInfo}>
    <Text style={styles.subtitle}>{label}</Text>
  </View>
);
`;


// Return Statement
const ReturnStatement = (fields,enableTranslation) => {
  const convertFieldName = (fieldName) => fieldName.replace(/[\[\]\.]/g, "_");
  let componentCode = `
    return (
      <View style={styles.container}>
        {/* Card Field: Total Balance and User Summary (showing only one item) */}
        <View style={styles.cardWrapper}>
          <View
            style={[
              styles.card,
              styles.activeCard,
            ]}
          >

  `;

  for (const fieldName in fields) {
    const field = fields[fieldName];

    switch (field.type) {
      case 'cardTitle':
        componentCode += `{/* ${field.type} - ${field.label} */}
        <View
          testID={'${field.type}-${fieldName}'}
        >
          <Text style={styles.title}>${field.label}</Text>
        </View>`;
        break;
      case 'currencyField':
        componentCode += `{/* ${field.type} - ${field.label} */}
        {<View>
            <Text style={styles.balance}>
              {savingAccount ? savingAccount.currencyCode+' ': 'SGD '}
              {savingAccount ? savingAccount.${fieldName}.toFixed(2) : '$0.00'}
            </Text>
          </View>}`;
        break;
      default:
        break;
    }
  }

  componentCode += `
          </View>
        </View>
    </View>);`;

  return componentCode;
};

const Styles = `
  import { defaultsDeep } from 'lodash';
  import { useContext } from 'react';
  import { StyleSheet } from 'react-native';
  import { ThemeContext } from 'react-native-theme-component';

  const useMergeStyles = (style?: SelectGenderModalStyles): SelectGenderModalStyles => {
      const theme = useContext(ThemeContext);
      const defaultStyles: SelectGenderModalStyles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.White,
        },
        cardWrapper: {
          paddingTop: 15,
          paddingHorizontal:15
        },
        card: {
          backgroundColor: theme.colors.primaryColor,
          borderRadius: 12,
          padding: 16,
          minHeight: 100,
          marginBottom: 10,
        },
        activeCard: {
          borderColor: theme.colors.white,
          borderWidth: 1,
        },
        title: {
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.white,
        },
        balance: {
          fontSize: 24,
          marginTop: 8,
          color: theme.colors.white,
        },
        userInfo: {
          fontSize: 16,
          marginTop: 8,
          color: theme.colors.OffWhite,
        }
      });

      return defaultsDeep(defaultStyles);
    };

  export default useMergeStyles;
`.trim();


const financialProfileSummaryFunctions = {
  HeaderImports,
  StateDetails,
  ContextStateDetails,
  Functions,
  ReturnStatement,
  Styles
};

module.exports = financialProfileSummaryFunctions;
