import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const DonutChart = ({ data = [], total = 0 }) => {
  const radius = 80;
  const strokeWidth = 18;
  const center = radius + strokeWidth;

  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <View style={styles.container}>
      <Svg width={center * 2} height={center * 2}>
        <G rotation="-90" origin={`${center}, ${center}`}>

          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E6E6E6"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Category arcs */}
          {data.map((item, index) => {
            const percent = item.percentage || 0;
            const strokeDashoffset =
              circumference - (circumference * percent) / 100;

            const strokeDasharray = `${circumference}`;

            const rotation = (cumulativePercent * 360) / 100;
            cumulativePercent += percent;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color || '#3498db'}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation={rotation}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </G>
      </Svg>

      {/* Center Text */}
      <View style={styles.centerText}>
        <Text style={styles.total}>₹ {total}</Text>
        <Text style={styles.label}>Total Spend</Text>
      </View>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  total: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
  },
  label: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});