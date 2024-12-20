import React, {useState} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import styles from './styles';
import Theme from '../../theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../components';
import {useMutation} from '@tanstack/react-query';
import {get_items_byCategroy} from '../../services';
import {Constants} from '../../constants';

const SearchScreen = (props: any) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterData = {
    Cars: ['car', 'Sedans', 'SUVs', 'Trucks', 'Vans'],
    Motorcycles: ['Street Bikes', 'Off-road Bikes', 'Cruisers'],
    Bicycles: ['Mountain Bikes', 'Electric Bikes', 'Road Bikes'],
    Boats: ['Speedboats', 'Sailboats', 'Kayaks'],
    RVs: ['Motorhomes', 'Campers'],
  };

  const mutation = useMutation<any, Error, string[]>({
    mutationFn: get_items_byCategroy,
    onSuccess: data => {
      props.navigation.navigate(Constants.SEARCH_DATA_SCREEN, {
        data: data.data,
        filter: selectedFilters,
      });
    },
    onError: (error: any) => {
      console.error('Error:', error.response.data.message);
    },
  });

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(item => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleSearch = () => {
    if (selectedFilters.length === 0) {
      Alert.alert('Please select at least one filter!');
      return;
    }
    mutation.mutate(selectedFilters);
  };

  const FilterOption = ({label}: any) => (
    <TouchableOpacity
      style={styles.filterOption}
      onPress={() => toggleFilter(label)}>
      <Text
        style={[
          styles.filterText,
          selectedFilters.includes(label) && styles.filterTextSelected,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.notifIconContainer}>
        <View style={styles.subContainer}>
          <Ionicons
            name="notifications-outline"
            size={Theme.responsiveSize.size16}
            color={Theme.colors.white}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>{'Transport'}</Text>
        {Object.entries(filterData).map(([category, options]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.optionsContainer}>
              {options.map(option => (
                <FilterOption key={option} label={option} />
              ))}
            </View>
          </View>
        ))}
        <CustomButton title="Search" onClick={() => handleSearch()} />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
