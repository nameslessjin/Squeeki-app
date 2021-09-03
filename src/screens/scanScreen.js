import {BarCodeScanner} from 'expo-barcode-scanner';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {getTheme} from '../utils/theme';
import {scanQRCode, redeemUserReward} from '../actions/reward';
import ScanScreenModal from '../components/scanScreen/scanScreenModal';

const {width} = Dimensions.get('screen');

class ScanScreen extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
    ...this.props.route.params,
    permission: false,
    scanned: false,
    modalVisible: false,
    message: null,
    data: null,
  };

  componentDidMount() {
    const {theme} = this.state;
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTintColor: theme.textColor.color,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
    });
    this.hasPermission();
  }

  hasPermission = async () => {
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      this.setState({permission: status});
    } else {
      alert('Permission needed to use camera');
    }
  };

  handleBarCodeScanned = async ({type, data}) => {
    const {group, auth, scanQRCode} = this.props;
    const request = {
      token: auth.token,
      type: 'reward',
      id: data,
    };
    this.setState({modalVisible: true, scanned: true});
    const req = await scanQRCode(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward at this time, please try again later');
      return;
    }

    this.setState({data: req});
  };

  redeemUserReward = async id => {
    const {redeemUserReward, auth, group} = this.props;

    const request = {
      token: auth.token,
      rewardId: id,
    };

    const hasRewardManagementAuthority = group.group.auth
      ? group.group.auth.rank <=
        group.group.rank_setting.manage_reward_rank_required
      : false;

    if (!hasRewardManagementAuthority) {
      alert(
        'Your current rank is below allowed rank to manage rewards, please check with the group owner',
      );
      return;
    }

    const req = await redeemUserReward(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot redeem user reward at this time, please try again later');
      return;
    }
    this.setState({data: null, modalVisible: false, message: 'Redeem success'});
  };

  onPress = (type, id) => {
    if (type == 'scanAgain') {
      this.setState({scanned: false, message: null});
    } else if (type == 'redeem') {
      this.redeemUserReward(id);
    }
  };

  onBackgroundPress = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {theme, scanned, modalVisible, data, prevRoute, message} = this.state;
    return (
      <View style={[styles.container, theme.backgroundColor]}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? null : this.handleBarCodeScanned}
          style={{width: width, height: 300, marginTop: 100}}
        />
        {scanned ? (
          <TouchableOpacity onPress={() => this.onPress('scanAgain')}>
            <View style={styles.scanButton}>
              <Text style={{color: 'white'}}>Scan Again</Text>
            </View>
          </TouchableOpacity>
        ) : null}
        {message ? (
          <Text style={[theme.textColor, {marginTop: 10}]}>{message}</Text>
        ) : null}
        {modalVisible ? (
          <ScanScreenModal
            modalVisible={modalVisible}
            onBackgroundPress={this.onBackgroundPress}
            theme={theme}
            data={data}
            prevRoute={prevRoute}
            onPress={this.onPress}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 15,
    backgroundColor: '#EA2027',
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    scanQRCode: data => dispatch(scanQRCode(data)),
    redeemUserReward: data => dispatch(redeemUserReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScanScreen);
