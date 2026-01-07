import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency, calculatePercent } from '../utils';
import DonutChart from './DonutChart';

const StatsCard = ({ totalSaved, totalGoal, goals = [] }) => {
    const percent = calculatePercent(totalSaved, totalGoal);

    return (
        <View style={styles.statsCard}>
            {/* Left side: Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Saved</Text>
                    <Text style={styles.statValue}>{formatCurrency(totalSaved)}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Goal</Text>
                    <Text style={styles.statValue}>{formatCurrency(totalGoal)}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statPercent}>{percent}%</Text>
                    <Text style={styles.statLabel}>to financial freedom</Text>
                </View>
            </View>

            {/* Right side: Donut Chart */}
            <View style={styles.chartContainer}>
                <DonutChart
                    goals={goals}
                    totalSaved={totalSaved}
                    totalGoal={totalGoal}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 24,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statsContainer: {
        flex: 1,
    },
    chartContainer: {
        marginLeft: 0,
    },
    statItem: {
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 14,
        color: '#a0a0a0',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    statPercent: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
});

export default StatsCard;
