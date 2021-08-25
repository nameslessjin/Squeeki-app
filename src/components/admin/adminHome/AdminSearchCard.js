import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {getTheme} from '../../../utils/theme';
import {singleDefaultIcon} from '../../../utils/defaultIcon';
import {dateConversion} from '../../../utils/time';
import PostMedia from '../../posts/postMedia';
import AdminModal from './adminModal';
import {adminAction, updateSecurityClearance} from '../../../actions/security';

const {width} = Dimensions.get('screen');

class AdminSearchCard extends React.Component {
  state = {
    ...this.props,
    theme: getTheme(this.props.auth.user.theme),
    modalVisible: false,
  };

  onPress = () => {
    const {type, item} = this.props;
    const {id} = item;
    this.setState({modalVisible: true});
    Keyboard.dismiss();
  };

  onBackgroundPress = () => {
    this.setState({modalVisible: false});
  };

  securityClearanceDisplay = (type, value) => {
    const {theme} = this.state;

    if (type == 'securityClearanceLvl' || type == 'clearanceStatus') {
      return (
        <Text style={theme.textColor}>
          {type}: {value}
        </Text>
      );
    }

    if (value) {
      return <Text style={theme.textColor}>{type}</Text>;
    }
    return null;
  };

  onAction = async data => {
    const {auth, item, adminAction} = this.props;
    const {id, status} = item;
    const {action} = data;
    const request = {
      token: auth.token,
      id,
      ...data,
    };

    const req = await adminAction(request);
    if (req.errors) {
      console.log(req.errors);
      if (req.errors[0].message == 'Security clearance failed') {
        alert('Security clearance failed');
      }
      return;
    }

    let updateStatus = status;
    if (action == 'suspend') {
      updateStatus = 'suspended';
    } else if (action == 'delete') {
      updateStatus = 'deleted';
    } else if (action == 'activate') {
      updateStatus = 'active';
    }

    this.setState(prevState => ({
      item: {...prevState.item, status: updateStatus},
    }));
  };

  updateSecurityClearance = async data => {
    const {auth, updateSecurityClearance} = this.props;
    const updatedSecurityClearance = this.state.item.securityClearance
      ? {
          userId: this.state.item.id,
          ...this.state.item.securityClearance,
          ...data,
        }
      : {
          userId: this.state.item.id,
          ...data,
          deleteUserClearance: false,
          deleteGroupClearance: false,
          deletePostClearance: false,
          deleteCommentClearance: false,
        };
    const request = {
      token: auth.token,
      securityClearance: updatedSecurityClearance,
    };

    const req = await updateSecurityClearance(request);
    if (req.errors) {
      console.log(req.errors);
      if (req.errors[0].message == 'Security clearance failed') {
        alert('Security clearance failed');
      }
      return;
    }

    this.setState(prevState => ({
      item: {
        ...prevState.item,
        securityClearance: updatedSecurityClearance,
      },
    }));
  };

