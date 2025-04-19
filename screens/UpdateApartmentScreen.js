import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateApartment} from '../redux/apartment/apartmentSlice'; // You will create this action

const UpdateApartmentScreen = ({route, navigation}) => {
  //   const navigation = useNavigation();
  //   const route = useRoute();
  const {apartment} = route.params; // Get the apartment details passed from HomeScreen

  const [formData, setFormData] = useState({
    description: apartment.description,
    rooms: apartment.rooms.toString(),
    location: apartment.location,
    areaSize: apartment.areaSize.toString(),
    pricePerMonth: apartment.pricePerMonth.toString(),
  });

  const dispatch = useDispatch();

  const handleUpdate = async () => {
    try {
      await dispatch(
        updateApartment({
          apartmentId: apartment._id,
          updatedData: {
            ...formData,
            rooms: Number(formData.rooms),
            areaSize: Number(formData.areaSize),
            pricePerMonth: Number(formData.pricePerMonth),
          },
        }),
      );
      Alert.alert('Success', 'Apartment updated successfully');
      navigation.goBack(); // Go back to HomeScreen
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update apartment');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={formData.description}
        onChangeText={text => setFormData({...formData, description: text})}
        placeholder="Description"
      />
      <Text style={styles.label}>Location</Text>

      <TextInput
        style={styles.input}
        value={formData.location}
        onChangeText={text => setFormData({...formData, location: text})}
        placeholder="Location"
      />
      <Text style={styles.label}>Price Per Month</Text>

      <TextInput
        style={styles.input}
        value={formData.pricePerMonth}
        onChangeText={text => setFormData({...formData, pricePerMonth: text})}
        placeholder="Price per Month"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Area Size (sqft)</Text>

      <TextInput
        style={styles.input}
        value={formData.areaSize}
        onChangeText={text => setFormData({...formData, areaSize: text})}
        placeholder="Area Size"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Rooms</Text>

      <TextInput
        style={styles.input}
        value={formData.rooms}
        onChangeText={text => setFormData({...formData, rooms: text})}
        placeholder="Area Size"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: { fontWeight: 'bold', marginTop: 10 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#6a11cb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateApartmentScreen;
