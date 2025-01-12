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
import {CustomButton, DropDown, InputText} from '../../components';
import {checkPermission} from '../../api/api';
import {useMutation} from '@tanstack/react-query';
import {AxiosError, AxiosResponse} from 'axios';
import {add_item} from '../../services';

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

  const addItem = async () => {
    if (!itemName || !description || !price || !category || images.length < 3) {
      Alert.alert('Error', 'Please fill in all fields and add 3 images');
      return;
    }
    const formData = new FormData();
    formData.append('name', itemName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);

    images.forEach((image, index) => {
      if (image) {
        formData.append(`image${index + 1}`, {
          uri: image,
          type: 'image/jpeg',
          name: `image${index + 1}.jpg`,
        });
      }
    });

    addItemMutation.mutate(formData);
  };

  const addItemMutation = useMutation<AxiosResponse<any>, AxiosError, any>({
    mutationFn: add_item,
    onSuccess: data => {
      Alert.alert('Success', 'Item added successfully!');
      setCategory('');
      setDescription('');
      setItemName('');
      setPrice('');
      setImages([]);
    },
    onError: (err: any) => {
      console.error(err.response.data);
      Alert.alert('Error', 'Failed to add item');
    },
  });

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
        <View>
          <Text style={styles.label}>{'Description'}</Text>
          <TextInput
            style={styles.descriptionContainer}
            keyboardType='default'
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>{'Price'}</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <Text style={styles.priceUnit}>{'/day'}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>{'Category'}</Text>
            <DropDown selectedItem={category} setSelectedItem={setCategory} />
          </View>
        </View>
        <CustomButton title="add item" onClick={() => addItem()} />
      </View>
    </ScrollView>
  );
};

export default AddItemScreen;
function useAddItemMutation(): {mutate: any; isLoading: any} {
  throw new Error('Function not implemented.');
}
