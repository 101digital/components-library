// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import {Text, TouchableOpacity, View} from "react-native";
import {Formik, FormikProps,} from "formik";
import {validationSchema} from "./model";
import {TextInput as PaperTextInput} from "react-native-paper";
import {Button} from "react-native-theme-component";
import React, {useRef,useState} from "react";
import useMergeStyles from './styles';
`;

// State Details
const StateDetails = `
  const styles = useMergeStyles();
   const formikRef = useRef<FormikProps<any>>(null);
    const [selectedAmount, setSelectedAmount] = useState();
    const initialValues = {
        amount: ''
    };
`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions = (initialValuesCode, functionCode) => `
 const onSubmit = async ({amount}: typeof initialValues) => {
        try {
            //    TODO: Submit funds
            console.log('submit form: ', amount);
        } catch (error) {
            // TODO: Handle error
            console.log('error', error);
        }
    };

    const handleSubmit = () => {
        if (formikRef.current) {
            formikRef.current.handleSubmit()
        }
    }

    const onPressAmount = (item: any) => {
        formikRef?.current?.setFieldValue('amount', item?.toString())
    }
    
    const amountSelection = (props: any) => {
        const {onPressAmount} = props || {}
        const AMOUNT_LIST = [100, 250, 500]

        const _onPressAmountBtn = (item: any) => () => {
            onPressAmount?.(item)
        }

        return (
            <View style={styles.amountSelectionContainer}>
                {AMOUNT_LIST.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={_onPressAmountBtn?.(item)}
                            style={[styles.amountOption, {
                                backgroundColor: 'white',
                                marginRight: index === AMOUNT_LIST.length - 1 ? 0 : 10
                            }]}>
                            <Text style={styles.amountOptionText}>{item}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

        )
    }
`;

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
    let
        componentCode = `
    return (
      <View style={styles.container}>    
      <View>   
  `;

    let bottomButton = ``

    for (const fieldName in fields) {
        const field = fields[fieldName];
        const testId = `${field.type}-${fieldName}`

        switch (field.type) {
            case "title":
                componentCode += `{/* ${field.type} - ${field.label} */}
                <Text testID={'${testId}'} style={styles.title}>${field.label}</Text>
                 `;
                break;

            case "subtitle":
                componentCode += `{/* ${field.type} - ${field.label} */}
                 <Text testID={'${testId}'} style={styles.subtitle}>${field.label}</Text>
                 `;
                break;

            case "amountInput":
                componentCode += `{/* ${field.type} - ${field.label} */}
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    {(formikProps: FormikProps<typeof initialValues>) => {
                        return (
                            <>
                                {/* textField - Email */}
                                <PaperTextInput
                                    testID={'${testId}'}
                                    style={styles.input}
                                    label={'Amount'}
                                    secureTextEntry={false}
                                    onChangeText={formikProps.handleChange('amount')}
                                    value={formikProps.values.amount}
                                    underlineColor="transparent"
                                    underlineStyle={{
                                        display: 'none',
                                    }}
                                />

                                {formikProps.errors.amount && (
                                    <Text style={styles.errorText}>{formikProps.errors.amount}</Text>
                                )}
                            </>
                        )
                    }}
                </Formik>
                  `;
                break;

            case "amountSelection":
                componentCode += `{/* ${field.type} - ${field.label} */}
                 { amountSelection({onPressAmount}) }
                 `;
                break;

            case "availableBalance":
                componentCode += `{/* ${field.type} - ${field.label} */}
                 <View testID={'${testId}'}
                       style={styles.availableBalanceContainer}>
                    <View>
                        <Text style={styles.availableBalanceText}>Transfer from</Text>
                        <Text style={styles.availableBalanceText}>•••• •••• •••• 8000</Text>
                    </View>

                    <View>
                        <Text style={styles.availableBalanceText}>Available balance</Text>
                        <Text style={styles.availableBalanceText}>RM 6,352.60</Text>
                    </View>
                </View>
                 `;
                break;

            case "button":
                bottomButton += `{/* ${field.type} - ${field.label} */}
                 <View style={styles.buttonContainer}>
                    <Button
                        label={'Continue'}
                        onPress={handleSubmit}
                        variant="primary"
                        testID={'${testId}'}
                    />
                </View>
                 `;
                break;

            default:
                break;
        }
    }

    componentCode += `
    </View>);`;

    componentCode += bottomButton

    componentCode += `
    </View>);`;

    return componentCode;
};

const Styles = `
import {defaultsDeep} from 'lodash';
import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {ThemeContext} from 'react-native-theme-component';
import {fonts} from '@/assets/fonts';
import {colors} from "@/assets";

const useMergeStyles = (
    style
) => {
    const theme = useContext(ThemeContext);
    const defaultStyles = StyleSheet.create({
        container: {
            justifyContent: 'space-between',
            flex: 1,
            paddingHorizontal: 23
        },
        valueContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 24,
            fontFamily: fonts.SemiBold,
            marginBottom: 10
        },
        subtitle: {
            fontSize: 14,
            fontFamily: fonts.Regular,
            marginBottom: 20
        },
        buttonContainer: {
            marginBottom: 15
        },
        amountSelectionContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            marginVertical: 20
        },
        amountOption: {
            paddingVertical: 15,
            paddingHorizontal: 20,
            flex: 1,
            borderRadius: 17,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor:colors.PinkPrimaryBlackColor,
            borderWidth:1
        },
        amountOptionText:{
            color:colors.PinkPrimaryBlackColor
        },
        availableBalanceContainer:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: 10,
            backgroundColor: colors.DarkBlue,
            paddingHorizontal:20,
            paddingVertical:15
        },
        availableBalanceText:{
            color: colors.White,
            fontFamily: fonts.Regular
        }
    });

    return defaultsDeep(defaultStyles);
};

export default useMergeStyles;
`.trim();

const accountAddFundsFunctions = {
    HeaderImports, StateDetails, ContextStateDetails, Functions, ReturnStatement, Styles,
};

module.exports = accountAddFundsFunctions;
