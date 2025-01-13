import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {get_profile} from '../../services';
import {Constants} from '../../constants';
import Theme from '../../theme/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = (props: any) => {
  const {data} = useQuery({
    queryKey: ['profile'],
    queryFn: get_profile,
  });

  const handleEditPress = () => {
    props.navigation.navigate(Constants.EDIT_PROFILE, {profile: data});
  };

  const handleLogout = () => {
    AsyncStorage.clear();
    props.navigation.replace(Constants.LOGIN_SCREEN);
  };
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#283593', '#121212']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.imageContainer}>
            <Image source={{uri: data?.image}} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={handleEditPress}>
              <Icon name="pencil-circle" size={36} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <Text style={styles.username}>{data?.name}</Text>
        <View style={styles.emailContainer}>
          <Icon name="email" size={20} color="#9e9e9e" />
          <Text style={styles.email}>{data?.email}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{data?.userItemsCount}</Text>
          <Text style={styles.statLabel}>{'Items'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{data?.userRentalItemsCount}</Text>
          <Text style={styles.statLabel}>{'Rentals'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="package-variant" size={24} color="#fff" />
          <Text style={styles.sectionTitle}>{'My Items'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="hand-coin" size={24} color="#fff" />
          <Text style={styles.sectionTitle}>{'Rental Items'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>{'Logout'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: Theme.responsiveSize.size1,
    backgroundColor: Theme.colors.appColor,
  },
  headerGradient: {
    paddingTop: Theme.responsiveSize.size30,
    paddingBottom: Theme.responsiveSize.size25,
  },
  headerContent: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: Theme.responsiveSize.size90,
    height: Theme.responsiveSize.size90,
    borderRadius: Theme.responsiveSize.size45,
    borderWidth: Theme.responsiveSize.size3,
    borderColor: Theme.colors.bgColor1,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Theme.colors.bgColor1,
    borderRadius: Theme.responsiveSize.size15,
    elevation: Theme.responsiveSize.size2,
    shadowColor: Theme.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: Theme.responsiveSize.size2,
  },

  infoContainer: {
    padding: Theme.responsiveSize.size10,
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor12,
    borderRadius: Theme.responsiveSize.size10,
    marginTop: -Theme.responsiveSize.size10,
    marginHorizontal: Theme.responsiveSize.size10,
    elevation: Theme.responsiveSize.size2,
    shadowColor: Theme.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: Theme.responsiveSize.size2,
  },
  username: {
    fontSize: Theme.responsiveSize.size16,
    fontWeight: 'bold',
    color: Theme.colors.white,
    marginBottom: Theme.responsiveSize.size5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size5,
  },
  email: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.textColor31,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Theme.responsiveSize.size10,
    backgroundColor: Theme.colors.bgColor12,
    marginTop: Theme.responsiveSize.size14,
    marginHorizontal: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size10,
    elevation: Theme.responsiveSize.size2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Theme.responsiveSize.size18,
    fontWeight: 'bold',
    color: Theme.colors.white,
  },
  statLabel: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.textColor31,
    marginTop: Theme.responsiveSize.size2,
  },
  divider: {
    width: 1,
    backgroundColor: '#333',
    height: '100%',
  },
  section: {
    backgroundColor: Theme.colors.bgColor12,
    marginTop: Theme.responsiveSize.size10,
    marginHorizontal: Theme.responsiveSize.size10,
    padding: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
    marginBottom: Theme.responsiveSize.size10,
  },
  sectionTitle: {
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    color: Theme.colors.white,
  },
  logoutButton: {
    marginTop: Theme.responsiveSize.size20,
    marginHorizontal: Theme.responsiveSize.size10,
    backgroundColor: Theme.colors.textColor5,
    borderRadius: Theme.responsiveSize.size10,
    padding: Theme.responsiveSize.size10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Theme.responsiveSize.size10,
  },
  logoutText: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
