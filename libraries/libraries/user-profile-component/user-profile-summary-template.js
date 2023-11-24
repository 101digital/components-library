// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import { getEnterpriseData } from '@/utils/screen-utils';
import { useUser } from 'react-native-user-profile-component';
import { ThemeContext } from 'react-native-theme-component';
import { EditIcon, SelectorIcon, TickIcon } from '@/assets/icon';
import useMergeStyles from './styles';
import {validationSchema as generateValidationSchema} from './model';
`;

// State Details
const StateDetails = `
const { userDetails, updateUserProfile } = useUser();
const [initialValues, setInitialValues] = useState({});
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [selectedFieldTitle, setSelectedFieldTitle] = useState('');
const [selectedField, setSelectedField] = useState('');
const [activeInput, setActiveInput] = useState(null);
const [isSelectorVisible, setSelectorVisible] = useState(false);
const [selectFieldData, setSelectFieldData] = useState(null);
const [selectedValues, setSelectedValues] = useState({});
const [formatedFields, setFormatedFields] = useState({});
const formikRef = useRef(null);
const inputRefs = {};
const styles = useMergeStyles();`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions =(initialValuesCode,functionCode) => `
useEffect(() => {
  if (userDetails) {
    setInitialValues(${initialValuesCode});
  }
}, [userDetails]);

const ensureStringValue=(value)=> {
  if (typeof value === 'number') {
    return value.toString(); // Convert number to string
  }
  if (typeof value === 'string') {
    return value; // It's already a string
  }
  // Handle other types or undefined here if needed
  return ''; // Return an empty string for unsupported types
}

// Generate the validation schema using the function
const validationSchema = generateValidationSchema(fields);

