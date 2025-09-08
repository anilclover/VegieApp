import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const {colors} = useTheme();
  const navigation = useNavigation();

  const handleAddMoney = () => {
    const amount = parseInt(customAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (amount < 10) {
      Alert.alert('Minimum Amount', 'Minimum amount to add is ₹10');
      return;
    }

    Alert.alert('Add Money', `Add ₹${amount} to your wallet?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Add',
        onPress: () => {
          setBalance(prev => prev + amount);
          setSelectedAmount(0);
          setCustomAmount('');
          Alert.alert(
            'Success',
            `₹${amount} added to your wallet successfully!`,
          );
        },
      },
    ]);
  };

  const applyOffer = (bonus: number, minAmount: number) => {
    const amount = parseInt(customAmount);
    if (amount >= minAmount) {
      Alert.alert(
        'Offer Applied',
        `You will get ₹${bonus} bonus on recharge of ₹${amount}`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Proceed',
            onPress: () => {
              setBalance(prev => prev + amount + bonus);
              setSelectedAmount(0);
              setCustomAmount('');
              Alert.alert(
                'Success',
                `₹${
                  amount + bonus
                } (₹${amount} + ₹${bonus} bonus) added to your wallet!`,
              );
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Offer Not Applicable',
        `Minimum recharge amount is ₹${minAmount}`,
      );
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>VeCash Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance}</Text>
          <TouchableOpacity style={styles.transactionButton}>
            <Text style={styles.transactionText}>View Transaction ▼</Text>
          </TouchableOpacity>
          <View style={styles.coinsIcon}>
            <Text style={styles.coins}>🪙</Text>
          </View>
        </View>

        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <View style={styles.easyPayment}>
              <Text style={[styles.featureIcon]}>⚡</Text>
            </View>
            <Text style={[styles.featureTitle]}>Easy & Fast</Text>
            <Text style={styles.featureSubtitle}>Payment</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureBackGround}>
              <Text style={styles.featureIcon}>₹</Text>
            </View>
            <Text style={styles.featureTitle}>Instant Refunds</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureBackGround}>
              <Text style={styles.featureIcon}>%</Text>
            </View>
            <Text style={styles.featureTitle}>Exclusive Offers</Text>
          </View>
        </View>

        <View style={styles.addMoneySection}>
          <Text style={styles.addMoneyTitle}>
            ₹ Enter Amount To Add In Wallet
          </Text>

          <TextInput
            style={styles.customAmountInput}
            placeholder="Enter custom amount"
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="numeric"
          />

          <View style={styles.amountGrid}>
            <TouchableOpacity
              style={[
                styles.amountButton,
                selectedAmount === 100 && styles.selectedAmountButton,
              ]}
              onPress={() => {
                setSelectedAmount(100);
                setCustomAmount('100');
              }}>
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === 100 && styles.selectedAmountText,
                ]}>
                +₹100
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.amountButton,
                selectedAmount === 200 && styles.selectedAmountButton,
              ]}
              onPress={() => {
                setSelectedAmount(200);
                setCustomAmount('200');
              }}>
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === 200 && styles.selectedAmountText,
                ]}>
                +₹200
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.amountButton,
                selectedAmount === 500 && styles.selectedAmountButton,
              ]}
              onPress={() => {
                setSelectedAmount(500);
                setCustomAmount('500');
              }}>
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === 500 && styles.selectedAmountText,
                ]}>
                +₹500
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.amountButton,
                selectedAmount === 1000 && styles.selectedAmountButton,
              ]}
              onPress={() => {
                setSelectedAmount(1000);
                setCustomAmount('1000');
              }}>
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === 1000 && styles.selectedAmountText,
                ]}>
                +₹1000
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addMoneyButton}
            onPress={handleAddMoney}>
            <Text style={styles.addMoneyButtonText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.offersSection}>
          <Text style={styles.offersTitle}>Wallet Recharge Offers</Text>

          <View style={styles.offersRow}>
            <View style={styles.offerCard}>
              <Text style={styles.offerAmount}>₹50</Text>
              <Text style={styles.offerText}>Wallet Bonus</Text>
              <Text style={styles.offerCondition}>On recharge of</Text>
              <Text style={styles.offerMinAmount}>₹1000+</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => applyOffer(50, 1000)}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.offerCard}>
              <Text style={styles.offerAmount}>₹150</Text>
              <Text style={styles.offerText}>Wallet Bonus</Text>
              <Text style={styles.offerCondition}>On recharge of</Text>
              <Text style={styles.offerMinAmount}>₹2000+</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => applyOffer(150, 2000)}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  balanceTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  transactionText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  coinsIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  coins: {
    fontSize: 60,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
  },
  easyPayment: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  featureBackGround: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 12,
    padding: 2,
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 14,
    color: 'white',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  addMoneySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  addMoneyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  amountText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addMoneyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addMoneyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offersSection: {
    marginBottom: 20,
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  offersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  offerAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  offerText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 8,
  },
  offerCondition: {
    color: 'white',
    fontSize: 10,
  },
  offerMinAmount: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: '#90EE90',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
  },
  applyText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customAmountInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  selectedAmountButton: {
    backgroundColor: '#4CAF50',
  },
  selectedAmountText: {
    color: 'white',
  },
});
