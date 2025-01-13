import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImageCropPicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {profile_update} from '../../services';
import {UserProfile} from './type';
import Theme from '../../theme/Theme';
const {height} = Dimensions.get('screen');
interface FormData extends Partial<UserProfile> {}

const EditProfileScreen = ({navigation, route}: any) => {
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const currentProfile = route.params.profile;

  const [formData, setFormData] = useState<FormData>({
    name: currentProfile.name,
    email: currentProfile.email,
    image: currentProfile.image,
  });

  const mutation = useMutation({
    mutationFn: profile_update,
    onSuccess: () => {
      queryClient.invalidateQueries<any>(['profile']);
      navigation.goBack();
    },
    onError: (err: any) => {
      console.log(err.response.data);
    },
  });

  const handleCamera = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      });
      setFormData(prev => ({...prev, image: image.path}));
      ref.current?.close();
    } catch (error) {
      if ((error as Error).message !== 'User cancelled image selection') {
        console.error(error);
      }
    }
  };

  const handleGallery = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      });
      setFormData(prev => ({...prev, image: image.path}));
      ref.current?.close();
    } catch (error) {
      if ((error as Error).message !== 'User cancelled image selection') {
        console.error(error);
      }
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    key: keyof FormData,
    icon: string,
    multiline: boolean = false,
    editable: boolean = false,
  ) => (
    <View style={styles.inputContainer}>
      <Icon name={icon} size={24} color="#9e9e9e" style={styles.inputIcon} />
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={text => setFormData(prev => ({...prev, [key]: text}))}
          placeholderTextColor="#666"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={editable}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#283593', '#121212']}
          style={styles.headerGradient}>
          <View style={styles.imageContainer}>
            <Image source={{uri: formData.image}} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={() => ref.current.open()}>
              <Icon name="camera" size={22} color="#fff" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          {renderInputField(
            'Full Name',
            formData.name || '',
            'name',
            'account',
            false,
            true
          )}
          {renderInputField(
            'Email Address',
            formData.email || '',
            'email',
            'email',
            false,
            false
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => mutation.mutate(formData)}>
            <LinearGradient
              colors={['#82d533', '#6bb029']}
              style={styles.saveButtonGradient}>
              <Icon name="content-save" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <RBSheet
        ref={ref}
        draggable={true}
        height={height / 4}
        openDuration={650}
        customStyles={{
          container: {
            flex: 1,
            backgroundColor: '#1E1E1E',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Choose Photo</Text>
          <TouchableOpacity
            style={styles.bottomSheetOption}
            onPress={handleCamera}>
            <Icon name="camera" size={24} color="#fff" />
            <Text style={styles.bottomSheetOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetOption}
            onPress={handleGallery}>
            <Icon name="image" size={24} color="#fff" />
            <Text style={styles.bottomSheetOptionText}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Theme.colors.appColor},
  headerGradient: {
    paddingTop: Theme.responsiveSize.size10,
    paddingBottom: Theme.responsiveSize.size10,
  },
  imageContainer: {alignItems: 'center'},
  profileImage: {
    width: Theme.responsiveSize.size90,
    height: Theme.responsiveSize.size90,
    borderRadius: Theme.responsiveSize.size50,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(130, 213, 51, 0.9)',
    paddingHorizontal: Theme.responsiveSize.size10,
    paddingVertical: Theme.responsiveSize.size5,
    borderRadius: Theme.responsiveSize.size20,
    marginTop: Theme.responsiveSize.size1,
    gap: Theme.responsiveSize.size5,
    marginLeft: Theme.responsiveSize.size5,
  },

  changePhotoText: {color: '#fff', marginLeft: 10},
  formContainer: {padding: 20},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  inputIcon: {marginRight: 10},
  inputWrapper: {flex: 1},
  inputLabel: {color: '#9e9e9e', fontSize: 12, marginBottom: 5},
  input: {color: '#fff', fontSize: 16},
  multilineInput: {height: 100, textAlignVertical: 'top'},
  saveButton: {marginTop: 20},
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  saveButtonText: {color: '#fff', marginLeft: 10},
  bottomSheetContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheetContent: {padding: 20},
  bottomSheetTitle: {fontSize: 18, color: '#fff', marginBottom: 20},
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bottomSheetOptionText: {color: '#fff', marginLeft: 10},
});

export default EditProfileScreen;