  render() {
    const {navigation, type, metadata} = this.props;
    const {theme, modalVisible, item} = this.state;
    const {
      id,
      username,
      displayName,
      icon,
      status,
      groupname,
      shortDescription,
      image,
      content,
      createdAt,
      user,
      postId,
      replyId,
      securityClearance,
    } = item;

    let userSecurityClearanceDisplay = null;
    if (type == 'user' && securityClearance) {
      if (
        securityClearance.securityClearanceLvl <=
        metadata.securityClearance.securityClearanceLvl
      ) {
        const {
          securityClearanceLvl,
          searchUserClearance,
          suspendUserClearance,
          deleteUserClearance,
          searchGroupClearance,
          suspendGroupClearance,
          deleteGroupClearance,
          searchPostClearance,
          suspendPostClearance,
          deletePostClearance,
          searchCommentClearance,
          suspendCommentClearance,
          deleteCommentClearance,
        } = securityClearance;
        userSecurityClearanceDisplay = (
          <View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'securityClearanceLvl',
                securityClearanceLvl,
              )}
              {this.securityClearanceDisplay(
                'clearanceStatus',
                securityClearance.status,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'searchUserClearance',
                searchUserClearance,
              )}
              {this.securityClearanceDisplay(
                'suspendUserClearance',
                suspendUserClearance,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'deleteUserClearance',
                deleteUserClearance,
              )}
              {this.securityClearanceDisplay(
                'searchGroupClearance',
                searchGroupClearance,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'suspendGroupClearance',
                suspendGroupClearance,
              )}
              {this.securityClearanceDisplay(
                'deleteGroupClearance',
                deleteGroupClearance,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'searchPostClearance',
                searchPostClearance,
              )}
              {this.securityClearanceDisplay(
                'suspendPostClearance',
                suspendPostClearance,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'deletePostClearance',
                deletePostClearance,
              )}
              {this.securityClearanceDisplay(
                'searchCommentClearance',
                searchCommentClearance,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'suspendCommentClearance',
                suspendCommentClearance,
              )}
            </View>
            <View style={styles.metaDataSubContainer}>
              {this.securityClearanceDisplay(
                'deleteCommentClearance',
                deleteCommentClearance,
              )}
            </View>
          </View>
        );
      } else if (
        securityClearance.securityClearanceLvl >
        metadata.securityClearance.securityClearanceLvl
      ) {
        userSecurityClearanceDisplay = (
          <View style={styles.metaDataSubContainer}>
            <Text style={theme.textColor}>
              User has higher clearance level than you
            </Text>
          </View>
        );
      } else if (securityClearance.status == 'active') {
        <View style={styles.metaDataSubContainer}>
          <Text style={theme.textColor}>
            User security clearance is inactive
          </Text>
        </View>;
      }
    }

    const postType = item.type;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onPress}>
          <View
            style={[
              styles.card,
              theme.backgroundColor,
              {width: type == 'post' ? width : width * 0.95},
            ]}>
            {type == 'group' ? (
              <View style={styles.rowCard}>
                <View style={styles.groupIconHolder}>
                  <Image
                    source={icon ? {uri: icon} : singleDefaultIcon()}
                    style={styles.groupIcon}
                  />
                </View>
                <View style={{width: width * 0.95 - 120}}>
                  <Text style={[styles.groupnameStyle, theme.textColor]}>
                    {displayName}
                  </Text>
                  <Text style={[styles.groupnameStyle, {color: 'grey'}]}>
                    @{groupname}
                  </Text>
                  <Text style={[theme.textColor]}>{shortDescription}</Text>
                </View>
              </View>
            ) : null}
            {type == 'user' ? (
              <View style={styles.rowCard}>
                <View style={styles.userIconHolder}>
                  <Image
                    source={icon ? {uri: icon} : singleDefaultIcon()}
                    style={styles.userIcon}
                  />
                </View>
                <View style={{width: width * 0.95 - 70}}>
                  <Text style={[styles.groupnameStyle, theme.textColor]}>
                    {displayName}
                  </Text>
                  <Text style={[styles.postCommentNameStyle]}>@{username}</Text>
                </View>
              </View>
            ) : null}
            {type == 'post' ? (
              <View style={styles.postCard}>
                <View style={styles.postCommentHeader}>
                  <View style={[styles.postCommentUserIconholder]}>
                    <Image
                      source={
                        user.icon ? {uri: user.icon} : singleDefaultIcon()
                      }
                      style={styles.postCommentUserIcon}
                    />
                  </View>
                  <View style={styles.postUserInfoContainer}>
                    <View style={styles.postUserNameContainer}>
                      <Text style={[styles.groupnameStyle, theme.textColor]}>
                        {user.displayName}
                      </Text>
                      <Text style={[styles.postCommentNameStyle]}>
                        @{user.username}
                      </Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeStyle}>
                        {dateConversion(createdAt, 'timeDisplay')}
                      </Text>
                    </View>
                  </View>
                </View>
                <PostMedia image={image} content={content} theme={theme} />
              </View>
            ) : null}
            {type == 'comment' ? (
              <View style={styles.postCard}>
                <View style={styles.postCommentHeader}>
                  <View style={[styles.postCommentUserIconholder]}>
                    <Image
                      source={
                        user.icon ? {uri: user.icon} : singleDefaultIcon()
                      }
                      style={styles.postCommentUserIcon}
                    />
                  </View>
                  <View style={styles.postUserInfoContainer}>
                    <View style={styles.postUserNameContainer}>
                      <Text
                        style={[
                          styles.groupnameStyle,
                          {color: theme.textColor.color},
                        ]}>
                        {user.displayName}
                      </Text>
                      <Text style={[styles.postCommentNameStyle]}>
                        @{user.username}
                      </Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeStyle}>
                        {dateConversion(createdAt, 'timeDisplay')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', padding: 10}}>
                  <Text style={theme.textColor}>{content}</Text>
                </View>
              </View>
            ) : null}
            <View style={styles.metadata}>
              <View style={styles.metaDataSubContainer}>
                <Text style={theme.textColor}>Status: {status}</Text>
                {type == 'post' ? (
                  <Text style={theme.textColor}>Type: {postType}</Text>
                ) : null}
              </View>
              {type == 'comment' ? (
                <View style={styles.metaDataSubContainer}>
                  <Text style={theme.textColor}>postId: {postId}</Text>
                </View>
              ) : null}
              {replyId ? (
                <View style={styles.metaDataSubContainer}>
                  <Text style={theme.textColor}>replyId: {replyId}</Text>
                </View>
              ) : null}
              {type == 'user' ? userSecurityClearanceDisplay : null}
            </View>
            <AdminModal
              theme={theme}
              modalVisible={modalVisible}
              onBackgroundPress={this.onBackgroundPress}
              type={type}
              securityClearance={metadata.securityClearance}
              securityClearanceLvl={
                securityClearance
                  ? securityClearance.securityClearanceLvl
                  : user
                  ? user.securityClearance.securityClearanceLvl
                  : 0
              }
              status={status}
              onAction={this.onAction}
              updateSecurityClearance={this.updateSecurityClearance}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.95,
    borderRadius: 15,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 7,
  },
  groupIconHolder: {
    aspectRatio: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 5,
  },
  groupIcon: {
    height: 90,
    aspectRatio: 1,
    borderRadius: 20,
  },
  groupnameStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  userIconHolder: {
    aspectRatio: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  userIcon: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  postCommentUserIconholder: {
    aspectRatio: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  postCommentUserIcon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  postCommentHeader: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    paddingHorizontal: 5,
  },
  postCommentNameStyle: {
    fontSize: 13,
    color: 'grey',
  },
  postCard: {
    width: '100%',
  },
  postUserInfoContainer: {
    width: width * 0.95 - 70,
    height: 40,
    flexDirection: 'row',
  },
  postUserNameContainer: {
    width: width * 0.95 - 130,
    height: 40,
  },
  timeContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeStyle: {
    color: '#95a5a6',
    fontSize: 12,
  },
  metadata: {
    width: '100%',
    padding: 10,
  },
  metaDataSubContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  const {auth, metadata} = state;
  return {auth, metadata};
};

const mapDispatchToProps = dispatch => {
  return {
    adminAction: data => dispatch(adminAction(data)),
    updateSecurityClearance: data => dispatch(updateSecurityClearance(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminSearchCard);
