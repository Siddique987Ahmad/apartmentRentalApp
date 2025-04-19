import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import { createApartment } from '../redux/apartment/apartmentSlice';
import { launchImageLibrary } from 'react-native-image-picker';

const CreateApartmentScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [description, setDescription] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [rooms, setRooms] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedAsset = response.assets[0];
        setImage(selectedAsset);
      }
    });
  };
  const user = useSelector(state => state.auth.user); // 👈 Get the logged-in user
  const handleSubmit = async () => {
    if (!description || !areaSize || !rooms || !pricePerMonth || !location || !image) {
      alert('Fill all fields and add an image');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('areaSize', areaSize);
    formData.append('rooms', rooms);
    formData.append('pricePerMonth', pricePerMonth);
    formData.append('location', location);
    formData.append('images', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.type || 'image/jpeg',
    });

    //  dispatch(createApartment(formData));
    // navigation.goBack();
    try {
        const resultAction = await dispatch(createApartment(formData));
        if (createApartment.fulfilled.match(resultAction)) {
          navigation.goBack();
        } else {
          console.log('Error creating apartment:', resultAction.payload || resultAction.error);
          alert(resultAction.payload || 'Failed to create apartment');
        }
      } catch (err) {
        console.log('Unexpected error:', err);
        alert('Something went wrong.');
      }
      
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Area Size (sqft)</Text>
      <TextInput style={styles.input} value={areaSize} onChangeText={setAreaSize} keyboardType="numeric" />

      <Text style={styles.label}>Rooms</Text>
      <TextInput style={styles.input} value={rooms} onChangeText={setRooms} keyboardType="numeric" />

      <Text style={styles.label}>Price Per Month</Text>
      <TextInput style={styles.input} value={pricePerMonth} onChangeText={setPricePerMonth} keyboardType="numeric" />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        <Text style={{ color: '#007bff' }}>{image ? 'Change Image' : 'Pick Image'}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      <Button title="Create Apartment" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4 },
  imagePicker: { marginVertical: 10 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
});

export default CreateApartmentScreen;
