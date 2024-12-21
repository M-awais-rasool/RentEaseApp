import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import Theme from '../../theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton, InputText} from '../../components';
import {checkPermission} from '../../api/api';

const AddItemScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const pickImage = async (index: number) => {
    const hasPermission = await checkPermission('gallery');
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Gallery permission is required to pick images.',
      );
      return;
    }
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });
      if (image) {
        const newImages = [...images];
        newImages[index] = image.path;
        setImages(newImages);
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.error('Error picking image:', error);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages: any = [...images];
    newImages[index] = null;
    setImages(newImages.filter(Boolean));
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.notifIconContainer}>
        <View style={styles.subContainer}>
          <Ionicons
            name="notifications-outline"
            size={Theme.responsiveSize.size16}
            color={Theme.colors.white}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.photoSection}>
        <View style={styles.mainPhotoBox}>
          <TouchableOpacity
            style={[
              styles.addPhotoButton,
              !images[0] && styles.firstPhotoButton,
            ]}
            onPress={() => pickImage(0)}>
            {images[0] ? (
              <View style={styles.imageWrapper}>
                <Image source={{uri: images[0]}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(0)}>
                  <Icon
                    name="close-circle"
                    size={24}
                    color={Theme.colors.bgColor1}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Icon
                  name="add-circle-outline"
                  size={24}
                  color={Theme.colors.bgColor1}
                />
                <Text style={styles.addPhotoText}>{'Add photos'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryPhotosColumn}>
          {[1, 2].map(index => (
            <View key={index} style={styles.secondaryPhotoBox}>
              <TouchableOpacity
                style={[styles.addPhotoButton, styles.smallPhotoButton]}
                onPress={() => pickImage(index)}>
                {images[index] ? (
                  <View style={styles.imageWrapper}>
                    <Image source={{uri: images[index]}} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}>
                      <Icon
                        name="close-circle"
                        size={24}
                        color={Theme.colors.bgColor1}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Icon
                      name="add-circle-outline"
                      size={24}
                      color={Theme.colors.bgColor1}
                    />
                    <Text style={styles.addPhotoText}>{'Add photos'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.inputSection}>
        <InputText
          title="Item name"
          bgStyle={styles.input}
          textStyle={styles.label}
          value={itemName}
          onChangeText={setItemName}
        />
        <InputText
          title="Description"
          bgStyle={styles.descriptionContainer}
          textStyle={styles.label}
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.row}>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>{'Price'}</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                placeholderTextColor="#666666"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <Text style={styles.priceUnit}>{'/day'}</Text>
            </View>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.label}>{'Category'}</Text>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>
                {category || 'Select'}
              </Text>
              <Icon name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton title="add item" onClick={() => {}} />
      </View>
    </ScrollView>
  );
};

export default AddItemScreen;
