import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/auth/authSlice';
import {useFocusEffect} from '@react-navigation/native';
import {
  fetchApartments,
  fetchFilteredApartments,
} from '../redux/apartment/apartmentSlice';
import Slider from '@react-native-community/slider';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {apartments} = useSelector(state => state.apartment);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [location, setLocation] = useState('');

  const handleLogout = () => {
    dispatch(logout());
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.role === 'realtor') {
        dispatch(fetchApartments({role: 'realtor', userId: user._id}));
      } else {
        dispatch(fetchApartments({role: 'user'}));
      }
    }, [dispatch, user?.role, user?._id]),
  );

  const handleFilter = () => {
    dispatch(fetchFilteredApartments({minPrice, maxPrice, location}));
    setFilterModalVisible(false);
  };

  const renderItem = ({item}) => (
    <View style={styles.apartmentCard}>
      <Text style={styles.apartmentText}>{item.description}</Text>
      <Text style={styles.apartmentText}>Rooms: {item.rooms}</Text>
      <Text style={styles.apartmentText}>Location: {item.location}</Text>
     <Text style={styles.apartmentText}>AreaSize: {item.areaSize}</Text>
     <Text style={styles.apartmentText}>Price: ${item.pricePerMonth}/mo</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Apartments</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterIcon}>🎚️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Apartments</Text>

            <Text>Price Range: ${minPrice} - ${maxPrice}</Text>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={500}
              maximumValue={5000}
              step={100}
              value={minPrice}
              onValueChange={value => setMinPrice(value)}
              minimumTrackTintColor="#6a11cb"
              maximumTrackTintColor="#ccc"
            />
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={500}
              maximumValue={5000}
              step={100}
              value={maxPrice}
              onValueChange={value => setMaxPrice(value)}
              minimumTrackTintColor="#6a11cb"
              maximumTrackTintColor="#ccc"
            />

            <TextInput
              placeholder="Search Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                onPress={() => setFilterModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#6a11cb'}]}
                onPress={handleFilter}>
                <Text style={{color: '#fff'}}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {user?.role === 'realtor' ? (
        <>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate('CreateApartment')}>
            <Text style={styles.logoutText}>Create Apartment</Text>
          </TouchableOpacity>
          <Text style={styles.listTitle}>Your Apartments</Text>
        </>
      ) : (
        <Text style={styles.listTitle}>Available Apartments</Text>
      )}

      <FlatList
        data={apartments}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 100}}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  logoutButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#6a11cb',
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
  apartmentText: {
    color: '#333',
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
});

export default HomeScreen;
