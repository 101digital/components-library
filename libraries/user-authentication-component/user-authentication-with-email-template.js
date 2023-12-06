// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import React, { useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { Checkbox, TextInput as PaperTextInput } from 'react-native-paper';
import { Formik, Field, FormikProps } from 'formik';
import { useAuth } from 'react-native-auth-component';
import {validationSchema} from './model';
import { colors as defaultColors } from '@/assets/Colors';
import useMergeStyles from './styles';
import {Button, ThemeContext} from 'react-native-theme-component';
import {
  changeLanguage,
  convertToLanguageCode,
} from '@/translations/translation-config';

type LoginComponentProps = {
  loginSuccess: () => void;
  colors?: typeof defaultColors;
  title: string;
};
`;

// State Details
const StateDetails = `
const { login } = useAuth();
const [loginError, setLoginError] = useState<string | null>(null);
const styles = useMergeStyles();
const {i18n} = useContext(ThemeContext);
const [currentSelectedLanguage, setCurrentSelectedLanguage] =
  useState<string>('english');

const initialValues = {
    email: '',
    password: '',
  };`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions = (initialValuesCode, functionCode) => `
const onSubmit = async ({ email, password }: typeof initialValues) => {
    try {
      const response = await login(email, password);
      if (response === true) {
        loginSuccess();
      } else {
        setLoginError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.log('error', error);
      setLoginError('An error occurred during login. Please try again.');
    }
  };


const onChangeLanguage = (lang: string) => {
  changeLanguage(convertToLanguageCode(lang));
  setCurrentSelectedLanguage(lang);
};
`;

// Fields Components
const FieldsComponents = (detailsField) => `
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
          label={${
            enableTranslation
              ? `i18n?.t('${convertI18nKey(componentName)}.txt_${convertI18nKey(
                  field.name
                )}')`
              : `'${field.label}'`
          }}
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
          label={${
            enableTranslation
              ? `i18n?.t('${convertI18nKey(componentName)}.${convertI18nKey(
                  field.name
                )}')`
              : `'${field.label}'`
          }}
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
            setSelectedFieldTitle(${
              enableTranslation
                ? `i18n?.t('${convertI18nKey(componentName)}.${convertI18nKey(
                    field.name
                  )}')`
                : `'${field.label}'`
            })
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
        {${
          enableTranslation
            ? `i18n?.t('${convertI18nKey(componentName)}.lbl_${convertI18nKey(
                field.name
              )}')`
            : `'${field.label}'`
        }}:
      </Text>
      <Text style={styles.label}>{values['${detailsField}']}</Text>
    </>
  </View>}
);
`;

// Return Statement
const ReturnStatement = (
  fields,
  enableTranslation,
  componentName,
  convertI18nKey,
  supportLanguages
) => {
  const convertFieldName = (fieldName) => fieldName.replace(/[\[\]\.]/g, "_");

  let componentCode = `return (
    <View style={styles.container}>

    ${
      supportLanguages?.length > 0
        ? supportLanguages
            .map(
              (
                l
              ) => `<View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>${l}</Text>
    <Checkbox
      status={
        currentSelectedLanguage === '${l}' ? 'checked' : 'unchecked'
      }
      onPress={() => onChangeLanguage('${l}')}
    />
    </View>`
            )
            .join("")
        : ""
    }

      <Text style={styles.title}>{${
        enableTranslation
          ? `i18n?.t('login_with_email_component.lbl_title')`
          : "Welcome to App studio"
      }}</Text>
      
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
      {(formikProps: FormikProps<typeof initialValues>) => (
        <>
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

      const mainFieldName = fieldParts[0].replace(/\[\d+\]/, ""); // Convert nested field name
      const subFieldName = fieldParts[1];
      detailsField = `${mainFieldName}_${index}_${subFieldName}`;
    }

    switch (field.type) {
      case "textField":
        componentCode += `{/* ${field.type} - ${field.label} */}
            <PaperTextInput
              testID="${detailsField}-input"
              style={styles.input}
              label={${
                enableTranslation
                  ? `i18n?.t('${convertI18nKey(
                      componentName
                    )}.lbl_${convertI18nKey(fieldName)}')`
                  : `'${field.label}'`
              }}
              secureTextEntry={${field.isSecure}}
              onChangeText={formikProps.handleChange('${detailsField}')}
              value={formikProps.values.${detailsField}}
              underlineColor="transparent"
              underlineStyle={{
                display: 'none',
              }}
            />
            {formikProps.errors.${detailsField} && (
              <View style={{ width:'100%',marginTop:-15}}>
                <Text style={styles.errorText}>{formikProps.errors.${detailsField}}</Text>
              </View>
            )}`;
        break;
      case "buttonField":
        componentCode += `{/* ${field.type} - ${field.label} */}
        <>
          <View style={{ width:'100%'}}>
            <Button
              testID="${testId}"
              label={${
                enableTranslation
                  ? `i18n?.t('${convertI18nKey(
                      componentName
                    )}.btn_${convertI18nKey(fieldName)}')`
                  : `'${field.label}'`
              }}
              onPress={formikProps.handleSubmit}
              variant= 'primary'
            />
          </View>
        </>`;
        break;
      default:
        break;
    }
  }

  componentCode += `
        {loginError && <Text style={styles.errorText}>{loginError}</Text>}
        </>
        )}
      </Formik>
    </View>
);`;

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
        backgroundColor: theme.colors.LightGrayBackground,
        padding: 20,
        paddingTop: 33,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: '50%',
        color: theme.colors.blue,
      },
      input: {
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: 'white',
        width: '100%',
      },
      inputWrapper: {
        width: '100%',
        marginBottom: 10,
      },
      button: {
        marginTop: 10,
        padding: 15,
        borderRadius: 5,
        width: '100%',
        backgroundColor: theme.colors.blue,
      },
      buttonText: {
        color: theme.colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
      },
      errorText: {
        color: theme.colors.red,
        textAlign: 'left',
      },
      userInfo: {
        marginTop: 16,
        width: '100%',
        paddingHorizontal: 8,
      },
      activeInput: {
        borderColor: theme.colors.Black1B,
        borderWidth: 1,
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
      paperInput: {
        marginBottom: 16,
        width: '100%',
      },
      paperButton: {
        marginTop: 10,
        borderRadius: 5,
        width: '100%',
        backgroundColor: theme.colors.blue,
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
  Styles,
};

module.exports = userProfileSummaryFunctions;
