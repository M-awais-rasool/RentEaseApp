import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  textSubTitle: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size11,
    fontWeight: '500',
    paddingLeft: Theme.responsiveSize.size15,
  },
  viewBgInputText: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Theme.responsiveSize.size38,
    marginTop: Theme.responsiveSize.size3,
    backgroundColor: '#1E1E1E',
    borderRadius: Theme.responsiveSize.size30,
    paddingHorizontal: Theme.responsiveSize.size12,
  },
  textInput: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size12,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  textInput1: {
    color: Theme.colors.textColor6,
    fontSize: Theme.responsiveSize.size13,
    fontWeight: '500',
    paddingVertical: Theme.responsiveSize.size10,
  },
  imageIcon: {
    height: Theme.responsiveSize.size17,
    width: Theme.responsiveSize.size17,
    tintColor: Theme.colors.textColor2,
  },
  textError: {
    color: Theme.colors.textColor5,
    marginTop: Theme.responsiveSize.size2,
    fontSize: Theme.responsiveSize.size11,
    fontWeight: '400',
    paddingLeft: Theme.responsiveSize.size10,
    marginBottom: -Theme.responsiveSize.size5,
  },
});

export default styles;
