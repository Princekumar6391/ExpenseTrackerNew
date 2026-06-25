import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDeviceOrientation } from '@react-native-community/hooks';
import Loading from '../components/Loading';
import {
  primaryColor,
  textColor,
  backgroundColor,
  cardBackground,
} from '../utils/GlobalStyle';
import ExportToExcel from '../utils/ExportToExcel';
import TransactionModal from '../components/TransactionModal';
import DateTypeSelection from '../components/DateTypeSelection';

const AllTransactionsScreen = ({
  route,
  navigation,
  allTransactions =[],
  deleteTransaction,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [tempTransactions, setTempTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateAndType, setdateAndType] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [date] = useState(new Date());

  const { landscape } = useDeviceOrientation();

  const hideModal = () => {
    setModalItem(null);
  };

  const handleDateFilter = useCallback(
    (type, value) => {
      setdateAndType([type, value]);
      switch (type) {
        case 'Day':
          setTransactions(
            tempTransactions.filter(
              item =>
                new Date(item.transactionDate).toLocaleDateString() ===
                value.toLocaleDateString(),
            ),
          );
          break;
        case 'Month':
          setTransactions(
            tempTransactions.filter(item => {
              const txnDate = new Date(item.transactionDate);
              return (
                txnDate.getMonth() === value.getMonth() &&
                txnDate.getFullYear() === value.getFullYear()
              );
            }),
          );
          break;
        case 'Year':
          setTransactions(
            tempTransactions.filter(
              item => new Date(item.transactionDate).getFullYear() === value,
            ),
          );
          break;
        default:
          setTransactions(tempTransactions);
          break;
      }
    },
    [tempTransactions],
  );

  const handleExport = useCallback(async () => {
    setIsLoading(true);

    // Convert transactionDate, rename key names and remove unnecessary fields
    let data = JSON.parse(JSON.stringify(transactions));
    for (let item of data) {
      item.date = moment(new Date(item.transactionDate)).format('DD-MMM-YYYY');
      if ((item.note ?? '').trim() === '') {
        item.note = 'null';
      }
      item.category = item.categoryName;
      delete item.transactionDate;
      delete item.id;
      delete item.color;
      delete item.remind;
      delete item.categoryId;
      delete item.categoryName;
    }

    await ExportToExcel(dateAndType[0], dateAndType[1], data);
    setIsLoading(false);
  }, [dateAndType, transactions]);

  const handleDelete = async transaction => {
    setIsLoading(true);
    const isDeleted = await deleteTransaction(
      transaction.categoryId,
      transaction.id,
    );
    if (isDeleted) {
      setTransactions(transactions.filter(item => item.id !== transaction.id));
    } else {
      Alert.alert(
        'Error!',
        'Problem deleting transaction. Please try again later.',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: true },
      );
    }
    setModalItem(null);
    setIsLoading(false);
  };

  const handleUpdate = transaction => {
    setModalItem(null);
    navigation.navigate('AddTransactionScreen', {
      name: 'Add Transaction',
      transaction: transaction,
      showFutureDates: false,
    });
  };

  const showDialog = useCallback(() => {
    if (!transactions || transactions.length < 1){
      Alert.alert('Error!', 'No data found', [{ text: 'Cancel' }]);
      return;
    }
    if (!dateAndType[0]) {
      Alert.alert('Error!', 'Select a date filter to export data', [
        { text: 'Cancel' },
      ]);
      return;
    }

    let dateValue = dateAndType[1];
    if (dateAndType[0] === 'Day') {
      dateValue = dateValue.toLocaleDateString();
    } else if (dateAndType[0] === 'Year') {
      dateValue = 'year ' + dateValue;
    } else {
      dateValue = moment(dateValue).format('MMMM, YYYY');
    }

    Alert.alert('Confirmation!', `Export data of ${dateValue}?`, [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => handleExport() },
    ]);
  }, [transactions, dateAndType, handleExport]);

  useEffect(() => {
  const dataFromRoute =
    route?.params?.transactions ?? allTransactions ?? [];

  setTempTransactions(dataFromRoute);
  setTransactions(dataFromRoute);
}, [route.params, allTransactions]);

  useEffect(() => {
    if (tempTransactions.length > 0) {
      handleDateFilter('Month', new Date());
    }
  }, [tempTransactions, handleDateFilter]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => showDialog()}>
          <Icon name="file-export-outline" size={30} color={primaryColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showDialog]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setModalItem(item)} style={styles.card}>
      <View style={styles.cardDate}>
        <View>
          <Text style={styles.text}>
            {moment(new Date(item.transactionDate)).format('DD')}
          </Text>
          <Text style={styles.text}>
            {moment(new Date(item.transactionDate)).format('MMM')}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.text}>{item?.categoryName ?? 'Unknown'}</Text>

        <Text style={styles.noteText}>{item?.note ? item.note : 'N/A'}</Text>
      </View>
      <View style={styles.cardAmount}>
        <Text style={styles.text}>
          {'\u20B9'}
          {item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pageContainer}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loading />
        </View>
      ) : (
        <>
          {modalItem !== null ? (
            <TransactionModal
              item={modalItem}
              hideModal={hideModal}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          ) : (
            <View style={styles.screenContainer}>
              {route.params === undefined && (
                <View
                  style={[
                    styles.dateContainer,
                    landscape ? styles.dateContainerLandscape : null,
                  ]}
                >
                  <DateTypeSelection
                    date={date}
                    sendDateToHome={handleDateFilter}
                  />
                </View>
              )}

              <View
                style={[
                  styles.dataContainer,
                  landscape ? styles.dataContainerLandscape : null,
                ]}
              >
                <FlatList
                  data={transactions}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        No transactions found.
                      </Text>
                    </View>
                  }
                />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default AllTransactionsScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  screenContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#193147',
    backgroundColor: cardBackground,
    marginTop: 10,
    borderRadius: 18,
    marginHorizontal: 10,
  },
  sortButtons: {
    paddingVertical: 10,
    width: '50%',
  },
  buttonDivider: {
    borderRightWidth: 1,
    borderRightColor: '#D3D3D3',
  },
  footerText: {
    color: textColor,
    textAlign: 'center',
  },
  dateContainer: {
    flex: 2,
    backgroundColor: cardBackground,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
  },
  dataContainer: {
    flex: 12,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  dataContainerLandscape: {
    flex: 3,
  },
  dateContainerLandscape: {
    flex: 2,
  },
  dataItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 25,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: cardBackground,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  text: {
    color: textColor,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDate: {
    flex: 1,
    flexDirection: 'row',
  },
  divider: {
    borderRightWidth: 1,
    marginVertical: 3,
    marginHorizontal: 5,
    borderColor: '#D3D3D3',
  },
  cardText: {
    flex: 6,
    marginLeft: 3,
  },
  cardAmount: {
    flex: 2,
    alignItems: 'flex-end',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0B7C4',
    fontSize: 16,
  },
  noteText: {
    color: '#8B97A0',
    marginTop: 4,
    fontSize: 14,
  },
});
