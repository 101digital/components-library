// ReactNativeLibrary.js

// Header Imports
let HeaderImports = `
import React, { useEffect } from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import { useFinance } from 'financial-profile-component';
import { useUser } from 'react-native-user-profile-component';
import useMergeStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useConditions} from 'react-native-branch-component';
import Route from '@/navigation/routes';

`;

// State Details
const StateDetails = `
  const styles = useMergeStyles();
  const navigation = useNavigation();
`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;


const formatRouteKey = (key) => {
  return key
    .replace(/[A-Z]/g, (match, offset) => (offset > 0 ? "_" : "") + match)
    .toUpperCase();
};

// Functions
const Functions = (initialValuesCode, functionCode, enterpriseDataSource, fields, paths) => {
  let eventFunctions = '';
  const branchConditionImports = []; // Declare and initialize outside the Functions function

  const functionExists = (functionName) => {
    return eventFunctions.includes(`const ${functionName} = (`);
  };
  

  const generateBranchesCode = (data, key) => {
    if (data[key]) {
      eventFunctions += `if (await ${key}()) {`;
      branchConditionImports.push(key);
      if (data[key].action.true) {
        const nextKey = data[key].action.true.branch || data[key].action.true.screen;
        generateBranchesCode(data, nextKey);
      }
      eventFunctions += `} else {`;
      if (data[key].action.false) {
        const nextKey = data[key].action.false.branch || data[key].action.false.screen;
        generateBranchesCode(data, nextKey);
      } else {
        console.log(`navigate("UnknownScreen");`);
      }
      eventFunctions += `}`;
    } else {
      eventFunctions += `navigation.navigate(Route.${formatRouteKey(key)});`;
    }
  };

  for (const fieldName in fields) {
    const field = fields[fieldName];
    const eventKey = Object.keys(field).find((key) => key.startsWith('event'));
    const eventName = eventKey ? eventKey : null;

    if (eventName) {
      let uniqueFunctionName = eventName;

      // Check if the function already exists
      let suffix = 1;
      while (functionExists(uniqueFunctionName)) {
        uniqueFunctionName = `${eventName}${suffix}`;
        suffix += 1;
      }

      // If the function already exists, modify the existing function
      if (suffix > 1) {
        eventFunctions = eventFunctions.replace(
          new RegExp(`const ${eventName} = \\(\\) => {`, 'g'),
          `const ${eventName} = (type:any) => {`
        );
      } else {
        // If the function does not exist, create a new one
        eventFunctions += `
  const ${uniqueFunctionName} = async (type:any) => {
    `;
        if (field[eventKey] && field[eventKey].screenName) {
          eventFunctions += `navigation.navigate(type.screenName);`;
        } else if (field[eventKey] && field[eventKey].branch) {
          generateBranchesCode(paths, field[eventKey].branch); // Ensure paths is passed here
        }

        eventFunctions += `
    console.log('${uniqueFunctionName} function called');
  };
  `;
      }
    }
  }
  return { eventFunctions, branchConditionImports };
};





// Fields Components
const FieldsComponents = (detailsField) => `
// Your subtitle component code
const SubtitleComponent = ({ label }) => (
  <View style={styles.userInfo}>
    <Text style={styles.subtitle}>{label}</Text>
  </View>
);
`;

// Return Statement
const ReturnStatement = (fields, enableTranslation) => {
  const convertFieldName = (fieldName) => fieldName.replace(/[\[\]\.]/g, "_");
  let componentCode = `
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.actionItems}>`;

  for (const fieldName in fields) {
    const field = fields[fieldName];

    switch (field.type) {
      case "buttonField":
        const eventKey = Object.keys(field).find(key => key.startsWith('event'));
        // const eventName = eventKey ? field[eventKey].screenName : null;
        
        const eventName = eventKey ? eventKey : null;

        componentCode += `{/* ${field.type} - ${field.label} */}
        <TouchableOpacity
          testID={'${field.type}-${fieldName}'}
          style={styles.actionButton}
          onPress={(e:any) => {
            const eventData = ${eventName ? JSON.stringify(field[eventKey]) : 'null'};
            ${eventName ? `${eventName}(eventData)` : ''}
          }}>
            ${
              field.iconName
                ? `<Icon name="${field.iconName}" size={32} color="white" />`
                : ""
            }
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
  Styles,
};

module.exports = buttonGroupFunctions;
