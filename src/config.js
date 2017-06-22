/**
 * Global App Config
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

'use strict';

import { Dimensions } from 'react-native';

/* Setup ==================================================================== */
exports.title = 'GlobalConfig';

/* Default Styles ==================================================================== */
// Window Dimensions
const window = Dimensions.get('window');
exports.windowHeight = window.height;
exports.windowWidth = window.width;

// Grid
exports.windowWidthHalf = window.width * 0.5;
exports.windowWidthYhird = window.width * 0.333;
exports.windowWidthYwoThirds = window.width * 0.666;
exports.windowWidthQuarter = window.width * 0.25;
exports.windowWidthThreeQuarters = window.width * 0.75;

// General Element Dimensions
const navbarHeight = 64;
exports.navbarHeight = navbarHeight;
exports.statusBarHeight = 22;

// Fonts
exports.baseFont = 'Roboto';
exports.baseFontSize = 14;

// Colors
exports.primaryColor = '#F17422';
exports.secondaryColor = '#48494A';
exports.textColor = '#555';
exports.borderColor = '#E7E7E7';

// External
// exports.serverURL = 'http://159.203.110.173:9000';
exports.serverURL = 'http://104.40.81.104';
// exports.serverURL = 'http://192.168.1.53:9000';
