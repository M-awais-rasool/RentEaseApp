import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  contianer: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.appColor,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  header: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size16,
    fontWeight: 'bold',
    marginVertical: Theme.responsiveSize.size10,
  },
  notifIconContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.colors.black,
    width: Theme.responsiveSize.size35,
    height: Theme.responsiveSize.size35,
    borderRadius: Theme.responsiveSize.size18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.responsiveSize.size10,
  },
  subContainer: {
    width: Theme.responsiveSize.size26,
    height: Theme.responsiveSize.size26,
    borderRadius: Theme.responsiveSize.size15,
    backgroundColor: Theme.colors.bgColor9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
