import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useAuth } from '../../context/authContext';
import CustomAlert from '../../components/CustomAlert';

const steps = [
  {
    step: 1,
    headline: "Let's start with the basics.",
    subHeadline: "This helps us understand your skin's starting point.",
    questions: [
      {
        title: "How does your face feel an hour after washing?",
        type: 'single-choice',
        options: [
          "A bit tight, dry, or even flaky.",
          "Comfortable and smooth.",
          "Shiny T-zone, normal cheeks.",
          "Shiny or greasy all over."
        ]
      },
      {
        title: "How sensitive is your skin?",
        type: 'single-choice',
        options: [
          "Almost never reacts.",
          "Sometimes reacts.",
          "Often reacts."
        ]
      }
    ]
  },
  {
    step: 2,
    headline: "What are your main skin concerns?",
    subHeadline: "Select all that apply. This helps us target specific issues.",
    questions: [
      {
        title: "Select your concerns",
        type: 'multi-choice-grid',
        options: [
          "Pimples & Breakouts",
          "Clogged Pores",
          "Fine Lines",
          "Redness",
          "Dark Spots",
          "Uneven Texture"
        ]
      }
    ]
  },
  {
    step: 3,
    headline: "What are your ultimate skin goals?",
    subHeadline: "Choose the one that matters most to you.",
    questions: [
      {
        title: "Select your primary goal",
        type: 'single-choice',
        options: [
          "Achieve a clear, blemish-free complexion.",
          "Get that bright, radiant 'glow'.",
          "Keep my skin looking youthful and smooth.",
          "Hydrate and plump my skin.",
          "Soothe and calm my sensitive skin."
        ]
      }
    ]
  },
  {
    step: 4,
    headline: "A bit about your lifestyle.",
    subHeadline: "This helps us understand environmental factors.",
    questions: [
      {
        title: "Which of these best describes your climate?",
        type: 'pills',
        options: ["Humid & Warm", "Dry & Hot", "Cold & Dry", "Balanced & Mild"]
      },
      {
        title: "How much sun exposure do you get?",
        type: 'pills',
        options: ["Hardly Any", "A Little Bit", "Moderate", "A Lot"]
      }
    ]
  }
];

