import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../theme/Theme';
import {ItemCard} from '../../components';

const SearchData = (props: any) => {
  const {data, filter} = props.route.params;
  const FilterOption = ({label}: any) => (
    <View style={[styles.filterOption, {margin: Theme.responsiveSize.size5}]}>
      <Text style={[styles.filterText, styles.filterTextSelected]}>
        {label}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <TouchableOpacity
          style={styles.notifIconContainer}
          onPress={() => props.navigation.goBack()}>
          <View style={styles.subContainer}>
            <Image source={Theme.icons.back_arrow} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifIconContainer}>
          <View style={styles.subContainer}>
            <Ionicons
              name="notifications-outline"
              size={Theme.responsiveSize.size16}
              color={Theme.colors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filter.map((option: any) => (
            <FilterOption key={option} label={option} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.marginV5} />
      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemCard title={item.name} image={item.image1} price={item.price} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={data?.length > 1 && {alignItems: 'center'}}
      />
    </View>
  );
};

export default SearchData;
