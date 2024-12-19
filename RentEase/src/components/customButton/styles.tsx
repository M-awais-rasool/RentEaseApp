import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  viewMain: {
    paddingHorizontal: Theme.responsiveSize.size20,
    paddingVertical: Theme.responsiveSize.size10,
    borderTopLeftRadius: Theme.responsiveSize.size15,
    borderTopRightRadius: Theme.responsiveSize.size15,
    backgroundColor: Theme.colors.bgColor2,
    shadowColor: Theme.colors.bgColor1,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 15,
  },
  // Common
  bgStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.responsiveSize.size20,
    backgroundColor: Theme.colors.bgColor1,
    paddingVertical: Theme.responsiveSize.size8,
  },
  viewSvg: {
    height: Theme.responsiveSize.size18,
    width: Theme.responsiveSize.size18,
    marginRight: Theme.responsiveSize.size5,
  },
  textStyle: {
    color: Theme.colors.black,
    fontSize: Theme.responsiveSize.size13,
    fontWeight: '500',
    letterSpacing: 0.7,
    // fontFamily: Theme.fontFamily.fontInterMedium,
  },
  image: {
    marginLeft: Theme.responsiveSize.size10,
  },
});

export default styles;
