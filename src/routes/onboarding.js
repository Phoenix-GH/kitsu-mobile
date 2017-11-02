import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
  CreateAccountScreen,
  SelectAccountScreen,
  WelcomeScreen,
  RateScreen,
  OnboardingHeader,
  FavoritesScreen,
  ManageLibrary,
  RatingSystemScreen,
  ImportLibrary,
  ImportDetail,
} from 'kitsu/screens/Onboarding/';
import navigationOptions from './navigationOptions';

const OnboardingStack = StackNavigator(
  {
    RatingSystemScreen: {
      screen: RatingSystemScreen,
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
    },
    CreateAccountScreen: {
      screen: CreateAccountScreen,
    },
    SelectAccountScreen: {
      screen: SelectAccountScreen,
    },
    RateScreen: {
      screen: RateScreen,
    },
    OnboardingHeader: {
      screen: OnboardingHeader,
    },
    FavoritesScreen: {
      screen: FavoritesScreen,
    },
    ManageLibrary: {
      screen: ManageLibrary,
    },
    ImportLibrary: {
      screen: ImportLibrary,
    },
    ImportDetail: {
      screen: ImportDetail,
    },
    RatingSystemScreen: {
      screen: RatingSystemScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      ...navigationOptions(null),
      header: ({ getScreenDetails, scene }) => {
        const { backEnabled } = getScreenDetails(scene).options;
        const { params } = navigation.state;
        return (
          <OnboardingHeader
            navigation={navigation}
            backEnabled={backEnabled}
            buttonRightText={params && params.buttonRightText}
            buttonRightEnabled={params && params.buttonRightEnabled}
            buttonRightOnPress={params && params.buttonRightOnPress}
          />
        );
      },
    }),
  },
);

export default OnboardingStack;
