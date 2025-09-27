import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EmailIcon from '../assets/icons/EmailIcon.svg';
import LockIcon from '../assets/icons/LockIcon.svg';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/theme';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomAlert from '../components/CustomAlert';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function LogIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const {login} = useAuth();

  // 1. State to track which input is currently focused
  const [activeInput, setActiveInput] = useState(null);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      setAlertTitle('Log In');
      setAlertMessage('Please fill all the fields!');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    if(!response.success){
        setAlertTitle('Log In');
        setAlertMessage(response.msg);
        setAlertVisible(true);
        return;
    }

  }

  useFonts({
    'Nunito-Sans': require('../assets/fonts/NunitoSans_7pt-Regular.ttf'),
    'Nunito-Sans-bold': require('../assets/fonts/NunitoSans_7pt-Bold.ttf'),
    'Nunito-Sans-light': require('../assets/fonts/NunitoSans_7pt-Light.ttf'),
  });
  
  return (
    <View className="flex-1 bg-app-bg">
      <CustomKeyboardView>
        <StatusBar style='dark' />
        <View style={{ paddingTop: hp(8), paddingHorizontal: wp(2) }} className="flex-1 gap-12">

          <View className="gap-16">
            <Text className="font-nunito-sans-bold pt-10 text-24px tracking-wider text-center text-dark-olive-green" >Welcome Back!</Text>
            {/*inputs*/}
            <View className="gap-8">

              {/* Email Input */}
              <View 
                style={{ height: hp(7) }} 
                className={`flex-row gap-4 px-4 bg-white items-center rounded-full ${activeInput === 'email' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}>
                <EmailIcon width={hp(2.7)} height={hp(2.7)} className="text-neutral-500" />
                <TextInput
                  // Add onFocus and onBlur handlers
                  onFocus={() => setActiveInput('email')}
                  onBlur={() => setActiveInput(null)}
                  onChangeText={value => emailRef.current = value}
                  style={{ height: hp(7) }}
                  className="flex-1 font-nunito-sans-regular text-base text-dark-olive-green"
                  placeholder='Email address'
                  placeholderTextColor={colors['muted-khaki']} />
              </View>

              <View className="gap-5">
                {/* Password Input */}
                <View 
                  style={{ height: hp(7) }} 
                  className={`flex-row gap-4 px-4 bg-white items-center rounded-full ${activeInput === 'password' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}>
                  <LockIcon width={hp(2.7)} height={hp(2.7)} className="text-neutral-500" />
                  <TextInput
                    onFocus={() => setActiveInput('password')}
                    onBlur={() => setActiveInput(null)}
                    onChangeText={value => passwordRef.current = value}
                    style={{ height: hp(7) }}
                    className="flex-1 font-nunito-sans-regular text-base text-dark-olive-green"
                    placeholder='Password'
                    secureTextEntry
                    placeholderTextColor={colors['muted-khaki']} />
                </View>
                <Text style={{ fontSize: hp(1.5) }} className="font-bold text-center text-muted-khaki">Forgot Password?</Text>
              </View>

              {/* Login button */}
              <View>
                {
                  loading ? (
                    <View className="flex-row justify-center">
                      <Loading size={hp(9)} />
                    </View>
                  ) : (
                    <TouchableOpacity 
                      onPress={handleLogin} 
                      style={{ height: hp(7) }} 
                      className="bg-primary rounded-full flex justify-center items-center mt-6">
                      <Text style={{ fontSize: hp(2.3) }} className="text-white font-nunito-sans-semibold tracking-wider">
                        Log In
                      </Text>
                    </TouchableOpacity>
                  )
                }
              </View>

              {/* sign up text */}
              <View className="flex-row justify-center">
                <Text style={{ fontSize: hp(1.6) }} className="font-regular text-muted-khaki">Don&apos;t have an account? </Text>
                <Pressable onPress={() => router.push('signUp')} >
                  <Text style={{ fontSize: hp(1.6) }} className="font-semibold text-primary">Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </CustomKeyboardView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onOk={() => setAlertVisible(false)}
      />
    </View>
  );
}