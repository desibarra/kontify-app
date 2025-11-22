import React from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import HeroSection from '@/components/experts/HeroSection';
import AuthorityBadges from '@/components/experts/AuthorityBadges';
import IdentificationSection from '@/components/experts/IdentificationSection';
import HowItWorks from '@/components/experts/HowItWorks';
import Requirements from '@/components/experts/Requirements';
import Benefits from '@/components/experts/Benefits';
import IncomeCalculator from '@/components/experts/IncomeCalculator';
import Community from '@/components/experts/Community';

export default function ExpertsLandingScreen() {
    // Always use dark theme
    const colors = Colors.dark;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <HeroSection />
            <AuthorityBadges />
            <IdentificationSection />
            <HowItWorks />
            <Requirements />
            <Benefits />
            <IncomeCalculator />
            <Community />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
});

