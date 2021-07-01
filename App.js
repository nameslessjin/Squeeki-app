import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// reducers import
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './src/reducers/authReducer';
import currentScreenReducer from './src/reducers/currentScreenReducer';
import groupReducer from './src/reducers/groupReducer';
import postReducer from './src/reducers/postReducer';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {PersistGate} from 'redux-persist/integration/react';
import {createLogger} from 'redux-logger';
import commentReducer from './src/reducers/commentReducer';
import userReducer from './src/reducers/userReducer';
import checkinReducer from './src/reducers/checkinReducer';
import pointReducer from './src/reducers/pointReducer';
import rewardReducer from './src/reducers/rewardReducer';
import chatReducer from './src/reducers/chatReducer';

// screens import
import SignIn from './src/screens/signin';
import SignUp from './src/screens/signup';
import HomeDrawerNavigator from './src/navigators/homeDrawerNavigator';
import GroupDrawerNavigator from './src/navigators/groupDrawerNavigator';
import GroupsSearch from './src/screens/groupsSearch';
import GroupCreation from './src/screens/groupCreation';
import Comment from './src/screens/comment';
import PostSetting from './src/screens/postSetting';
import GroupSetting from './src/screens/groupSetting';
import ChangePassword from './src/screens/changePassword';
import Members from './src/screens/members';
import Member from './src/screens/member';
import UserSearch from './src/screens/userSearch';
import ForgetPassword from './src/screens/forgetPassword';
import Nomination from './src/screens/nomination';
import NominationSetting from './src/screens/nominationSetting';
import NominationResult from './src/screens/nominationResult';
import Tag from './src/screens/tag';
import NominationPost from './src/screens/nominationPost';
import CheckIn from './src/screens/checkin';
import CheckInSetting from './src/screens/checkinSetting';
import Post from './src/screens/post';
import CheckInResult from './src/screens/checkinResult';
import Leaderboard from './src/screens/leaderboard';
import RewardTabNavigator from './src/navigators/rewardTabNavigator';
import RewardSetting from './src/screens/rewardSetting';
import RewardHistory from './src/screens/rewardHistory';
import GroupJoinRequest from './src/screens/groupJoinRequest';
import TermDisplay from './src/screens/termDisplay';
import Terms from './src/screens/terms';
import GroupRules from './src/screens/groupRules';
import Chats from './src/screens/chats';
import ChatSetting from './src/screens/chatSetting';
import Chat from './src/screens/chat';
import RankSetting from './src/screens/rankSetting';
import Profile from './src/screens/profile';
import ChatDrawerNavigator from './src/navigators/chatDrawerNavigator';
import ChatMembers from './src/screens/chatMembers';
import UserSettings from './src/screens/userSettings';
import NotificationSettings from './src/screens/notificationSettings';
import VisibilitySettings from './src/screens/visibilitySettings';
import ThemeSettings from './src/screens/themeSettings';
import Activity from './src/screens/activity';
import TaskManagement from './src/screens/taskManagement';
import TaskVerify from './src/screens/taskVerify'

import messaging from '@react-native-firebase/messaging';

const rootReducer = combineReducers({
  auth: authReducer,
  currentScreen: currentScreenReducer,
  group: groupReducer,
  post: postReducer,
  comment: commentReducer,
  user: userReducer,
  checkin: checkinReducer,
  point: pointReducer,
  reward: rewardReducer,
  chat: chatReducer,
});

const persistConfig = {
  storage: AsyncStorage,
  key: 'root',
  whitelist: ['auth'],
  blacklist: [
    'currentScreen',
    'group',
    'post',
    'comment',
    'user',
    'checkin',
    'point',
    'reward',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk, createLogger())),
);

let persistor = persistStore(store);

const Stack = createStackNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  return routeName;
}

export default (App = () => {
  // const [token, setToken] = useState('')

  // AsyncStorage.getItem('token').then(r => {

  //   if (r){
  //     setToken(r)
  //   }
  // }).catch(e => {
  //   console.log(e)
  // })

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{headerShown: false}}
            />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen
              name="Home"
              component={HomeDrawerNavigator}
              options={({route}) => ({headerTitle: getHeaderTitle(route)})}
            />
            <Stack.Screen name="Search" component={GroupsSearch} />
            <Stack.Screen name="GroupCreation" component={GroupCreation} />
            <Stack.Screen
              name="GroupNavigator"
              component={GroupDrawerNavigator}
            />
            <Stack.Screen name="Comment" component={Comment} />
            <Stack.Screen name="PostSetting" component={PostSetting} />
            <Stack.Screen name="GroupSetting" component={GroupSetting} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Members" component={Members} />
            <Stack.Screen name="Member" component={Member} />
            <Stack.Screen name="SearchUser" component={UserSearch} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="Nomination" component={Nomination} />
            <Stack.Screen
              name="NominationSetting"
              component={NominationSetting}
            />
            <Stack.Screen
              name="NominationResults"
              component={NominationResult}
            />
            <Stack.Screen name="Tags" component={Tag} />
            <Stack.Screen name="NominationPost" component={NominationPost} />
            <Stack.Screen name="CheckIn" component={CheckIn} />
            <Stack.Screen name="CheckInSetting" component={CheckInSetting} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="CheckInResult" component={CheckInResult} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} />
            <Stack.Screen
              name="RewardNavigator"
              component={RewardTabNavigator}
            />
            <Stack.Screen name="RewardSetting" component={RewardSetting} />
            <Stack.Screen name="RewardHistory" component={RewardHistory} />
            <Stack.Screen
              name="GroupJoinRequest"
              component={GroupJoinRequest}
            />
            <Stack.Screen name="Terms" component={Terms} />
            <Stack.Screen name="TermDisplay" component={TermDisplay} />
            <Stack.Screen name="GroupRules" component={GroupRules} />
            <Stack.Screen
              name="ChatDrawerNavigator"
              component={ChatDrawerNavigator}
            />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="ChatSetting" component={ChatSetting} />
            <Stack.Screen name="RankSetting" component={RankSetting} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChatMembers" component={ChatMembers} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettings}
            />
            <Stack.Screen
              name="VisibilitySettings"
              component={VisibilitySettings}
            />
            <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
            <Stack.Screen name="Activity" component={Activity} />
            <Stack.Screen name="TaskManagement" component={TaskManagement} />
            <Stack.Screen name="TaskVerify" component={TaskVerify} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
});