// Function to fetch select field data (getEnterpriseData)
const fetchSelectFieldData = async (field) => {
  try {
   const response = await getEnterpriseData([\`EntData_\${field}\`]);
   setSelectFieldData(response?.[0]?.dataItems);
  } catch (error) {
   console.error('Error fetching data:', error);
  }
};

// Function to handle icon press for input fields
const handleInputIconPress = (field) => {
  if (inputRefs[field]) {
    inputRefs[field].focus();
  }
};

// Function to handle option selection
const handleOptionSelect = (field, value) => {
  // set form data
  formikRef.current.setFieldValue(field,value);
  // Handle triggers for this field
  handleFieldChange(field,value);

  setSelectedValues({
    ...selectedValues,
    [field]: value,
  });
  toggleSelector();
};

// Function to handle field change
const handleFieldChange = (field, value) => {
  ${functionCode}
};

// Function to calculate the max height (replace with your logic)
const getMaxHeight = () => {
  if (selectFieldData) {
   if (selectFieldData.length < 3) {
     return '20%'; // 1/4 of the screen height
   } else if (selectFieldData.length < 10) {
     return '40%'; // 2/4 of the screen height
   }else if (selectFieldData.length < 15) {
     return '50%'; // 2/4 of the screen height
   } else {
     return '80%'; // 3/4 of the screen height
   }
 }
 return '50%'; // Default to 2/4 of the screen height
};

// Function to toggle the selector modal
const toggleSelector = () => {
  setSelectorVisible(!isSelectorVisible);
};

// Function to handle input focus
const handleInputFocus = (field) => {
  setActiveInput(field);
};

// Function to handle input blur
const handleInputBlur = (field) => {
  setActiveInput(null);
};

// Function to save user details
const saveDetails = async (values) => {
  try {

    const changedFieldsValues = {};
    Object.keys(values).forEach((fieldName) => {
      if (values[fieldName] !== initialValues[fieldName]) {
        changedFieldsValues[fieldName] = values[fieldName];
      }
    });

    const changedFields =restructureObject(changedFieldsValues);

    if (Object.keys(changedFields).length > 0) {
      await updateUserProfile(userDetails.userId, changedFields);
      setSuccessMessage('Profile updated successfully');
      setErrorMessage('');

      // setInitialValues({ ...initialValues, ...changedFields });
    } else {
      setSuccessMessage('');
      setErrorMessage('No changes to save.');
    }
  } catch (error) {
    setSuccessMessage('');
    setErrorMessage('Error updating profile: ' + error.message);
  }
};

// Function to restructure object
const restructureObject=(input)=> {
  const output = {};
  for (const key in input) {
      const parts = key.split('_');
      let currentObject = output;

      for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];

          if (!currentObject[part]) {
              if (isNaN(parts[i + 1])) {
                  if (userDetails && userDetails[parts[i - 1]]) {
                    if (userDetails[parts[i - 1]].length > 0) {
                      currentObject[part] = {'id':userDetails[parts[i - 1]][part].id};
                    }else{
                      currentObject[part] = {};
                    }
                  }else{
                    currentObject[part] = {};
                  }

              } else {
                currentObject[part] = [];
              }
          }
          currentObject = currentObject[part];
      }

      const lastKey = parts[parts.length - 1];
      if (!isNaN(lastKey)) {
          currentObject.push({ [lastKey]: input[key] });
      } else {
          currentObject[lastKey] = input[key];
      }
  }

  return output;
}
`;

// Fields Components
const FieldsComponents =(detailsField) => `
// Your subtitle component code
const SubtitleComponent = ({ label }) => (
  <View style={styles.userInfo}>
    <Text style={styles.subtitle}>{label}</Text>
  </View>
);

// Your textField component code
const TextFieldComponent = ({ field, values, initialValues, activeInput, handleChange, handleInputFocus, handleInputBlur, handleInputIconPress }) => (
  {!values['${detailsField}_hidden'] && <View style={styles.userInfo}>
    <View style={styles.inputWrapper}>
      <View
        style={[
          styles.inputContent,
          activeInput === '${detailsField}' ? styles.activeInput : null,
        ]}
      >
        <TextInput
          testID={'textField-${field.name}'}
          style={[
            styles.input,
            values['${detailsField}'] !== initialValues['${detailsField}']
              ? styles.errorInput
              : null,
          ]}
          label={${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.txt_${convertI18nKey(field.name)}')` : `'${field.label}'`}}
          name={'${detailsField}'}
          onChangeText={handleChange('${detailsField}')}
          value={values['${detailsField}']}
          onBlur={handleInputBlur}
          onFocus={() => handleInputFocus('${detailsField}')}
          editable={${field.isEditable}}
          underlineColor="transparent"
          underlineStyle={{
            display: 'none',
          }}
          onBlur={handleInputBlur}
          ref={(ref) => (inputRefs['${detailsField}'] = ref)}
        />
        <TouchableOpacity
          onPress={() => handleInputIconPress('${detailsField}')}
          activeOpacity={0.7}
          style={styles.inputIconWrapper}
        >
          <EditIcon />
        </TouchableOpacity>
      </View>
    </View>
  </View>}
);

