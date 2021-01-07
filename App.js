import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

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
import checkinReducer from './src/reducers/checkinReducer'
import pointReducer from './src/reducers/pointReducer'

import SignIn from './src/screens/signin';
import SignUp from './src/screens/signup';
import HomeDrawerNavigator from './src/navigators/homeDrawerNavigator';
import GroupDrawerNavigator from './src/navigators/groupDrawerNavigator'
import GroupsSearch from './src/screens/groupsSearch';
import GroupCreation from './src/screens/groupCreation';
import Group from './src/screens/group';
import Comment from './src/screens/comment';
import PostSetting from './src/screens/postSetting';
import GroupSetting from './src/screens/groupSetting';
import ChangePassword from './src/screens/changePassword';
import Members from './src/screens/members';
import Member from './src/screens/member';
import UserSearch from './src/screens/userSearch'
import ForgetPassword from './src/screens/forgetPassword'
import Nomination from './src/screens/nomination'
import NominationSetting from './src/screens/nominationSetting'
import NominationResult from './src/screens/nominationResult'
import Tag from './src/screens/tag'
import NominationPost from './src/screens/nominationPost'
import CheckIn from './src/screens/checkin'
import CheckInSetting from './src/screens/checkinSetting'
import Post from './src/screens/post'
import CheckInResult from './src/screens/checkinResult'
import Leaderboard from './src/screens/leaderboard'


import messaging from '@react-native-firebase/messaging';


const rootReducer = combineReducers({
  auth: authReducer,
  currentScreen: currentScreenReducer,
  group: groupReducer,
  post: postReducer,
  comment: commentReducer,
  user: userReducer,
  checkin: checkinReducer,
  point: pointReducer
});

const persistConfig = {
  storage: AsyncStorage,
  key: 'root',
  whitelist: ['auth'],
  blacklist: ['currentScreen', 'group', 'post', 'comment', 'user', 'checkin', 'pointReducer'],
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
  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage))
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
            <Stack.Screen name="Create Group" component={GroupCreation} />
            <Stack.Screen
              name="GroupNavigator"
              component={GroupDrawerNavigator}
            />
            {/* <Stack.Screen
              name="Group"
              component={Group}
              options={{headerBackTitleVisible: false}}
            /> */}
            <Stack.Screen name="Comment" component={Comment} />
            <Stack.Screen name="PostSetting" component={PostSetting} />
            <Stack.Screen name="GroupSetting" component={GroupSetting} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Members" component={Members} />
            <Stack.Screen name="Member" component={Member} />
            <Stack.Screen name="SearchUser" component={UserSearch} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword}/>
            <Stack.Screen name="Nomination" component={Nomination} />
            <Stack.Screen name="NominationSetting" component={NominationSetting} />
            <Stack.Screen name="NominationResults" component={NominationResult}/>
            <Stack.Screen name="Tags" component={Tag}/>
            <Stack.Screen name="NominationPost" component={NominationPost} />
            <Stack.Screen name="CheckIn" component={CheckIn} />
            <Stack.Screen name="CheckInSetting" component={CheckInSetting} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="CheckInResult" component={CheckInResult} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
});
