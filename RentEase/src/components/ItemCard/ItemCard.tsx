import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';

interface Props {
  title: string;
  price: string;
  image: string;
  onPress?: () => void;
}
const ItemCard = (props: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={props.onPress}>
      <ImageBackground style={styles.image} source={{uri: props.image}}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.price}>{props.price}$/day</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ItemCard;
