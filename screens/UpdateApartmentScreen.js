import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateApartment} from '../redux/apartment/apartmentSlice';
import {launchImageLibrary} from 'react-native-image-picker';

const UpdateApartmentScreen = ({route, navigation}) => {
  const {apartment} = route.params;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    description: apartment.description,
    rooms: apartment.rooms.toString(),
    location: apartment.location,
    areaSize: apartment.areaSize.toString(),
    pricePerMonth: apartment.pricePerMonth.toString(),
  });
  
  const [image, setImage] = useState(null);

  const handleSelectImage = useCallback(() => {
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

  const handleUpdate = useCallback(async () => {
    const data = new FormData();
    
    // Append form fields
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('rooms', Number(formData.rooms));
    data.append('areaSize', Number(formData.areaSize));
    data.append('pricePerMonth', Number(formData.pricePerMonth));

    // Append image if selected
    if (image) {
      data.append('images', {
        uri: image.uri,
        name: image.fileName || 'photo.jpg',
        type: image.type || 'image/jpeg',
      });
    }

    try {
      const result = await dispatch(updateApartment({
        apartmentId: apartment._id,
        updatedData: data,
        isFormData: true,
      }));
      
      if (updateApartment.fulfilled.match(result)) {
        Alert.alert('Success', 'Apartment updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.payload || 'Failed to update apartment');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  }, [formData, image, dispatch, apartment._id, navigation]);

  return (
    <View style={styles.container}>
      <FormField
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
        placeholder="Description"
      />
      
      <FormField
        label="Location"
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
        placeholder="Location"
      />
      
      <FormField
        label="Price Per Month"
        value={formData.pricePerMonth}
        onChangeText={(text) => handleChange('pricePerMonth', text)}
        placeholder="Price per Month"
        keyboardType="numeric"
      />
      
      <FormField
        label="Area Size (sqft)"
        value={formData.areaSize}
        onChangeText={(text) => handleChange('areaSize', text)}
        placeholder="Area Size"
        keyboardType="numeric"
      />
      
      <FormField
        label="Rooms"
        value={formData.rooms}
        onChangeText={(text) => handleChange('rooms', text)}
        placeholder="Rooms"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
        <Text style={styles.imageButtonText}>
          {image ? 'Change Image' : 'Select Image'}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{uri: image.uri}}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
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
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  imageButton: {
    marginVertical: 10,
  },
  imageButtonText: {
    color: '#6a11cb',
    fontWeight: '500'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16
  },
  updateButton: {
    backgroundColor: '#6a11cb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default UpdateApartmentScreen;