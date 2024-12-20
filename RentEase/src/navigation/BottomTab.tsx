import React, {useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  AddItemScreen,
  ChatScreen,
  HomeScreen,
  ProfileScreen,
  SearchScreen,
} from '../screens';
import Theme from '../theme/Theme';
import {Constants} from '../constants';

const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({children, onPress, focused}: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.customButtonContainer}>
      <Animated.View
        style={[styles.customButton, {transform: [{scale: scaleAnim}]}]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({focused}) => {
          let iconName: string = '';
          let notificationBadge = false;

          switch (route.name) {
            case Constants.HOME_SCREEN:
              iconName = focused ? 'home' : 'home-outline';
              break;
            case Constants.SEARCH_SCREEN:
              iconName = focused ? 'search' : 'search-outline';
              break;
            case Constants.CHAT_SCREEN:
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              notificationBadge = true;
              break;
            case Constants.PROFILE_SCREEN:
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={25}
                color={focused ? 'white' : 'gray'}
              />
              {notificationBadge && <View style={styles.badge} />}
            </View>
          );
        },
      })}>
      <Tab.Screen name={Constants.HOME_SCREEN} component={HomeScreen} />
      <Tab.Screen name={Constants.SEARCH_SCREEN} component={SearchScreen} />
      <Tab.Screen
        name={Constants.ADD_ITEM_SCREEN}
        component={AddItemScreen}
        options={{
          tabBarButton: props => <TabBarCustomButton {...props} />,
          tabBarIcon: () => <Ionicons name="add" size={30} color="black" />,
        }}
      />
      <Tab.Screen name={Constants.CHAT_SCREEN} component={ChatScreen} />
      <Tab.Screen name={Constants.PROFILE_SCREEN} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  tabBar: {
    position: 'absolute',
    bottom: Theme.responsiveSize.size10,
    left: Theme.responsiveSize.size10,
    right: Theme.responsiveSize.size10,
    elevation: 0,
    backgroundColor: Theme.colors.black,
    borderRadius: Theme.responsiveSize.size40,
    height: Theme.responsiveSize.size50,
  },
  customButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -Theme.responsiveSize.size15,
  },
  customButton: {
    width: Theme.responsiveSize.size50,
    height: Theme.responsiveSize.size50,
    borderRadius: Theme.responsiveSize.size25,
    backgroundColor: Theme.colors.bgColor1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.bgColor1,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: Theme.responsiveSize.size10,
  },
  badge: {
    position: 'absolute',
    top: -Theme.responsiveSize.size1,
    right: -Theme.responsiveSize.size1,
    backgroundColor: 'red',
    width: Theme.responsiveSize.size8,
    height: Theme.responsiveSize.size8,
    borderRadius: Theme.responsiveSize.size5,
  },
});
