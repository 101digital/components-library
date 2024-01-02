// Header Imports
const HeaderImports = `
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import useMergeStyles from './styles';
`;

// State Details
const StateDetails = `
  const styles = useMergeStyles();
`;

// State Details
const ContextStateDetails = ``;

// Functions
const Functions = (initialValuesCode, functionCode) => ``;
//
// // Fields Components
// const FieldsComponents = (detailsField) => `
// // Your subtitle component code
// const SubtitleComponent = ({ label }) => (
//   <View style={styles.userInfo}>
//     <Text style={styles.subtitle}>{label}</Text>
//   </View>
// );
// `;

// Return Statement
const ReturnStatement = (fields, enableTranslation) => {
    // const convertFieldName = (fieldName) => fieldName.replace(/[\[\]\.]/g, "_");
    // let componentCode = `
    // return (
    //   <View style={styles.container}>
    //     <View style={styles.wrapper}>
    //       <View style={styles.actionItems}>`;
    //
    // for (const fieldName in fields) {
    //     const field = fields[fieldName];
    //
    //     switch (field.type) {
    //         case "buttonField":
    //             componentCode += `{/* ${field.type} - ${field.label} */}
    //     <TouchableOpacity
    //       testID={'${field.type}-${fieldName}'}
    //       style={styles.actionButton}>
    //         ${
    //                 field.iconName
    //                     ? `<Icon name="${field.iconName}" size={32} color="white" />`
    //                     : ""
    //             }
    //         <Text style={styles.actionText}>${fieldName}</Text>
    //     </TouchableOpacity>
    //     `;
    //             break;
    //         default:
    //             break;
    //     }
    // }
    //
    // componentCode += `
    //       </View>
    //     </View>
    // </View>);`;
    //
    // return componentCode;

    return `
type ProgressCircleProps = {
  /**
   * progress value
   */
  progress?: number;
  /**
   * circle stroke color
   */
  color?: string;
  /**
   * circle underline progress background color
   */
  secondaryColor?: string;
  inActiveStrokeOpacity?: number;
  /**
   * circle diameter
   */
  diameter?: number;
};

const screenWidth = Dimensions.get('window').width;

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress = 0,
  color,
  diameter = screenWidth / 2,
  children,
  secondaryColor,
  inActiveStrokeOpacity = 1,
}) => {
  if (progress < 0 || progress > 100) {
    console.error('progress value must be between 0 and 100');
  }
  if (inActiveStrokeOpacity < 0 || inActiveStrokeOpacity > 1) {
    console.error('inActiveStrokeOpacity value must be between 0 and 1');
  }
  const strokeLinecap = 'round';
  const radius = diameter / 2;
  const circleStrokeWidth = 12;
  const viewBox = radius + circleStrokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeColor = color || '#4F4F4F';
  const activeStrokeSizePercentage = (circleCircumference * (100 - progress)) / 100;

  return (
    <View style={styles.container}>
      <Svg width={diameter} height={diameter} viewBox={\`0 0 \${viewBox * 2} \${viewBox * 2}\`}>
        <G rotation={'-90'} origin={\`\${viewBox}, \${viewBox}\`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={secondaryColor || strokeColor}
            opacity={inActiveStrokeOpacity}
            strokeWidth={circleStrokeWidth}
            r={radius}
            fill="rgba(0,0,0,0)"
          />
          <Circle
            cx="50%"
            cy="50%"
            strokeWidth={circleStrokeWidth}
            stroke={strokeColor}
            r={radius}
            strokeDasharray={circleCircumference}
            strokeDashoffset={activeStrokeSizePercentage}
            strokeLinecap={strokeLinecap}
            fill="rgba(0,0,0,0)"
          />
        </G>
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, styles.valueContainer]}>{children}</View>
    </View>
  );
};

    `

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
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    valueContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
       });

       return defaultsDeep(defaultStyles);
     };

   export default useMergeStyles;

`.trim();

const progressCirlcleFunctions = {
    HeaderImports,
    StateDetails,
    ContextStateDetails,
    Functions,
    ReturnStatement,
    Styles,
};

module.exports = progressCirlcleFunctions;
