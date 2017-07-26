import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Icon, Spinner } from 'native-base';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { Col, Grid } from 'react-native-easy-grid';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import moment from 'moment';

import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card/Card';
import CardStatus from '../../components/Card/CardStatus';
import CardFull from '../../components/Card/CardFull';
import CardTabs from '../../components/Card/CardTabs';
import CardActivity from '../../components/Card/CardActivity';
import ProgressiveImage from '../../components/ProgressiveImage';
import * as colors from '../../constants/colors';
import { defaultAvatar } from '../../constants/app';
import ResultsList from '../../screens/Search/Lists/ResultsList';

import {
  fetchProfile,
  fetchProfileFavorites,
  fetchLibraryEntires,
} from '../../store/profile/actions';
import { getUserFeed } from '../../store/feed/actions';

const Loader = <Spinner size="small" color="grey" />;
class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
    ),
    header: null,
  });

  constructor(props) {
    super(props);
    const userId = props.navigation.state.params && props.navigation.state.params.userId;
    this.state = {
      page: 0,
      userId,
    };
    this.renderInfoBlock = this.renderInfoBlock.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const { userId } = this.state;
    this.props.fetchProfile(userId);
    this.props.fetchLibraryEntires(userId, 12);
    this.props.fetchProfileFavorites(userId, 'character');
    this.props.fetchProfileFavorites(userId, 'manga');
    this.props.fetchProfileFavorites(userId, 'anime');
    // this.props.getUserFeed(user);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile !== this.props.profile) {
      // this.props.navigation.setParams({ name: nextProps.profile.name });
    }
  }

  renderImageRow(items, height = 120, hasCaption, type) {
    let data = items;
    if (type === 'characters') {
      data = items.map((e) => {
        let char = {
          image: defaultAvatar,
        };
        if (e.image) {
          char = {
            ...e,
            image: e.image.original,
          };
        }
        return char;
      });
    }
    if (type === 'entries') {
      data = items.map((e) => {
        let char = {
          image: defaultAvatar,
        };
        if (e.media) {
          char = {
            ...e,
            image: e.media.posterImage.original,
          };
        }
        return char;
      });
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        {data.map((item, index) => (
          <View key={index} style={{ flex: 1, paddingRight: index === data.length - 1 ? 0 : 5 }}>
            <ProgressiveImage
              source={{ uri: item.image }}
              containerStyle={{
                height,
                backgroundColor: colors.imageGrey,
              }}
              style={{ height }}
              hasOverlay={type === 'characters'}
            />
            {hasCaption &&
              <Text
                style={{
                  fontSize: 9,
                  paddingTop: 3,
                  fontFamily: 'OpenSans',
                  textAlign: 'center',
                }}
              >
                {item.caption}
              </Text>}
            {hasCaption &&
              type === 'characters' &&
              <Text
                style={{
                  color: 'white',
                  zIndex: 100,
                  fontWeight: '500',
                  fontSize: 12,
                  fontFamily: 'OpenSans',
                  backgroundColor: 'transparent',
                  alignSelf: 'center',
                  marginTop: -40,
                  marginBottom: 8,
                }}
              >
                {item.name}
              </Text>}
          </View>
        ))}
      </View>
    );
  }

  renderScrollableLibrary(items) {
    const data = items.map((e) => {
      let char = {
        image: defaultAvatar,
      };
      if (e.activities && e.activities[0]) {
        const activity = e.activities[0];
        let caption = '';
        if (activity.verb === 'progressed') {
          caption = `${activity.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'} ${activity.progress}`;
        } else if (activity.verb === 'updated') {
          caption = `${_.capitalize(activity.status.replace('_', ' '))}`;
        } else if (activity.verb === 'rated') {
          caption = `Rated: ${activity.rating}`;
        }
        char = {
          ...activity,
          image: activity.media.posterImage.original,
          caption,
        };
      }
      return char;
    });
    return (
      <ScrollView horizontal style={{ flexDirection: 'row' }}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ margin: 2 }}
            onPress={() =>
              this.props.navigation.navigate('Media', {
                mediaId: item.media.id,
                type: item.media.type,
              })}
          >
            <ProgressiveImage source={{ uri: item.image }} style={{ height: 118, width: 83 }} />
            <Text
              style={{
                fontSize: 9,
                paddingTop: 3,
                fontFamily: 'OpenSans',
                textAlign: 'center',
              }}
            >
              {item.caption}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  wrapTouchable(item, wrap, navigate) {
    if (wrap) {
      return <TouchableOpacity key="6" onPress={() => navigate()}>{item}</TouchableOpacity>;
    }
    return item;
  }

  renderInfoBlock() {
    const { profile, loading, navigation } = this.props;
    const infos = [];
    _.forOwn(getInfo(profile), (item, key) => {
      infos.push(
        this.wrapTouchable(
          <View
            key={item.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 2,
              paddingBottom: 5,
            }}
          >
            <View style={{ width: 25, alignItems: 'center' }}>
              <IconAwe
                name={item.icon}
                style={{
                  fontSize: 11,
                  paddingRight: 10,
                  paddingLeft: 5,
                  alignItems: 'center',
                  color: '#898989',
                }}
              />
            </View>
            <Text
              style={{
                color: '#3A3A3A',
                fontFamily: 'Open Sans',
                fontSize: 11,
              }}
            >
              {item.label}
            </Text>
          </View>,
          key === '6',
          () => navigation.navigate('Network', { userId: profile.id, name: profile.name }),
        ),
      );
    });
    return (
      <View style={{ marginTop: 15 }}>
        {loading && Loader}
        {infos}
      </View>
    );
  }

  refresh(userId) {
    this.props.getUserFeed(userId);
  }

  loadMore(userId) {
    const { loadingUserFeed, userFeed } = this.props;

    if (loadingUserFeed) return;
    // this.props.getUserFeed(userId, userFeed[userFeed.length - 1].id);
  }

  getDataForList(main, index = 0, size = 1) {
    const arr = main.slice(index, size + index);
    const result = arr.map(item => ({
      image: item.posterImage ? item.posterImage.medium : 'none',
      key: item.id,
      id: item.id,
    }));
    return result;
  }

  renderHeader() {
    const {
      profile,
      navigation,
      loading,
      loadingUserFeed,
      currentUser,
      favoritesLoading,
      favorite: { characters, anime, manga },
      entries,
    } = this.props;

    const { userId } = this.state;
    return (
      <View>
        <View
          style={{
            backgroundColor: '#F7F7F7',
            marginTop: 80,
            margin: 10,
            marginBottom: 0,
            borderRadius: 5,
          }}
        >
          <Card leftText="Library" rightText="Reactions">
            <View style={{ marginTop: -50 }}>
              <ProgressiveImage
                source={{ uri: profile.avatar && profile.avatar.medium }}
                style={{
                  width: 80,
                  height: 80,
                  alignSelf: 'center',
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: 'white',
                }}
              />
            </View>
            <View
              style={{
                paddingTop: 5,
                marginLeft: 15,
                marginRight: 15,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#EEEEEE',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#525252', fontFamily: 'OpenSans', fontSize: 12 }}>
                {profile.about}
              </Text>
            </View>
            {this.renderInfoBlock()}
          </Card>
          <CardStatus
            leftText="Write Post"
            rightText="Share Photo"
            user={currentUser}
            toUser={profile}
          />
        </View>
        <View style={{ backgroundColor: '#F7F7F7', borderRadius: 5 }}>
          <CardFull single singleText="View Library" heading="Recent Activity">
            {this.renderScrollableLibrary(entries.slice(0, 12), 110, true, 'entries')}
          </CardFull>
          <CardFull
            single
            singleText="View All Favorites"
            heading="Favorite Characters"
            onPress={() =>
              this.props.navigation.navigate('FavoriteCharacters', {
                label: 'Favorite Characters',
                userId,
              })}
          >
            {this.renderImageRow(
              characters.slice(0, 2),
              (Dimensions.get('window').width - 24) / 2,
              true,
              'characters',
            )}
            {this.renderImageRow(
              characters.slice(2, 5),
              (Dimensions.get('window').width - 24) / 2,
              true,
              'characters',
            )}
            {favoritesLoading.character && Loader}
            {characters.length === 0 &&
              !favoritesLoading.character &&
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  fontSize: 12,
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: 30,
                }}
              >
                User has no favorites.
              </Text>}
          </CardFull>
          <CardTabs
            single
            singleText="View All Favorites"
            heading="Favorite Anime"
            onPress={() =>
              this.props.navigation.navigate('FavoriteMedia', {
                label: 'Favorite Media',
                userId,
              })}
          >
            {anime.length > 0
              ? <Grid tabLabel="Favorite Anime">
                <Col size={45}>
                  <ResultsList
                    dataArray={this.getDataForList(anime)}
                    numColumns={1}
                    imageSize={{
                      h: 250,
                      w: Dimensions.get('window').width * 0.5,
                    }}
                    scrollEnabled={false}
                    onPress={media =>
                        this.props.navigation.navigate('Media', {
                          mediaId: media.id,
                          type: 'anime',
                        })}
                  />
                </Col>
                <Col size={55}>
                  <View style={{ marginTop: -2, marginLeft: 4 }}>
                    <ResultsList
                      dataArray={this.getDataForList(anime, 1, 4)}
                      numColumns={2}
                      imageSize={{
                        h: 127,
                        w: Dimensions.get('window').width / 3,
                        m: 2,
                      }}
                      scrollEnabled={false}
                      onPress={media =>
                          this.props.navigation.navigate('Media', {
                            mediaId: media.id,
                            type: 'anime',
                          })}
                    />
                  </View>
                </Col>
              </Grid>
              : <View tabLabel="Favorite Anime">
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 12,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 50,
                  }}
                >
                    User has no favorites.
                  </Text>
              </View>}
            {manga.length > 0
              ? <Grid tabLabel="Favorite Manga">
                <Col size={45}>
                  <ResultsList
                    dataArray={this.getDataForList(manga)}
                    numColumns={1}
                    imageSize={{
                      h: 250,
                      w: Dimensions.get('window').width * 0.5,
                    }}
                    scrollEnabled={false}
                    onPress={media =>
                        this.props.navigation.navigate('Media', {
                          mediaId: media.id,
                          type: 'manga',
                        })}
                  />
                </Col>
                <Col size={55}>
                  <View style={{ marginTop: -2, marginLeft: 4 }}>
                    <ResultsList
                      dataArray={this.getDataForList(manga, 1, 4)}
                      numColumns={2}
                      imageSize={{
                        h: 127,
                        w: Dimensions.get('window').width / 3,
                        m: 2,
                      }}
                      scrollEnabled={false}
                      onPress={media =>
                          this.props.navigation.navigate('Media', {
                            mediaId: media.id,
                            type: 'manga',
                          })}
                    />
                  </View>
                </Col>
              </Grid>
              : <View tabLabel="Favorite Manga">
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 12,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 50,
                  }}
                >
                    User has no favorites.
                  </Text>
              </View>}
          </CardTabs>
          <Text
            style={{
              color: '#A8A8A8',
              fontWeight: '500',
              fontSize: 12,
              padding: 10,
              paddingBottom: 5,
              paddingTop: 15,
            }}
          >
            ACTIVITY
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      profile,
      navigation,
      loading,
      loadingUserFeed,
      currentUser,
      favorite: { characters, anime, manga },
      entries,
    } = this.props;

    return (
      <Container style={styles.container}>
        <CustomHeader
          navigation={navigation}
          headerImage={{ uri: profile.coverImage && profile.coverImage.original }}
          leftText={profile.name}
        />
        <View style={{ width: Dimensions.get('window').width, marginTop: 65 }}>
          <FlatList
            data={this.props.userFeed}
            ListHeaderComponent={() => this.renderHeader()}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <CardActivity {...item} />}
            refreshing={loadingUserFeed}
            onRefresh={() => this.refresh(profile.id)}
            onEndReached={() => this.loadMore(profile.id)}
            onEndReachedThreshold={0.5}
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { profile, loading, character, manga, anime, library, favoritesLoading } = state.profile;
  const userId = ownProps.navigation.state.params
    && ownProps.navigation.state.params.userId;
  const { currentUser } = state.user;
  const c = (character[userId] && character[userId].map(({ item }) => item)) || [];
  const m = (manga[userId] && manga[userId].map(({ item }) => item)) || [];
  const a = (anime[userId] && anime[userId].map(({ item }) => item)) || [];
  const l = library[userId] || [];
  const { userFeed, loadingUserFeed } = state.feed;
  const filteredFeed = userFeed.filter(
    ({ activities }) => !['comment', 'follow'].includes(activities[0].verb),
  );

  return {
    loading,
    profile: profile[userId] || {},
    currentUser,
    favorite: {
      characters: [...c],
      manga: [...m],
      anime: [...a],
    },
    entries: [...l],
    favoritesLoading,
    userFeed: filteredFeed,
    loadingUserFeed,
  };
};

