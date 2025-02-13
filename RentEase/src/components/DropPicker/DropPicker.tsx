import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import Theme from '../../theme/Theme';

const DropPicker = (props: any) => {
  return (
    <View >
      <View style={styles.viewLoader}>
        <View></View>
        <Text style={styles.textStyleTitle}>{props.title}</Text>
        <View
          style={{
            borderBottomWidth: Theme.responsiveSize.size1,
            borderColor: '#E7E7E7',
          }}
        />
        <TouchableOpacity onPress={props.Camera}>
          <Text style={styles.textStyle}>{'Camera'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.Image}>
          <Text style={styles.textStyle}>{'Gallery'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.Close}>
          <Text style={styles.textStyle}>{'Close'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DropPicker;
