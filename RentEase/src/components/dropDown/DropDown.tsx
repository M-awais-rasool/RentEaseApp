import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

interface Props {
  setSelectedItem: (i: string) => void;
  selectedItem: string;
}
const CustomDropdown = (props: Props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [selectedItem, setSelectedItem] = useState('');
  const dropdownHeight = 150;

  const items = [
    'car',
    'bus',
    'Sedans',
    'SUVs',
    'Trucks',
    'Vans',
    'Street Bikes',
    'Off-road Bikes',
    'Cruisers',
    'Mountain Bikes',
    'Electric Bikes',
    'Road Bikes',
    'Speedboats',
    'Sailboats',
    'Kayaks',
    'Motorhomes',
    'Campers',
  ];
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleSelectItem = (item: any) => {
    props.setSelectedItem(item);
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
        activeOpacity={0.8}>
        <Text style={styles.selectedText}>{props.selectedItem}</Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <View
          style={[
            styles.dropdownList,
            {
              bottom: 45,
            },
          ]}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            style={{maxHeight: dropdownHeight}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectItem(item)}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: Theme.responsiveSize.size1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    borderRadius: Theme.responsiveSize.size5,
    padding: Theme.responsiveSize.size8,
    width: '100%',
    backgroundColor: Theme.colors.bgColor12,
  },
  selectedText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.white,
  },
  dropdownList: {
    position: 'absolute',
    width: '100%',
    backgroundColor: Theme.colors.bgColor12,
    borderRadius: Theme.responsiveSize.size5,
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: Theme.responsiveSize.size8,
    borderBottomWidth: Theme.responsiveSize.size1,
    borderBottomColor: '#333',
  },
  itemText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.white,
  },
});

export default CustomDropdown;
