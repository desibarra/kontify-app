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
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
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
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
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
      <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}>
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
          <Ionicons name="options-outline" size={20} color={colors.primary} />
          {activeFiltersCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{activeFiltersCount}</Text>
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
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
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
                    { backgroundColor: colors.backgroundSecondary },
                    selectedSpecialty === specialty && { backgroundColor: colors.primary },
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
                    { backgroundColor: colors.backgroundSecondary },
                    selectedService === service && { backgroundColor: colors.primary },
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

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
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
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalButton: {
    ...Typography.body,
  },
  modalTitle: {
    ...Typography.h3,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
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
  },
  optionText: {
    ...Typography.bodySmall,
  },
  modalFooter: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...Typography.button,
  },
});