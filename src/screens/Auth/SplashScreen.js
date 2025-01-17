import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';

import anim from 'kitsu/assets/animation/kitsu.json';
import * as colors from 'kitsu/constants/colors';
import { refreshTokens, logoutUser } from 'kitsu/store/auth/actions';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    refreshingToken: false,
  }

  componentDidMount() {
    const { isAuthenticated, completed, refreshTokens, logoutUser, rehydratedAt } = this.props;
    if (rehydratedAt) {
      this.init(refreshTokens, logoutUser, isAuthenticated, completed);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, completed, refreshTokens, logoutUser } = nextProps;
    this.init(refreshTokens, logoutUser, isAuthenticated, completed);
  }

  async init(refresh, logout, authorized, completed) {
    if (this.state.refreshingToken) return;
    this.setState({ refreshingToken: true });

    try {
      const tokens = await refresh();
      console.log('tokens: ', tokens);
      this.setState({ refreshingToken: false });
      this.navigate(authorized, completed);
    } catch (e) {
      this.setState({ refreshingToken: false });
      console.log('token refresh error: ', e);
      logout(this.props.navigation);
    }
  }

  navigate(authorized, completed) {
    const { dispatch } = this.props.navigation;
    let resetAction = null;
    if (authorized && completed) {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        key: null,
      });
    } else if (authorized) {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
        key: null,
      });
    } else {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Intro' })],
        key: null,
      });
    }
    dispatch(resetAction);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.darkPurple,
        }}
      >
      </View>
    );
  }
}

const mapStateToProps = ({ auth, onboarding }) => {
  const { isAuthenticated, rehydratedAt } = auth;
  const { completed } = onboarding;
  return { isAuthenticated, rehydratedAt, completed };
};

SplashScreen.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { refreshTokens, logoutUser })(SplashScreen);
