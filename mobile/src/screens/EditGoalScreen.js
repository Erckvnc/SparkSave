import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useGoals } from '../context/GoalsContext';
import GoalForm from '../components/GoalForm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNotification } from '../context/NotificationContext';
import Constants from 'expo-constants';

const EditGoalScreen = () => {
    const { updateGoal } = useGoals();
    const { showNotification } = useNotification();
    const navigation = useNavigation();
    const route = useRoute();
    const { goal } = route.params;

    const handleUpdateGoal = (updatedGoal) => {
        updateGoal(updatedGoal);
        if (updatedGoal.saved >= updatedGoal.target) {
            showNotification(`🎉 Congratulations! You reached your goal: ${updatedGoal.name}`);
        } else {
            showNotification('Goal updated successfully');
        }
        navigation.goBack();
    };

    const Container = Platform.OS === 'web' ? View : BlurView;
    const containerProps = Platform.OS === 'web' ? { style: [styles.absoluteFill, styles.webOverlay] } : { intensity: 30, tint: "dark", style: styles.absoluteFill };

    return (
        <Container {...containerProps}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Goal</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <GoalForm onAddGoal={handleUpdateGoal} initialValues={goal} />
                    </ScrollView>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webOverlay: {
        backgroundColor: 'rgba(0,0,0,0.8)', // Darker fallback for web
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1f1f1f',
        borderRadius: 20,
        maxHeight: '80%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        color: '#fff',
        fontSize: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
});

export default EditGoalScreen;
