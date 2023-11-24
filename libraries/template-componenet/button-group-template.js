// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import React, { useEffect } from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import { useFinance } from 'financial-profile-component';
import { useUser } from 'react-native-user-profile-component';
import useMergeStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
`;

// State Details
const StateDetails = `
  const styles = useMergeStyles();
`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions =(initialValuesCode,functionCode) => ``;

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
        <View style={styles.wrapper}>
          <View style={styles.actionItems}>`;

  for (const fieldName in fields) {
    const field = fields[fieldName];

    switch (field.type) {
      case 'buttonField':
        componentCode += `{/* ${field.type} - ${field.label} */}
        <TouchableOpacity
          testID={'${field.type}-${fieldName}'}
          style={styles.actionButton}>
            ${field.iconName ? `<Icon name="${field.iconName}" size={32} color="white" />` : ''}
            <Text style={styles.actionText}>${fieldName}</Text>
        </TouchableOpacity>
        `;
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
           backgroundColor: theme.colors.lightGray,
         },
         wrapper: {
           paddingTop: 10,
           paddingHorizontal: 15,
           flex: 1,
         },
         actionItems: {
           flexDirection: 'row',
           justifyContent: 'space-between',
           marginBottom: 16,
         },
         actionButton: {
           flex: 1,
           borderRadius: 12,
           marginHorizontal:4,
           alignItems: 'center',
           backgroundColor: theme.colors.primaryColor,
           padding:5,
           paddingVertical:22
         },
         actionText: {
           fontSize: 12,
           marginTop: 4,
           color: theme.colors.white,
         }
       });

       return defaultsDeep(defaultStyles);
     };

   export default useMergeStyles;

`.trim();

const buttonGroupFunctions = {
  HeaderImports,
  StateDetails,
  ContextStateDetails,
  Functions,
  ReturnStatement,
  Styles
};

module.exports = buttonGroupFunctions;
