import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Header from '../components/Header';
import Constants from 'expo-constants';
import { useGoals } from '../context/GoalsContext';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const { goals, deleteGoal, clearAllGoals } = useGoals();
    const { showNotification } = useNotification();
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleClearDataPress = () => {
        setModalVisible(true);
    };

    const confirmClearData = () => {
        if (goals.length === 0) {
            showNotification('No data to clear');
            return;
        }
        clearAllGoals();
        showNotification('All data cleared successfully');
    };

    const handleAbout = () => {
        navigation.navigate('About');
    };

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const toggleNotifications = () => {
        setNotificationsEnabled(previousState => !previousState);
        showNotification(notificationsEnabled ? "Notifications disabled" : "Notifications enabled");
    };

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.pageTitle}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        trackColor={{ false: "#3e3e3e", true: "#ff8c00" }}
                        thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
                        onValueChange={toggleNotifications}
                    />
                </View>
                <TouchableOpacity style={styles.row} onPress={handleAbout}>
                    <Text style={styles.rowLabel}>About SparkSave</Text>
                    <Text style={styles.rowArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Management</Text>
                <TouchableOpacity style={styles.dangerRow} onPress={handleClearDataPress}>
                    <Text style={styles.dangerLabel}>Clear All Data</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footer}>SparkSave v1.0.0</Text>

            <ConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={confirmClearData}
                title="Clear All Data"
                message="⚠️ WARNING: This will permanently delete all your savings goals. This action cannot be undone. Are you sure?"
                confirmText="Yes, Delete Everything"
            />
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
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    section: {
        backgroundColor: '#1f1f1f',
        borderRadius: 16,
        padding: 8,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginLeft: 12,
        marginTop: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    rowLabel: {
        fontSize: 16,
        color: '#ffffff',
    },
    rowArrow: {
        fontSize: 20,
        color: '#666',
    },
    dangerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    dangerLabel: {
        fontSize: 16,
        color: '#ff4444',
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        color: '#333',
        fontSize: 12,
        marginTop: 'auto',
        marginBottom: 20,
    },
});

export default SettingsScreen;
