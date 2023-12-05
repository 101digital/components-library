// ReactNativeLibrary.js

// Header Imports
const HeaderImports = `
import React, { useEffect,useState,useContext,useCallback } from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import { useLoyalty } from 'loyalty-profile-component';
import { useUser } from 'react-native-user-profile-component';
import useMergeStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from 'react-native-theme-component';
import Barcode from "@kichiyaki/react-native-barcode-generator";
`;

// State Details
const StateDetails = `
  const styles = useMergeStyles();
  const { loyaltyProfileDetails, fetchLoyaltyProfile } = useLoyalty();
  const { userDetails } = useUser();
  const theme = useContext(ThemeContext);

  const [myPointsVisible, setMyPointsVisible] = useState<boolean>(false);
  const [membershipDetailsVisible, setMembershipDetailsVisible] = useState<boolean>(true);
  const [barCodeWidth, setBarCodeWidth] = useState(50);

`;

// State Details
const ContextStateDetails = `const { i18n } = useContext(ThemeContext)`;

// Functions
const Functions = (initialValuesCode, functionCode) => `
  useEffect(() => {
    fetchLoyaltyProfile()
  },[]);

  const toggleView = () => {
    setMembershipDetailsVisible(!membershipDetailsVisible);
  };

  const onLayout = useCallback((event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setBarCodeWidth(width);
    },
    []
  );
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
  let componentCode = `
    return (
      <View style={styles.container}>
        <View style={styles.membershipDetailsContainer}>
            <View style={styles.rowCenter}>
              <Text style={styles.subtitle} testID="card-title">{"My Points "}</Text>
              {/*  Info Icon */}

              <TouchableOpacity
                onPress={()=>{
                  setMyPointsVisible(true)
                }}
                testID={'show-point-info-button'}
                style={styles.transparent}>
                  <Icon name="info-circle" size={16} color={theme.colors.primaryColor} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={toggleView}
              testID={'show-point-button'}
              style={styles.transparent}>
                {membershipDetailsVisible ? (
                  <Icon name="eye" size={16} color={theme.colors.primaryColor} />
                ) : (
                  <Icon name="eye-slash" size={16} color={theme.colors.primaryColor} />
                )}
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.pointsText} testID="my-points-value">{"••••"}</Text>
          </View>

          <View
            style={[styles.barcodeContainer, styles.cardBarcodeContainer]}
            onLayout={onLayout}
            // testID={testID}
          >
            <Barcode
              format={'CODE128'}
              value={'12343333567n9q88978012309'}
              height={44}
              maxWidth={barCodeWidth}
              testID={"membership-barcode"}
            />

            <View style={styles.barcodeDetailsContainer}>
              <Text style={styles.barcodeDetails} testID="member-id-text">
                {"ID: 2022 0302 1992 1120"}
              </Text>
              <Text style={styles.barcodeDetails} testID="member-expiry-text">
                {'Expiry 10/26'}
              </Text>
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
          borderRadius: 15,
          padding: 16,
          backgroundColor: theme.colors.white,
          marginTop: 15,
          marginHorizontal: 15
        },
        membershipDetailsContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
        },
        rowCenter: {
          flexDirection: "row",
          alignItems: "center",
        },
        subtitle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "400",
          color: theme.colors.black,
        },
        transparent: {
          backgroundColor: theme.colors.transparent,
        },
        barcodeContainer: {
          zIndex: -1,
          width: "100%"
        },
        cardBarcodeContainer: {
          marginTop: 22,
        },
        barcodeDetailsContainer: {
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 4,
        },
        barcodeDetails: {
          fontSize: 10,
          lineHeight: 14,
          color: theme.colors.black,
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
  Styles,
};

module.exports = financialProfileSummaryFunctions;
