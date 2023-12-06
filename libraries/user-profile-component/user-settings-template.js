// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import React, {useEffect, useState,useContext } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useUser} from 'react-native-user-profile-component';
import useMergeStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from 'react-native-theme-component';
`;

// State Details
const StateDetails = `
const {userDetails, updateUserProfile} = useUser();
  const [profile, setProfile] = useState({});
  const styles = useMergeStyles();
  const theme = useContext(ThemeContext);`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions =(initialValuesCode,functionCode) => `
useEffect(() => {
  if (userDetails) {
    setProfile(userDetails);
  }
}, [userDetails]);

`;

// Fields Components
const FieldsComponents =(detailsField) => ``;


// Return Statement
const ReturnStatement = (fields,enableTranslation) => {
  const convertFieldName = (fieldName) => fieldName.replace(/[\[\]\.]/g, "_");
  let componentCode = `
    return (
      <View  style={styles.container}>
      <ScrollView style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={[styles.profile]}>
              <View>
  `;

  for (const fieldName in fields) {
    const field = fields[fieldName];
    const testId = `${field?.type}-${fieldName}`;

    let pattern = /\[\d+\]\./; // Regular expression to match "[X]."
    let containsPattern = pattern.test(fieldName);
    let detailsField = convertFieldName(fieldName);

    if (containsPattern) {
      const fieldParts = fieldName.split(".");
      const index = fieldParts[0].match(/\d+/)[0]; // Extract the index from fieldName

      const mainFieldName = fieldParts[0].replace(/\[\d+\]/, ''); // Convert nested field name
      const subFieldName = fieldParts[1];
      detailsField = `${mainFieldName}_${index}_${subFieldName}`;
    }

    switch (field.type) {
      case 'title':
        componentCode += `{/* ${field.type} - ${field.label} */}
        <>
          <Text testID={'${testId}'} style={styles.profileName}>{profile.${fieldName} ? profile?.${fieldName} : profile?.nickName}</Text>
        </>`;
        break;
      case 'subtitle':
        componentCode += `{/* ${field.type} - ${field.label} */}
        <>
          <Text testID={'${testId}'} style={styles.userName}>{profile ? profile.${fieldName}:''}</Text>
        </>`;
        break;
      case 'label':
        componentCode += `{/* ${field.type} - ${field.label} */}
        <>
          <Text testID={'${testId}'} style={styles.membershipIdLabel}>{"${field.label}"}</Text>
        </>`;
        break;
      default:
        break;
    }
  }

  componentCode += `
        </View>
        <TouchableOpacity
          style={styles.barcodeContainer}
        >
          <Icon name="barcode" size={32} color="red" />
        </TouchableOpacity>
      </View>`

      for (const fieldName in fields) {
        const field = fields[fieldName];
        const testId = `${field?.type}-${fieldName}`;

        let pattern = /\[\d+\]\./; // Regular expression to match "[X]."
        let containsPattern = pattern.test(fieldName);
        let detailsField = convertFieldName(fieldName);

        if (containsPattern) {
          const fieldParts = fieldName.split(".");
          const index = fieldParts[0].match(/\d+/)[0]; // Extract the index from fieldName

          const mainFieldName = fieldParts[0].replace(/\[\d+\]/, ''); // Convert nested field name
          const subFieldName = fieldParts[1];
          detailsField = `${mainFieldName}_${index}_${subFieldName}`;
        }

        switch (field.type) {
          case 'buttonItem':
            componentCode += `{/* ${field.type} - ${field.label} */}
              <TouchableOpacity testID={testId} style={[styles.buttonContainer]} >
                <View style={styles.itemWrapper}>
                  <View style={styles.itemContainer}>
                    <Icon name="${field.iconName}" size={16} color="theme.colors.primaryIconColor" />
                    <Text style={[styles.label]}>{'${field.label}'}</Text>
                  </View>
                  <Icon name="angle-right" size={16} color="red" />
                </View>
              </TouchableOpacity>`;
            break;
          default:
            break;
        }
      }


            componentCode += `</View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Text style={styles.appVersion}>
          { 'App Version '}
        </Text>
        <TouchableOpacity testID="btn-logout"   style={styles.logoutContainer}>
          <Icon name="power-off" size={20} color="red" />
          <Text style={styles.logoutBtn}>{'Logout'}</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
`;

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
        height: '100%',
        backgroundColor: '#fff',
      },
      bottomSection: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor:'#fff'
      },
      contentWrapper: {
        flex: 1,
        paddingHorizontal: 22,
        backgroundColor:'#fff'
      },
      content: {
        flex: 1,
        marginTop: 25,
      },
      profile: {
        paddingBottom: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.lightBorderColor,
      },
      profileName: {
        fontSize: 14,
        color: theme.colors.boldSubTitle,
      },
      userName: {
        color: theme.colors.subtitle,
        fontSize: 12,
        marginVertical: 8,
      },
      buttonContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.lightBorderColor,
      },
      label: {
        fontSize: 14,
        color: theme.colors.boldSubTitle,
        marginLeft: 12,
      },
      itemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
      },
      itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
      membershipId: {
        color: theme.colors.subtitle,
        fontSize: 12,
      },
      membershipIdLabel: {
        marginBottom: 4,
        fontSize: 12,
        color: theme.colors.subtitle,
      },
      logoutContainer: {
        marginTop: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 20,
      },
      logoutBtn: {
        fontSize: 14,
        color: theme.colors.alertTitle,
        marginLeft: 6,
      },
      appVersion: {
        fontSize: 12,
        color: theme.colors.subtitle,
      },
      barcodeContainer: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: theme.colors.primary,
        borderRadius: 96,
      },
    });

    return defaultsDeep(defaultStyles);
  };

  export default useMergeStyles;
`.trim();

const userProfileSummaryFunctions = {
  HeaderImports,
  StateDetails,
  ContextStateDetails,
  Functions,
  ReturnStatement,
  Styles
};

module.exports = userProfileSummaryFunctions;
