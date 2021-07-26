import React from 'react';
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { TwitterStep } from '../components/steps/TwitterStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';
import { checkAuth } from '../utils/checkAuth';

const stepsComponents = {
  0: WelcomeStep,
  1: TwitterStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

type MainContextProps = {
  onNextStep: () => void
  step: number
  setUserData: React.Dispatch<React.SetStateAction<User>>
  userData?: User
  setFieldValue: (field: string, value: string) => void
};

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

interface User {
  id: number
  fullname: string
  avatarUrl: string
  isActive: number
  username: string
  phone: string
  token?: string
}

const getUserData = () : User | null => {
  try {
    return JSON.parse(window.localStorage.getItem('userData'))
  } catch {
    return null
  }
}

const getCurrentStep = (userData: User | null) => {
  if (!userData) return 0
  if (userData.phone) return 5
  return 4
}

export default function Home() {
  const [step, setStep] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<User>()
  const Step = stepsComponents[step];

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const setFieldValue = (field: string, value: string) => setUserData(prev => ({...prev, [field]: value}))

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = getUserData();
      if (userData) {
        setUserData(userData);
        setStep(getCurrentStep(userData));
      }
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('userData', userData ? JSON.stringify(userData) : '');
  }, [userData]);

  return (
    <MainContext.Provider value={{ step, onNextStep, userData, setUserData, setFieldValue }}>
      <Step />
    </MainContext.Provider>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    if (user) {
      return {
        props: {},
        redirect: {
          destination: '/rooms',
          permanent: false,
        },
      };
    }
  } catch (err) {}

  return { props: {} };
};
