import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, data) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const getData = async key => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeData = async key => {
  await AsyncStorage.removeItem(key);
};