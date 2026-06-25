import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getAllTransactions,
  netExpense,
  dateFilterHelper,
} from '../utils/HelperFunctions';

import Card from '../components/Card';
import PieChart from '../components/PieChart';

import {
  primaryColor,
  secondaryColor,
  backgroundColor,
  cardBackground,
  textColor,
} from '../utils/GlobalStyle';

const FILTERS = ['Day', 'Week', 'Month', 'Year'];

const HomeScreen = ({ reload, allCategories, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Month');
  const [user, setUser] = useState(null);

  const onRefresh = () => {
    setRefreshing(true);
    reload();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('currentUser');
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  const handleDateFilter = useCallback(
    (type, value) => {
      if (!allCategories?.length) {
        setCategories([]);
        setTotal(0);
        return;
      }

      let temp = JSON.parse(JSON.stringify(allCategories));
      let filtered = dateFilterHelper(type, value, temp);

      const totalExpense = netExpense(filtered);

      filtered = filtered.map(item => ({
        ...item,
        percentage: totalExpense
          ? Math.round((item.totalExpense / totalExpense) * 100)
          : 0,
      }));

      setCategories(filtered);
      setTotal(totalExpense);
    },
    [allCategories],
  );

  const onFilterChange = (filter) => {
    setActiveFilter(filter);
    handleDateFilter(filter, new Date());
  };

  const handleCategoryPress = (item) => {
    const transactions = getAllTransactions([item]);
    navigation.navigate('AllTransactionsScreen', { transactions });
  };

  const handleAdd = () => {
    navigation.navigate('AddTransactionScreen', {
      showFutureDates: false,
    });
  };

  useEffect(() => {
    handleDateFilter(activeFilter, new Date());
  }, [handleDateFilter]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.firstName || 'Guest'} 👋
          </Text>

          <Text style={styles.sub}>
            Your finance dashboard
          </Text>

          {/* FILTER BAR */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {FILTERS.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => onFilterChange(item)}
                  style={[
                    styles.filterBtn,
                    activeFilter === item && styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === item && styles.activeFilterText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* TOTAL CARD */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Spend ({activeFilter})</Text>
            <Text style={styles.totalValue}>₹ {total}</Text>

            <View style={styles.totalRow}>
              <Text style={styles.smallText}>
                {categories.length} categories
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilter}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CHART */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>
          <PieChart categories={categories} total={total} />

          <Button
            mode="contained"
            icon="plus"
            onPress={handleAdd}
            style={styles.button}
          >
            Add Transaction
          </Button>
        </View>

        {/* CATEGORY LIST */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>

          {categories.length === 0 ? (
            <Text style={styles.empty}>No data found</Text>
          ) : (
            <FlatList
              data={categories}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCategoryPress(item)}>
                  <Card item={item} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor,
  },

  header: {
    padding: 16,
  },

  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: textColor,
  },

  sub: {
    color: '#8fb3c2',
    marginTop: 4,
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: cardBackground,
    marginRight: 8,
  },

  activeFilter: {
    backgroundColor: primaryColor,
  },

  filterText: {
    color: textColor,
    fontSize: 13,
  },

  activeFilterText: {
    color: '#fff',
    fontWeight: '700',
  },

  totalCard: {
    backgroundColor: secondaryColor,
    padding: 16,
    borderRadius: 20,
  },

  totalLabel: {
    color: '#d7f3f0',
    fontSize: 13,
  },

  totalValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    marginVertical: 6,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallText: {
    color: '#e2f7f6',
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
  },

  chartCard: {
    margin: 16,
    backgroundColor: cardBackground,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: textColor,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  button: {
    marginTop: 12,
    width: '100%',
    borderRadius: 14,
  },

  categorySection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  empty: {
    textAlign: 'center',
    color: '#9bb3c2',
    marginTop: 20,
  },
});