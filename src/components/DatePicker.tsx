import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  title?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  title = 'Select Delivery Date',
}) => {
  const {colors} = useTheme();

  const getDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', {weekday: 'short'}),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', {month: 'short'}),
      });
    }
    return dates;
  };

  const deliveryDates = getDeliveryDates();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScroll}>
        {deliveryDates.map((dateObj, index) => (
          <TouchableOpacity
            key={dateObj.date}
            style={[
              styles.dateCard,
              {
                backgroundColor:
                  selectedDate === dateObj.date
                    ? colors.primary
                    : colors.surface,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onDateSelect(dateObj.date)}>
            <Text
              style={[
                styles.dayText,
                {
                  color: selectedDate === dateObj.date ? '#fff' : colors.text,
                },
              ]}>
              {index === 0 ? 'Today' : dateObj.day}
            </Text>
            <Text
              style={[
                styles.dateText,
                {
                  color: selectedDate === dateObj.date ? '#fff' : colors.text,
                },
              ]}>
              {dateObj.dayNum}
            </Text>
            <Text
              style={[
                styles.monthText,
                {
                  color: selectedDate === dateObj.date ? '#fff' : colors.text,
                },
              ]}>
              {dateObj.month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dateScroll: {
    paddingVertical: 8,
  },
  dateCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 70,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  monthText: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default DatePicker;
