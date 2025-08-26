import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useCart} from '../context/CartContext';
import DatePicker from '../components/DatePicker';

// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkCIKQZ1ydCbRHBrXmC8hUh2dsrnCDEWI&amp;libraries=places"></script>;

const CartScreen = () => {
  const {colors} = useTheme();
  const {cartItems, addToCart, removeFromCart, getTotalPrice} = useCart();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showInstructionInput, setShowInstructionInput] =
    useState<boolean>(false);
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);

  const paymentOptions = [
    {id: 'phonepe', name: 'PhonePe', icon: '📱'},
    {id: 'paytm', name: 'Paytm', icon: '💳'},
    {id: 'googlepay', name: 'Google Pay', icon: '🔵'},
    {id: 'debit', name: 'Debit Card', icon: '💳'},
    {id: 'credit', name: 'Credit Card', icon: '💎'},
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
            <Text style={styles.paymentButtonText}>Payment</Text>
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
                onPress={() => {
                  console.log('Selected:', option.name);
                  setShowPaymentOptions(false);
                }}>
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
});

export default CartScreen;
