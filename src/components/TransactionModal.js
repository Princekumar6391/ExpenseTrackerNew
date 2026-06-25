import moment from 'moment';
import React from 'react';
import {Modal, StyleSheet, Text, View, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {primaryColor, textColor} from '../utils/GlobalStyle';



const TransactionModal = ({ item, hideModal, handleUpdate, handleDelete }) => {
  const categoryName = item?.categoryName ?? '';
  const note = item?.note ?? '';

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <View style={styles.header}>
              <Text style={styles.headerText}>
                {moment(new Date(item?.transactionDate)).format('MMMM DD, YYYY')}
              </Text>

              <Icon
                size={20}
                name="close-circle-outline"
                onPress={hideModal}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.content}>
              <Text style={styles.amount}>₹{item?.amount ?? 0}</Text>

              {categoryName.length <= 10 && note.length <= 10 ? (
                <Text style={styles.modalText}>
                  {categoryName}
                  {note ? ' - ' + note : ''}
                </Text>
              ) : (
                <>
                  <Text style={styles.modalText}>{categoryName}</Text>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>
                    {note.length > 20 ? note.substring(0, 20) + '...' : note}
                  </Text>
                </>
              )}
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Button onPress={() => handleUpdate(item)}>Update</Button>
              <Button onPress={() => handleDelete(item)}>Delete</Button>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginHorizontal: 5,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  headerText: {
    color: "#6e5252",
    fontSize: 15,
    paddingLeft: 5,
  },
  closeIcon: {
    color: 'black',
    alignSelf: 'flex-end',
  },
  divider: {
    margin: 2,
    borderBottomWidth: 1,
    borderColor: '#D3D3D3',
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  content: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalText: {
    textAlign: 'center',
    color: "#270202",
    fontSize: 18,
    marginBottom: 5,
  },
  amount: {
    fontSize: 35,
    marginBottom: 10,
    textAlign: 'center',
    color: "#6e5252",
    fontWeight: 'bold',
  },
  button: {
    width: '40%',
    padding: 5,
    borderRadius: 0,
  },
});

export default TransactionModal;
