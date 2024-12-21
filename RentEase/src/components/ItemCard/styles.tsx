import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginRight: Theme.responsiveSize.size4,
    backgroundColor: Theme.colors.bgColor6,
    borderRadius: Theme.responsiveSize.size20,
    marginTop: Theme.responsiveSize.size4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: Theme.responsiveSize.size140,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    height: Theme.responsiveSize.size50,
    backgroundColor: Theme.colors.black,
    marginBottom: Theme.responsiveSize.size6,
    borderRadius: Theme.responsiveSize.size15,
  },
  title: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size12,
    fontWeight: '400',
    margin: Theme.responsiveSize.size5,
    marginLeft: Theme.responsiveSize.size10,
    letterSpacing: 0.5,
  },
  price: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size13,
    marginHorizontal: 8,
    fontWeight: 'bold',
    letterSpacing: 0.7,
    marginLeft: Theme.responsiveSize.size10,
  },
});

export default styles;
