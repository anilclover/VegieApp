import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {
  DonutChartProps,
  StatCardProps,
  TaskRowProps,
  projectStatusData,
  tasksData,
} from '../data/products';

// --- Donut Chart (using react-native-svg, not a chart lib) ---

const DonutChart: React.FC<DonutChartProps> = ({data}) => {
  const size = 120;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const totalValue = data.reduce(
    (sum, item) => sum + parseFloat(item.percentage),
    0,
  );

  let startAngle = -90; // start from top (12 o’clock)

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angleDeg: number,
  ) => {
    const angleRad = (angleDeg * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeArc = (startAngleDeg: number, endAngleDeg: number) => {
    const start = polarToCartesian(center, center, radius, endAngleDeg);
    const end = polarToCartesian(center, center, radius, startAngleDeg);
    const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';
    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  const paths = data.map(item => {
    const value = parseFloat(item.percentage);
    const angle = (value / totalValue) * 360;
    const endAngle = startAngle + angle;
    const d = describeArc(startAngle, endAngle);
    startAngle = endAngle;

    return (
      <Path
        key={item.label}
        d={d}
        stroke={item.color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
      />
    );
  });

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={size} height={size}>
        {paths}
      </Svg>
      <View
        style={{
          position: 'absolute',
          width: size / 2,
          height: size / 2,
          borderRadius: size / 4,
          backgroundColor: '#FFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 12, fontWeight: '600', color: '#555'}}>
          Status
        </Text>
      </View>
    </View>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentage,
  isPositive,
  index = 0,
}) => {
  const percentageColor = isPositive ? '#4CAF50' : '#F44336';

  // Define your custom color pattern
  const colorPattern = ['#7E57C2', '#000', '#000', '#7E57C2'];
  const backgroundColor = colorPattern[index % colorPattern.length];

  // Choose text color based on background for contrast
  const textColor = backgroundColor === '#000' ? '#FFF' : '#FFF';

  return (
    <View style={[styles.card, {backgroundColor}]}>
      <Text style={[styles.cardTitle, {color: textColor}]}>{title}</Text>
      <Text style={[styles.cardValue, {color: textColor}]}>{value}</Text>
      <View style={styles.cardFooter}>
        <Text style={{color: percentageColor, fontWeight: 'bold'}}>
          {percentage}
        </Text>
      </View>
    </View>
  );
};

const TaskRow: React.FC<TaskRowProps> = ({taskName, status, statusColor}) => (
  <View style={styles.taskRow}>
    <Text style={styles.taskName} numberOfLines={1}>
      {taskName}
    </Text>
    <View style={styles.taskStatus}>
      <Text style={{color: statusColor, marginRight: 5}}>{'●'}</Text>
      <Text style={{color: statusColor, fontWeight: '600'}}>{status}</Text>
    </View>
  </View>
);



// --- Main Dashboard ---
const Dashboard: React.FC = () => {
  const statsData: StatCardProps[] = [
    {
      title: 'Total Projects',
      value: '29',
      percentage: '+11.02%',
      isPositive: true,
      iconName: 'folder',
    },
    {
      title: 'Total Tasks',
      value: '715',
      percentage: '-0.03%',
      isPositive: false,
      iconName: 'list',
    },
    {
      title: 'Members',
      value: '31',
      percentage: '+15.03%',
      isPositive: true,
      iconName: 'users',
    },
    {
      title: 'Productivity',
      value: '93.8%',
      percentage: '+6.08%',
      isPositive: true,
      iconName: 'battery-charging',
    },
  ];
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Check out VegieApp!',
        message:
          'Hey! Check out this awesome app: https://brunobarber.com/download',
        url: 'https://brunobarber.com/download', // iOS only supports "url" key
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error while sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onShare} style={styles.button}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Status</Text>
        <View style={styles.chartAndLegendContainer}>
          <DonutChart data={projectStatusData} />
          <View style={styles.legend}>
            {projectStatusData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <Text style={{color: item.color, fontSize: 18}}>{'●'}</Text>
                <Text style={styles.legendText}>{item.label}</Text>
                <Text style={styles.legendPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        {tasksData.map((task, index) => (
          <TaskRow
            key={index}
            taskName={task.name}
            status={task.status}
            statusColor={task.color}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// --- Styles ---
const {width} = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: CARD_MARGIN * 2,
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.7,
    borderRadius: 15,
    padding: 15,
    marginBottom: CARD_MARGIN * 2,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  lightCard: {backgroundColor: '#FFF'},
  darkCard: {backgroundColor: '#303040'},
  cardTitle: {fontSize: 14, color: '#A0A0A0'},
  darkText: {color: '#FFF'},
  cardValue: {fontSize: 32, fontWeight: '900', marginTop: 5},
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#7E57C2',
  },
  chartAndLegendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legend: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  legendPercentage: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  taskName: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#4CAF50',
    width: '25%',
    paddingVertical: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default Dashboard;
