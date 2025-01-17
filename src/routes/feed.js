import React from 'react';
import { Image, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Feed from 'kitsu/screens/Feed';
import CreatePost from 'kitsu/screens/Feed/pages/PostCreation/CreatePost';
import homeIcon from 'kitsu/assets/img/tabbar_icons/home.png';
import { statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';
import { commonRoutes } from './common';
import navigationOptions from './navigationOptions';

const PostStack = StackNavigator(
  {
    FeedActivity: {
      screen: Feed,
    },
    ...commonRoutes,
  },
  {
    headerMode: 'none',
    // eslint-disable-next-line react/prop-types
  },
);

const options = navigationOptions();

const FeedStack = StackNavigator(
  {
    PostStack: {
      screen: PostStack,
    },
    CreatePost: {
      screen: CreatePost,
    },
  },
  {
    mode: 'modal',
    navigationOptions: () => ({
      ...options,
      headerStyle: {
        ...options.headerStyle,
        // This may look weird but it's the only way to make the modal status bars look normal
        // On ios it auto adds status bar height, where as on android it doesnt :/
        height: navigationBarHeight + Platform.select({ ios: 0, android: statusBarHeight }),
        paddingTop: Platform.select({ ios: 0, android: statusBarHeight }),
      },
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={homeIcon} style={{ tintColor, width: 21, height: 21 }} />
      ),
    }),
  },
);

export default FeedStack;
