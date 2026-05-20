// Filter Modal Component for category filtering
import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';

export default function FilterModal({ visible, onClose, onApply, onClear, categories, selectedCategory }) {
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  
  const handleApply = () => {
    onApply(tempCategory);
    onClose();
  };
  
  const handleClear = () => {
    setTempCategory(null);
    onClear();
    onClose();
  };
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}> Filter Expenses</Text>
          
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity 
              style={[styles.categoryChip, !tempCategory && styles.categoryChipActive]}
              onPress={() => setTempCategory(null)}
            >
              <Text style={[styles.categoryText, !tempCategory && styles.categoryTextActive]}>All</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat.id}
                style={[styles.categoryChip, tempCategory === cat.id && styles.categoryChipActive]}
                onPress={() => setTempCategory(cat.id)}
              >
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                <Text style={[styles.categoryText, tempCategory === cat.id && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', borderRadius: 20, padding: 20, width: '90%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 10 },
  categoryScroll: { flexDirection: 'row', marginBottom: 15 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 8 },
  categoryChipActive: { backgroundColor: '#007AFF' },
  categoryEmoji: { fontSize: 16, marginRight: 4 },
  categoryText: { fontSize: 14, color: '#333' },
  categoryTextActive: { color: 'white' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  clearButton: { backgroundColor: '#F0F0F0' },
  clearButtonText: { color: '#666', fontWeight: 'bold' },
  applyButton: { backgroundColor: '#007AFF' },
  applyButtonText: { color: 'white', fontWeight: 'bold' },
  closeButton: { marginTop: 15, padding: 12, alignItems: 'center' },
  closeButtonText: { color: '#007AFF' }
});