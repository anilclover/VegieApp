// AppointmentBookingScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { goBack } from '../utils/NavigationUtils';

// ====================================================================
// 1. MOCK API DATA & TYPE DEFINITIONS
// ====================================================================

interface TimeSlot {
  time: string;
  available: boolean;
  isPreferred: boolean;
  slotId: string;
}
interface Service {
  serviceId: string;
  name: string;
  professionalType: string;
  selectedProfessional: string;
  slots: TimeSlot[];
}
interface HeadData {
  id?: string;
  head: string;
  services: Service[];
}
interface SelectedSlot extends TimeSlot {
  serviceId: string;
}
// 💡 Corrected the main component prop definition to accept `data` with a default
interface AppointmentBookingScreenProps {
  data?: HeadData[]; // Make optional if providing a default value
}
interface ServiceTimeSlotsProps {
  service: Service;
  onSelectSlot: (serviceId: string, slot: TimeSlot) => void;
  selectedSlot: SelectedSlot | undefined;
}

const bookingData: HeadData[] = [
  {
    id: 'H1',
    head: 'Head 1',
    services: [
      {
        serviceId: 'S1',
        name: 'Haircut',
        professionalType: 'Barber',
        selectedProfessional: 'Any Professional',
        slots: [
          {time: '09:00 AM', available: true, isPreferred: true, slotId: 'T1'},
          {time: '10:00 AM', available: true, isPreferred: false, slotId: 'T2'},
          {time: '11:00 AM', available: true, isPreferred: true, slotId: 'T3'},
          {time: '12:00 PM', available: true, isPreferred: false, slotId: 'T4'},
        ],
      },
      {
        serviceId: 'S2',
        name: 'Scalp Massage',
        professionalType: 'Therapist',
        selectedProfessional: 'Matthew Clark',
        slots: [
          {time: '09:00 AM', available: true, isPreferred: true, slotId: 'T5'},
          {time: '11:00 AM', available: true, isPreferred: true, slotId: 'T6'},
          {time: '12:00 PM', available: true, isPreferred: false, slotId: 'T7'},
        ],
      },
    ],
  },
  {
    id: 'H2',
    head: 'Head 2',
    services: [
      {
        serviceId: 'S3',
        name: 'Haircut',
        professionalType: 'Barber',
        selectedProfessional: 'Joseph Scott',
        slots: [
          {time: '09:00 AM', available: true, isPreferred: true, slotId: 'T8'},
          {time: '10:00 AM', available: true, isPreferred: true, slotId: 'T9'},
          {time: '11:00 AM', available: true, isPreferred: true, slotId: 'T10'},
        ],
      },
    ],
  },
];

