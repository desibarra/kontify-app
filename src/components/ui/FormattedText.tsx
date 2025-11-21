import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/Colors';

interface FormattedTextProps {
    content: string;
    isUser: boolean;
    colors: typeof Colors.light;
}

/**
 * Componente para renderizar texto con formato profesional
 * Soporta:
 * - Negritas con **texto**
 * - Cursivas con *texto*
 * - Emojis de sección (🧾 📌 📑 📚 ⚠️)
 * - Listas con bullets (•)
 * - Saltos de línea
 */
export default function FormattedText({ content, isUser, colors }: FormattedTextProps) {
    // Si es mensaje del usuario, renderizar texto simple
    if (isUser) {
        return (
            <Text style={[styles.messageText, { color: colors.background }]}>
                {content}
            </Text>
        );
    }

    // Procesar el contenido línea por línea
    const lines = content.split('\n');

    return (
        <View style={styles.container}>
            {lines.map((line, index) => {
                // Línea vacía
                if (line.trim() === '') {
                    return <View key={index} style={styles.emptyLine} />;
                }

                // Detectar tipo de línea
                const isEmojiSection = /^[🧾📌📑📚⚠️✔]/.test(line);
                const isBullet = line.trim().startsWith('•');
                const isNumbered = /^\d+\./.test(line.trim());

                // Renderizar línea con formato
                return (
                    <View key={index} style={styles.lineContainer}>
                        {renderFormattedLine(line, isEmojiSection, isBullet, isNumbered, colors)}
                    </View>
                );
            })}
        </View>
    );
}

function renderFormattedLine(
    line: string,
    isEmojiSection: boolean,
    isBullet: boolean,
    isNumbered: boolean,
    colors: typeof Colors.light
) {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Regex mejorado para detectar **negrita** y *cursiva* (sin conflictos)
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;

    let processedText = line;
    const boldMatches: Array<{ text: string; start: number; end: number }> = [];
    const italicMatches: Array<{ text: string; start: number; end: number }> = [];

    // Encontrar todas las negritas
    let match;
    while ((match = boldRegex.exec(line)) !== null) {
        boldMatches.push({
            text: match[1],
            start: match.index,
            end: match.index + match[0].length
        });
    }

    // Encontrar todas las cursivas (que no sean parte de negritas)
    while ((match = italicRegex.exec(line)) !== null) {
        const isInsideBold = boldMatches.some(
            bold => match.index >= bold.start && match.index < bold.end
        );
        if (!isInsideBold) {
            italicMatches.push({
                text: match[1],
                start: match.index,
                end: match.index + match[0].length
            });
        }
    }

    // Si no hay formato, renderizar texto simple
    if (boldMatches.length === 0 && italicMatches.length === 0) {
        return (
            <Text
                style={[
                    styles.text,
                    { color: colors.text },
                    isEmojiSection && styles.emojiSectionText,
                    isBullet && styles.bulletText,
                    isNumbered && styles.numberedText,
                ]}
            >
                {line}
            </Text>
        );
    }

    // Combinar y ordenar todos los matches
    const allMatches = [
        ...boldMatches.map(m => ({ ...m, type: 'bold' as const })),
        ...italicMatches.map(m => ({ ...m, type: 'italic' as const }))
    ].sort((a, b) => a.start - b.start);

    // Construir partes del texto
    let lastIndex = 0;
    allMatches.forEach((match) => {
        // Texto antes del match
        if (match.start > lastIndex) {
            const beforeText = line.substring(lastIndex, match.start);
            parts.push(
                <Text key={key++} style={[styles.text, { color: colors.text }]}>
                    {beforeText}
                </Text>
            );
        }

        // Texto formateado
        if (match.type === 'bold') {
            parts.push(
                <Text key={key++} style={[styles.text, styles.bold, { color: colors.text }]}>
                    {match.text}
                </Text>
            );
        } else {
            parts.push(
                <Text key={key++} style={[styles.text, styles.italic, { color: colors.textSecondary }]}>
                    {match.text}
                </Text>
            );
        }

        lastIndex = match.end;
    });

    // Texto después del último match
    if (lastIndex < line.length) {
        const afterText = line.substring(lastIndex);
        parts.push(
            <Text key={key++} style={[styles.text, { color: colors.text }]}>
                {afterText}
            </Text>
        );
    }

    return (
        <Text
            style={[
                styles.text,
                isEmojiSection && styles.emojiSectionText,
                isBullet && styles.bulletText,
                isNumbered && styles.numberedText,
            ]}
        >
            {parts}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lineContainer: {
        marginBottom: 4,
    },
    emptyLine: {
        height: 8,
    },
    messageText: {
        ...Typography.body,
        lineHeight: 22,
    },
    text: {
        ...Typography.body,
        lineHeight: 20,
        fontSize: 15,
    },
    bold: {
        fontWeight: '700',
        fontSize: 15,
    },
    italic: {
        fontStyle: 'italic',
        fontSize: 14,
        opacity: 0.9,
    },
    emojiSectionText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        marginBottom: 4,
    },
    bulletText: {
        paddingLeft: 12,
        lineHeight: 20,
    },
    numberedText: {
        fontWeight: '500',
        lineHeight: 20,
    },
});
