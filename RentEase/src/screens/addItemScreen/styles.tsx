import {Dimensions, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.appColor,
    paddingHorizontal: Theme.responsiveSize.size10,
  },
  photoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.responsiveSize.size15,
    height: Dimensions.get('window').width * 0.5,
  },
  notifIconContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.colors.black,
    width: Theme.responsiveSize.size35,
    height: Theme.responsiveSize.size35,
    borderRadius: Theme.responsiveSize.size18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.responsiveSize.size10,
  },
  subContainer: {
    width: Theme.responsiveSize.size26,
    height: Theme.responsiveSize.size26,
    borderRadius: Theme.responsiveSize.size15,
    backgroundColor: Theme.colors.bgColor9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPhotoBox: {
    width: '48%',
    height: '100%',
  },
  secondaryPhotosColumn: {
    width: '48%',
    height: '100%',
    justifyContent: 'space-between',
  },
  secondaryPhotoBox: {
    height: '48%',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.responsiveSize.size5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.responsiveSize.size5,
    borderWidth: Theme.responsiveSize.size1,
    borderColor: Theme.colors.bgColor1,
    borderStyle: 'dashed',
    backgroundColor: Theme.colors.bgColor12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPhotoButton: {
    borderWidth: Theme.responsiveSize.size1,
  },
  firstPhotoButton: {
    borderWidth: Theme.responsiveSize.size1,
  },
  addPhotoText: {
    color: Theme.colors.bgColor1,
    fontSize: Theme.responsiveSize.size12,
    marginTop: Theme.responsiveSize.size3,
  },
  removeButton: {
    position: 'absolute',
    top: Theme.responsiveSize.size5,
    right: Theme.responsiveSize.size5,
    backgroundColor: Theme.colors.appColor,
    borderRadius: Theme.responsiveSize.size11,
  },
  inputSection: {
    gap: Theme.responsiveSize.size15,
  },
  label: {
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size11,
    marginBottom: Theme.responsiveSize.size3,
    opacity: 0.87,
    paddingLeft: 0,
    paddingBottom: 0,
  },
  input: {
    borderRadius: Theme.responsiveSize.size5,
    color: Theme.colors.white,
    marginTop: 0,
  },
  descriptionContainer: {
    backgroundColor: Theme.colors.bgColor12,
    borderRadius: Theme.responsiveSize.size5,
    maxHeight: Theme.responsiveSize.size100,
    minHeight: Theme.responsiveSize.size100,
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    gap: Theme.responsiveSize.size10,
  },
  priceContainer: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgColor12,
    borderRadius: Theme.responsiveSize.size5,
    paddingHorizontal: Theme.responsiveSize.size3,
  },
  priceInput: {
    flex: 1,
    color: Theme.colors.white,
    fontSize: Theme.responsiveSize.size12,
    padding: Theme.responsiveSize.size8,
  },
  priceUnit: {
    color: '#666666',
    fontSize: 16,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButtonText: {
    color: '#666666',
    fontSize: 16,
  },
});

export default styles;
