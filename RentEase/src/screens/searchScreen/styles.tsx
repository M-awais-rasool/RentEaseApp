import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.appColor,
    paddingHorizontal: Theme.responsiveSize.size10,
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
    marginBottom: Theme.responsiveSize.size10,
  },
  subContainer: {
    width: Theme.responsiveSize.size26,
    height: Theme.responsiveSize.size26,
    borderRadius: Theme.responsiveSize.size15,
    backgroundColor: Theme.colors.bgColor9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContainer: {
    height: '80%',
    backgroundColor: Theme.colors.bgColor12,
    borderRadius: Theme.responsiveSize.size20,
    padding: Theme.responsiveSize.size10,
  },
  title: {
    fontSize: Theme.responsiveSize.size16,
    fontWeight: 'bold',
    color: Theme.colors.white,
    marginBottom: Theme.responsiveSize.size10,
  },
  categoryContainer: {
    marginBottom: Theme.responsiveSize.size10,
  },
  categoryTitle: {
    fontSize: Theme.responsiveSize.size13,
    color: Theme.colors.white,
    marginBottom: Theme.responsiveSize.size8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.responsiveSize.size5,
  },
  filterOption: {
    paddingHorizontal: Theme.responsiveSize.size10,
    paddingVertical: Theme.responsiveSize.size5,
    borderRadius: Theme.responsiveSize.size15,
    backgroundColor: Theme.colors.bgColor13,
    marginBottom: Theme.responsiveSize.size5,
  },
  filterText: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size11,
  },
  filterTextSelected: {
    color: Theme.colors.bgColor1,
  },
});

export default styles;
