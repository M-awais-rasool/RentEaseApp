import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  StyleSheet,
} from 'react-native';
import styles from './styles';
import { CustomButton } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../theme/Theme';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const CarRentalScreen = (props: any) => {
  const { item } = props.route.params;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('11 October');
  const [endDate, setEndDate] = useState('18 October');

  // Calendar data
  const months = ['October', 'November', 'December'];
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const renderDot = (index: any) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.4, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  const renderCalendarModal = () => (
    <Modal
      visible={showCalendar}
      animationType="slide"
      transparent
      onRequestClose={() => setShowCalendar(false)}
    >
      <View style={calendarStyles.modalContainer}>
        <View style={calendarStyles.calendarContainer}>
          <View style={calendarStyles.calendar}>
            {/* Calendar header */}
            <Text style={calendarStyles.monthText}>October</Text>
            <View style={calendarStyles.weekDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <Text key={index} style={calendarStyles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>
            {/* Calendar grid would go here */}
          </View>

          {/* Date selection dropdowns */}
          <View style={calendarStyles.dateSelection}>
            <View style={calendarStyles.datePickerContainer}>
              <Text style={calendarStyles.label}>From</Text>
              <TouchableOpacity 
                style={calendarStyles.dateButton}
                onPress={() => {}}
              >
                <Text style={calendarStyles.dateButtonText}>{startDate}</Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={calendarStyles.datePickerContainer}>
              <Text style={calendarStyles.label}>To</Text>
              <TouchableOpacity 
                style={calendarStyles.dateButton}
                onPress={() => {}}
              >
                <Text style={calendarStyles.dateButtonText}>{endDate}</Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Price and rent button */}
          <View style={calendarStyles.footer}>
            <Text style={calendarStyles.priceText}>{item?.price}$/day</Text>
            <TouchableOpacity style={calendarStyles.chatButton}>
              <Ionicons name="chatbubble-outline" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={calendarStyles.rentButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={calendarStyles.rentButtonText}>Rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.contianer}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {[item?.image1, item?.image2, item?.image3].map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: image }} style={styles.carImage} />
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {[item?.image1, item?.image2, item?.image3].map((_, index) =>
          renderDot(index),
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>{item?.price}$/day</Text>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={25} color="white" />
        </TouchableOpacity>
        <CustomButton
          title="Rent"
          onClick={() => setShowCalendar(true)}
          bgStyle={{ width: Theme.responsiveSize.size100 }}
        />
      </View>

      {renderCalendarModal()}
    </View>
  );
};

const calendarStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  calendar: {
    marginBottom: 20,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    color: '#666',
  },
  dateSelection: {
    marginBottom: 20,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  dateButtonText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 25,
  },
  rentButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  rentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CarRentalScreen;