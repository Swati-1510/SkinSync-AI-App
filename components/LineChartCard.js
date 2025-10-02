import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import React from 'react';
import Card from './Card'; // Assuming your Card component is imported correctly

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 0.8; // Chart width will be 80% of screen width

export default function LineChartCard({ title, labels, data, chartColor }) {
  const chartData = {
    labels: labels, // Your dates array
    datasets: [
      {
        data: data, // Your water or sleep array
        color: (opacity = 1) => chartColor(opacity), // Line color
        strokeWidth: 2 
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF', // Card background color
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1, // Optional: show one decimal place
    color: (opacity = 1) => `rgba(85, 107, 47, ${opacity})`, // Dark Olive Green for text/lines
    labelColor: (opacity = 1) => `rgba(178, 172, 136, ${opacity})`, // Sage for labels
    strokeWidth: 2,
    fillShadowGradient: chartColor(1), // Fill color under the line
    fillShadowGradientOpacity: 0.1, // Light opacity
    propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: chartColor(1),
        fill: 'white',
    }
  };

  return (
    <Card style={{ marginBottom: 20 }}>
        <Text className="font-nunito-sans-bold mb-3" style={{ fontSize: 20, color: '#556B2F' }}>{title}</Text>
        
        {labels.length === 0 ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(178, 172, 136, 0.1)', borderRadius: 8 }}>
                <Text className="text-sage">No data to display for this period.</Text>
            </View>
        ) : (
            <LineChart
                data={chartData}
                width={chartWidth - 20} // Subtract padding
                height={220}
                chartConfig={chartConfig}
                bezier // Makes the line curved and smooth
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        )}
    </Card>
  );
}