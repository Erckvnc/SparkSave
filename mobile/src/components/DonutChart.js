import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const DonutChart = ({ goals = [], totalSaved = 0, totalGoal = 0 }) => {
    const size = 140;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Calculate overall progress percentage (0 to 100)
    const progressPercent = totalGoal > 0 ? Math.min((totalSaved / totalGoal) * 100, 100) : 0;

    // Calculate the stroke dash for the progress arc (how much to fill)
    const progressDash = (circumference * progressPercent) / 100;

    // Choose color based on progress level
    let progressColor = '#ff8c00'; // Default orange
    if (progressPercent >= 75) {
        progressColor = '#4CAF50'; // Green when close to goal
    } else if (progressPercent >= 50) {
        progressColor = '#ffcc00'; // Gold when halfway
    } else if (progressPercent >= 25) {
        progressColor = '#ffa726'; // Light orange
    }

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {/* Background track (grey ring) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#2a2a2a"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Progress arc (fills up as you save) */}
                <G rotation="-90" origin={`${center}, ${center}`}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${progressDash} ${circumference}`}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>

            {/* Center label */}
            <View style={styles.centerLabel}>
                <Text style={styles.percentText}>{Math.round(progressPercent)}%</Text>
                <Text style={styles.subText}>saved</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 140,
        height: 140,
    },
    centerLabel: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subText: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
});

export default DonutChart;
