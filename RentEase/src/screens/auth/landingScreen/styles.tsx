import {StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    width: Theme.responsiveSize.size100,
    height: Theme.responsiveSize.size35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.black,
    marginTop: Theme.responsiveSize.size35,
    alignSelf: 'center',
    borderRadius: Theme.responsiveSize.size10,
  },
  logo: {
    width: Theme.responsiveSize.size90,
    height: Theme.responsiveSize.size30,
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor: Theme.colors.appColor,
    width: '90%',
    bottom: Theme.responsiveSize.size20,
    alignSelf: 'center',
    height: Theme.responsiveSize.size200,
    paddingHorizontal: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size20,
  },
  title: {
    fontSize: Theme.responsiveSize.size16,
    fontWeight: 'bold',
    color: Theme.colors.white,
    textAlign: 'center',
    marginVertical: Theme.responsiveSize.size10,
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: Theme.responsiveSize.size12,
    color: 'white',
    textAlign: 'center',
    lineHeight: Theme.responsiveSize.size18,
    letterSpacing: 0.4,
    marginBottom: Theme.responsiveSize.size15,
  },
});

export default styles;