const styles = {
  container: {
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

ProfileScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  fetchProfileFavorites: PropTypes.func.isRequired,
  fetchLibraryEntires: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
};

const getInfo = (profile, navigate) => {
  const info = {};
  _.forOwn(profile, (value, key) => {
    if (value) {
      if (key === 'waifuOrHusbando') {
        let image = '';
        if (profile.waifu) {
          image = (
            <Image
              source={{ uri: profile.waifu.image.original }}
              style={{ width: 15, height: 15 }}
            />
          );
        }
        info['1'] = {
          label: <Text>{value} is {image} {profile.waifu && profile.waifu.name}</Text>,
          icon: 'heart',
          image,
        };
      }
      if (key === 'gender') {
        info['2'] = { label: `Gender is ${value}`, icon: 'venus-mars' };
      }
      if (key === 'location') {
        info['3'] = { label: `Lives is ${value}`, icon: 'map-marker' };
      }
      if (key === 'birthday') {
        info['4'] = {
          label: `Birthday is ${moment(value).format('MMMM Do')}`,
          icon: 'birthday-cake',
        };
      }
      if (key === 'createdAt') {
        info['5'] = { label: `Joined ${moment(value).fromNow()}`, icon: 'calendar' };
      }
      if (key === 'followersCount' && value > 0) {
        info['6'] = { label: `Followed by ${value} people`, icon: 'user' };
      }
      if (key === 'followingCount' && value > 0) {
        const label = `Following ${value} people`;
        if (info['6'].label.length > 0) {
          info['6'].label = `${info['6'].label}, ${label.toLowerCase()}`;
        } else {
          info['6'] = { label, icon: 'user' };
        }
      }
    }
  });
  return info;
};
export default connect(mapStateToProps, {
  fetchProfile,
  fetchProfileFavorites,
  fetchLibraryEntires,
  getUserFeed,
})(ProfileScreen);