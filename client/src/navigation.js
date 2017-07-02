import PropTypes from 'prop-types';
import React from 'react';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Groups from './screens/Groups.screen';
import Messages from './screens/Messages.screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
  },
});

const TestScreen = title => () => (
  <View style={styles.container}>
    <Text>
      {title}
    </Text>
  </View>
);

// Our main scene with tabs
const MainScreenNavigator = TabNavigator({
  Chats: { screen: Groups },
  Settings: { screen: TestScreen('Settings') },
});
// Navigation stack for our entire application
const AppNavigator = StackNavigator({
  Main: { screen: MainScreenNavigator },
  Messages: { screen: Messages }
}, {
  mode: 'modal'
});
// reducer initialization code
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(
  tempNavState,
);
// reducer code
export const navigationReducer = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
// Return original `state` if `nextState` is null or undefined.
  return nextState || state;
};

// Navigation component that integrates with redux
const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

// Connect AppWithNavitationState to Redux!
export default connect(state => ({
  nav: state.nav,
}))(AppWithNavigationState);