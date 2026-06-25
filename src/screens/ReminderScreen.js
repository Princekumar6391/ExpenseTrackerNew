import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Loading from '../components/Loading';
import ReminderModal from '../components/ReminderModal';
import {
  textColor,
  backgroundColor,
  cardBackground,
  placeholderColor,
} from '../utils/GlobalStyle';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;

const ReminderScreen = ({
  reminders,
  deleteTransaction,
  updateTransaction,
}) => {
  const [reminderItem, setReminderItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleReminder = () => {
    const sortedReminders = [...reminders].sort(
      (a, b) => a['transactionDate'] - b['transactionDate'],
    );
    setData(sortedReminders);
    let presentDayReminders = reminders.filter(
      item =>
        new Date(item.transactionDate).toLocaleDateString() ===
        new Date().toLocaleDateString(),
    );
    if (presentDayReminders.length > 0) setReminderItem(presentDayReminders[0]);
  };

  const handleReminderClick = async text => {
    if (text === 'Pay') await handleUpdate();
    else if (text === 'Decline') await handleDelete(reminderItem);
    setReminderItem(null);
  };

  const handleDelete = async transaction => {
    setIsLoading(true);
    const isDeleted = await deleteTransaction(
      transaction.categoryId,
      transaction.id,
    );
    if (!isDeleted) {
      Alert.alert(
        'Unsuccessful!',
        'Error deleting transaction. Please try again later',
        [{ text: 'Ok' }],
        { cancelable: true },
      );
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    let transaction = { ...reminderItem };
    transaction.remind = false;
    const isUpdated = await updateTransaction(
      transaction,
      transaction.categoryId,
      transaction.id,
    );
    if (!isUpdated) {
      console.log('Error updating transaction');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleReminder();
  }, [reminders]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => setReminderItem(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.date}>
        {moment(new Date(item.transactionDate)).format('MMMM DD, YYYY')}
      </Text>
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.colorBadge, { backgroundColor: item.color }]} />
          <Text style={styles.categoryName} numberOfLines={1}>
            {item.categoryName}
          </Text>
        </View>
        <Text style={styles.amount}>₹ {item.amount}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete-outline" size={26 * scale} color="#EF5350" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <Loading />
          </View>
        ) : (
          <>
            {reminderItem !== null ? (
              <ReminderModal
                item={reminderItem}
                handleReminderClick={handleReminderClick}
              />
            ) : (
              <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Icon name="bell-off-outline" size={60 * scale} color="#A8C9D1" />
                    <Text style={styles.emptyText}>No reminders today</Text>
                    <Text style={styles.emptySubText}>
                      All caught up! 🎉
                    </Text>
                  </View>
                }
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingHorizontal: 16 * scale,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 24 * scale,
  },
  itemContainer: {
    marginTop: 16 * scale,
  },
  date: {
    color: '#A4C7D7',
    fontWeight: '600',
    marginBottom: 4 * scale,
    marginLeft: 4 * scale,
    fontSize: 13 * scale,
    letterSpacing: 0.3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cardBackground,
    borderRadius: 18 * scale,
    paddingHorizontal: 16 * scale,
    paddingVertical: 14 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLeft: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBadge: {
    width: 14 * scale,
    height: 14 * scale,
    borderRadius: 7 * scale,
    marginRight: 12 * scale,
  },
  categoryName: {
    color: textColor,
    fontSize: 15 * scale,
    fontWeight: '500',
    flexShrink: 1,
  },
  amount: {
    flex: 1,
    color: textColor,
    fontSize: 16 * scale,
    fontWeight: '700',
    textAlign: 'right',
    marginRight: 8 * scale,
  },
  deleteButton: {
    padding: 4 * scale,
  },
  emptyContainer: {
    marginTop: 80 * scale,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8AB7C6',
    fontSize: 18 * scale,
    fontWeight: '600',
    marginTop: 16 * scale,
  },
  emptySubText: {
    color: '#A8C9D1',
    fontSize: 14 * scale,
    marginTop: 4 * scale,
  },
});