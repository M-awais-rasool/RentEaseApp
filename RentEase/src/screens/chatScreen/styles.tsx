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
    backgroundColor: Theme.colors.bgColor1,
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
    color: Theme.colors.bgColor6,
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
    color: Theme.colors.white,
  },
  messgSendBtn: {
    backgroundColor: Theme.colors.bgColor1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  messgSendText: {
    color: Theme.colors.black,
    fontWeight: 'bold',
    letterSpacing: 0.7,
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
  //chat list screen
  chatListContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.appColor,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatInfo: {
    flex: 1,
  },
  image: {
    width: Theme.responsiveSize.size30,
    height: Theme.responsiveSize.size30,
    borderRadius: Theme.responsiveSize.size15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.responsiveSize.size7,
  },
  chatName: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  chatMessage: {
    color: '#aaa',
    fontSize: Theme.responsiveSize.size12,
  },
  unreadBadge: {
    backgroundColor: Theme.colors.bgColor1,
    borderRadius: Theme.responsiveSize.size10,
    width: Theme.responsiveSize.size17,
    height: Theme.responsiveSize.size17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: Theme.colors.black,
    fontSize: Theme.responsiveSize.size11,
  },
  headerTitle: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size17,
    fontWeight: 'bold',
    marginVertical: Theme.responsiveSize.size10,
    marginLeft: Theme.responsiveSize.size10,
  },
  searchInput: {
    backgroundColor: '#333',
    justifyContent: 'space-between',
    width: '95%',
    paddingHorizontal: Theme.responsiveSize.size10,
    alignItems: 'center',
    borderRadius: Theme.responsiveSize.size5,
    marginBottom: Theme.responsiveSize.size10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default styles;
