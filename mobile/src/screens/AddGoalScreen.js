import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useGoals } from '../context/GoalsContext';
import GoalForm from '../components/GoalForm';
import Header from '../components/Header';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

import { useNotification } from '../context/NotificationContext';

const AddGoalScreen = () => {
    const { addGoal } = useGoals();
    const { showNotification } = useNotification();
    const navigation = useNavigation();

    const handleAddGoal = (goal) => {
        addGoal(goal);
        if (goal.saved >= goal.target) {
            showNotification(`🎉 Wow! You started with a completed goal: ${goal.name}`);
        } else {
            showNotification('New goal created successfully');
        }
        // Navigate back to Home or show success
        navigation.navigate('HomeTab');
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <GoalForm onAddGoal={handleAddGoal} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
        paddingHorizontal: 20,
        paddingTop: Constants.statusBarHeight + 10,
    },
    scrollContent: {
        paddingBottom: 20,
    },
});

export default AddGoalScreen;