// ====================================================================
// 2. REUSABLE COMPONENT: ServiceTimeSlots
// ====================================================================
const ServiceTimeSlots: React.FC<ServiceTimeSlotsProps> = ({
  service,
  onSelectSlot,
  selectedSlot,
}) => {
  const getTimeSlotStyle = (slot: TimeSlot) => {
    const isSelected = selectedSlot && selectedSlot.slotId === slot.slotId;
    let baseStyle: any = styles.slotButton;
    let textStyle: any = styles.slotText;

    if (slot.isPreferred) {
      baseStyle = isSelected
        ? styles.slotButtonPreferredSelected
        : styles.slotButtonPreferred;
      textStyle = isSelected
        ? styles.slotTextSelected
        : styles.slotTextPreferred;
    } else {
      baseStyle = isSelected
        ? styles.slotButtonAnySelected
        : styles.slotButtonAny;
      textStyle = isSelected ? styles.slotTextSelected : styles.slotTextAny;
    }
    if (!slot.available) {
      baseStyle = [baseStyle, styles.slotButtonDisabled];
      textStyle = styles.slotTextDisabled;
    }
    return {baseStyle, textStyle};
  };

  return (
    <View style={styles.serviceContainer}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.professionalInfo}>
          {service.selectedProfessional} • {service.professionalType}
        </Text>
      </View>
      <View style={styles.slotsRow}>
        {service.slots.map(slot => {
          const {baseStyle, textStyle} = getTimeSlotStyle(slot);
          return (
            <TouchableOpacity
              key={slot.slotId}
              style={baseStyle}
              onPress={() => onSelectSlot(service.serviceId, slot)}
              disabled={!slot.available}>
              <Text style={textStyle}>{slot.time}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ====================================================================
// 3. MAIN COMPONENT: AppointmentBookingScreen (FIXED FUNCTION SIGNATURE)
// ====================================================================
const AppointmentBookingScreen: React.FC<AppointmentBookingScreenProps> = ({
  data = bookingData, // Use the default if no data prop is passed
}) => {
  // State is strongly typed as a record where keys are service IDs (string)
  // and values are SelectedSlot objects.
  const [selectedSlots, setSelectedSlots] = useState<
    Record<string, SelectedSlot>
  >({});
  const [isWalkIn, setIsWalkIn] = useState<boolean>(false);
  const selectedDate: string = 'August 18, 2025';

  const handleSelectSlot = (serviceId: string, slot: TimeSlot) => {
    // If the slot is already selected, unselect it.
    if (
      selectedSlots[serviceId] &&
      selectedSlots[serviceId].slotId === slot.slotId
    ) {
      setSelectedSlots(prev => {
        const newSlots = {...prev};
        delete newSlots[serviceId];
        return newSlots;
      });
    } else {
      // Create a SelectedSlot object and update state
      const selected: SelectedSlot = {...slot, serviceId};
      setSelectedSlots(prev => ({
        ...prev,
        [serviceId]: selected,
      }));
    }
  };

  const getEarliestSelectedTime = (): string | null => {
    const selectedArray = Object.values(selectedSlots);
    return selectedArray.length > 0 ? selectedArray[0].time : null;
  };

  const selectedTime = getEarliestSelectedTime();

  const handleContinue = () => {
    if (Object.keys(selectedSlots).length === 0 && !isWalkIn) {
      Alert.alert(
        'Selection Required',
        'Please select at least one time slot or choose "Walk-in".',
      );
      return;
    }

    const finalBookingDetails = {
      date: selectedDate,
      isWalkIn: isWalkIn,
      selections: Object.values(selectedSlots),
    };

    console.log('Final Booking Details:', finalBookingDetails);
    Alert.alert(
      'Booking Confirmed',
      `Items: ${Object.keys(selectedSlots).length}, Time: ${
        selectedTime || 'N/A'
      }`,
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>  goBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Time</Text>
        <View style={styles.walkInContainer}>
          <TouchableOpacity
            style={[styles.walkInCheckbox, isWalkIn && styles.checkboxActive]}
            onPress={() => setIsWalkIn(prev => !prev)}>
            {isWalkIn && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.walkInText}>Walk-in</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.preferredColor]} />
            <Text style={styles.legendText}>Preferred Professional</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.anyColor]} />
            <Text style={styles.legendText}>Any Professional</Text>
          </View>
        </View>

        {/* Dynamic Data Mapping */}
        {data.map(
          (
            headData, // Type is correctly inferred from the `data` prop definition
          ) => (
            <View
              key={headData.id || headData.head}
              style={styles.headContainer}>
              <Text style={styles.headTitle}>{headData.head}</Text>
              {headData.services.map(
                (
                  service, // Type is correctly inferred from `headData.services`
                ) => (
                  <ServiceTimeSlots
                    key={service.serviceId}
                    service={service}
                    onSelectSlot={handleSelectSlot}
                    selectedSlot={selectedSlots[service.serviceId]}
                  />
                ),
              )}
            </View>
          ),
        )}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerDate}>{selectedDate}</Text>
          <Text style={styles.footerTime}>{selectedTime || '10:00 AM'}</Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ====================================================================
// 4. STYLES
// ====================================================================
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {paddingRight: 10},
  backArrow: {fontSize: 28, color: '#000'},
  title: {fontSize: 22, fontWeight: 'bold', flex: 1, marginLeft: 10},
  walkInContainer: {flexDirection: 'row', alignItems: 'center'},
  walkInText: {fontSize: 16, color: '#000'},
  walkInCheckbox: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {borderColor: '#000'},
  checkboxInner: {
    height: 12,
    width: 12,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  container: {flex: 1, paddingHorizontal: 20},
  legendContainer: {flexDirection: 'row', marginVertical: 15},
  legendItem: {flexDirection: 'row', alignItems: 'center', marginRight: 25},
  legendColor: {width: 12, height: 12, borderRadius: 2, marginRight: 8},
  preferredColor: {backgroundColor: '#38A169'},
  anyColor: {backgroundColor: '#C5307A'},
  legendText: {fontSize: 13},
  headContainer: {marginBottom: 10},
  headTitle: {fontSize: 20, fontWeight: 'bold', marginVertical: 15},
  serviceContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  serviceName: {fontSize: 17, fontWeight: '500'},
  professionalInfo: {fontSize: 14, color: '#555'},
  slotsRow: {flexDirection: 'row', flexWrap: 'wrap'},
  slotButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  slotText: {fontSize: 16, fontWeight: '600'},
  slotButtonPreferred: {borderColor: '#38A169', backgroundColor: 'transparent'},
  slotTextPreferred: {color: '#38A169'},
  slotButtonPreferredSelected: {
    backgroundColor: '#38A169',
    borderColor: '#38A169',
  },
  slotButtonAny: {borderColor: '#C5307A', backgroundColor: 'transparent'},
  slotTextAny: {color: '#C5307A'},
  slotButtonAnySelected: {backgroundColor: '#C5307A', borderColor: '#C5307A'},
  slotTextSelected: {color: '#fff'},
  slotButtonDisabled: {backgroundColor: '#f5f5f5', borderColor: '#ddd'},
  slotTextDisabled: {color: '#aaa'},
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  footerDate: {fontSize: 13, color: '#555'},
  footerTime: {fontSize: 17, fontWeight: 'bold'},
  continueButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  continueButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default AppointmentBookingScreen;
