import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

const {width} = Dimensions.get('window');
const MAX_GRAPH_HEIGHT = 200;
const TOP_MARGIN = 20; // space above bars for labels / breathing room
const GRAPH_HEIGHT = MAX_GRAPH_HEIGHT - TOP_MARGIN; // the actual drawable height for bars

interface GraphItem {
  month: string;
  value: number;
}

interface CustomBarGraphProps {
  initialYear?: string;
}

// scale value to GRAPH_HEIGHT (so scale and grid lines use same height)
const scaleValue = (
  value: number,
  minValue: number,
  maxValue: number,
): number => {
  if (maxValue === minValue) return 0;
  if (value <= minValue) return 0;
  const normalizedValue = value - minValue;
  return (normalizedValue / (maxValue - minValue)) * GRAPH_HEIGHT;
};

const yearlyData: Record<string, GraphItem[]> = {
  '2023': [
    {month: 'Jan', value: 95.5},
    {month: 'Feb', value: 97.8},
    {month: 'Mar', value: 99.3},
    {month: 'Apr', value: 100.9},
    {month: 'May', value: 102.4},
    {month: 'Jun', value: 104.7},
    {month: 'Jul', value: 106.2},
    {month: 'Aug', value: 108.8},
    {month: 'Sep', value: 107.1},
    {month: 'Oct', value: 104.4},
    {month: 'Nov', value: 101.5},
    {month: 'Dec', value: 98.6},
  ],
  '2024': [
    {month: 'Jan', value: 96.2},
    {month: 'Feb', value: 98.4},
    {month: 'Mar', value: 101.1},
    {month: 'Apr', value: 104.2},
    {month: 'May', value: 107.0},
    {month: 'Jun', value: 110.3},
    {month: 'Jul', value: 113.1},
    {month: 'Aug', value: 115.7},
    {month: 'Sep', value: 112.5},
    {month: 'Oct', value: 109.3},
    {month: 'Nov', value: 105.6},
    {month: 'Dec', value: 101.9},
  ],
  '2025': [
    {month: 'Jan', value: 98.4},
    {month: 'Feb', value: 100.8},
    {month: 'Mar', value: 104.0},
    {month: 'Apr', value: 107.3},
    {month: 'May', value: 110.1},
    {month: 'Jun', value: 112.6},
    {month: 'Jul', value: 114.8},
    {month: 'Aug', value: 116.2},
    {month: 'Sep', value: 113.9},
    {month: 'Oct', value: 110.7},
    {month: 'Nov', value: 107.4},
    {month: 'Dec', value: 103.8},
  ],
};

const CustomBarGraph: React.FC<CustomBarGraphProps> = ({
  initialYear = '2025',
}) => {
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const data = yearlyData[selectedYear];

  // dynamic min/max (you may tweak padding if you want more headroom)
  const values = data.map(item => item.value);
  const minValue = Math.min(...values) - 2;
  const maxValue = Math.max(...values) + 2;
  const valueRange = maxValue - minValue;

  // generate Y-axis labels (top-down)
  const ticks = 4; // number of intervals
  const yLabels: string[] = [];
  for (let i = 0; i <= ticks; i++) {
    // label from max to min
    const labelValue = maxValue - (valueRange / ticks) * i;
    yLabels.push(labelValue.toFixed(1));
  }

  // equal division of horizontal space for bars
  const leftPaddingForYAxis = 50; // space reserved for y labels/grid
  const barAreaWidth = Math.max(width - leftPaddingForYAxis, 300); // allow horizontal scroll if narrow
  const spacePerBar = barAreaWidth / data.length;
  const barWidth = Math.min(spacePerBar * 0.5, 40); // bar occupies 50% of slot but cap width

  return (
    <View style={styles.outerContainer}>
      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.title}>Select Year:</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedYear}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}>
          <View style={styles.modalContent}>
            <FlatList
              data={Object.keys(yearlyData)}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedYear(item);
                    setModalVisible(false);
                  }}>
                  <Text
                    style={[
                      styles.modalItemText,
                      item === selectedYear && styles.selectedYearText,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Graph area (scrollable if needed) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.graphRow}>
          {/* Y-axis & grid (absolute positioned within this column) */}
          <View
            style={[
              styles.yAxisContainer,
              {height: GRAPH_HEIGHT + TOP_MARGIN},
            ]}>
            {yLabels.map((label, i) => {
              // position from top: TOP_MARGIN + (i * GRAPH_HEIGHT / ticks)
              const topPos = TOP_MARGIN + (i * GRAPH_HEIGHT) / ticks;
              return (
                <View key={i} style={[styles.gridLine, {top: topPos}]}>
                  <Text style={styles.yLabel}>{label}</Text>
                </View>
              );
            })}
          </View>

          {/* Bars area */}
          <View
            style={[
              styles.barArea,
              {height: GRAPH_HEIGHT + TOP_MARGIN, paddingTop: TOP_MARGIN},
            ]}>
            {data.map((item, idx) => {
              const barHeight = scaleValue(item.value, minValue, maxValue);
              return (
                <View
                  key={idx}
                  style={[
                    styles.barSlot,
                    {width: spacePerBar, alignItems: 'center'},
                  ]}>
                  <Text style={styles.valueLabel}>{item.value.toFixed(1)}</Text>
                  <View
                    style={[styles.bar, {height: barHeight, width: barWidth}]}
                  />
                  <Text style={styles.xLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 6,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 200,
    paddingVertical: 8,
  },
  modalItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedYearText: {
    fontWeight: '700',
    color: '#357a79',
  },

  // Graph layout
  graphRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxisContainer: {
    width: 50,
    marginRight: 8,
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    left: 0,
    transform: [{translateY: -8}], // center label on line
    fontSize: 10,
    color: '#666',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    width: width * 2, // long line so it visually extends across graph area
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  barArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  barSlot: {
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#357a79',
    borderRadius: 4,
  },
  valueLabel: {
    fontSize: 10,
    marginBottom: 6,
    color: '#222',
    fontWeight: '600',
  },
  xLabel: {
    fontSize: 12,
    marginTop: 6,
    color: '#222',
  },
});

export default CustomBarGraph;
