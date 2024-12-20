import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: Theme.colors.appColor,
    width: '90%',
    alignSelf: 'center',
    height: '64%',
    paddingHorizontal: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size20,
  },
  logo: {
    width: Theme.responsiveSize.size90,
    height: Theme.responsiveSize.size30,
    marginTop: Theme.responsiveSize.size10,
    marginBottom: Theme.responsiveSize.size20,
    alignSelf: 'center',
  },
  loginHeading: {
    fontSize: Theme.responsiveSize.size20,
    fontWeight: 'bold',
    letterSpacing: 0.7,
    color: Theme.colors.white,
    paddingLeft: Theme.responsiveSize.size10,
    marginBottom: Theme.responsiveSize.size15,
  },
  marginV5: {
    marginVertical: Theme.responsiveSize.size5,
  },
  marginV10: {
    marginVertical: Theme.responsiveSize.size10,
  },
});

export default styles;
