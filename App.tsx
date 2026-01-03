
import React, { useState, useEffect } from 'react';
import { View, UserData, GoogleProfile } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Button from './components/ui/Button';
import { ShieldCheck, Activity, Chrome } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LOGIN');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Check for saved user on load for automatic login
  useEffect(() => {
    const saved = localStorage.getItem('cai_user_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isRegistered) {
          setUserData(parsed);
          setView('DASHBOARD');
        }
      } catch (e) {
        console.error("Error loading saved user");
      }
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    const finalData = { ...data, isRegistered: true };
    setUserData(finalData);
    localStorage.setItem('cai_user_data', JSON.stringify(finalData));
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    // Clear the active session state so the user is prompted again
    setUserData(null);
    setView('LOGIN');
  };

  const startGoogleBinding = () => {
    // Always open the account selector popup when the user initiates login
    // This satisfies the "keep ask will use a account" requirement
    setIsPopupOpen(true);
  };

  const finishGoogleBinding = () => {
    setIsLoading(true);
    setIsPopupOpen(false);
    
    // Simulate Google Identity Provider delay
    setTimeout(() => {
      const mockProfile: GoogleProfile = {
        name: "User Google",
        email: "user.health@gmail.com",
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
      };

      const savedDataStr = localStorage.getItem('cai_user_data');
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);
        // If the user already finished registration before, jump to dashboard
        if (savedData.isRegistered) {
          const updated = { ...savedData, googleProfile: mockProfile };
          setUserData(updated);
          localStorage.setItem('cai_user_data', JSON.stringify(updated));
          setView('DASHBOARD');
          setIsLoading(false);
          return;
        }
      }

      // Fresh user or not registered yet
      setUserData({ googleProfile: mockProfile });
      setView('ONBOARDING');
      setIsLoading(false);
    }, 1200);
  };

  if (view === 'LOGIN') {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-8 justify-between bg-slate-950 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 z-10">
          <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-pulse">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter">CAI AI</h1>
            <p className="text-slate-400 text-lg">Intelligent Fitness & Health</p>
          </div>
        </div>

        <div className="space-y-4 z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in">
               <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-emerald-400 font-bold animate-pulse tracking-wide">Syncing account...</p>
            </div>
          ) : (
            <>
              <Button fullWidth onClick={startGoogleBinding}>
                Get Started
              </Button>
              <Button variant="outline" fullWidth onClick={startGoogleBinding}>
                <Chrome className="w-5 h-5" />
                Sign In with Google
              </Button>
            </>
          )}
          
          <div className="flex items-center justify-center gap-2 pt-4">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-center">
               Encrypted Account Protection
             </span>
          </div>
        </div>

        {/* Mock Google OAuth Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-center">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-8" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Sign in with Google</h2>
                <p className="text-slate-500 text-sm">to continue to CAI AI Health</p>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <button 
                  onClick={finishGoogleBinding}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-2xl border border-slate-200 text-left group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-blue-600 group-hover:bg-white transition-colors">U</div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-800">User Google</span>
                    <span className="text-xs text-slate-500">user.health@gmail.com</span>
                  </div>
                </button>
                <button className="w-full mt-4 text-sm text-blue-600 font-bold hover:underline">Use another account</button>
              </div>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Google will share your profile info with CAI AI to personalize your health plan.
              </p>
              <Button fullWidth variant="ghost" className="text-slate-900 border border-slate-200" onClick={() => setIsPopupOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'ONBOARDING') {
    return (
      <div className="bg-slate-950 min-h-screen">
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          onBackToLogin={() => setView('LOGIN')} 
        />
      </div>
    );
  }

  if (view === 'DASHBOARD' && userData) {
    return <Dashboard userData={userData} onLogout={handleLogout} onUpdateUser={(d) => setUserData(d)} />;
  }

  return null;
};

export default App;
