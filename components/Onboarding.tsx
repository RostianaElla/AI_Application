
import React, { useState, useEffect } from 'react';
import { UserData, Gender, WorkoutFrequency, ReferralSource, Goal, Speed, DietType } from '../types';
import Button from './ui/Button';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Star, 
  Bell, 
  CheckCircle2, 
  Smartphone, 
  CreditCard,
  Target,
  Trophy
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: UserData) => void;
  onBackToLogin: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserData>({
    height: 170,
    weight: 70,
    desiredWeight: 65,
    obstacles: [],
    accomplishments: []
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(1, s - 1));

  const update = (field: keyof UserData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      next();
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("CAI AI Health", {
          body: "Notifications enabled! We will help you stay on track.",
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission", error);
    }
    next();
  };

  const calculateWeightDiff = () => {
    if (data.weight && data.desiredWeight) {
      return Math.abs(data.weight - data.desiredWeight);
    }
    return 0;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Choose your gender</h2>
            <div className="grid gap-4">
              {['Female', 'Male', 'Other'].map(g => (
                <Button key={g} variant={data.gender === g ? 'primary' : 'outline'} fullWidth onClick={() => { update('gender', g); next(); }}>
                  {g}
                </Button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">How many workouts do you do per week?</h2>
            <div className="grid gap-4">
              <Button variant={data.workoutFrequency === '0-2' ? 'primary' : 'outline'} fullWidth onClick={() => { update('workoutFrequency', '0-2'); next(); }}>
                0 - 2 = Workout now and then
              </Button>
              <Button variant={data.workoutFrequency === '3-5' ? 'primary' : 'outline'} fullWidth onClick={() => { update('workoutFrequency', '3-5'); next(); }}>
                3 - 5 = A few workouts per week
              </Button>
              <Button variant={data.workoutFrequency === '6+' ? 'primary' : 'outline'} fullWidth onClick={() => { update('workoutFrequency', '6+'); next(); }}>
                6+ = Dedicated athlete
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Where did you hear about us?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['TikTok', 'YouTube', 'Instagram', 'Google', 'Play Store', 'Facebook', 'Other'].map(s => (
                <Button key={s} variant={data.referralSource === s ? 'primary' : 'outline'} onClick={() => { update('referralSource', s); next(); }}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Have you tried other calorie tracking apps?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button variant={data.triedOtherApps === true ? 'primary' : 'outline'} onClick={() => { update('triedOtherApps', true); next(); }}>Yes</Button>
              <Button variant={data.triedOtherApps === false ? 'primary' : 'outline'} onClick={() => { update('triedOtherApps', false); next(); }}>No</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-center animate-pulse">
            <h2 className="text-3xl font-bold">CAI AI Creates Long-term Results</h2>
            <div className="bg-emerald-900/20 p-8 rounded-3xl border border-emerald-500/30">
              <img src="https://picsum.photos/seed/health/400/300" alt="Result" className="rounded-xl shadow-2xl mx-auto mb-6" />
              <p className="text-slate-400">Join 1M+ users reaching their goals through our AI modeling.</p>
            </div>
            <Button fullWidth onClick={next}>Continue</Button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Height & Weight</h2>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-2">Height (cm)</label>
                <input 
                  type="range" min="100" max="250" value={data.height} 
                  onChange={(e) => update('height', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-center font-bold text-2xl mt-2">{data.height} cm</div>
              </div>
              <div>
                <label className="text-slate-400 block mb-2">Weight (kg)</label>
                <input 
                  type="range" min="30" max="200" value={data.weight} 
                  onChange={(e) => update('weight', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-center font-bold text-2xl mt-2">{data.weight} kg</div>
              </div>
            </div>
            <Button fullWidth onClick={next}>Continue</Button>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">When were you born?</h2>
            <input 
              type="date" 
              className="w-full p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:border-emerald-500 outline-none text-white"
              value={data.birthDate}
              onChange={(e) => update('birthDate', e.target.value)}
            />
            <Button fullWidth onClick={next}>Continue</Button>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What is your goal?</h2>
            <div className="grid gap-4">
              {['Lose Weight', 'Maintain', 'Gain Weight'].map((g: any) => (
                <Button key={g} variant={data.goal === g ? 'primary' : 'outline'} fullWidth onClick={() => { update('goal', g); next(); }}>
                  {g}
                </Button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What is your desired weight?</h2>
            <input 
              type="number" 
              className="w-full p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:border-emerald-500 outline-none text-white text-center text-3xl font-bold"
              value={data.desiredWeight}
              onChange={(e) => update('desiredWeight', parseInt(e.target.value))}
            />
            <p className="text-center text-slate-400">Kilograms</p>
            <Button fullWidth onClick={next}>Continue</Button>
          </div>
        );
      case 10:
        return (
          <div className="space-y-8 text-center py-10">
            <h2 className="text-3xl font-bold">Your Target</h2>
            <div className="relative inline-block">
              <div className="w-48 h-48 rounded-full border-8 border-emerald-500 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-bold block">{calculateWeightDiff()}</span>
                  <span className="text-slate-400 uppercase tracking-widest text-xs">KG to go</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-emerald-500 p-3 rounded-full shadow-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-300 px-6">We've calculated a specialized path for you to lose {calculateWeightDiff()} kg efficiently.</p>
            <Button fullWidth onClick={next}>Analyze Plan</Button>
          </div>
        );
      case 11:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">How fast do you want to reach your goal?</h2>
            <div className="grid gap-4">
              {[
                { id: 'Koala', rate: '0.1 kg', label: 'Easy pace' },
                { id: 'Rabbit', rate: '0.8 kg', label: 'Moderate' },
                { id: 'Puma', rate: '1.5 kg', label: 'Intense' }
              ].map((s: any) => (
                <Button key={s.id} variant={data.speed === s.id ? 'primary' : 'outline'} fullWidth onClick={() => { update('speed', s.id); next(); }} className="flex justify-between items-center h-auto py-5">
                  <div className="text-left">
                    <span className="block font-bold text-lg">{s.id}</span>
                    <span className="text-slate-400 font-normal">{s.label}</span>
                  </div>
                  <span className="bg-slate-700/50 px-3 py-1 rounded-full text-sm">{s.rate} / week</span>
                </Button>
              ))}
            </div>
          </div>
        );
      case 12:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What's stopping you from reaching your goals?</h2>
            <div className="grid gap-3">
              {[
                'Lack of consistency',
                'Unhealthy eating habits',
                'Lack of support',
                'Busy schedule',
                'Lack of meal inspiration'
              ].map(o => (
                <Button 
                  key={o} 
                  variant={data.obstacles?.includes(o) ? 'primary' : 'outline'} 
                  fullWidth 
                  onClick={() => {
                    const current = data.obstacles || [];
                    const updated = current.includes(o) ? current.filter(x => x !== o) : [...current, o];
                    update('obstacles', updated);
                  }}
                  className="text-left"
                >
                  {o}
                </Button>
              ))}
            </div>
            <Button fullWidth onClick={next} disabled={!data.obstacles?.length}>Continue</Button>
          </div>
        );
      case 13:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Do you follow a specific diet?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['classic', 'Pescatarian', 'vegetarian', 'Vegan'].map((d: any) => (
                <Button key={d} variant={data.diet === d ? 'primary' : 'outline'} onClick={() => { update('diet', d); next(); }} className="capitalize">
                  {d}
                </Button>
              ))}
            </div>
          </div>
        );
      case 14:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What would you like to accomplish?</h2>
            <div className="grid gap-4">
              {[
                'Eat and live healthy',
                'Boost my energy and mood',
                'Stay motivated and consistent',
                'Feel better about my body'
              ].map(a => (
                <Button 
                  key={a} 
                  variant={data.accomplishments?.includes(a) ? 'primary' : 'outline'} 
                  fullWidth 
                  onClick={() => {
                    const current = data.accomplishments || [];
                    const updated = current.includes(a) ? current.filter(x => x !== a) : [...current, a];
                    update('accomplishments', updated);
                  }}
                >
                  {a}
                </Button>
              ))}
            </div>
            <Button fullWidth onClick={next} disabled={!data.accomplishments?.length}>Finish Planning</Button>
          </div>
        );
      case 15:
        return (
          <div className="space-y-10 text-center py-20 flex flex-col items-center">
            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-black text-emerald-400">CRUSH IT!</h2>
            <p className="text-2xl font-bold">You have great potential to crush your goal</p>
            <Button fullWidth onClick={next}>I'm Ready</Button>
          </div>
        );
      case 16:
        return (
          <div className="space-y-6 text-center py-10">
            <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto" />
            <h2 className="text-3xl font-bold">Thank you for trusting us</h2>
            <p className="text-slate-400">Our AI has analyzed your data and prepared your custom plan.</p>
            <Button fullWidth onClick={next}>View My Journey</Button>
          </div>
        );
      case 17:
        return (
          <div className="space-y-8 text-center p-6 bg-slate-800 rounded-3xl border border-slate-700">
            <div className="p-4 bg-emerald-500/10 rounded-2xl inline-block">
              <Bell className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold">Reach your goal with notifications</h2>
            <p className="text-slate-400 text-sm">We'll send you daily reminders for workouts and meal tracking to your mobile device.</p>
            <div className="space-y-3">
              <Button fullWidth onClick={requestNotificationPermission}>Allow Notifications</Button>
              <Button fullWidth variant="ghost" onClick={next}>Later</Button>
            </div>
          </div>
        );
      case 18:
        return (
          <div className="space-y-6 text-center py-10">
             <Smartphone className="w-16 h-16 text-blue-400 mx-auto" />
            <h2 className="text-2xl font-bold">Love the app?</h2>
            <p className="text-slate-400">Rate us on Play Store!</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500" />)}
            </div>
            <Button fullWidth onClick={next}>Rate Now</Button>
          </div>
        );
      case 19:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Enter referral code</h2>
            <p className="text-slate-400 text-sm">(Optional) Enter a friend's code to get 1 month premium.</p>
            <input 
              type="text" 
              placeholder="CODE123" 
              className="w-full p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:border-emerald-500 outline-none uppercase text-center text-xl tracking-widest"
              value={data.referralCode}
              onChange={(e) => update('referralCode', e.target.value)}
            />
            <Button fullWidth onClick={next}>Continue</Button>
          </div>
        );
      case 20:
        return (
          <div className="space-y-8 text-center py-20 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-3xl">
            <h2 className="text-4xl font-bold">Congratulations!</h2>
            <p className="text-xl">Your custom plan is ready.</p>
            <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30">
               <p className="text-emerald-400 font-bold italic">"Consistency is the key to transformation."</p>
            </div>
            <Button fullWidth onClick={next}>Next</Button>
          </div>
        );
      case 21:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-slate-400 text-sm">Secure your progress with Google account binding.</p>
            <div className="grid gap-4">
              <Button fullWidth onClick={() => setStep(22)}>Sign in</Button>
              <Button fullWidth variant="outline" onClick={() => onComplete(data)}>Skip</Button>
            </div>
          </div>
        );
      case 22:
        return (
          <div className="space-y-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl relative">
            <button onClick={() => setStep(21)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">No Payment Due Now</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <p>• 7-day free trial included</p>
              <p>• Standard Google Play Store billing policies apply</p>
              <p>• Cancel anytime in your subscription settings</p>
            </div>
            <Button fullWidth onClick={() => onComplete(data)}>Start Free Trial</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        {step > 1 && (
          <button onClick={prev} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <ChevronLeft />
          </button>
        )}
        <div className="flex-1 px-4">
          <div className="h-1.5 bg-slate-800 rounded-full w-full">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / 22) * 100}%` }}
            ></div>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-mono">{step}/22</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
