// Filter Modal Component for category filtering

// Import React and useState hook
import React, { useState } from 'react';

// Those are import React Native components
import {
  View,          
  Text,           
  Modal,          
  TouchableOpacity, 
  StyleSheet,     
  ScrollView      
} from 'react-native';

// Main FilterModal component
export default function FilterModal({
  visible,            
  onClose,          
  onApply,            
  onClear,           
  categories,         
  selectedCategory    
}) {

  // Temporary category state used before applying filter
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  
  // Apply selected category filter
  const handleApply = () => {
    onApply(tempCategory); // Send selected category to parent
    onClose();             // Close modal
  };
  
  // Clear selected category filter
  const handleClear = () => {
    setTempCategory(null); // Reset temporary category
    onClear();             // Notify parent to clear filter
    onClose();             // Close modal
  };
  
  return (
    // Modal component
    <Modal visible={visible} animationType="slide" transparent>

      {/* Dark overlay background */}
      <View style={styles.overlay}>

        {/* Main modal container */}
        <View style={styles.modal}>

          {/* Modal title */}
          <Text style={styles.title}> Filter Expenses</Text>
          
          {/* Category section label */}
          <Text style={styles.label}>Category</Text>

          {/* Horizontal scroll view for categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >

            {/* "All" category button */}
            <TouchableOpacity 
              style={[
                styles.categoryChip,
                !tempCategory && styles.categoryChipActive
              ]}
              onPress={() => setTempCategory(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  !tempCategory && styles.categoryTextActive
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {/* Render all categories dynamically */}
            {categories.map(cat => (

              <TouchableOpacity 
                key={cat.id} // Unique key for each category
                style={[
                  styles.categoryChip,
                  tempCategory === cat.id && styles.categoryChipActive
                ]}
                onPress={() => setTempCategory(cat.id)}
              >

                {/* Category emoji/icon */}
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>

                {/* Category name */}
                <Text
                  style={[
                    styles.categoryText,
                    tempCategory === cat.id && styles.categoryTextActive
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Buttons container */}
          <View style={styles.buttonRow}>

            {/* Clear button */}
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>

            {/* Apply button */}
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          
          {/* Close modal button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Styles for the component
const styles = StyleSheet.create({

  // Background overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Main modal box
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%'
  },

  // Title text
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  // Section label
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10
  },

  // Horizontal category scroll container
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 15
  },

  // Category button style
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8
  },

  // Active selected category style
  categoryChipActive: {
    backgroundColor: '#007AFF'
  },

  // Emoji/icon style
  categoryEmoji: {
    fontSize: 16,
    marginRight: 4
  },

  // Category text style
  categoryText: {
    fontSize: 14,
    color: '#333'
  },

  // Active category text style
  categoryTextActive: {
    color: 'white'
  },

  // Row for action buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },

  // General button style
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },

  // Clear button background
  clearButton: {
    backgroundColor: '#F0F0F0'
  },

  // Clear button text
  clearButtonText: {
    color: '#666',
    fontWeight: 'bold'
  },

  // Apply button background
  applyButton: {
    backgroundColor: '#007AFF'
  },

  // Apply button text
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },

  // Close button style
  closeButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center'
  },

  // Close button text
  closeButtonText: {
    color: '#007AFF'
  }
});