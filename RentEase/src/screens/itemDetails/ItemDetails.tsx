import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import styles from './styles';
import {CustomButton} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../theme/Theme';
import {Constants} from '../../constants';
import {Calendar} from 'react-native-calendars';

const {width} = Dimensions.get('window');

const CarRentalScreen = (props: any) => {
  const {item} = props.route.params;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [range, setRange] = useState({startDate: '', endDate: ''});

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
            transform: [{scale}],
            opacity,
          },
        ]}
      />
    );
  };

  const onDayPress = (day: any) => {
    const {dateString} = day;

    if (!range.startDate || (range.startDate && range.endDate)) {
      setRange({startDate: dateString, endDate: ''});
      setMarkedDates({
        [dateString]: {
          startingDay: true,
          color: Theme.colors.bgColor1,
          textColor: 'white',
        },
      });
    } else {
      const startDate = new Date(range.startDate);
      const endDate = new Date(dateString);

      if (endDate < startDate) {
        setRange({startDate: dateString, endDate: ''});
        setMarkedDates({
          [dateString]: {
            startingDay: true,
            color: Theme.colors.bgColor1,
            textColor: 'white',
          },
        });
      } else {
        const rangeDates = getDatesInRange(range.startDate, dateString);
        const marked: any = {};

        rangeDates.forEach((date, index) => {
          if (index === 0) {
            marked[date] = {
              startingDay: true,
              color: Theme.colors.bgColor1,
              textColor: 'white',
            };
          } else if (index === rangeDates.length - 1) {
            marked[date] = {
              endingDay: true,
              color: Theme.colors.bgColor1,
              textColor: 'white',
            };
          } else {
            marked[date] = {color: Theme.colors.bgColor1, textColor: 'white'};
          }
        });

        setRange({startDate: range.startDate, endDate: dateString});
        setMarkedDates(marked);
      }
    }
  };

  const getDatesInRange = (startDate: any, endDate: any) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const renderCalendarModal = () => (
    <Modal
      visible={showCalendar}
      animationType="slide"
      transparent
      onRequestClose={() => setShowCalendar(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
          <View style={styles.roundedContainer}>
            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={{
                backgroundColor: Theme.colors.bgColor2,
                calendarBackground: Theme.colors.bgColor2,
                textSectionTitleColor: Theme.colors.white,
                selectedDayBackgroundColor: Theme.colors.bgColor1,
                selectedDayTextColor: Theme.colors.white,
                todayTextColor: Theme.colors.bgColor1,
                dayTextColor: Theme.colors.white,
                textDisabledColor: 'gray',
                monthTextColor: Theme.colors.white,
                arrowColor: Theme.colors.white,
                textDayFontWeight: 'bold',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: 'bold',
                textDayFontSize: Theme.responsiveSize.size14,
                textMonthFontSize: Theme.responsiveSize.size14,
                textDayHeaderFontSize: Theme.responsiveSize.size14,
              }}
            />
          </View>
          <View style={styles.footer1}>
            <Text style={styles.price}>{item?.price}$/day</Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(Constants.MESSAGE_SCREEN, {
                  image: item.image1,
                  userID: item.userID,
                })
              }>
              <Ionicons name="chatbubble-outline" size={25} color="white" />
            </TouchableOpacity>
            <CustomButton
              title="Rent"
              onClick={() => setShowCalendar(true)}
              bgStyle={{width: Theme.responsiveSize.size100}}
            />
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
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        style={styles.carousel}>
        {[item?.image1, item?.image2, item?.image3].map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{uri: image}} style={styles.carImage} />
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {[item?.image1, item?.image2, item?.image3].map((_, index) =>
          renderDot(index),
        )}
      </View>

      {!showCalendar && (
        <View style={styles.footer}>
          <Text style={styles.price}>{item?.price}$/day</Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(Constants.MESSAGE_SCREEN, {
                image: item.image1,
                userID: item.userID,
              })
            }>
            <Ionicons name="chatbubble-outline" size={25} color="white" />
          </TouchableOpacity>
          <CustomButton
            title="Rent"
            onClick={() => setShowCalendar(true)}
            bgStyle={{width: Theme.responsiveSize.size100}}
          />
        </View>
      )}

      {renderCalendarModal()}
    </View>
  );
};

export default CarRentalScreen;