// Your selectField component code
const SelectFieldComponent = ({ field, values, initialValues, activeInput, handleOptionSelect, fetchSelectFieldData, toggleSelector }) => (
  {!values['${detailsField}_hidden'] && <View style={styles.userInfo}>
    <View style={styles.inputWrapper}>
      <View
        style={[
          styles.inputContent,
          activeInput === '${detailsField}' ? styles.activeInput : null,
        ]}
      >
        <TextInput
          testID={'selectField-${field.name}'}
          style={[
            styles.input,
            values['${detailsField}'] !== initialValues['${detailsField}']
              ? styles.errorInput
              : null,
          ]}
          label={${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.${convertI18nKey(field.name)}')` : `'${field.label}'`}}
          name={'${detailsField}'}
          value={values['${detailsField}']}
          onFocus={() => handleInputFocus('${detailsField}')}
          editable={false}
          underlineColor="transparent"
          underlineStyle={{
            display: 'none',
          }}
          onBlur={handleInputBlur}
          ref={(ref) => (inputRefs['${detailsField}'] = ref)}
        />
        <TouchableOpacity
          onPress={() => {
            setSelectedFieldTitle(${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.${convertI18nKey(field.name)}')` : `'${field.label}'`})
            setSelectedField('${detailsField}')
            toggleSelector()
            // Fetch data when the selectField is clicked
            if ('${detailsField}'.includes('_')) {
              const lastPart = '${detailsField}'.split('_').pop();
              fetchSelectFieldData(lastPart);
            } else {
              fetchSelectFieldData('${detailsField}');
            }
          }} // Open the action sheet modal
          activeOpacity={0.7}
          style={styles.inputIconWrapper}
        >
          <SelectorIcon />
        </TouchableOpacity>
      </View>
    </View>
  </View>}
);

// Your labelField component code
const LabelFieldComponent = ({ field, values, detailsField, enableTranslation }) => (
  {!values['${detailsField}_hidden'] && <View style={styles.userInfo}>
    <Text style={styles.subtitle}>{enableTranslation ? \`i18n?.t('\${convertI18nKey(componentName)}.lbl_\${convertI18nKey(field.name)}')\` : \`'\${field.label}'\`}</Text>
    <>
      <Text testID={'labelField-${field.name}'} style={styles.fieldLabel}>
        {${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.lbl_${convertI18nKey(field.name)}')` : `'${field.label}'`}}:
      </Text>
      <Text style={styles.label}>{values['${detailsField}']}</Text>
    </>
  </View>}
);
`;


// Return Statement
const ReturnStatement = (fields,enableTranslation) => {
  const convertFieldName = (fieldName) => fieldName.replace(/[\[\]\.]/g, "_");
  let componentCode = `
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Form elements for user profile */}
        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={saveDetails}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => {
            return (
              <>
                {/* Your JSX code for rendering fields */}
  `;

  for (const fieldName in fields) {
    const field = fields[fieldName];

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
        <View
          style={styles.userInfo}
        >
          <Text style={styles.title}>{values['${detailsField}']}</Text>
        </View>`;
        break;
      case 'subtitle':
        componentCode += `{/* ${field.type} - ${field.label} */}
        <View
          testID={'${field.type}-${fieldName}'}
          style={styles.userInfo}
        >
          <Text style={styles.subtitle}>${field.label}</Text>
        </View>`;
        break;
      case 'textField':
        componentCode += `{/* ${field.type} - ${field.label} */}
        {!values['${detailsField}_hidden'] && <View
          style={styles.userInfo}
        >
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContent,
                activeInput === '${detailsField}' ? styles.activeInput : null,
              ]}
            >
              <TextInput
                testID={'${field.type}-${fieldName}'}
                style={[
                  styles.input,
                  values['${detailsField}'] !== initialValues['${detailsField}']
                    ? styles.errorInput
                    : null,
                ]}
                label={${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.txt_${convertI18nKey(fieldName)}')` : `'${field.label}'`}}
                name={'${detailsField}'}
                onChangeText={handleChange('${detailsField}')}
                value={values['${detailsField}']}
                onBlur={handleSubmit}
                onFocus={() => handleInputFocus('${detailsField}')}
                editable={${field.isEditable}}
                underlineColor="transparent"
                underlineStyle={{
                  display: 'none',
                }}
                onBlur={handleInputBlur}
                ref={(ref) => (inputRefs['${detailsField}'] = ref)}
              />
              <TouchableOpacity
                onPress={() => handleInputIconPress('${detailsField}')}
                activeOpacity={0.7}
                style={styles.inputIconWrapper}
              >
                <EditIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>}`;
        break;
      case 'selectField':
        componentCode += `{/* ${field.type} - ${field.label} */}
        {!values['${detailsField}_hidden'] && <View
          style={styles.userInfo}
        >
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContent,
                activeInput === '${detailsField}' ? styles.activeInput : null,
              ]}
            >
              <TextInput
                testID={'${field.type}-${fieldName}'}
                style={[
                  styles.input,
                  values['${detailsField}'] !== initialValues['${detailsField}']
                    ? styles.errorInput
                    : null,
                ]}
                label={${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.${convertI18nKey(fieldName)}')` : `'${field.label}'`}}
                name={'${detailsField}'}
                value={selectedValues['${detailsField}'] || values['${detailsField}']}
                onFocus={() => handleInputFocus('${detailsField}')}
                editable={false}
                underlineColor="transparent"
                underlineStyle={{
                  display: 'none',
                }}
                onBlur={handleInputBlur}
                ref={(ref) => (inputRefs['${detailsField}'] = ref)}
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectedFieldTitle(${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.${convertI18nKey(fieldName)}')` : `'${field.label}'`})
                  setSelectedField('${detailsField}')
                  toggleSelector()
                  // Fetch data when the selectField is clicked
                  if ('${detailsField}'.includes('_')) {
                    const lastPart = '${detailsField}'.split('_').pop();
                    fetchSelectFieldData(lastPart);
                  } else {
                    fetchSelectFieldData('${detailsField}');
                  }
                }} // Open the action sheet modal
                activeOpacity={0.7}
                style={styles.inputIconWrapper}
              >
                <SelectorIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>}`;
        break;
      case 'labelField':
        componentCode += `{/* ${field.type} - ${field.label} */}
        {!values['${detailsField}_hidden'] && <View
          style={styles.userInfo}
        >
          <>
            <Text testID={'${field.type}-${fieldName}'} style={styles.fieldLabel}>
              {${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.lbl_${convertI18nKey(fieldName)}')` : `'${field.label}'`}}:
            </Text>
            <Text style={styles.label}>{values['${detailsField}']}</Text>
          </>
        </View>}`;
        break;
      default:
        break;
    }
  }

  componentCode += `
              </>
            );
          }}
        </Formik>
      </ScrollView>
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
        backgroundColor: theme.colors.LightGrayBackground, // Access theme colors
        padding: 8,
        paddingTop: 33,
      },
      userInfo: {
        marginTop: 16,
        width: '100%',
        paddingHorizontal: 8,
      },
      title:{
        fontSize: 24,
        marginTop: 8,
        color: theme.colors.black,
      },
      subtitle:{
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 20,
        color:theme.colors.Black
      },
      fieldLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
      },
      input: {
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: 'white',
        width: '90%',
      },
      activeInput: {
        borderColor: theme.colors.Black1B, // Use theme colors
        borderWidth: 1,
      },
      inputIconWrapper: {
        alignSelf: 'center',
      },
      inputWrapper: {
        flex: 1,
        paddingHorizontal: 8,
        flexDirection: 'row',
      },
      inputContent: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 12,
        height: 55,
        overflow: 'hidden',
      },
      errorText: {
        color: theme.colors.Red, // Use theme colors
      },
      errorInput: {
        borderColor: theme.colors.Red,
      },
      errorWrapper: {
        flex: 1,
        paddingHorizontal: 8,
        flexDirection: 'row',
      },
      saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
      },
      successMessage: {
        color: theme.colors.GreenSuccess, // Use theme colors
        textAlign: 'center',
        marginBottom: 10,
      },
      errorMessage: {
        color: theme.colors.Red, // Use theme colors
        textAlign: 'center',
        marginBottom: 10,
      },
      selectorWrapper:{
        margin: 0,
        justifyContent: 'flex-end'
      },
      selectorContainer: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
      },
      selectorTitle : {
        textAlign:'center',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 32,
        letterSpacing: -0.12,
        color:theme.colors.Black1B,
      },
      selectorItem :{
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        alignItems: 'center',
      },
      selectedItem :{
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: theme.colors.LightGrayBorder
      }
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
