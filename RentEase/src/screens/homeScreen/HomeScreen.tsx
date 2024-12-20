import {View, Text, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import {ItemCard} from '../../components';
import {useQuery} from '@tanstack/react-query';
import {get_home_items} from '../../services';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../theme/Theme';

type Item = {
  id: string;
  name: string;
  price: string;
  image1: string;
};
const HomeScreen = () => {
  const {data, error, isLoading} = useQuery<Item[], Error>({
    queryKey: ['homeItems'],
    queryFn: get_home_items,
  });
  return (
    <ScrollView style={styles.contianer}>
      <TouchableOpacity style={styles.notifIconContainer}>
        <View style={styles.subContainer}>
          <Ionicons
            name="notifications-outline"
            size={Theme.responsiveSize.size16}
            color={Theme.colors.white}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.header}>{'For You'}</Text>
      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemCard title={item.name} image={item.image1} price={item.price} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default HomeScreen;
