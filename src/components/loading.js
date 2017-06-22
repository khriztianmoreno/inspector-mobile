/**
 * Loading Screen
 *
     <Loading text={'Server is down'} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

'use strict';

/* Setup ==================================================================== */
import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

// App Globals
import AppStyles from '../styles';

/* Component ================================================================ */
const Loading = (props) => {
  const { text, transparent } = props;
  const colorOfSpinner = transparent ? '#000' : '#AAA';

  return (
    <View
      style={[
        AppStyles.container,
        AppStyles.containerCentered,
        transparent && { backgroundColor: 'rgba(255,255,255,0.75)' },
      ]}
    >
      <ActivityIndicator
        animating
        size="large"
        color={colorOfSpinner}
      />

      <View style={[AppStyles.spacer_10]} />

      {text &&
      <Text style={[AppStyles.baseText]}>
        {text}
      </Text>
      }
    </View>
  );
};

Loading.propTypes = {
  text: React.PropTypes.string,
  transparent: React.PropTypes.bool,
};

/* Export Component ========================================================= */
export default Loading;
