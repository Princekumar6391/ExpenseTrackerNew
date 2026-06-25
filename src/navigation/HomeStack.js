import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import DrawerIcon from '../components/DrawerIcon';
import AllTransactionsScreen from '../screens/AllTransactionsScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CustomSidebar from '../components/CustomSidebar';
import { backgroundColor } from '../utils/GlobalStyle';

const Stack = createNativeStackNavigator();

const HomeStack = ({
  reload,
  handleToken,
  categories,
  addCategory,
  deleteCategory,
  updateCategory,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  openSidebar,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screenOptions = {
  headerStyle: {
    backgroundColor: backgroundColor,
  },
  headerTintColor: '#fff', // back icon + title color
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeScreen"
        options={({ navigation }) => {
          return {
            title: 'Home',
            headerLeft: () => (
              <DrawerIcon  onPress={() => setDrawerVisible(true)} />
            ),
          };
        }}
      >
        {props => (
          <>
            <HomeScreen
              reload={reload}
              handleToken={handleToken}
              allCategories={categories}
              {...props}
            />

            <CustomSidebar
              visible={drawerVisible}
              setVisible={setDrawerVisible}
              navigation={props.navigation}
              handleToken={handleToken}
            />
          </>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AddTransactionScreen"
        options={({ route }) => ({ title: route.params.name })}
      >
        {props => (
          <AddTransactionScreen
            categories={categories}
            addTransaction={addTransaction}
            updateTransaction={updateTransaction}
            {...props}
          />
        )}
      </Stack.Screen>
    <Stack.Screen
  name="CategoryScreen"
  options={{
    title: 'Add Category',
    headerStyle: {
      backgroundColor: backgroundColor , // your theme color
    },
    headerTintColor: '#fff', // title + back icon color
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
>
        
        {props => (
          <CategoryScreen
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            {...props}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AllTransactionsScreen"
        options={{ title: 'Transactions' }}
      >
        {props => (
          <AllTransactionsScreen
            deleteTransaction={deleteTransaction}
            {...props}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeStack;
