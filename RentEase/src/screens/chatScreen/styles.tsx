import {StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  contianer: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.black,
    borderTopWidth: 0.5,
    borderColor: Theme.colors.white,
  },
  sendMessgContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    maxWidth: '60%',
    borderRadius: 7,
    margin: 10,
  },
  recevierMessgContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 8,
    margin: 10,
    borderRadius: 7,
    maxWidth: '60%',
  },
  messgText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messgTime: {
    textAlign: 'right',
    fontSize: 9,
    color: 'gray',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    color:Theme.colors.white
  },
  messgSendBtn: {
    backgroundColor: '#1E71B7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  messgSendText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: Theme.responsiveSize.size30,
    height: Theme.responsiveSize.size30,
    borderRadius: Theme.responsiveSize.size15,
    resizeMode: 'cover',
  },
  userNameText: {
    marginLeft: Theme.responsiveSize.size10,
    fontSize: Theme.responsiveSize.size14,
    fontWeight: '500',
    color: Theme.colors.white,
    letterSpacing: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size10,
  },
});

export default styles;
