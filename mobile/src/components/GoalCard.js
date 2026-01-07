import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatCurrency, calculatePercent } from '../utils';

const GoalCard = ({ goal, onDelete, onEdit, onAddSavings }) => {
    const percent = calculatePercent(goal.saved, goal.target);

    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() => onEdit(goal)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.editText}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onDelete(goal.id)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.goalIcon}>🎯</Text>
            {goal.description ? (
                <Text style={styles.goalDescription}>{goal.description}</Text>
            ) : null}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <View style={styles.footer}>
                <Text style={styles.goalAmounts}>
                    {formatCurrency(goal.saved)}
                    <Text style={styles.goalAmountsLight}> of {formatCurrency(goal.target)}</Text>
                </Text>
                {goal.saved < goal.target && (
                    <TouchableOpacity style={styles.addSavingsButton} onPress={() => {
                        console.log('GoalCard: Add Savings pressed for', goal.id);
                        if (onAddSavings) onAddSavings(goal);
                        else console.error('onAddSavings prop is missing');
                    }}>
                        <Text style={styles.addSavingsText}>+ Add Savings</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    goalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    goalName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 4,
        marginLeft: 8,
    },
    deleteText: {
        fontSize: 24,
        color: '#ff4444',
        fontWeight: '300',
    },
    editText: {
        fontSize: 20,
        color: '#a0a0a0',
    },
    goalIcon: {
        fontSize: 16,
        marginBottom: 8,
    },
    goalDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ff8c00',
        borderRadius: 4,
    },
    goalAmounts: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    goalAmountsLight: {
        fontWeight: '400',
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addSavingsButton: {
        backgroundColor: 'rgba(255, 140, 0, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ff8c00',
    },
    addSavingsText: {
        color: '#ff8c00',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default GoalCard;
