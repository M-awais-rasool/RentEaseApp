import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import styles from './styles';

interface Props {
  title: string;
  price: string;
  image: string;
}
const ItemCard = (props: Props) => {
  return (
    <View style={styles.card}>
      <ImageBackground style={styles.image} source={{uri: props.image}}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.price}>{props.price}$/day</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ItemCard;
