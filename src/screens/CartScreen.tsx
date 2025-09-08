import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useCart} from '../context/CartContext';
import DatePicker from '../components/DatePicker';
import { RazorpayService } from '../services/RazorpayService';
import {preventScreenshot, allowScreenshot} from '../utils/ScreenshotPrevention';
import { PaymentAppDetector, PaymentApp } from '../utils/PaymentAppDetector';

// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkCIKQZ1ydCbRHBrXmC8hUh2dsrnCDEWI&amp;libraries=places"></script>;

const CartScreen = () => {
  const {colors} = useTheme();

  useEffect(() => {
    preventScreenshot();
    loadInstalledPaymentApps();
    return () => allowScreenshot();
  }, []);

  const loadInstalledPaymentApps = async () => {
    try {
      const apps = await PaymentAppDetector.getInstalledPaymentApps();
      setInstalledPaymentApps(apps);
    } catch (error) {
      console.error('Error loading payment apps:', error);
    }
  };
  const {cartItems, addToCart, removeFromCart, clearCart, getTotalPrice} =
    useCart();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showInstructionInput, setShowInstructionInput] =
    useState<boolean>(false);
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [showUPIOptions, setShowUPIOptions] = useState<boolean>(false);
  const [showWalletOptions, setShowWalletOptions] = useState<boolean>(false);
  const [showBankOptions, setShowBankOptions] = useState<boolean>(false);
  const [installedPaymentApps, setInstalledPaymentApps] = useState<PaymentApp[]>([]);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const paymentOptions = [
    {id: 'card', name: 'Credit/Debit Card', icon: '💳'},
    {id: 'upi', name: 'UPI', icon: '📱'},
    {id: 'wallet', name: 'Wallets', icon: '👛'},
    {id: 'netbanking', name: 'Net Banking', icon: '🏦'},
    {id: 'cod', name: 'Cash on Delivery', icon: '💵'},
  ];

  const upiOptions = [
    {id: 'gpay', name: 'Google Pay', icon: '🟢'},
    {id: 'phonepe', name: 'PhonePe', icon: '🟣'},
    {id: 'paytm', name: 'Paytm', icon: '🔵'},
    {id: 'upi_id', name: 'Enter UPI ID', icon: '📱'},
  ];

  const walletOptions = [
    {id: 'paytm_wallet', name: 'Paytm Wallet', icon: '🔵'},
    {id: 'mobikwik', name: 'MobiKwik', icon: '🔴'},
    {id: 'freecharge', name: 'FreeCharge', icon: '🟡'},
    {id: 'amazon_pay', name: 'Amazon Pay', icon: '🟠'},
  ];

  const bankOptions = [
    {id: 'sbi', name: 'State Bank of India', icon: '🏦'},
    {id: 'hdfc', name: 'HDFC Bank', icon: '🏦'},
    {id: 'icici', name: 'ICICI Bank', icon: '🏦'},
    {id: 'axis', name: 'Axis Bank', icon: '🏦'},
  ];

  const timeSlots = [
    {id: 'morning', label: '7:00 AM - 11:30 AM', endTime: '11:30'},
    {id: 'afternoon', label: '11:30 AM - 5:00 PM', endTime: '17:00'},
  ];

  const getAvailableTimeSlots = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return timeSlots.filter(slot => {
      const [hours, minutes] = slot.endTime.split(':').map(Number);
      const endTimeMinutes = hours * 60 + minutes;
      return currentTime <= endTimeMinutes - 30;
    });
  };

  const coupons = [
    {
      id: 'SAVE10',
      title: 'SAVE10',
      discount: 10,
      minOrder: 200,
      description: '10% off on orders above ₹200',
    },
    {
      id: 'FIRST20',
      title: 'FIRST20',
      discount: 20,
      minOrder: 300,
      description: '20% off on first order above ₹300',
    },
    {
      id: 'FLAT50',
      title: 'FLAT50',
      discount: 50,
      minOrder: 500,
      description: 'Flat ₹50 off on orders above ₹500',
    },
  ];

  const totalAmount = parseFloat(getTotalPrice());
  const applicableCoupons = coupons.filter(
    coupon => totalAmount >= coupon.minOrder,
  );
  const deliveryCharge = totalAmount > 250 ? 0 : 40;
  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate);
    return {
      day: date.toLocaleDateString('en-US', {weekday: 'short'}),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', {month: 'short'}),
      year: date.getFullYear(),
    };
  };

  const handlePaymentMethod = async (methodId: string) => {
    setShowPaymentOptions(false);
    
    if (methodId === 'card') {
      setShowCardForm(true);
    } else if (methodId === 'upi') {
      setShowUPIOptions(true);
    } else if (methodId === 'wallet') {
      setShowWalletOptions(true);
    } else if (methodId === 'netbanking') {
      setShowBankOptions(true);
    } else if (methodId === 'cod') {
      await processCODPayment();
    }
  };

  const handleUPIMethod = async (methodId: string) => {
    setShowUPIOptions(false);
    await processUPIPayment(methodId);
  };

  const handleWalletMethod = async (methodId: string) => {
    setShowWalletOptions(false);
    await processWalletPayment(methodId);
  };

  const handleBankMethod = async (methodId: string) => {
    setShowBankOptions(false);
    await processBankPayment(methodId);
  };

  const processCardPayment = async () => {
    if (!validateCardDetails()) return;
    
    const finalAmount = getFinalAmount();
    const maskedCard = cardDetails.number.replace(/.(?=.{4})/g, '*');
    
    Alert.alert(
      'Payment Successful!',
      `Card payment completed!\nCard: ${maskedCard}\nAmount: ₹${finalAmount}\nTransaction ID: CARD${Date.now()}`,
      [{text: 'OK', onPress: () => {
        clearCart();
        setShowCardForm(false);
        setCardDetails({number: '', expiry: '', cvv: '', name: ''});
      }}]
    );
  };

  const validateCardDetails = () => {
    if (!cardDetails.number || cardDetails.number.length < 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      Alert.alert('Error', 'Please enter expiry in MM/YY format');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    if (!cardDetails.name.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return false;
    }
    return true;
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return match;
    }
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const processUPIPayment = async (method: string) => {
    const finalAmount = getFinalAmount();
    const methodName = upiOptions.find(opt => opt.id === method)?.name || 'UPI';
    Alert.alert(
      'Payment Successful!',
      `${methodName} payment completed!\nAmount: ₹${finalAmount}\nTransaction ID: UPI${Date.now()}`,
      [{text: 'OK', onPress: () => clearCart()}]
    );
  };

  const processWalletPayment = async (method: string) => {
    const finalAmount = getFinalAmount();
    const methodName = walletOptions.find(opt => opt.id === method)?.name || 'Wallet';
    Alert.alert(
      'Payment Successful!',
      `${methodName} payment completed!\nAmount: ₹${finalAmount}\nTransaction ID: WAL${Date.now()}`,
      [{text: 'OK', onPress: () => clearCart()}]
    );
  };

  const processBankPayment = async (method: string) => {
    const finalAmount = getFinalAmount();
    const methodName = bankOptions.find(opt => opt.id === method)?.name || 'Net Banking';
    Alert.alert(
      'Payment Successful!',
      `${methodName} payment completed!\nAmount: ₹${finalAmount}\nTransaction ID: NB${Date.now()}`,
      [{text: 'OK', onPress: () => clearCart()}]
    );
  };

  const processCODPayment = async () => {
    const finalAmount = getFinalAmount();
    Alert.alert(
      'Order Confirmed!',
      `Cash on Delivery order placed!\nAmount: ₹${finalAmount}\nOrder ID: COD${Date.now()}`,
      [{text: 'OK', onPress: () => clearCart()}]
    );
  };

  const initiateRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    try {
      const finalAmount = getFinalAmount();
      const amountInRupees = parseFloat(finalAmount);

      if (amountInRupees < 1) {
        Alert.alert('Error', 'Minimum payment amount is ₹1');
        return;
      }

      const orderId = RazorpayService.generateOrderId();
      // Use mock payment for now to avoid Razorpay configuration issues
      const paymentResponse = await RazorpayService.mockPayment(amountInRupees, orderId);

      Alert.alert(
        'Payment Successful!',
        `Payment completed successfully!\nAmount: ₹${finalAmount}\nPayment ID: ${paymentResponse.razorpay_payment_id}\nOrder ID: ${paymentResponse.razorpay_order_id}`,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Order placed successfully');
              clearCart();
            },
          },
        ],
      );
    } catch (error: any) {
      if (error.message.includes('cancelled')) {
        Alert.alert('Payment Cancelled', 'Payment was cancelled by user');
      } else {
        Alert.alert('Payment Failed', error.message || 'Something went wrong');
      }
    }
  };

  const getFinalAmount = () => {
    if (!selectedCoupon) return (totalAmount + deliveryCharge).toFixed(2);
    const coupon = coupons.find(c => c.id === selectedCoupon);
    if (!coupon) return (totalAmount + deliveryCharge).toFixed(2);
    const discount =
      coupon.title === 'FLAT50'
        ? coupon.discount
        : Math.round((totalAmount * coupon.discount) / 100);
    return (totalAmount - discount + deliveryCharge).toFixed(2);
  };

  const renderCartItem = ({item}: {item: any}) => (
    <View style={[styles.cartItem, {backgroundColor: colors.surface}]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, {color: colors.text}]}>{item.name}</Text>
        <Text style={[styles.itemPrice, {color: colors.primary}]}>
          ₹ {item.price}
        </Text>
      </View>
      <View
        style={[styles.quantityContainer, {backgroundColor: colors.primary}]}>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.quantityButton}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() =>
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              emoji: item.emoji,
            })
          }>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={[styles.emptyText, {color: colors.text}]}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            style={styles.cartList}
            scrollEnabled={false}
          />

          <View style={styles.discountSection}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              Apply Coupon
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.couponScroll}>
              {coupons.map(coupon => {
                const isApplicable = totalAmount >= coupon.minOrder;
                const isSelected = selectedCoupon === coupon.id;
                return (
                  <TouchableOpacity
                    key={coupon.id}
                    style={[
                      styles.couponCard,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surface,
                        borderColor: isApplicable
                          ? colors.primary
                          : colors.text + '40',
                        opacity: isApplicable ? 1 : 0.6,
                      },
                    ]}
                    onPress={() =>
                      isApplicable &&
                      setSelectedCoupon(isSelected ? '' : coupon.id)
                    }
                    disabled={!isApplicable}>
                    <Text
                      style={[
                        styles.couponTitle,
                        {
                          color: isSelected ? '#fff' : colors.primary,
                        },
                      ]}>
                      {coupon.title}
                    </Text>
                    <Text
                      style={[
                        styles.couponDescription,
                        {
                          color: isSelected ? '#fff' : colors.text,
                        },
                      ]}>
                      {coupon.description}
                    </Text>
                    {!isApplicable && (
                      <Text style={[styles.minOrderText, {color: colors.text}]}>
                        Min order: ₹{coupon.minOrder}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          <View>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              Delivery Time
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.timeSlotScroll}>
              {getAvailableTimeSlots().map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlotCard,
                    {
                      backgroundColor:
                        selectedTimeSlot === slot.id
                          ? colors.primary
                          : colors.surface,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedTimeSlot(slot.id)}>
                  <Text
                    style={[
                      styles.timeSlotText,
                      {
                        color:
                          selectedTimeSlot === slot.id ? '#fff' : colors.text,
                      },
                    ]}>
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <TouchableOpacity
              style={[styles.instructionCard]}
              onPress={() => setShowInstructionInput(!showInstructionInput)}>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor: showInstructionInput
                        ? colors.primary
                        : colors.text + '40',
                    },
                  ]}>
                  {showInstructionInput && (
                    <Text
                      style={[styles.radioCheckMark, {color: colors.primary}]}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={[styles.instructionText, {color: colors.text}]}>
                  Delivery Instructions
                </Text>
              </View>
            </TouchableOpacity>

            {showInstructionInput && (
              <TextInput
                style={[
                  styles.customInstructionInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.primary,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter your delivery instructions..."
                placeholderTextColor={colors.text + '60'}
                value={customInstruction}
                onChangeText={setCustomInstruction}
                multiline
                numberOfLines={3}
              />
            )}
          </View>
        </ScrollView>
      )}
      {/*=========================== Billing Section=========================== */}
      {cartItems.length === 0 ? null : (
        <View
          style={[styles.totalContainer, {backgroundColor: colors.surface}]}>
          {selectedCoupon && (
            <View style={styles.discountRow}>
              <Text style={[styles.discountLabel, {color: colors.text}]}>
                Subtotal:
              </Text>
              <Text style={[styles.discountAmount, {color: colors.text}]}>
                ₹{getTotalPrice()}
              </Text>
            </View>
          )}

          {selectedCoupon && (
            <View style={styles.discountRow}>
              <Text style={[styles.discountLabel, {color: '#4CAF50'}]}>
                Discount ({selectedCoupon}):
              </Text>
              <Text style={[styles.discountAmount, {color: '#4CAF50'}]}>
                -₹
                {(() => {
                  const coupon = coupons.find(c => c.id === selectedCoupon);
                  if (coupon?.title === 'FLAT50') return coupon.discount;
                  return coupon
                    ? Math.round((totalAmount * coupon.discount) / 100)
                    : 0;
                })()}
              </Text>
            </View>
          )}
          <View style={styles.discountRow}>
            <Text style={[styles.discountLabel, {color: '#4CAF50'}]}>
              Delivery charge :
            </Text>
            <Text style={[styles.discountAmount, {color: '#4CAF50'}]}>
              ₹ {deliveryCharge}
            </Text>
          </View>
          <View style={styles.discountRow}>
            <Text style={[styles.totalText, {color: colors.text}]}>Total:</Text>
            <Text>
              ₹{' '}
              {(() => {
                if (!selectedCoupon)
                  return (totalAmount + deliveryCharge).toFixed(2);

                const coupon = coupons.find(c => c.id === selectedCoupon);
                if (!coupon) return (totalAmount + deliveryCharge).toFixed(2);

                const discount =
                  coupon.title === 'FLAT50'
                    ? coupon.discount
                    : Math.round((totalAmount * coupon.discount) / 100);
                return (totalAmount - discount + deliveryCharge).toFixed(2);
              })()}
            </Text>
          </View>

          {selectedDate && (
            <Text style={[styles.deliveryText, {color: colors.text}]}>
              Delivery: {selectedTimeSlot} {getSelectedDateInfo()?.day}{' '}
              {getSelectedDateInfo()?.dayNum} {getSelectedDateInfo()?.month}{' '}
              {getSelectedDateInfo()?.year}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.paymentButton, {backgroundColor: colors.primary}]}
            onPress={() => setShowPaymentOptions(true)}>
            <Text style={styles.paymentButtonText}>Choose Payment Method</Text>
          </TouchableOpacity>
        </View>
      )}
      {/*=========================== Payment Section=========================== */}
      <Modal
        visible={showPaymentOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentOptions(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.paymentModal, {backgroundColor: colors.surface}]}>
            <Text style={[styles.modalTitle, {color: colors.text}]}>
              Select Payment Method
            </Text>

            {paymentOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.paymentOption,
                  {borderColor: colors.text + '20'},
                ]}
                onPress={() => handlePaymentMethod(option.id)}>
                <Text style={styles.paymentIcon}>{option.icon}</Text>
                <Text style={[styles.paymentName, {color: colors.text}]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: colors.primary}]}
              onPress={() => setShowPaymentOptions(false)}>
              <Text style={[styles.cancelText, {color: colors.primary}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* UPI Options Modal */}
      <Modal
        visible={showUPIOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUPIOptions(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModal, {backgroundColor: colors.surface}]}>
            <Text style={[styles.modalTitle, {color: colors.text}]}>Select UPI Method</Text>
            {installedPaymentApps
              .filter(app => ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].includes(app.name))
              .map((app) => (
                <TouchableOpacity
                  key={app.name}
                  style={[styles.paymentOption, {borderColor: colors.text + '20', backgroundColor: '#e8f5e8'}]}
                  onPress={() => {
                    PaymentAppDetector.openPaymentApp(app.scheme);
                    handleUPIMethod(app.name.toLowerCase().replace(' ', ''));
                  }}>
                  <Text style={styles.paymentIcon}>✅</Text>
                  <Text style={[styles.paymentName, {color: colors.text}]}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              style={[styles.paymentOption, {borderColor: colors.text + '20'}]}
              onPress={() => handleUPIMethod('upi_id')}>
              <Text style={styles.paymentIcon}>📱</Text>
              <Text style={[styles.paymentName, {color: colors.text}]}>Enter UPI ID</Text>
            </TouchableOpacity>
            {installedPaymentApps.filter(app => ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].includes(app.name)).length === 0 && (
              <Text style={[styles.noAppsText, {color: colors.text}]}>No UPI apps detected</Text>
            )}
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: colors.primary}]}
              onPress={() => setShowUPIOptions(false)}>
              <Text style={[styles.cancelText, {color: colors.primary}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wallet Options Modal */}
      <Modal
        visible={showWalletOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWalletOptions(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModal, {backgroundColor: colors.surface}]}>
            <Text style={[styles.modalTitle, {color: colors.text}]}>Select Wallet</Text>
            {installedPaymentApps
              .filter(app => ['Paytm', 'MobiKwik', 'FreeCharge', 'Amazon Pay'].includes(app.name))
              .map((app) => (
                <TouchableOpacity
                  key={app.name}
                  style={[styles.paymentOption, {borderColor: colors.text + '20', backgroundColor: '#fff3e0'}]}
                  onPress={() => {
                    PaymentAppDetector.openPaymentApp(app.scheme);
                    handleWalletMethod(app.name.toLowerCase().replace(' ', ''));
                  }}>
                  <Text style={styles.paymentIcon}>✅</Text>
                  <Text style={[styles.paymentName, {color: colors.text}]}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            {installedPaymentApps.filter(app => ['Paytm', 'MobiKwik', 'FreeCharge', 'Amazon Pay'].includes(app.name)).length === 0 && (
              <Text style={[styles.noAppsText, {color: colors.text}]}>No wallet apps detected</Text>
            )}
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: colors.primary}]}
              onPress={() => setShowWalletOptions(false)}>
              <Text style={[styles.cancelText, {color: colors.primary}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bank Options Modal */}
      <Modal
        visible={showBankOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBankOptions(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModal, {backgroundColor: colors.surface}]}>
            <Text style={[styles.modalTitle, {color: colors.text}]}>Select Bank</Text>
            {installedPaymentApps
              .filter(app => ['SBI Pay', 'HDFC PayZapp', 'ICICI Pockets', 'Axis Pay'].includes(app.name))
              .map((app) => (
                <TouchableOpacity
                  key={app.name}
                  style={[styles.paymentOption, {borderColor: colors.text + '20', backgroundColor: '#e3f2fd'}]}
                  onPress={() => {
                    PaymentAppDetector.openPaymentApp(app.scheme);
                    handleBankMethod(app.name.toLowerCase().replace(' ', ''));
                  }}>
                  <Text style={styles.paymentIcon}>✅</Text>
                  <Text style={[styles.paymentName, {color: colors.text}]}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              style={[styles.paymentOption, {borderColor: colors.text + '20'}]}
              onPress={() => handleBankMethod('netbanking')}>
              <Text style={styles.paymentIcon}>🏦</Text>
              <Text style={[styles.paymentName, {color: colors.text}]}>Other Net Banking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: colors.primary}]}
              onPress={() => setShowBankOptions(false)}>
              <Text style={[styles.cancelText, {color: colors.primary}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Card Payment Form Modal */}
      <Modal
        visible={showCardForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardForm(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.cardModal, {backgroundColor: colors.surface}]}>
            <Text style={[styles.modalTitle, {color: colors.text}]}>Enter Card Details</Text>
            
            <TextInput
              style={[styles.cardInput, {borderColor: colors.primary, color: colors.text}]}
              placeholder="Card Number"
              placeholderTextColor={colors.text + '60'}
              value={cardDetails.number}
              onChangeText={(text) => setCardDetails({...cardDetails, number: formatCardNumber(text)})}
              keyboardType="numeric"
              maxLength={19}
            />
            
            <View style={styles.cardRow}>
              <TextInput
                style={[styles.cardInputHalf, {borderColor: colors.primary, color: colors.text}]}
                placeholder="MM/YY"
                placeholderTextColor={colors.text + '60'}
                value={cardDetails.expiry}
                onChangeText={(text) => setCardDetails({...cardDetails, expiry: formatExpiry(text)})}
                keyboardType="numeric"
                maxLength={5}
              />
              <TextInput
                style={[styles.cardInputHalf, {borderColor: colors.primary, color: colors.text}]}
                placeholder="CVV"
                placeholderTextColor={colors.text + '60'}
                value={cardDetails.cvv}
                onChangeText={(text) => setCardDetails({...cardDetails, cvv: text.replace(/\D/g, '')})}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
            
            <TextInput
              style={[styles.cardInput, {borderColor: colors.primary, color: colors.text}]}
              placeholder="Cardholder Name"
              placeholderTextColor={colors.text + '60'}
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails({...cardDetails, name: text.toUpperCase()})}
              autoCapitalize="characters"
            />
            
            <TouchableOpacity
              style={[styles.payButton, {backgroundColor: colors.primary}]}
              onPress={processCardPayment}>
              <Text style={styles.payButtonText}>Pay ₹{getFinalAmount()}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: colors.primary}]}
              onPress={() => setShowCardForm(false)}>
              <Text style={[styles.cancelText, {color: colors.primary}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 30,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 4,
  },
  quantityButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 30,
    textAlign: 'center',
  },
  totalContainer: {
    padding: 16,
    borderRadius: 8,
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  discountSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  couponScroll: {
    paddingVertical: 8,
  },
  couponCard: {
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 140,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  minOrderText: {
    fontSize: 10,
    opacity: 0.7,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  discountLabel: {
    fontSize: 14,
  },
  discountAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryText: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
  },

  timeSlotScroll: {
    paddingVertical: 8,
  },
  timeSlotCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 140,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkMark: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCheckMark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionCard: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  customInstructionInput: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  paymentButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  paymentModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  noAppsText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    padding: 20,
  },
  cardModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  cardInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInputHalf: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    width: '48%',
  },
  payButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartScreen;
