import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {timeDifferentInMandS, countDownFormat} from '../../utils/time';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ngeohash from 'ngeohash';

export default class CheckinCard extends React.Component {
  state = {
    time: false,
  };

  componentDidMount() {
    const {endAt} = this.props.item;
    const self = this;
    this.interval = setInterval(() => {
      const time = timeDifferentInMandS(endAt);
      self.setState({time});
    }, 1000);
  }

  componentDidUpdate() {
    const {endAt} = this.props.item;
    if (endAt < Date.now()) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onDelete = () => {
    const {onDeleteCheckIn, item} = this.props;
    const {id} = item;

    Alert.alert('Delete check-in', null, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => onDeleteCheckIn(id),
        style: 'destructive',
      },
    ]);
  };

  render() {
    const {
      onCheckInPress,
      currentUserId,
      auth,
      item,
      rank_required,
      onResultPress,
      theme,
      position,
      hasLocationPermission,
    } = this.props;
    const {
      name,
      content,
      point,
      hasPassword,
      priority,
      locationDescription,
      id,
      count,
      checked,
      userId,
      isLocal,
      geohash,
    } = item;
    const {time} = this.state;
    const timeDisplay = countDownFormat(time);

    const myGeoHash = position
      ? ngeohash.encode(position.coords.latitude, position.coords.longitude, 7)
      : null;

    let userIsLocal = false;

    if (myGeoHash && geohash) {
      userIsLocal = geohash.includes(myGeoHash);
    }

    const allowToCheckResult = checked || auth.rank <= rank_required;
    return (
      <TouchableWithoutFeedback>
        <View style={[styles.card, theme.backgroundColor]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.name, styles.text, theme.textColor]}>
              {name}
            </Text>
            {currentUserId == userId || auth.rank <= rank_required ? (
              <TouchableOpacity onPress={this.onDelete}>
                <MaterialIcons name={'close'} size={20} color={'red'} />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text
            numberOfLines={3}
            ellipsizeMode={'tail'}
            style={[styles.text, {color: 'grey'}]}>
            {content.slice(0, 100)} {content.length > 100 ? '...' : null}
          </Text>
          {priority == 3 ? (
            <Text style={[styles.text, theme.textColor]}>Point: {point}</Text>
          ) : null}
          {locationDescription && isLocal ? (
            <Text style={[styles.text, theme.textColor]}>
              Location: {'\n' + locationDescription}
            </Text>
          ) : null}
          <Text style={[styles.text, theme.textColor]}>Attended: {count}</Text>
          {/* <Text style={styles.text}>Points: {point}</Text> */}
          <Text style={[styles.text, theme.textColor]}>
            End At: {timeDisplay}
          </Text>

          <View style={[styles.checkin, theme.underLineColor]}>
            {(checked && time) || (!time && allowToCheckResult) ? (
              <TouchableOpacity
                onPress={() => onResultPress({checkin_id: id, userId: userId})}>
                <View>
                  <Text style={[styles.checkinText]}>Result</Text>
                </View>
              </TouchableOpacity>
            ) : isLocal && !userIsLocal ? (
              <View>
                <Text style={theme.secondaryTextColor}>
                  {hasLocationPermission
                    ? 'User is not nearby'
                    : 'Unable to get user location'}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                disabled={!time}
                onPress={() =>
                  onCheckInPress({checkinId: id, hasPassword: hasPassword})
                }>
                <View style={{flexDirection: 'row'}}>
                  {hasPassword ? (
                    time ? (
                      <MaterialIcons
                        name={'lock'}
                        size={15}
                        style={theme.iconColor}
                      />
                    ) : null
                  ) : null}
                  <Text
                    style={[
                      styles.checkinText,
                      {color: time ? '#74b9ff' : 'grey'},
                    ]}>
                    {time ? 'Check In' : 'Closed'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    // width: '100%',
    margin: 8,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 3,
  },
  checkin: {
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginTop: 5,
  },
  checkinText: {
    fontWeight: 'bold',
    color: '#74b9ff',
  },
});
