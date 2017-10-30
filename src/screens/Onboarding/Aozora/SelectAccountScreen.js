import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { defaultAvatar } from 'kitsu/constants/app';
import { upperFirst, toLower } from 'lodash';
import { kitsu, aozora } from 'kitsu/assets/img/onboarding/';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const AccountView = ({ style, data, selected, onSelectAccount }) => {
  const { libraryCount, username, profileImageURL, accountType } = data;
  const selectedRowStyle = selected ? commonStyles.rowSelected : null;
  const selectedTextStyle = selected ? commonStyles.textSelected : null;
  return (
    <TouchableOpacity
      onPress={() => onSelectAccount(data.accountType)}
      style={[commonStyles.rowWrapper, selectedRowStyle, style]}
    >
      <Image
        style={styles.profileImage}
        source={profileImageURL ? { uri: profileImageURL } : { uri: defaultAvatar }}
      />
      <View style={styles.textWrapper}>
        <Text style={[commonStyles.text, selectedTextStyle]}>{username}</Text>
        <Text style={[styles.libraryCount, selectedTextStyle]}>
          {libraryCount ? `${libraryCount} library entries` : 'Empty Library'}
        </Text>
      </View>
      <Image style={styles.brandImage} source={accountType === 'kitsu' ? kitsu : aozora} />
    </TouchableOpacity>
  );
};

class SelectAccountScreen extends React.Component {
  state = {
    selectedAccount: 'kitsu',
  };

  onSelectAccount = (accountType) => {
    this.setState({ selectedAccount: accountType });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { selectedAccount } = this.state;
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.contentWrapper}>
          <Text style={commonStyles.tutorialText}>
            Oh, you already have a Kitsu account!{'\n'}
            Which do you want to keep?
          </Text>
          <AccountView
            style={{ marginTop: 16 }}
            selected={selectedAccount === 'kitsu'}
            onSelectAccount={this.onSelectAccount}
            data={{
              username: 'Josh',
              libraryCount: '408',
              accountType: 'kitsu',
            }}
          />
          <AccountView
            selected={selectedAccount === 'aozora'}
            onSelectAccount={this.onSelectAccount}
            data={{
              username: 'Wexter',
              libraryCount: '1205',
              accountType: 'aozora',
            }}
          />
          <Text style={styles.ps}>
            Activity feed posts from both accounts will be merged. All other account information
            will be overwritten by the account you select above.
          </Text>
          <Button
            style={{ marginHorizontal: 0, marginTop: 24 }}
            onPress={() => navigate('CreateAccountScreen')}
            title={`Keep ${upperFirst(toLower(selectedAccount))} account`}
            titleStyle={commonStyles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}

export default SelectAccountScreen;
