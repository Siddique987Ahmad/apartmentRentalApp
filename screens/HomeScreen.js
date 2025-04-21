import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/auth/authSlice';
import {useFocusEffect} from '@react-navigation/native';
import {
  fetchApartments,
  fetchFilteredApartments,
  deleteApartment,
} from '../redux/apartment/apartmentSlice';
import Slider from '@react-native-community/slider';

// Extract constants for better maintainability
const MIN_PRICE = 500;
const MAX_PRICE = 5000;
const BASE_IMAGE_URL = 'http://192.168.70.159:4001';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {apartments} = useSelector(state => state.apartment);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [location, setLocation] = useState('');

  const handleLogout = () => dispatch(logout());

  // Memoized fetch logic based on user role
  const fetchData = useCallback(() => {
    if (user?.role === 'realtor') {
      dispatch(fetchApartments({role: 'realtor', userId: user._id}));
    } else {
      dispatch(fetchApartments({role: 'user'}));
    }
  }, [dispatch, user?.role, user?._id]);

  useFocusEffect(fetchData);

  const handleFilter = () => {
    dispatch(fetchFilteredApartments({minPrice, maxPrice, location}));
    setFilterModalVisible(false);
  };

  const handleDelete = useCallback(
    apartmentId => {
      Alert.alert(
        'Delete Apartment',
        'Are you sure you want to delete this apartment?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => dispatch(deleteApartment(apartmentId)),
          },
        ],
      );
    },
    [dispatch],
  );

  // Memoized apartment render item
  const renderItem = useMemo(
    () =>
      ({item}) =>
        (
          <View style={styles.apartmentCard}>
            {item.pictures?.[0] && (
              <Image
                source={{uri: `${BASE_IMAGE_URL}${item.pictures[0]}`}}
                style={styles.apartmentImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.apartmentText}>
              Description: {item.description}
            </Text>
            <Text style={styles.apartmentText}>Rooms: {item.rooms}</Text>
            <Text style={styles.apartmentText}>Location: {item.location}</Text>
            <Text style={styles.apartmentText}>AreaSize: {item.areaSize}</Text>
            <Text style={styles.apartmentText}>
              Price: ${item.pricePerMonth}/mo
            </Text>

            {user?.role === 'realtor' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() =>
                    navigation.navigate('UpdateApartment', {apartment: item})
                  }>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item._id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ),
    [handleDelete, navigation, user?.role],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Apartments</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterIcon}>🎚️</Text>
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onFilter={handleFilter}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        location={location}
        onLocationChange={setLocation}
      />

      {(user?.role === 'realtor' && (
        <>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CreateApartment')}>
            <Text style={styles.buttonText}>Create Apartment</Text>
          </TouchableOpacity>
          <Text style={styles.listTitle}>Your Apartments</Text>
        </>
      )) || <Text style={styles.listTitle}>Available Apartments</Text>}

      <FlatList
        data={apartments}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
        <Text style={styles.secondaryButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Extracted Modal component for better readability
const FilterModal = ({
  visible,
  onClose,
  onFilter,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  location,
  onLocationChange,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filter Apartments</Text>
        <Text>
          Price Range: ${minPrice} - ${maxPrice}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={MIN_PRICE}
          maximumValue={MAX_PRICE}
          step={100}
          value={minPrice}
          onValueChange={onMinPriceChange}
          minimumTrackTintColor="#6a11cb"
          maximumTrackTintColor="#ccc"
        />
        <Slider
          style={styles.slider}
          minimumValue={MIN_PRICE}
          maximumValue={MAX_PRICE}
          step={100}
          value={maxPrice}
          onValueChange={onMaxPriceChange}
          minimumTrackTintColor="#6a11cb"
          maximumTrackTintColor="#ccc"
        />

        <TextInput
          placeholder="Search Location"
          value={location}
          onChangeText={onLocationChange}
          style={styles.input}
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.applyButton]}
            onPress={onFilter}>
            <Text style={styles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#6a11cb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  filterIcon: {
    fontSize: 22,
  },
  primaryButton: {
    //backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'black',
    //color: '#6a11cb',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listTitle: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 12,
    fontWeight: 'bold',
  },
  apartmentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  apartmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  apartmentText: {
    color: '#333',
    marginVertical: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#6a11cb',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  applyButton: {
    backgroundColor: '#6a11cb',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#6a11cb',
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    //color: '#6a11cb',
    //fontSize:20,
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default HomeScreen;
