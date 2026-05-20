import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, Alert, StyleSheet, Modal, ScrollView
} from 'react-native';
import useAuthStore from './src/store/authStore';
import useExpenseStore from './src/store/expenseStore';
import AuthScreen from './src/screens/AuthScreen';
import FilterModal from './src/components/FilterModal';

export default function App() {
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    checkAuth().then(() => setIsReady(true));
  }, []);
  
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }
  
  return <MainApp onLogout={logout} />;
}

function MainApp({ onLogout }) {
  const {
    expenses, categories, loading, error, loadExpenses, addExpense,
    updateExpense, deleteExpense, searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory, getFilteredExpenses,
    clearFilters, getTotalExpenses
  } = useExpenseStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    loadExpenses();
  }, []);
  
  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = getTotalExpenses();
  
  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategoryId('1');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setEditingExpense(null);
  };
  
  const handleSubmit = async () => {
    // Client-side validation
    if (!title || title.length < 3) {
      Alert.alert('Validation Error', 'Title must be at least 3 characters');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Validation Error', 'Amount must be greater than 0');
      return;
    }
    if (parseFloat(amount) > 100000) {
      Alert.alert('Validation Error', 'Amount cannot exceed 100,000');
      return;
    }
    
    const expenseData = { title, amount: parseFloat(amount), categoryId, date, description };
    
    let result;
    if (editingExpense) {
      result = await updateExpense(editingExpense.id, expenseData);
    } else {
      result = await addExpense(expenseData);
    }
    
    if (result.success) {
      resetForm();
      setModalVisible(false);
      Alert.alert('Success', editingExpense ? 'Expense updated!' : 'Expense added!');
    } else {
      Alert.alert('Error', result.error);
    }
  };
  
  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategoryId(expense.categoryId || '1');
    setDate(expense.date);
    setDescription(expense.description || '');
    setModalVisible(true);
  };
  
  const handleDelete = (id, title) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(id) }
      ]
    );
  };
  
  const getCategoryInfo = (id) => {
    return categories.find(c => c.id === id) || categories[0];
  };
  
  if (loading && expenses.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading expenses...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}> Expense Tracker</Text>
          <Text style={styles.headerSubtitle}>Total: Nu{totalExpenses.toFixed(2)}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.headerIconButton}>
            <Text style={styles.headerIconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.headerIconButton}>
            <Text style={styles.headerIconText}>⎋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { resetForm(); setModalVisible(true); }} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search expenses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Error Display */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadExpenses}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Expense List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const category = getCategoryInfo(item.categoryId);
          return (
            <View style={styles.expenseCard}>
              <TouchableOpacity style={styles.expenseInfo} onPress={() => openEditModal(item)}>
                <View style={styles.expenseHeader}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.expenseTitle}>{item.title}</Text>
                </View>
                <Text style={styles.expenseDate}>{item.date}</Text>
                {item.description ? (
                  <Text style={styles.expenseDesc} numberOfLines={1}>{item.description}</Text>
                ) : null}
              </TouchableOpacity>
              <View style={styles.expenseActions}>
                <Text style={styles.expenseAmount}>NU{item.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.title)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubText}>Tap + to add your first expense</Text>
          </View>
        }
      />
      
      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingExpense ? ' Edit Expense' : '➕ Add Expense'}
            </Text>
            
            <Text style={styles.inputLabel}>Title * (min 3 chars)</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g., Grocery Shopping" />
            
            <Text style={styles.inputLabel}>Amount * (0)</Text>
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" />
            
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryOption, categoryId === cat.id && styles.categoryOptionActive]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text style={styles.categoryOptionEmoji}>{cat.icon}</Text>
                  <Text style={[styles.categoryOptionText, categoryId === cat.id && styles.categoryOptionTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-06-15" />
            
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Add notes..." multiline />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>{editingExpense ? 'Update' : 'Add'}</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(cat) => setSelectedCategory(cat)}
        onClear={clearFilters}
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#007AFF' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  headerIconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerIconText: { fontSize: 22 },
  addButton: { backgroundColor: 'white', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 5 },
  addButtonText: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
  searchContainer: { padding: 15, backgroundColor: 'white' },
  searchInput: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, fontSize: 16 },
  errorBox: { backgroundColor: '#FFE5E5', padding: 15, margin: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' },
  errorText: { color: 'red', flex: 1 },
  retryText: { color: '#007AFF', fontWeight: 'bold' },
  expenseCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 16, marginHorizontal: 15, marginVertical: 6, borderRadius: 12, elevation: 2 },
  expenseInfo: { flex: 1 },
  expenseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryIcon: { fontSize: 20, marginRight: 8 },
  expenseTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  expenseDate: { fontSize: 12, color: '#999', marginBottom: 4 },
  expenseDesc: { fontSize: 12, color: '#666' },
  expenseActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  expenseAmount: { fontSize: 18, fontWeight: 'bold', color: '#FF3B30', marginBottom: 8 },
  deleteText: { color: '#FF3B30', fontSize: 12 },
  emptyContainer: { padding: 60, alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#999' },
  emptySubText: { fontSize: 14, color: '#CCC', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, margin: 20, maxHeight: '85%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  categorySelector: { flexDirection: 'row', marginVertical: 10 },
  categoryOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 8 },
  categoryOptionActive: { backgroundColor: '#007AFF' },
  categoryOptionEmoji: { fontSize: 16, marginRight: 4 },
  categoryOptionText: { fontSize: 14, color: '#333' },
  categoryOptionTextActive: { color: 'white' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#F0F0F0' },
  cancelButtonText: { color: '#666', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#007AFF' },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});