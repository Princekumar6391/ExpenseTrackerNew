import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryScreen from '../screens/CategoryScreen';
import ChartScreen from '../screens/ChartScreen';
import AppInfoScreen from '../screens/AppInfoScreen';
import HomeStack from './HomeStack';
import MainDrawer from './MainDrawer';
import ReminderStack from './ReminderStack';
import TransactionStack from './TransactionStack';
import Loading from '../components/Loading';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  calculateTotalExpense,
  eliminateReminders,
  getAllTransactions,
  handleCategories,
} from '../utils/HelperFunctions';
import { backgroundColor } from '../utils/GlobalStyle';

const Stack = createNativeStackNavigator();

const AppStack = ({ token, handleToken }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const getCurrentUser = async () => {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  };

  const fetchAllCategories = useCallback(async () => {
    setLoading(true);

    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        handleToken(null);
        return;
      }

      const categoriesData = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      let allData = categoriesData ? JSON.parse(categoriesData) : [];

      allData = handleCategories(allData);

      let tempTransactions = getAllTransactions(allData);

      let data = eliminateReminders(allData);

      data = calculateTotalExpense(data);

      setCategories(data);

      setTransactions(tempTransactions.filter(item => item.remind === false));

      setReminders(tempTransactions.filter(item => item.remind === true));
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [handleToken]);

  const addCategory = async category => {
    try {
      const currentUser = await getCurrentUser();

      const categoriesData = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      const categories = categoriesData ? JSON.parse(categoriesData) : [];

      const newCategory = {
        ...category,
        id: Date.now().toString(),
        transactions: [],
      };

      categories.push(newCategory);

      await AsyncStorage.setItem(
        `categories_${currentUser.email}`,
        JSON.stringify(categories),
      );

      fetchAllCategories();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateCategory = async category => {
    try {
      const currentUser = await getCurrentUser();

      const data = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      let categories = data ? JSON.parse(data) : [];

      categories = categories.map(item =>
        item.id === category.id ? category : item,
      );

      await AsyncStorage.setItem(
        `categories_${currentUser.email}`,
        JSON.stringify(categories),
      );

      fetchAllCategories();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const deleteCategory = async id => {
    try {
      const currentUser = await getCurrentUser();

      const data = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      let categories = data ? JSON.parse(data) : [];

      categories = categories.filter(category => category.id !== id);

      await AsyncStorage.setItem(
        `categories_${currentUser.email}`,
        JSON.stringify(categories),
      );

      fetchAllCategories();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const addTransaction = async (transaction, categoryId) => {
    try {
      const currentUser = await getCurrentUser();

      const data = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      let categories = data ? JSON.parse(data) : [];

      categories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            transactions: [
              ...(category.transactions || []),
              {
                ...transaction,
                id: Date.now().toString(),
              },
            ],
          };
        }
        return category;
      });

      await AsyncStorage.setItem(
        `categories_${currentUser.email}`,
        JSON.stringify(categories),
      );

      fetchAllCategories();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const deleteTransaction = async (categoryId, transactionId) => {
    try {
      const currentUser = await getCurrentUser();

      const data = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      let categories = data ? JSON.parse(data) : [];

      categories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            transactions: category.transactions.filter(
              item => item.id !== transactionId,
            ),
          };
        }
        return category;
      });

      await AsyncStorage.setItem(
        `categories_${currentUser.email}`,
        JSON.stringify(categories),
      );

      fetchAllCategories();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateTransaction = async (transaction, categoryId, transactionId) => {
    try {
      const currentUser = await getCurrentUser();

      const data = await AsyncStorage.getItem(
        `categories_${currentUser.email}`,
      );

      let categories = data ? JSON.parse(data) : [];

      categories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            transactions: category.transactions.map(item =>
              item.id === transactionId
                ? { ...transaction, id: transactionId }
                : item,
            ),
          };
        }
        return category;
      });

      await AsyncStorage.setItem(
        `categories_${currentUser.email}`,
        JSON.stringify(categories),
      );

      fetchAllCategories();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading message="Fetching data..." />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {props => (
          <MainDrawer
            {...props}
            reload={fetchAllCategories}
            handleToken={handleToken}
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            updateTransaction={updateTransaction}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Categories" options={{ title: 'Categories' }}>
        {props => (
          <CategoryScreen
            {...props}
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Transactions" options={{ title: 'Transactions' }}>
        {props => (
          <TransactionStack
            {...props}
            categories={categories}
            allTransactions={transactions}
            deleteTransaction={deleteTransaction}
            updateTransaction={updateTransaction}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Reminders" options={{ title: 'Reminders' }}>
        {props => (
          <ReminderStack
            {...props}
            categories={categories}
            reminders={reminders}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            updateTransaction={updateTransaction}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Charts" options={{ title: 'Charts' }}>
        {props => (
          <ChartScreen
            {...props}
            categories={categories}
            transactions={transactions}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="AppInfo"
        component={AppInfoScreen}
        options={{ title: 'App Info' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
