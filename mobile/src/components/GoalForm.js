import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const GoalForm = ({ onAddGoal, initialValues }) => {
    const [name, setName] = useState(initialValues?.name || '');
    const [target, setTarget] = useState(initialValues?.target?.toString() || '');
    const [saved, setSaved] = useState(initialValues?.saved?.toString() || '');
    const [description, setDescription] = useState(initialValues?.description || '');

    const handleSubmit = () => {
        if (!name.trim() || !target) {
            Alert.alert('Missing Fields', 'Please fill in Goal Name and Target.');
            return;
        }

        onAddGoal({
            id: initialValues?.id || Date.now(),
            name: name.trim(),
            target: parseFloat(target),
            saved: initialValues ? initialValues.saved : (parseFloat(saved) || 0), // Use existing for edit, or input for new
            description: description.trim(),
        });

        if (!initialValues) {
            // Reset form only if adding new
            setName('');
            setTarget('');
            setSaved('');
            setDescription('');
        }
    };

    return (
        <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{initialValues ? 'Edit Goal' : 'Add New Goal'}</Text>

            <Text style={styles.formLabel}>Goal Name</Text>
            <TextInput
                style={styles.formInput}
                placeholder="e.g., Vacation Fund"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.formLabel}>Target (₱)</Text>
            <TextInput
                style={styles.formInput}
                placeholder="5000"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
            />

            {!initialValues && (
                <>
                    <Text style={styles.formLabel}>Initial Savings (₱)</Text>
                    <TextInput
                        style={styles.formInput}
                        placeholder="0"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={saved}
                        onChangeText={setSaved}
                    />
                </>
            )}

            <Text style={styles.formLabel}>Description (Optional)</Text>
            <TextInput
                style={[styles.formInput, styles.formTextarea]}
                placeholder="Add a note about this goal..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonIcon}>⚡</Text>
                <Text style={styles.submitButtonText}>{initialValues ? 'Update Goal' : 'Add Goal'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    formSection: {
        backgroundColor: '#1f1f1f',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        color: '#a0a0a0',
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    formTextarea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff8c00',
        borderRadius: 12,
        padding: 14,
        marginTop: 8,
    },
    submitButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0d0d0d',
    },
});

export default GoalForm;
