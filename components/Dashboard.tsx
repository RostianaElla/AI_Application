
import React, { useState, useEffect, useMemo } from 'react';
import { UserData } from '../types';
import { getPersonalizedHealthTips } from '../services/geminiService';
import Button from './ui/Button';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Flame, 
  Footprints, 
  Timer, 
  Utensils,
  LogOut,
  User,
  Zap,
  ChevronRight,
  Target,
  Bell,
  CheckCircle2,
  Circle,
  Chrome
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUser: (data: UserData) => void;
}

interface Task {
  id: number;
  time: string;
  task: string;
  done: boolean;
  calories: number;
}

const mockProgressData = [
  { day: 'Mon', weight: 70.2 },
  { day: 'Tue', weight: 70.0 },
  { day: 'Wed', weight: 69.8 },
  { day: 'Thu', weight: 69.8 },
  { day: 'Fri', weight: 69.5 },
  { day: 'Sat', weight: 69.4 },
  { day: 'Sun', weight: 69.2 },
];

const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PROGRESS' | 'SETTINGS'>('HOME');
  const [tips, setTips] = useState<any[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, time: '07:00', task: 'Morning Yoga & Stretching', done: true, calories: 120 },
    { id: 2, time: '08:30', task: 'Healthy Breakfast (High Protein)', done: true, calories: 0 },
    { id: 3, time: '12:30', task: 'Nutritious Lunch (Salad & Chicken)', done: false, calories: 0 },
    { id: 4, time: '15:00', task: '2L Water Intake Check', done: false, calories: 0 },
    { id: 5, time: '18:00', task: 'Cardio: 30m Running/Cycling', done: false, calories: 350 },
    { id: 6, time: '21:00', task: 'Evening Meditation', done: false, calories: 30 }
  ]);

  useEffect(() => {
    const fetchTips = async () => {
      setLoadingTips(true);
      const res = await getPersonalizedHealthTips(userData);
      setTips(res);
      setLoadingTips(false);
    };
    fetchTips();
  }, [userData]);

  const progressPercentage = useMemo(() => {
    const completed = tasks.filter(t => t.done).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const activeCalories = useMemo(() => {
    return tasks.filter(t => t.done).reduce((acc, t) => acc + t.calories, 0);
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.done;
        // Trigger notification when completing a task
        if (newState && Notification.permission === "granted") {
          new Notification("Task Completed!", {
            body: `Excellent! You finished: ${t.task}`,
            silent: false
          });
        }
        return { ...t, done: newState };
      }
      return t;
    }));
  };

  const renderHome = () => (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hello, {userData.googleProfile?.name?.split(' ')[0] || 'Athlete'}!</h2>
          <p className="text-slate-400">Track your activities below.</p>
        </div>
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
          {userData.googleProfile?.picture ? (
            <img src={userData.googleProfile.picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="text-white" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-16 h-16 text-emerald-500" />
          </div>
          <Zap className="w-6 h-6 text-yellow-500 mb-2" />
          <span className="block text-slate-400 text-sm">Daily Progress</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{progressPercentage}%</span>
            <span className="text-xs text-emerald-400 font-bold">Completed</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
          <Flame className="w-6 h-6 text-orange-500 mb-2" />
          <span className="block text-slate-400 text-sm">Active Burn</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{activeCalories}</span>
            <span className="text-xs text-orange-400 font-bold">kcal</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wider">From checked activities</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg">Daily Schedule</h3>
          <span className="text-xs font-bold text-slate-500">{tasks.filter(t => t.done).length} of {tasks.length} done</span>
        </div>
        <div className="space-y-3">
          {tasks.map((item) => (
            <button 
              key={item.id} 
              onClick={() => toggleTask(item.id)}
              className={`w-full flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border-l-4 transition-all duration-300 text-left active:scale-[0.98] ${
                item.done ? 'border-emerald-500 bg-emerald-500/5 opacity-60' : 'border-slate-600 hover:border-emerald-400'
              }`}
            >
              <span className={`text-xs font-mono font-bold ${item.done ? 'text-emerald-500/50' : 'text-slate-500'}`}>
                {item.time}
              </span>
              <div className="flex-1">
                <span className={`block font-semibold transition-all ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {item.task}
                </span>
                {item.calories > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 ${item.done ? 'text-emerald-500/50' : 'text-orange-400'}`}>
                    +{item.calories} kcal
                  </span>
                )}
              </div>
              <div className="flex-shrink-0">
                {item.done ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">AI Diet Tips</h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-bold">GEMINI FLASH 3</span>
        </div>
        {loadingTips ? (
           <div className="animate-pulse space-y-4">
             {[1,2].map(i => <div key={i} className="h-24 bg-slate-800 rounded-2xl"></div>)}
           </div>
        ) : (
          <div className="grid gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-3xl border border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{tip.category}</span>
                  <Utensils className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white mb-1">{tip.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Your Progress</h2>
      
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
        <h3 className="text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider">Weight Trend (kg)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockProgressData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                cursor={{ stroke: '#334155', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-700">
           <div className="flex flex-col">
             <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Initial</span>
             <span className="text-white font-black text-xl">{userData.weight}kg</span>
           </div>
           <div className="flex flex-col items-center">
             <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 mb-1">
               <span className="text-emerald-400 font-bold text-xs">-1.2 kg</span>
             </div>
             <span className="text-slate-500 text-[8px] font-bold uppercase">Total Progress</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Target</span>
             <span className="text-white font-black text-xl">{userData.desiredWeight}kg</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-blue-500/10 rounded-2xl mb-3">
            <Footprints className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white">8,432</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Steps Today</span>
        </div>
        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-purple-500/10 rounded-2xl mb-3">
            <Timer className="w-8 h-8 text-purple-400" />
          </div>
          <span className="text-2xl font-black text-white">45m</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Active Time</span>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center gap-4 bg-slate-800/30">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
             {userData.googleProfile?.picture ? (
               <img src={userData.googleProfile.picture} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <User className="w-8 h-8 text-white" />
             )}
           </div>
           <div className="flex-1">
             <h3 className="font-black text-xl leading-tight">{userData.googleProfile?.name || 'Athlete Profile'}</h3>
             <div className="flex items-center gap-2 mt-1">
                {userData.googleProfile ? (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Chrome className="w-3 h-3" /> Bound to Google
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs font-medium">{userData.gender} • {userData.goal}</span>
                )}
             </div>
           </div>
        </div>
        
        <div className="p-2">
          {[
            { icon: User, label: 'Edit Personal Info', sub: 'Weight, Height, Birth' },
            { icon: Target, label: 'Change Goals', sub: 'Maintain, Lose or Gain' },
            { icon: Bell, label: 'Notifications', sub: 'Alerts, Daily reminders' }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-slate-700/50 transition-all rounded-2xl text-left group">
              <div className="w-10 h-10 bg-slate-700 group-hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors">
                <item.icon className="w-5 h-5 text-slate-300" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-slate-200">{item.label}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{item.sub}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-500/10 transition-all rounded-2xl text-left text-red-500 group"
        >
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-black">Logout Application</span>
        </button>
      </div>
      
      <div className="text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">CAI AI Health v1.0.4</p>
        <p className="text-emerald-500 text-[10px] font-bold mt-1">PRO ACCOUNT ACTIVE</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0f172a] text-white flex flex-col font-sans selection:bg-emerald-500/30">
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'HOME' && renderHome()}
        {activeTab === 'PROGRESS' && renderProgress()}
        {activeTab === 'SETTINGS' && renderSettings()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800/50 max-w-md mx-auto px-10 py-5 flex justify-between items-center z-50 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setActiveTab('HOME')}
          className={`relative flex flex-col items-center transition-all duration-300 ${activeTab === 'HOME' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home className={`w-6 h-6 mb-1 ${activeTab === 'HOME' ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`} />
          <span className="text-[10px] font-black tracking-tighter">HOME</span>
          {activeTab === 'HOME' && <div className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('PROGRESS')}
          className={`relative flex flex-col items-center transition-all duration-300 ${activeTab === 'PROGRESS' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BarChart3 className={`w-6 h-6 mb-1 ${activeTab === 'PROGRESS' ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`} />
          <span className="text-[10px] font-black tracking-tighter">PROGRESS</span>
          {activeTab === 'PROGRESS' && <div className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('SETTINGS')}
          className={`relative flex flex-col items-center transition-all duration-300 ${activeTab === 'SETTINGS' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Settings className={`w-6 h-6 mb-1 ${activeTab === 'SETTINGS' ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`} />
          <span className="text-[10px] font-black tracking-tighter">SETTINGS</span>
          {activeTab === 'SETTINGS' && <div className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full" />}
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
