import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Path, Text as SvgText, Circle} from 'react-native-svg';

interface CircleGraphData {
  label: string;
  value: number;
  color: string;
}

interface CircleGraphProps {
  data: CircleGraphData[];
  size?: number;
  centerText?: string;
}

const CircleGraph: React.FC<CircleGraphProps> = ({
  data,
  size = 300,
  centerText = 'Pie center text!',
}) => {
  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.2;
  const labelRadius = size * 0.3;

  const total = data.reduce((sum, item) => sum + item.value, 0);

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

  const createDonutSlice = (
    startAngle: number,
    endAngle: number,
    color: string,
  ) => {
    const outerStart = polarToCartesian(center, center, outerRadius, endAngle);
    const outerEnd = polarToCartesian(center, center, outerRadius, startAngle);
    const innerStart = polarToCartesian(center, center, innerRadius, endAngle);
    const innerEnd = polarToCartesian(center, center, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M', outerStart.x, outerStart.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');

    return <Path key={`${startAngle}-${endAngle}`} d={d} fill={color} />;
  };

  let currentAngle = -90;
  const slices = data.map(item => {
    const sliceAngle = (item.value / total) * 360;
    const slice = createDonutSlice(currentAngle, currentAngle + sliceAngle, item.color);
    
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelPos = polarToCartesian(center, center, labelRadius, labelAngle);
    const percentage = ((item.value / total) * 100).toFixed(1);
    
    currentAngle += sliceAngle;
    
    return {
      slice,
      label: item.label,
      percentage,
      labelPos,
      color: item.color,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: item.color}]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
        <Text style={styles.legendTitle}>Pie dataset</Text>
      </View>
      
      <Svg width={size} height={size} style={styles.chart}>
        {slices.map(({slice}) => slice)}
        
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="white"
        />
        
        {slices.map(({label, percentage, labelPos}, index) => {
          const sliceAngle = (data[index].value / total) * 360;
          console.log('SLICE ANGLE ' + sliceAngle);
          if (sliceAngle > 30) {
            return (
              <React.Fragment key={index}>
                <SvgText
                  x={labelPos.x}
                  y={labelPos.y - 5}
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                  textAnchor="middle">
                  {percentage}
                </SvgText>
                <SvgText
                  x={labelPos.x}
                  y={labelPos.y + 8}
                  fontSize="10"
                  fill="white"
                  textAnchor="middle">
                  {label}
                </SvgText>
              </React.Fragment>
            );
          }
          return null;
        })}

        <SvgText
          x={center}
          y={center}
          fontSize="16"
          fill="#333"
          fontWeight="bold"
          textAnchor="middle">
          {centerText}
        </SvgText>
      </Svg>

      <Text style={styles.descriptionLabel}>Description Label</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFB6C1',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  legend: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  legendTitle: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    fontWeight: 'bold',
  },
  chart: {
    alignSelf: 'center',
  },
  descriptionLabel: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CircleGraph;