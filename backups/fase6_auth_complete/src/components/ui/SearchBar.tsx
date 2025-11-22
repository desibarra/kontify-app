import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/Colors';
import { Specialty, ServiceType } from '../../constants/Types';

interface SearchBarProps {
  onSearch: (query: string, specialty?: Specialty, service?: ServiceType) => void;
  placeholder?: string;
}

const specialties: Specialty[] = [
  'IVA',
  'ISR',
  'Nómina',
  'Deducciones',
  'Facturación Electrónica',
  'Declaraciones',
  'Auditoría',
  'Planeación Fiscal',
];

const services: ServiceType[] = [
  'Consultoría General',
  'Revisión de Declaraciones',
  'Optimización Fiscal',
  'Asesoría en Auditoría',
  'Capacitación',
  'Resolución de Controversias',
];

export default function SearchBar({ onSearch, placeholder = 'Buscar expertos...' }: SearchBarProps) {
  // Always use dark theme
  const colors = Colors.dark;

  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | undefined>();
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>();

  const handleSearch = () => {
    onSearch(query, selectedSpecialty, selectedService);
  };

  const clearFilters = () => {
    setSelectedSpecialty(undefined);
    setSelectedService(undefined);
    setQuery('');
    onSearch('');
  };

  const activeFiltersCount = (selectedSpecialty ? 1 : 0) + (selectedService ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }, Shadows.sm]}>
        <Ionicons name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color={colors.primary} />
          {activeFiltersCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.background }]}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.modalButton, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.modalButton, { color: colors.primary }]}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Especialidad</Text>
            <View style={styles.optionsContainer}>
              {specialties.map(specialty => (
                <TouchableOpacity
                  key={specialty}
                  style={[
                    styles.option,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                    selectedSpecialty === specialty && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() =>
                    setSelectedSpecialty(selectedSpecialty === specialty ? undefined : specialty)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      selectedSpecialty === specialty && { color: colors.background },
                    ]}
                  >
                    {specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tipo de servicio</Text>
            <View style={styles.optionsContainer}>
              {services.map(service => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.option,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                    selectedService === service && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() =>
                    setSelectedService(selectedService === service ? undefined : service)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      selectedService === service && { color: colors.background },
                    ]}
                  >
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.border, backgroundColor: colors.backgroundSecondary }]}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }, Shadows.green]}
              onPress={() => {
                handleSearch();
                setShowFilters(false);
              }}
            >
              <Text style={[styles.applyButtonText, { color: colors.background }]}>
                Aplicar filtros
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
  },
  filterButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalButton: {
    ...Typography.body,
    fontWeight: '500',
  },
  modalTitle: {
    ...Typography.h3,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  optionText: {
    ...Typography.bodySmall,
    fontWeight: '500',
  },
  modalFooter: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    ...Typography.button,
    fontWeight: '700',
  },
});