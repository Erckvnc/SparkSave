import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ScrollView style={styles.container}>
                    <Text style={styles.title}>Something went wrong.</Text>
                    <Text style={styles.error}>{this.state.error && this.state.error.toString()}</Text>
                    <Text style={styles.stack}>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </Text>
                </ScrollView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#330000',
        padding: 20,
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    error: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
    },
    stack: {
        fontSize: 12,
        color: '#ffcccc',
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;
