import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createApartment} from '../redux/apartment/apartmentSlice';
import {launchImageLibrary} from 'react-native-image-picker';

const CreateApartmentScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  const [formData, setFormData] = useState({
    description: '',
    areaSize: '',
    rooms: '',
    pricePerMonth: '',
    location: '',
  });
  const [image, setImage] = useState(null);

  const handlePickImage = useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      setImage(response.assets[0]);
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = useCallback(async () => {
    const {description, areaSize, rooms, pricePerMonth, location} = formData;
    
    if (!description || !areaSize || !rooms || !pricePerMonth || !location || !image) {
      Alert.alert('Error', 'Please fill all fields and add an image');
      return;
    }

    const data = new FormData();
    data.append('description', description);
    data.append('areaSize', areaSize);
    data.append('rooms', rooms);
    data.append('pricePerMonth', pricePerMonth);
    data.append('location', location);
    data.append('images', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.type || 'image/jpeg',
    });

    try {
      const result = await dispatch(createApartment(data));
      if (createApartment.fulfilled.match(result)) {
        navigation.goBack();
      } else {
        Alert.alert('Error', result.payload || 'Failed to create apartment');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
      console.error('Unexpected error:', err);
    }
  }, [formData, image, dispatch, navigation]);

  return (
    <View style={styles.container}>
      <FormField
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
      />
      
      <FormField
        label="Area Size (sqft)"
        value={formData.areaSize}
        onChangeText={(text) => handleChange('areaSize', text)}
        keyboardType="numeric"
      />
      
      <FormField
        label="Rooms"
        value={formData.rooms}
        onChangeText={(text) => handleChange('rooms', text)}
        keyboardType="numeric"
      />
      
      <FormField
        label="Price Per Month"
        value={formData.pricePerMonth}
        onChangeText={(text) => handleChange('pricePerMonth', text)}
        keyboardType="numeric"
      />
      
      <FormField
        label="Location"
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
      />

      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>
          {image ? 'Change Image' : 'Pick Image'}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{uri: image.uri}} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Apartment</Text>
      </TouchableOpacity>
    </View>
  );
};

// Reusable form field component
const FormField = ({label, ...props}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </>
);

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    backgroundColor: '#fff',
    flex: 1
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 10,
    color: '#333'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 6, 
    padding: 12, 
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
  imagePicker: { 
    marginVertical: 10 
  },
  imagePickerText: {
    color: '#6a11cb',
    fontWeight: '500'
  },
  image: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    marginBottom: 16 
  },
  submitButton: {
    backgroundColor: '#6a11cb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default CreateApartmentScreen;