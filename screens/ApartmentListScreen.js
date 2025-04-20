import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApartments } from '../redux/apartment/apartmentSlice'; 

const ApartmentListScreen = () => {
  const dispatch = useDispatch();
  const { apartments, loading, error } = useSelector((state) => state.apartment);

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.pictures.length > 0 && (
        <Image
          source={{ uri: `http://192.168.70.128:4001${item.pictures[0]}` }}
          style={styles.image}
        />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.detail}>Area: {item.areaSize} sqft</Text>
        <Text style={styles.detail}>Rooms: {item.rooms}</Text>
        <Text style={styles.price}>${item.pricePerMonth}/month</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={apartments}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a11cb',
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApartmentListScreen;
// import React, { useEffect } from 'react';
// import { View, FlatList, ActivityIndicator,Text } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchApartments } from '../redux/apartment/apartmentSlice';
// import { ApartmentCard } from '../components/apartmentComponents';
// import { commonStyles } from '../components/apartmentStyles';

// const ApartmentListScreen = () => {
//   const dispatch = useDispatch();
//   const { apartments, loading, error } = useSelector(state => state.apartment);

//   useEffect(() => {
//     dispatch(fetchApartments());
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <View style={commonStyles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6a11cb" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={commonStyles.loadingContainer}>
//         <Text style={commonStyles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={apartments}
//       keyExtractor={item => item._id}
//       renderItem={({ item }) => <ApartmentCard item={item} />}
//       contentContainerStyle={commonStyles.container}
//     />
//   );
// };

// export default ApartmentListScreen;