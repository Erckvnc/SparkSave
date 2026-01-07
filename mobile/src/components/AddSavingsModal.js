import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { BlurView } from 'expo-blur';

const AddSavingsModal = ({ visible, onClose, onConfirm, goalName }) => {
    const [amount, setAmount] = useState('');

    const handleConfirm = () => {
        if (!amount || isNaN(amount)) return;
        onConfirm(parseFloat(amount));
        setAmount('');
        onClose();
    };

    const Container = Platform.OS === 'web' ? View : BlurView;
    const containerProps = Platform.OS === 'web' ? { style: [styles.absoluteFill, styles.webOverlay] } : { intensity: 20, tint: "dark", style: styles.absoluteFill };

    React.useEffect(() => {
        if (visible) console.log('AddSavingsModal: Visible prop is TRUE');
    }, [visible]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Container {...containerProps}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
                    <View style={styles.modalView}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}>Add Savings</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.goalName}>to {goalName}</Text>

                        <Text style={styles.label}>Amount to Add (₱)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            autoFocus={true}
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <TouchableOpacity
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.textConfirm}>Add Savings</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Container>
        </Modal>
    );
};

const styles = StyleSheet.create({
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    webOverlay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalView: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1f1f1f',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    closeIcon: {
        fontSize: 24,
        color: '#666',
        padding: 4,
    },
    goalName: {
        fontSize: 16,
        color: '#ff8c00',
        marginBottom: 24,
        fontWeight: '600',
    },
    label: {
        fontSize: 14,
        color: '#a0a0a0',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#0d0d0d',
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        color: '#ffffff',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
        textAlign: 'center',
    },
    button: {
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    buttonConfirm: {
        backgroundColor: '#ff8c00',
    },
    textConfirm: {
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default AddSavingsModal;
