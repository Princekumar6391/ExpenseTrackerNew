import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PieChart as GiftedPieChart} from 'react-native-gifted-charts';
import {textColor} from '../utils/GlobalStyle';

const PieChart = ({categories, total}) => {
  const data =
    categories?.map(item => ({
      value: item.totalExpense,
      color: item.color,
      text: `${item.percentage}%`,
    })) || [];

  return (
    <View style={styles.container}>
      <GiftedPieChart
        donut
        radius={90}
        innerRadius={50}
        data={data}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={styles.gaugeText}>₹{total}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeText: {
    color: textColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
});