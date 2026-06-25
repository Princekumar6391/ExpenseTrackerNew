import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
} from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryModal from '../components/CategoryModal';
import Loading from '../components/Loading';
import { windowWidth } from '../utils/Dimentions';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  globalStyle,
  primaryColor,
  textColor,
  placeholderColor,
  backgroundColor,
  cardBackground,
} from '../utils/GlobalStyle';

const CategoryScreen = ({
  categories,
  addCategory,
  deleteCategory,
  updateCategory,
}) => {
  let initialState = {
    title: '',
    description: '',
  };

  const [errMsg, setErrMsg] = useState('');
  const [data, setData] = useState(categories);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = text => {
    setData(
      categories.filter(
        item => item.title.toLowerCase().indexOf(text.toLowerCase()) !== -1,
      ),
    );
  };

  const handleChange = (key, value) => {
    setPayload({ ...payload, [key]: value });
  };

  const handleModalVisibility = flag => {
    setPayload(initialState);
    setModalVisible(flag);
  };

  const handleSubmit = async () => {
    setModalVisible(false);
    setIsLoading(true);

    if (payload.title.trim() === '') {
      setErrMsg('Fill the title.');
      setIsLoading(false);
      return;
    }

    let isSuccessful;
    if (isUpdate) {
      isSuccessful = await updateCategory(payload);
      setIsUpdate(false);
    } else {
      isSuccessful = await addCategory(payload);
    }

    if (isSuccessful === true) {
      setPayload(initialState);
    } else {
      setErrMsg('Problem occured. Please try again later.');
    }
    setIsLoading(false);
  };

 const handleDelete = async id => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this category?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const isDeleted = await deleteCategory(id);

          if (isDeleted) {
            Alert.alert('Deleted', 'Category deleted successfully');
          } else {
            Alert.alert(
              'Error!',
              'Problem deleting category. Please try again later.',
              [{ text: 'Ok' }],
              { cancelable: true }
            );
          }
        },
      },
    ],
    { cancelable: true }
  );
};

  const handleUpdate = item => {
    setIsUpdate(true);
    setPayload(item);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setIsUpdate(false);
    setPayload(initialState);
    setModalVisible(true);
  };

  useEffect(() => {
    setData(categories);
    return () => {
      setData([]);
    };
  }, [categories]);
const renderItem = ({ item }) => (
  <View style={styles.card}>
    
    {/* Left content */}
    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
      
      <View style={[styles.color, { backgroundColor: item.color }]} />

      <View style={{ flex: 1 }}>
        {/* Title */}
        <Text style={{ color: textColor, fontSize: 15, fontWeight: '600' }}>
          {item.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            color: '#8A8A8A',
            fontSize: 12,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {item.description}
        </Text>
      </View>
    </View>

    {/* Icons */}
    <View style={styles.iconsContainer}>
      <Icon
        size={25}
        color="#0096FF"
        name="square-edit-outline"
        onPress={() => handleUpdate(item)}
      />
      <Icon
        size={25}
        color="#D11A2A"
        name="delete"
        onPress={() => handleDelete(item.id)}
      />
    </View>
  </View>
);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loading />
        </View>
      ) : (
        <>
          {modalVisible ? (
            <CategoryModal
              payload={payload}
              isUpdate={isUpdate}
              handleSave={handleSubmit}
              handleChange={handleChange}
              handleModalVisibility={handleModalVisibility}
            />
          ) : (
            <View>
              <View style={styles.header}>
                <TextInput
                  style={styles.input}
                  placeholder="Search categories"
                  placeholderTextColor={placeholderColor}
                  onChangeText={text => handleSearch(text)}
                />
                <Button
                  color={primaryColor}
                  mode="contained"
                  style={styles.addButton}
                  onPress={handleAdd}
                >
                  Add
                </Button>
              </View>
              {errMsg.trim().length !== 0 && (
                <Text style={globalStyle.error} onPress={() => setErrMsg('')}>
                  {errMsg}
                </Text>
              )}
              <FlatList
                style={styles.list}
                data={data}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No categories found.</Text>
                  </View>
                }
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    color: textColor,
    borderWidth: 1,
    borderColor: '#1F4E68',
    width: windowWidth / 1.4,
    borderRadius: 14,
    fontSize: 17,
    paddingHorizontal: 14,
    backgroundColor: cardBackground,
  },
  addButton: {
    alignSelf: 'center',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
  },
  list: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: cardBackground,
    borderRadius: 18,
    marginTop: 10,
    marginHorizontal: 10,
    padding: 14,
    alignItems: 'center',
  },
  color: {
    marginRight: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  iconsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8AB7C6',
    fontSize: 16,
  },
});
