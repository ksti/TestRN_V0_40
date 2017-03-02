const React = require('react');
const ReactNative = require('react-native');
const {
  // TouchableNativeFeedback,
  TouchableOpacity,
  View,
} = ReactNative;

// const Button = (props) => {
//   return <TouchableNativeFeedback
//     delayPressIn={0}
//     background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
//     {...props}
//   >
//     {props.children}
//   </TouchableNativeFeedback>;
// };

const ButtonOpacity = (props) => {
  return <TouchableOpacity 
    underlayColor='transparent'
    {...props}
  >
    {props.children}
  </TouchableOpacity>;
};

module.exports = ButtonOpacity;
