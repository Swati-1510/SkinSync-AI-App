import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import EmailIcon from '../assets/icons/EmailIcon.svg';
import LockIcon from '../assets/icons/LockIcon.svg';
import UserIcon from '../assets/icons/UserIcon.svg';
import CustomAlert from '../components/CustomAlert';
import CustomKeyboardView from '../components/CustomKeyboardView';
import Loading from '../components/Loading';
import { colors } from '../constants/theme';
import { useAuth } from '../context/authContext';

export default function SignUp() {
    const router = useRouter();
    const {register} = useAuth();
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    // 1. State to track which input is currently focused
    const [activeInput, setActiveInput] = useState(null);
      
    const usernameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
      
    // register process
    const handleRegister = async () => {
        if (!usernameRef.current || !emailRef.current || !passwordRef.current || !confirmPasswordRef.current) {
          setAlertTitle('Sign Up');
          setAlertMessage('Please fill all the fields!');
          setAlertVisible(true);
          return;
        }
        if (passwordRef.current !== confirmPasswordRef.current) {
            setAlertTitle('Sign Up');
            setAlertMessage('Passwords do not match!');
            setAlertVisible(true);
            return;
        }
        setLoading(true);

        let response = await register(usernameRef.current, emailRef.current, passwordRef.current);
        
        // after registration is done
        setLoading(false);

        console.log('got result: ', response);
        if(!response.success){
          setAlertTitle('Sign Up');
          setAlertMessage(response.msg);
          setAlertVisible(true);
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
          <View style={{paddingTop: hp(10), paddingHorizontal: wp(2)}} className="flex-1 gap-12">
          
            <View className="gap-14">
              <Text className="font-nunito-sans-bold pt-15 text-24px tracking-wider text-center text-dark-olive-green" >Create Your Account</Text>
              {/*inputs*/}
              <View className="gap-8">

                {/* Username Input */}
                <View 
                    style={{height: hp(7)}} 
                    className={`flex-row gap-4 px-4 bg-white items-center rounded-full ${activeInput === 'username' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}>
                  <UserIcon width={hp(2.7)} height={hp(2.7)} className="text-neutral-500" /> 
                  <TextInput
                    onFocus={() => setActiveInput('username')}
                    onBlur={() => setActiveInput(null)}
                    onChangeText={value => usernameRef.current = value}
                    style={{height: hp(7)}}
                    className="flex-1 font-nunito-sans-regular text-base text-dark-olive-green"
                    placeholder='Username'
                    placeholderTextColor={colors['muted-khaki']}
                  />
                </View>

                {/* Email Input */}
                <View 
                    style={{height: hp(7)}} 
                    className={`flex-row gap-4 px-4 bg-white items-center rounded-full ${activeInput === 'email' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}>
                  <EmailIcon width={hp(2.7)} height={hp(2.7)} className="text-neutral-500" /> 
                  <TextInput
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput(null)}
                    onChangeText={value => emailRef.current = value}
                    style={{height: hp(7)}}
                    className="flex-1 font-nunito-sans-regular text-base text-dark-olive-green"
                    placeholder='Email address'
                    placeholderTextColor={colors['muted-khaki']}
                  />
                </View>

                {/* Password Input */}
                <View 
                    style={{height: hp(7)}} 
                    className={`flex-row gap-4 px-4 bg-white items-center rounded-full ${activeInput === 'password' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}>
                  <LockIcon width={hp(2.7)} height={hp(2.7)} className="text-neutral-500" /> 
                  <TextInput
                    onFocus={() => setActiveInput('password')}
                    onBlur={() => setActiveInput(null)}
                    onChangeText={value => passwordRef.current = value}
                    style={{height: hp(7)}}
                    className="flex-1 font-nunito-sans-regular text-base text-dark-olive-green"
                    placeholder='Password'
                    placeholderTextColor={colors['muted-khaki']}
                    secureTextEntry
                  />
                </View>

                {/* Confirm Password Input */}
                <View 
                    style={{height: hp(7)}} 
                    className={`flex-row gap-4 px-4 bg-white items-center rounded-full ${activeInput === 'confirmPassword' ? 'border-2 border-primary' : 'border-2 border-transparent'}`}>
                  <LockIcon width={hp(2.7)} height={hp(2.7)} className="text-neutral-500" /> 
                  <TextInput
                    onFocus={() => setActiveInput('confirmPassword')}
                    onBlur={() => setActiveInput(null)}
                    onChangeText={value => confirmPasswordRef.current = value}
                    style={{height: hp(7)}}
                    className="flex-1 font-nunito-sans-regular text-base text-dark-olive-green"
                    placeholder='Confirm Password'
                    placeholderTextColor={colors['muted-khaki']}
                    secureTextEntry
                  />
                </View>

                <View>
                  {
                    loading ? (
                      <View className="flex-row justify-center">
                        <Loading size={hp(8)} />
                      </View>  
                    ): (
                        <TouchableOpacity onPress={handleRegister} style={{height: hp(7)}} 
                            className="bg-primary rounded-full flex justify-center items-center mt-6">
                            <Text style={{fontSize: hp(2.3)}} className="text-white font-nunito-sans-semibold tracking-wider">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    )
                  }
                </View>
                <View className="flex-row justify-center">
                  <Text style={{fontSize: hp(1.6)}} className="font-regular text-muted-khaki">Already have an account? </Text>
                  <Pressable onPress={()=> router.push('logIn')} >
                    <Text style={{fontSize: hp(1.6)}} className="font-semibold text-primary">Log In</Text>
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