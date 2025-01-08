import {Dimensions, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  contianer: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.appColor,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Theme.responsiveSize.size140,
    width: '100%',
  },
  dot: {
    width: Theme.responsiveSize.size5,
    height: Theme.responsiveSize.size5,
    borderRadius: Theme.responsiveSize.size5,
    backgroundColor: Theme.colors.white,
    marginHorizontal: Theme.responsiveSize.size5,
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: Theme.responsiveSize.size40,
    backgroundColor: Theme.colors.appColor,
    height: Theme.responsiveSize.size70,
    width: '95%',
    alignSelf: 'center',
    borderRadius: Theme.responsiveSize.size20,
    paddingHorizontal: Theme.responsiveSize.size20,
  },
  price: {
    fontSize: Theme.responsiveSize.size14,
    color: Theme.colors.white,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: Theme.responsiveSize.size1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    width: '95%',
    backgroundColor: Theme.colors.appColor,
    borderRadius: Theme.responsiveSize.size20,
    padding: Theme.responsiveSize.size20,
    alignSelf: 'center',
    bottom: Theme.responsiveSize.size40,
  },
  roundedContainer: {
    borderRadius: Theme.responsiveSize.size20,
    overflow: 'hidden',
    marginBottom: Theme.responsiveSize.size20,
  },
});

export default styles;
