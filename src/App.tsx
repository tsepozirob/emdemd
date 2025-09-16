import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OnboardingFlow from './components/OnboardingFlow';
import HomeMapScreen from './components/HomeMapScreen';
import LocationSelectionScreen from './components/LocationSelectionScreen';
import RideConfirmationScreen from './components/RideConfirmationScreen';
import DriverSearchScreen from './components/DriverSearchScreen';
import LiveTrackingScreen from './components/LiveTrackingScreen';
import TripRatingScreen from './components/TripRatingScreen';
import PaymentHistoryScreen from './components/PaymentHistoryScreen';
import { Menu, User, CreditCard, Clock } from 'lucide-react';
import { Button } from './components/ui/button';

type Screen = 'onboarding' | 'home' | 'location-selection' | 'ride-selection' | 'confirmation' | 'driver-search' | 'tracking' | 'rating' | 'payment' | 'completed';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedRideType, setSelectedRideType] = useState<string>('Economy');
  const [showMenu, setShowMenu] = useState(false);
  const [tripData, setTripData] = useState({
    pickup: '',
    destination: '',
    estimatedFare: '$12',
    driver: null as any
  });

  const handleOnboardingComplete = () => {
    setCurrentScreen('home');
  };

  const handleLocationSearch = () => {
    setCurrentScreen('location-selection');
  };

  const handleLocationsSet = (pickup: string, destination: string) => {
    setTripData(prev => ({ ...prev, pickup, destination }));
    setCurrentScreen('ride-selection');
  };

  const handleRideSelect = (rideType: string) => {
    setSelectedRideType(rideType);
    // Calculate estimated fare based on ride type
    const baseFare = { 'Economy': 12, 'Premium': 18, 'Moto': 8, 'Carpool': 6 };
    setTripData(prev => ({ 
      ...prev, 
      estimatedFare: `${baseFare[rideType as keyof typeof baseFare] || 12}` 
    }));
    setCurrentScreen('confirmation');
  };

  const handleRideConfirm = () => {
    setCurrentScreen('driver-search');
  };

  const handleDriverFound = (driver: any) => {
    setTripData(prev => ({ ...prev, driver }));
    setCurrentScreen('tracking');
  };

  const handleTrackingComplete = () => {
    setCurrentScreen('rating');
  };

  const handleRatingComplete = () => {
    setCurrentScreen('completed');
    // Auto redirect to home after 3 seconds
    setTimeout(() => setCurrentScreen('home'), 3000);
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleBackToLocationSelection = () => {
    setCurrentScreen('location-selection');
  };

  const handleCancelSearch = () => {
    setCurrentScreen('ride-selection');
  };

  const handleShowPayment = () => {
    setShowMenu(false);
    setCurrentScreen('payment');
  };

  // Main menu overlay
  const MenuOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex"
      onClick={() => setShowMenu(false)}
    >
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="w-80 bg-white h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 gradient-shuvr text-white">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl">John Doe</h3>
              <p className="text-white/80">john.doe@email.com</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={handleShowPayment}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Payment & History
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => {/* Handle settings */}}
          >
            <User className="w-5 h-5 mr-3" />
            Profile Settings
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Trip completion screen
  const CompletedScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100"
    >
      <div className="text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white text-4xl"
          >
            ✓
          </motion.div>
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl mb-2 gradient-text"
        >
          Trip Completed!
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          Thank you for riding with Shuvr
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleBackToHome}
            className="gradient-shuvr text-white px-8 py-3 rounded-xl"
          >
            Book Another Ride
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Menu button for main app screens */}
      {(currentScreen === 'home' || currentScreen === 'completed') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 z-40"
        >
          <Button
            onClick={() => setShowMenu(true)}
            className="w-12 h-12 rounded-full glass shadow-lg border-white/30 hover:bg-white/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* Screen content */}
      <AnimatePresence mode="wait">
        {currentScreen === 'onboarding' && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
        
        {currentScreen === 'home' && (
          <HomeMapScreen onLocationSearch={handleLocationSearch} />
        )}
        
        {currentScreen === 'location-selection' && (
          <LocationSelectionScreen 
            onLocationsSet={handleLocationsSet}
            onBack={handleBackToHome}
          />
        )}
        
        {currentScreen === 'ride-selection' && (
          <HomeMapScreen 
            onRideSelect={handleRideSelect}
            pickup={tripData.pickup}
            destination={tripData.destination}
            showRideOptions={true}
          />
        )}
        
        {currentScreen === 'confirmation' && (
          <RideConfirmationScreen
            rideType={selectedRideType}
            pickup={tripData.pickup}
            destination={tripData.destination}
            fare={tripData.estimatedFare}
            onConfirm={handleRideConfirm}
            onBack={handleBackToLocationSelection}
          />
        )}
        
        {currentScreen === 'driver-search' && (
          <DriverSearchScreen
            rideType={selectedRideType}
            pickup={tripData.pickup}
            destination={tripData.destination}
            estimatedFare={tripData.estimatedFare}
            onDriverFound={handleDriverFound}
            onCancel={handleCancelSearch}
          />
        )}
        
        {currentScreen === 'tracking' && (
          <LiveTrackingScreen 
            driver={tripData.driver}
            pickup={tripData.pickup}
            destination={tripData.destination}
            onComplete={handleTrackingComplete} 
          />
        )}
        
        {currentScreen === 'rating' && (
          <TripRatingScreen
            driver={tripData.driver}
            tripDetails={{
              pickup: tripData.pickup,
              destination: tripData.destination,
              fare: tripData.estimatedFare,
              duration: '12 min',
              distance: '2.3 km'
            }}
            onComplete={handleRatingComplete}
            onSkip={handleRatingComplete}
          />
        )}
        
        {currentScreen === 'payment' && (
          <PaymentHistoryScreen onBack={handleBackToHome} />
        )}
        
        {currentScreen === 'completed' && <CompletedScreen />}
      </AnimatePresence>

      {/* Menu overlay */}
      <AnimatePresence>
        {showMenu && <MenuOverlay />}
      </AnimatePresence>
    </div>
  );
}