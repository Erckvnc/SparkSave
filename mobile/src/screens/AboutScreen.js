import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const teamMembers = [
    {
        id: 1,
        name: 'Jonel Curay',
        role: 'Developer',
        photo: require('../../assets/team/jonel.jpg'),
    },
    {
        id: 2,
        name: 'Erick Vince Estabillo',
        role: 'Developer',
        photo: require('../../assets/team/erick.jpg'),
    },
    {
        id: 3,
        name: 'Verwin Gonzales',
        role: 'Developer',
        photo: require('../../assets/team/verwin.png'),
    },
];

const AboutScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appLogo}>⚡</Text>
                    <Text style={styles.appName}>SparkSave</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                    <Text style={styles.appTagline}>Ignite Your Savings Potential</Text>
                </View>

                {/* Team Section */}
                <View style={styles.teamSection}>
                    <Text style={styles.sectionTitle}>Meet the Team</Text>
                    <Text style={styles.sectionSubtitle}>The minds behind SparkSave</Text>

                    <View style={styles.teamGrid}>
                        {teamMembers.map((member) => (
                            <View key={member.id} style={styles.memberCard}>
                                <View style={styles.photoContainer}>
                                    {member.photo ? (
                                        <Image source={member.photo} style={styles.photo} />
                                    ) : (
                                        <View style={styles.photoPlaceholder}>
                                            <Text style={styles.photoPlaceholderText}>
                                                {member.name.charAt(0)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberRole}>{member.role}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.copyright}>© 2026 SparkSave. All rights reserved.</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
        paddingTop: Constants.statusBarHeight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        width: 60,
    },
    backText: {
        color: '#ff8c00',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    appLogo: {
        fontSize: 64,
        marginBottom: 16,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    appTagline: {
        fontSize: 16,
        color: '#ff8c00',
        fontStyle: 'italic',
    },
    teamSection: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
    },
    teamGrid: {
        flexDirection: 'column',
    },
    memberCard: {
        backgroundColor: '#252525',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
    },
    photoContainer: {
        marginBottom: 12,
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    photoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ff8c00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
    },
    memberName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    memberRole: {
        fontSize: 14,
        color: '#888',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
        color: '#444',
    },
});

export default AboutScreen;
