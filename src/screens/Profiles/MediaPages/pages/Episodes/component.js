import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { StyledText } from 'kitsu/components/StyledText';
import { isNull, padStart } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { lightGrey, listBackPurple } from 'kitsu/constants/colors';
import { styles } from './styles';

class Episodes extends PureComponent {
  static propTypes = {
    media: PropTypes.shape({
      episodes: PropTypes.array.isRequired,
    }).isRequired,
    libraryEntry: PropTypes.object,
    loadingLibrary: PropTypes.bool,
    onEpisodeProgress: PropTypes.func,
    loadingAdditional: PropTypes.bool,
  }

  static defaultProps = {
    loadingLibrary: false,
    libraryEntry: null,
    onEpisodeProgress: null,
    loadingAdditional: false,
  }

  sortData(data) {
    return data.sort((a, b) => a.number - b.number);
  }

  renderItem = ({ item }) => {
    const { libraryEntry, media, onEpisodeProgress, loadingLibrary } = this.props;

    const numberString = !isNull(item.number) && item.number.toString();
    const paddedString = (numberString && padStart(numberString, 2, '0')) || '-';

    const prefix = media && media.type === 'anime' ? 'Episode' : 'Chapter';
    const title = item.canonicalTitle || `${prefix} ${item.number}`;

    // Check if we've completed the item
    const completed = libraryEntry && !isNull(item.number) && libraryEntry.progress >= item.number;

    return (
      <View style={styles.itemWrap}>
        <StyledText color="black" size="small" bold textStyle={styles.itemNumber}>{paddedString}</StyledText>
        <StyledText color="black" size="small" textStyle={styles.itemTitle}>{title}</StyledText>
        <TouchableOpacity
          onPress={() => onEpisodeProgress && onEpisodeProgress(item.number)}
          style={styles.progressIconContainer}
          disabled={loadingLibrary}
        >
          <View
            style={[styles.progressIconCircle, completed && styles.progressIconCircle__completed]}
          >
            {loadingLibrary && <ActivityIndicator color={lightGrey} />}
            {!loadingLibrary && completed && <Icon name="ios-checkmark" color="#FFFFFF" style={styles.progressIcon} />}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { media, loadingAdditional } = this.props;
    const isAnime = media.type === 'anime';
    const data = this.sortData(isAnime ? media.episodes : media.chapters);

    return (
      <TabContainer light>
        {loadingAdditional ?
          <View style={styles.loading}>
            <ActivityIndicator color={listBackPurple} />
          </View>
          :
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={k => k.id}
            ItemSeparatorComponent={() => <RowSeparator />}
          />
        }

      </TabContainer>
    );
  }
}

export const component = Episodes;
