import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { primaryColor, secondaryColor, textColor } from '../utils/GlobalStyle';

const AppInfoScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.subtitle}>Premium offline expense manager</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Project Details</Text>
        <Text style={styles.cardText}>
          • Add expenses with amount, category, note, date
        </Text>
        <Text style={styles.cardText}>• Edit and delete expenses</Text>
        <Text style={styles.cardText}>• View full expense history</Text>
        <Text style={styles.cardText}>
          • Filter expenses by date or category
        </Text>
        <Text style={styles.cardText}>
          • Visual analytics charts and export to Excel
        </Text>
        <Text style={styles.cardText}>
          • Offline persistence with local storage
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Architecture</Text>
        <Text style={styles.cardText}>
          • React Native with modular component architecture
        </Text>
        <Text style={styles.cardText}>
          • Async storage for offline persistence
        </Text>
        <Text style={styles.cardText}>
          • Clean navigation with drawer + stack flows
        </Text>
        <Text style={styles.cardText}>
          • Reusable form and chart components
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Design Notes</Text>
        <Text style={styles.cardText}>
          • Modern premium UI with teal and dark accent palette
        </Text>
        <Text style={styles.cardText}>
          • Consistent spacing, elevated cards, and readable typography
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#06131A',
  },
  title: {
    fontSize: 30,
    color: '#F7FAFB',
    fontWeight: '800',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0C9D2',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#0F2730',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: '#EAF6F9',
    fontWeight: '700',
    marginBottom: 10,
  },
  cardText: {
    color: '#B0C9D2',
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default AppInfoScreen;