export default function Quiz() {
  const { saveSkinProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const currentStepData = steps[step - 1];
  const progress = (step / steps.length) * 100;

  const validateStep = () => {
    const currentQuestions = steps[step -1].questions;

    for (let i = 0; i < currentQuestions.length; i++){
      const key = `step${step}_q${i}`;
      const answer = answers[key];


      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        return false;
      }
    }

    return true;
  };


  const handleNext = async () => {

    const isStepvalid = validateStep();

    if (!isStepvalid) {
      setAlertTitle("Incomplete");
      setAlertMessage("Please answer all questions before continuing.");
      setAlertVisible(true);
      return;
    }
    
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Navigate to results page or handle quiz completion
      console.log('Quiz Completed:', answers);

      const response = await saveSkinProfile(answers);

      if (response.success) {
        setAlertTitle('Success!');
        setAlertMessage('Your skin profile has been saved.');
        setAlertVisible(true);
        router.push('/(app)/home');
      } else {
        setAlertTitle('Error');
        setAlertMessage(response.msg);
        setAlertVisible(true);
      }
      
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSelect = (questionIndex, option) => {
    const question = currentStepData.questions[questionIndex];
    const key = `step${step}_q${questionIndex}`;

    if (question.type === 'single-choice' || question.type === 'pills') {
      setAnswers({ ...answers, [key]: option });
    } else if (question.type === 'multi-choice-grid') {
      const currentSelections = answers[key] || [];
      const newSelections = currentSelections.includes(option)
        ? currentSelections.filter(item => item !== option)
        : [...currentSelections, option];
      setAnswers({ ...answers, [key]: newSelections });
    }
  };

  const isSelected = (questionIndex, option) => {
    const key = `step${step}_q${questionIndex}`;
    const answer = answers[key];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };

  const handleOk = () => {
    setAlertVisible(false);
    if (alertTitle === 'Success!') {
        router.push('/(app)/home');
    }
  };

  return (
    <View className="flex-1 bg-app-bg" style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onOk={handleOk}
      />
      {/* Progress Bar */}
      <View className="h-1.5 bg-muted-khaki/30 rounded-full">
        <View style={{ width: `${progress}%` }} className="h-1.5 bg-primary rounded-full" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(15) }}>
        {/* Question Area */}
        <View style={{ marginVertical: hp(3) }}>
          <Text style={{ fontSize: hp(3.5) }} className="font-nunito-sans-bold text-dark-olive-green">
            {currentStepData.headline}
          </Text>
          <Text style={{ fontSize: hp(2) }} className="font-nunito-sans-regular text-muted-khaki mt-2">
            {currentStepData.subHeadline}
          </Text>
        </View>

        {/* Answer Area */}
        <View>
          {currentStepData.questions.map((q, qIndex) => (
            <View key={qIndex} style={{ marginBottom: hp(4) }}>
              <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green mb-4">
                {q.title}
              </Text>
              {q.type === 'single-choice' && (
                <View className="gap-y-3">
                  {q.options.map((option, oIndex) => (
                    <TouchableOpacity
                      key={oIndex}
                      onPress={() => handleSelect(qIndex, option)}
                      style={{
                        borderWidth: isSelected(qIndex, option) ? 2 : 1,
                        borderColor: isSelected(qIndex, option) ? '#FA7268' : '#938C63',
                      }}
                      className="bg-white p-5 rounded-2xl flex-row justify-between items-center"
                    >
                      <Text style={{ fontSize: hp(2) }} className="font-nunito-sans-regular text-dark-olive-green">{option}</Text>
                      {isSelected(qIndex, option) && <CheckCircleIcon color="#FA7268" size={hp(3)} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {q.type === 'multi-choice-grid' && (
                <View className="flex-row flex-wrap justify-between">
                  {q.options.map((option, oIndex) => (
                    <TouchableOpacity
                      key={oIndex}
                      onPress={() => handleSelect(qIndex, option)}
                      style={{
                        width: wp(42),
                        height: hp(15),
                        borderWidth: isSelected(qIndex, option) ? 2 : 1,
                        borderColor: isSelected(qIndex, option) ? '#FA7268' : '#938C63',
                      }}
                      className="bg-white rounded-2xl justify-center items-center p-2 mb-4"
                    >
                      {/* Placeholder for Icon */}
                      <View className="w-10 h-10 bg-muted-khaki/20 rounded-full mb-2" />
                      <Text style={{ fontSize: hp(1.8) }} className="font-nunito-sans-regular text-dark-olive-green text-center">{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {q.type === 'pills' && (
                <View className="flex-row flex-wrap gap-2">
                    {q.options.map((option, oIndex) => (
                        <TouchableOpacity
                            key={oIndex}
                            onPress={() => handleSelect(qIndex, option)}
                            style={{
                                backgroundColor: isSelected(qIndex, option) ? '#FA7268' : 'white',
                                borderWidth: 1,
                                borderColor: isSelected(qIndex, option) ? '#FA7268' : '#938C63',
                            }}
                            className="py-2 px-4 rounded-full"
                        >
                            <Text style={{ fontSize: hp(1.8), color: isSelected(qIndex, option) ? 'white' : '#938C63' }} className="font-nunito-sans-regular">
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Area */}
      <View className="absolute bottom-0 left-0 right-0 bg-app-bg/90" style={{ paddingHorizontal: wp(5), paddingVertical: hp(2) }}>
        <View className="flex-row justify-between items-center">
          {step > 1 ? (
            <TouchableOpacity onPress={handleBack}>
              <Text style={{ fontSize: hp(2) }} className="font-nunito-sans-regular text-muted-khaki">Back</Text>
            </TouchableOpacity>
          ) : (
            <View /> // Placeholder for alignment
          )}
          <TouchableOpacity
            onPress={handleNext}
            style={{ height: hp(7), width: wp(40) }}
            className="bg-primary rounded-full justify-center items-center"
          >
            <Text style={{ fontSize: hp(2) }} className="text-white font-nunito-sans-bold">
              {step === steps.length ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}