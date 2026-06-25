import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomSidebar = ({
  visible,
  setVisible,
  navigation,
  handleToken,
}) => {
  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setVisible(false);
    handleToken(null);
  };

  const menuItem = (title, icon, screen) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setVisible(false);
        navigation.navigate(screen);
      }}>
      <Icon name={icon} size={24} color="#fff" />
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent>

      <View style={styles.overlay}>
        <View style={styles.drawer}>

          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          {menuItem('Home', 'home-outline', 'HomeScreen')}
          {menuItem('Categories', 'clipboard-list', 'CategoryScreen')}
          {menuItem('Transactions', 'format-list-bulleted', 'AllTransactionsScreen')}
          {menuItem('Charts', 'chart-pie', 'Charts')}
          {menuItem('App Info', 'information-outline', 'AppInfo')}
           {menuItem('Reminders', 'bell-outline', 'Reminders')}

          <TouchableOpacity
            style={styles.logout}
            onPress={logout}>
            <Icon
              name="logout"
              size={24}
              color="red"
            />
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default CustomSidebar;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },

  drawer: {
    width: 280,
    backgroundColor: '#183849',
    paddingTop: 50,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  itemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
  },

  logoutText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 15,
  },
});