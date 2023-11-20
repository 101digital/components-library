// ReactNativeLibrary.js

// Header Imports
export const HeaderImports = `
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
export const StateDetails = `
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
export const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
export const Functions =(initialValuesCode,functionCode) => `
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
export const FieldsComponents =(detailsField) => `
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
export const ReturnStatement = (fields,enableTranslation) => {
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
          <Text style={styles.subtitle}>${enableTranslation ? `i18n?.t('${convertI18nKey(componentName)}.lbl_${convertI18nKey(fieldName)}')` : `'${field.label}'`}</Text>
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
                {/* Save Details button */}
                <View style={styles.saveButtonContainer}>
                  <Button title="Save Details" onPress={handleSubmit} />
                </View>
              </>
            );
          }}
        </Formik>

        {/* Modal for selecting options */}
        <Modal
          isVisible={isSelectorVisible}
          onBackdropPress={() => {
            toggleSelector();
            setSelectedFieldTitle('');
            setSelectedField('');
            setSelectFieldData(null);
          }} // Close the modal when clicking outside
          backdropOpacity={0.5}
          animationIn="slideInUp" // Specify the animation to open from the bottom
          animationOut="slideOutDown" // Specify the animation to close towards the bottom
          style={styles.selectorWrapper}
          // style={[styles.selectorWrapper, { height: getMaxHeight() }]}
        >
          <View style={[styles.selectorContainer, { height: getMaxHeight() }]}>
            {/* Add your action sheet content here */}
            <Text style={styles.selectorTitle}>{selectedFieldTitle}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectFieldData ? (
                selectFieldData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleOptionSelect(selectedField, item.value);
                    }} // Open the action sheet modal
                    activeOpacity={0.7}
                    // style={styles.inputIconWrapper}
                  >
                    {formikRef.current.getFieldProps(selectedField).value === item.value ? (
                      <View style={styles.selectedItem}>
                        <Text>{item.value}</Text>
                        <TickIcon />
                      </View>
                    ) : (
                      <View style={styles.selectorItem}>
                        <Text>{item.value}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Loading data...</Text>
              )}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    );
  );
`;

  return componentCode;
};
