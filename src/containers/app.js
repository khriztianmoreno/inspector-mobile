/**
 * App - set all the things up
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

'use strict';

/* Setup ==================================================================== */
import React, { Component } from 'react';
import {
  BackAndroid,
  Navigator,
  View,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import NavigationBar from 'react-native-navbar';
import SideMenu from 'react-native-side-menu';

// Actions
import * as SideMenuActions from '../actions/sidemenu';
import * as AuthActions from '../actions/authActions';

// App Globals
import AppStyles from '../styles';
import AppConfig from '../config';
import AppUtil from '../util';

// Components
import Menu from '../components/menu';
import NavbarElements from '../components/navbar.elements';

// Screens
import LoginContainer from '../containers/login';

/* Component ==================================================================== */
class AppContainer extends Component {
  /**
    * On first load
    */
  componentDidMount = () => {
    // Status Bar
    StatusBar.setHidden(false, 'slide'); // Slide in on load
    StatusBar.setBackgroundColor(AppConfig.primaryColor, true); // Android Status Bar Color
    // Configure Hardware Back Button
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const nav = this.rootNavigator;
      if (nav && nav.getCurrentRoutes().length > 1) {
        nav.pop();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  /**
    * An option was pressed in the Side Menu. Go to scene...
    */
  onSideMenuPress = (title, component, extraProps) => {
    // Close menu
    this.props.closeSideMenu();

    if (AppUtil.objIsEmpty(extraProps)) extraProps = {};

    // Change Scene
    const route = {
      title,
      component,
      index: 0,
      ...extraProps,
    };

    if (title === 'Agregar revisión') {
      this.rootNavigator.replace(route);
    } else {
      this.rootNavigator.push({
        ...route,
        index: 1,
      });
    }

    /*if (title === 'Agregar revisión') {
      this.rootNavigator.replace(route);
    } else {
      this.rootNavigator.push({
        ...route,
        index: 1,
      });
    }*/
  }

  /**
    * Toggle Side Menu
    */
  onSideMenuChange = (isOpen) => {
    if (isOpen !== this.props.sideMenuIsOpen) {
      this.props.toggleSideMenu();
    }
  }

  /**
    * Render each scene with a Navbar and Sidebar
    */
  renderScene = (route, navigator) => {
    // Show Hamburger Icon when index is 0, and Back Arrow Icon when index is > 0

    const leftButton = {
      onPress: (route.index > 0)
        ? navigator.pop
        : this.props.toggleSideMenu,
      icon: (route.index > 0)
        ? 'md-arrow-back'
        : 'md-menu',
        // : 'ios-menu-outline',
    };

    // Show a cross icon when transition pops from bottom
    if (route.transition === 'FloatFromBottom') {
      leftButton.icon = 'ios-close-outline';
    }
    return (
      <View style={[AppStyles.appContainer, AppStyles.container]}>
        <NavigationBar
          title={<NavbarElements.Title title={route.title || null} />}
          statusBar={{ style: 'light-content', hidden: false }}
          style={[AppStyles.navbar]}
          tintColor={AppConfig.primaryColor}
          leftButton={
            <NavbarElements.LeftButton 
              onPress={leftButton.onPress}
              icon={leftButton.icon}
            />
          }
        />

        <route.component navigator={navigator} route={route} {...route.passProps} />
      </View>
    );
  }



  /**
    * RENDER
    */
  render() {
    return (
      <SideMenu
        ref={(sideMenu) => { this.rootSidebarMenu = sideMenu; }}
        menu={
          <Menu
            navigate={this.onSideMenuPress}
            ref={(rootMenu) => { this.rootSidebarMenuMenu = rootMenu; }}
            userLogin={this.props.userLogin}
            auth={this.props.auth}
            userLogout={this.props.userLogout}
          />
        }
        disableGestures={this.props.sideMenuGesturesDisabled}
        isOpen={this.props.sideMenuIsOpen}
        onChange={this.onSideMenuChange}
      >

        <Navigator
          ref={nav => this.rootNavigator = nav}
          style={[AppStyles.container, AppStyles.appContainer]}
          renderScene={this.renderScene}
          configureScene={(route, routeStack) => {
            if (route.transition === 'FloatFromBottom') {
              return Navigator.SceneConfigs.FloatFromBottom;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          initialRoute={{
            component: LoginContainer,
            index: 0,
            title: 'Iniciar sesión',
            navigator: this.rootNavigator,
            passProps: { },
          }}
        />

      </SideMenu>
    );
  }
}

// Define which part of the state we're passing to this component
const mapStateToProps = state => ({
  sideMenuIsOpen: state.sideMenu.isOpen,
  auth: state.auth,
});

// Define the actions this component may dispatch
const mapDispatchToProps = {
  toggleSideMenu: SideMenuActions.toggle,
  closeSideMenu: SideMenuActions.close,
  userLogin: AuthActions.userLogin,
  userLogout: AuthActions.userLogout,
};

AppContainer.propTypes = {
  userLogin: React.PropTypes.func,
  userLogout: React.PropTypes.func,
  toggleSideMenu: React.PropTypes.func,
  closeSideMenu: React.PropTypes.func,
  sideMenuIsOpen: React.PropTypes.bool,
  auth: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
