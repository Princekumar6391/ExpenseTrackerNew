import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {primaryColor, textColor, cardBackground} from '../utils/GlobalStyle';

const {width, height} = Dimensions.get('window');
const scale = Math.min(width, height) / 375;

const ReminderModal = ({item, handleReminderClick}) => {
  if (!item) return null;

  const handleClick = type => {
    handleReminderClick?.(type);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
          {/* Close */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleClick('Close')}>
            <Icon name="close-circle" size={28 * scale} color="#B0BEC5" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name="bell-ring" size={48 * scale} color={primaryColor} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.amount}>₹ {item.amount}</Text>

            <View style={styles.tagContainer}>
              <View
                style={[styles.colorTag, {backgroundColor: item.color}]}
              />
              <Text style={styles.categoryText}>{item.categoryName}</Text>
            </View>

            {!!item.note && (
              <Text style={styles.noteText}>“{item.note}”</Text>
            )}

            <Text style={styles.reminderLabel}>⏰ Reminder due today</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={() => handleClick('Decline')}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.payButton]}
              onPress={() => handleClick('Pay')}>
              <Text style={styles.payText}>Pay Now</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ReminderModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: cardBackground,
    borderRadius: 28 * scale,
    padding: 24 * scale,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  iconContainer: {
    padding: 16 * scale,
    borderRadius: 50 * scale,
    marginBottom: 12 * scale,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  amount: {
    fontSize: 38 * scale,
    fontWeight: '800',
    color: textColor,
    marginBottom: 8 * scale,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10 * scale,
  },
  colorTag: {
    width: 12 * scale,
    height: 12 * scale,
    borderRadius: 6 * scale,
    marginRight: 10 * scale,
  },
  categoryText: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: textColor,
  },
  noteText: {
    fontSize: 15 * scale,
    color: '#78909C',
    marginBottom: 12 * scale,
    textAlign: 'center',
  },
  reminderLabel: {
    fontSize: 13 * scale,
    color: '#EF5350',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20 * scale,
    gap: 12 * scale,
  },
  button: {
    flex: 1,
    paddingVertical: 14 * scale,
    borderRadius: 16 * scale,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#F5F5F5',
  },
  payButton: {
    backgroundColor: primaryColor,
  },
  declineText: {
    color: '#757575',
    fontWeight: '600',
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
  },
});