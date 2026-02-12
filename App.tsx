
import React, { useState, useEffect, useRef } from 'react';
import { HealBotService } from './services/geminiService';
import { Message, UserHealthProfile, Language, User, UserRole } from './types';
import ChatInterface from './components/ChatInterface';
import HealthReport from './components/HealthReport';
import MedicalServices from './components/MedicalServices';
import WellnessHub from './components/WellnessHub';
import InsuranceModule from './components/InsuranceModule';
import AdminDashboard from './components/AdminDashboard';
import LiveVoiceMode from './components/LiveVoiceMode';
import AboutSupport from './components/AboutSupport';

const SECURITY_QUESTIONS = [
  "What is your favorite healthy drink?",
  "What activity helps you relax when stressed?",
  "What time of day do you prefer for exercise?",
  "What healthy habit are you proud of?",
  "What is your favorite fruit for staying healthy?"
];

const ADMIN_CREDENTIALS = {
  name: 'logesh',
  email: 'logesh20bec@gmail.com',
  password: 'bec.ac.in'
};

const TRANSLATIONS = {
  [Language.EN]: {
    name: 'English',
    welcome: 'Welcome to HealBot AI',
    sub: 'Your advanced healthcare companion.',
    mainChat: 'Main Chat',
    consult: 'Consultations',
    doctors: 'Doctors & Specialists',
    hospitals: 'Hospitals Nearby',
    telemedicine: 'Telemedicine (Remote)',
    protection: 'Protection',
    insurance: 'Health Insurance',
    pharmacy: 'Pharmacy',
    medicines: 'Search Medicines',
    wellness: 'Wellness',
    fitness: 'Fitness & Nutrition',
    system: 'System Controls',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    rural: 'Rural Mode',
    clear: 'Clear Logs',
    selectLang: 'Select Language',
    loginTitle: 'Healthcare Portal Login',
    loginSub: 'Access your secure medical AI assistant.',
    emailLabel: 'Gmail / Medical ID',
    passLabel: 'Access Key / Password',
    loginBtn: 'Secure Entry',
    guestBtn: 'Continue as Guest',
    forgotPass: 'Forgot access credentials?',
    registerTitle: 'Create Healthcare Account',
    registerBtn: 'Complete Registration',
    usernameLabel: 'Username',
    ageLabel: 'Age',
    genderLabel: 'Gender',
    securityQ: 'Security Question',
    securityA: 'Your Answer',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already registered?',
    resetTitle: 'Password Recovery',
    resetBtn: 'Update Password',
    findAccount: 'Verify Account',
    wrongAnswer: 'Security answer is incorrect.',
    userNotFound: 'Account not found.',
    adminPanel: 'Admin Command Center',
    liveVoice: 'Live Voice Session',
    about: 'About & Support'
  },
  [Language.TA]: {
    name: 'தமிழ்',
    welcome: 'ஹீல்பாட் AI-க்கு வரவேற்கிறோம்',
    sub: 'உங்கள் மேம்பட்ட சுகாதார துணை.',
    mainChat: 'முக்கிய அரட்டை',
    consult: 'ஆலோசனைகள்',
    doctors: 'மருத்துவர்கள் மற்றும் நிபுணர்கள்',
    hospitals: 'அருகிலுள்ள மருத்துவமனைகள்',
    telemedicine: 'டெலிமெடிசின் (தொலைநிலை)',
    protection: 'பாதுகாப்பு',
    insurance: 'சுகாதார காப்பீடு',
    pharmacy: 'மருந்தகம்',
    medicines: 'மருந்துகளைத் தேடுங்கள்',
    wellness: 'நல்வாழ்வு',
    fitness: 'உடற்தகுதி மற்றும் ஊட்டச்சத்து',
    system: 'கணினி கட்டுப்பாடுகள்',
    darkMode: 'இருண்ட பயன்முறை',
    lightMode: 'ஒளி பயன்முறை',
    rural: 'கிராமப்புற முறை',
    clear: 'பதிவுகளை அழி',
    selectLang: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    loginTitle: 'சுகாதார போர்டல் உள்நுழைவு',
    loginSub: 'உங்கள் பாதுகாப்பான மருத்துவ AI உதவியாளரை அணுகவும்.',
    emailLabel: 'ஜிமெயில் / மருத்துவ ஐடி',
    passLabel: 'கடவுச்சொல்',
    loginBtn: 'பாதுகாப்பான நுழைவு',
    guestBtn: 'விருந்தினராக தொடரவும்',
    forgotPass: 'அடையாளச் சான்றுகளை மறந்துவிட்டீர்களா?',
    registerTitle: 'புதிய கணக்கை உருவாக்கவும்',
    registerBtn: 'பதிவை முடிக்கவும்',
    usernameLabel: 'பயனர் பெயர்',
    ageLabel: 'வயது',
    genderLabel: 'பாலினம்',
    securityQ: 'பாதுகாப்பு கேள்வி',
    securityA: 'உங்கள் பதில்',
    noAccount: 'கணக்கு இல்லையா?',
    hasAccount: 'ஏற்கனவே பதிவு செய்துள்ளீர்களா?',
    resetTitle: 'கடவுச்சொல் மீட்பு',
    resetBtn: 'கடவுச்சொல்லை மாற்றவும்',
    findAccount: 'கணக்கைச் சரிபார்க்கவும்',
    wrongAnswer: 'பதில் தவறானது.',
    userNotFound: 'கணக்கு கிடைக்கவில்லை.',
    adminPanel: 'நிர்வாக மையம்',
    liveVoice: 'நேரடி குரல் அமர்வு',
    about: 'தகவல் மற்றும் ஆதரவு'
  },
  [Language.HI]: {
    name: 'हिन्दी',
    welcome: 'हीलबॉट एआई में आपका स्वागत है',
    sub: 'आपका उन्नत स्वास्थ्य सेवा साथी।',
    mainChat: 'मुख्य चैट',
    consult: 'परामर्श',
    doctors: 'डॉक्टर और विशेषज्ञ',
    hospitals: 'पास के अस्पताल',
    telemedicine: 'टेलीमेडिसिन',
    protection: 'सुरक्षा',
    insurance: 'स्वास्थ्य बीमा',
    pharmacy: 'फार्मेसी',
    medicines: 'दवाएं खोजें',
    wellness: 'कल्याण',
    fitness: 'फिटनेस और पोषण',
    system: 'सिस्टम नियंत्रण',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    rural: 'ग्रामीण मोड',
    clear: 'लॉग साफ़ करें',
    selectLang: 'भाषा चुनें',
    loginTitle: 'स्वास्थ्य सेवा पोर्टल लॉगिन',
    loginSub: 'अपने सुरक्षित मेडिकल एआई सहायक तक पहुंचें।',
    emailLabel: 'जीमेल / मेडिकल आईडी',
    passLabel: 'पासवर्ड',
    loginBtn: 'सुरक्षित प्रवेश',
    guestBtn: 'अतिथि के रूप में जारी रखें',
    forgotPass: 'क्रेडेंशियल्स भूल गए?',
    registerTitle: 'खाता बनाएं',
    registerBtn: 'पंजीकरण पूरा करें',
    usernameLabel: 'उपयोगकर्ता नाम',
    ageLabel: 'आयु',
    genderLabel: 'लिंग',
    securityQ: 'सुरक्षा प्रश्न',
    securityA: 'आपका उत्तर',
    noAccount: 'खाता नहीं है?',
    hasAccount: 'पहले से पंजीकृत?',
    resetTitle: 'पासवर्ड रिकवरी',
    resetBtn: 'पासवर्ड अपडेट करें',
    findAccount: 'खाता सत्यापित करें',
    wrongAnswer: 'सुरक्षा उत्तर गलत है।',
    userNotFound: 'खाता नहीं मिला।',
    adminPanel: 'एडमिन सेंटर',
    liveVoice: 'लाइव वॉयस',
    about: 'परिचय और सहायता'
  },
  [Language.ES]: {
    name: 'Español',
    welcome: 'Bienvenido a HealBot AI',
    sub: 'Su compañero avanzado de atención médica.',
    mainChat: 'Chat Principal',
    consult: 'Consultas',
    doctors: 'Médicos y Especialistas',
    hospitals: 'Hospitales Cercanos',
    telemedicine: 'Telemedicina',
    protection: 'Protección',
    insurance: 'Seguro de Salud',
    pharmacy: 'Farmacia',
    medicines: 'Buscar Medicamentos',
    wellness: 'Bienestar',
    fitness: 'Gimnasia y Nutrición',
    system: 'Controles del Sistema',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Luz',
    rural: 'Modo Rural',
    clear: 'Borrar Registros',
    selectLang: 'Seleccionar Idioma',
    loginTitle: 'Inicio de Sesión del Portal',
    loginSub: 'Acceda a su asistente médico seguro de IA.',
    emailLabel: 'Gmail / ID Médico',
    passLabel: 'Contraseña',
    loginBtn: 'Entrada Segura',
    guestBtn: 'Continuar como Invitado',
    forgotPass: '¿Olvidó sus credenciales?',
    registerTitle: 'Crear Cuenta de Salud',
    registerBtn: 'Completar Registro',
    usernameLabel: 'Usuario',
    ageLabel: 'Edad',
    genderLabel: 'Género',
    securityQ: 'Pregunta de Seguridad',
    securityA: 'Su Respuesta',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya estás registrado?',
    resetTitle: 'Recuperar Contraseña',
    resetBtn: 'Actualizar Contraseña',
    findAccount: 'Verificar Cuenta',
    wrongAnswer: 'Respuesta incorrecta.',
    userNotFound: 'Usuario no encontrado.',
    adminPanel: 'Centro Administrativo',
    liveVoice: 'Voz en Vivo',
    about: 'Acerca de y Soporte'
  },
  [Language.AR]: {
    name: 'العربية',
    welcome: 'مرحبًا بك في HealBot AI',
    sub: 'رفيقك المتقدم في الرعاية الصحية.',
    mainChat: 'الدردشة الرئيسية',
    consult: 'الاستشارات',
    doctors: 'الأطباء والمتخصصون',
    hospitals: 'المستشفيات القريبة',
    telemedicine: 'الطب عن بعد',
    protection: 'الحماية',
    insurance: 'التأمين الصحي',
    pharmacy: 'الصيدلية',
    medicines: 'البحث عن الأدوية',
    wellness: 'العافية',
    fitness: 'اللياقة البدنية والتغذية',
    system: 'ضوابط النظام',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع المضيء',
    rural: 'الوضع الريفي',
    clear: 'مسح السجلات',
    selectLang: 'اختر اللغة',
    loginTitle: 'تسجيل دخول بوابة الرعاية الصحية',
    loginSub: 'الوصول إلى مساعدك الطبي الآمن.',
    emailLabel: 'جي ميل / الهوية الطبية',
    passLabel: 'كلمة المرور',
    loginBtn: 'دخول آمن',
    guestBtn: 'متابعة كضيف',
    forgotPass: 'هل نسيت بيانات الاعتماد؟',
    registerTitle: 'إنشاء حساب رعاية صحية',
    registerBtn: 'إكمال التسجيل',
    usernameLabel: 'اسم المستخدم',
    ageLabel: 'العمر',
    genderLabel: 'الجنس',
    securityQ: 'سؤال الأمان',
    securityA: 'إجابتك',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'مسجل بالفعل؟',
    resetTitle: 'استعادة كلمة المرور',
    resetBtn: 'تحديث كلمة المرور',
    findAccount: 'التحقق من الحساب',
    wrongAnswer: 'الإجابة غير صحيحة.',
    userNotFound: 'الحساب غير موجود.',
    adminPanel: 'لوحة التحكم الإدارية',
    liveVoice: 'جلسة صوتية حية',
    about: 'حول والدعم'
  }
};

const INITIAL_MESSAGE_CONTENT = (lang: Language) => `### ${TRANSLATIONS[lang].welcome}\n${TRANSLATIONS[lang].sub}\n\n**How can I help you today?**`;

type ViewState = 'chat' | 'report' | 'doctors' | 'medicines' | 'labs' | 'hospitals' | 'fitness' | 'insurance' | 'admin' | 'live' | 'about' | 'telemedicine';
type AuthState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('hb_auth') === 'true');
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.PATIENT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('hb_theme') as 'light' | 'dark') || 'light');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('hb_lang') as Language) || Language.EN);
  const [view, setView] = useState<ViewState>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => 'SID-' + Math.random().toString(36).substr(2, 8).toUpperCase());
  
  // Auth Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<User>({
    patientId: '', username: '', email: '', password: '', age: 0, gender: 'Male', 
    securityQuestion: SECURITY_QUESTIONS[0], securityAnswer: '', role: UserRole.PATIENT
  });
  const [resetForm, setResetForm] = useState({ email: '', answer: '', newPassword: '', stage: 1 });
  const [resetUser, setResetUser] = useState<User | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hb_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const userProfile: UserHealthProfile = {
    name: currentUser?.username || 'Guest Patient',
    email: currentUser?.email || 'guest@healbot.ai',
    patientId: currentUser?.patientId || 'GUEST-ID',
    age: currentUser?.age || 30,
    gender: currentUser?.gender || 'Not Specified',
    allergies: [],
    history: []
  };

  const healBot = useRef(new HealBotService());
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('hb_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme-root');
    } else {
      document.body.classList.remove('dark-theme-root');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hb_lang', lang);
  }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem('healbot_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
          return;
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    setMessages([{ id: 'init-' + Date.now(), role: 'assistant', content: INITIAL_MESSAGE_CONTENT(lang), timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('healbot_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auth Helpers
  const getUsers = (): User[] => {
    const raw = localStorage.getItem('hb_users');
    return raw ? JSON.parse(raw) : [];
  };

  const generateSession = () => {
    setSessionId('SID-' + Math.random().toString(36).substr(2, 8).toUpperCase());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginRole === UserRole.ADMIN) {
      if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.password === ADMIN_CREDENTIALS.password) {
        const adminUser: User = { 
          ...ADMIN_CREDENTIALS, 
          patientId: 'ADM-001', 
          age: 0, gender: 'Admin', securityQuestion: '', securityAnswer: '', role: UserRole.ADMIN, username: ADMIN_CREDENTIALS.name 
        };
        setIsLoggedIn(true);
        setCurrentUser(adminUser);
        generateSession();
        localStorage.setItem('hb_auth', 'true');
        localStorage.setItem('hb_current_user', JSON.stringify(adminUser));
        setView('admin');
        return;
      } else {
        alert("Invalid Admin credentials.");
        return;
      }
    }

    const users = getUsers();
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      generateSession();
      localStorage.setItem('hb_auth', 'true');
      localStorage.setItem('hb_current_user', JSON.stringify(user));
      setView('chat');
    } else {
      alert("Invalid credentials. Please try again or register.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    if (users.some(u => u.email === registerForm.email)) {
      alert("User already exists with this Gmail.");
      return;
    }
    const newPatientId = 'PID-' + Math.random().toString(36).substr(2, 5).toUpperCase() + '-' + Date.now().toString().substr(-4);
    const updatedUsers = [...users, { ...registerForm, patientId: newPatientId, role: UserRole.PATIENT }];
    localStorage.setItem('hb_users', JSON.stringify(updatedUsers));
    alert(`Registration successful! Your Patient ID is: ${newPatientId}. Please login.`);
    setAuthState('LOGIN');
  };

  const handleResetVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(u => u.email === resetForm.email);
    if (user) {
      setResetUser(user);
      setResetForm(prev => ({ ...prev, stage: 2 }));
    } else {
      alert(t.userNotFound);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetUser && resetForm.answer.toLowerCase() === resetUser.securityAnswer.toLowerCase()) {
      const users = getUsers();
      const updatedUsers = users.map(u => u.email === resetUser.email ? { ...u, password: resetForm.newPassword } : u);
      localStorage.setItem('hb_users', JSON.stringify(updatedUsers));
      alert("Password updated successfully!");
      setAuthState('LOGIN');
      setResetForm({ email: '', answer: '', newPassword: '', stage: 1 });
      setResetUser(null);
    } else {
      alert(t.wrongAnswer);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('hb_auth');
    localStorage.removeItem('hb_current_user');
    setIsSidebarOpen(false);
    setAuthState('LOGIN');
  };

  const clearHistory = () => {
    if (window.confirm("Perform a full system reset? This will clear all chat history, clinical bookings, and insurance requests.")) {
      // Clear all potential medical logs
      localStorage.removeItem('healbot_history');
      localStorage.removeItem('hb_service_bookings');
      localStorage.removeItem('hb_insurance_requests');
      localStorage.removeItem('wellness_calorie_log');
      
      const newInitialMessage: Message = { 
        id: 'init-' + Date.now(), 
        role: 'assistant', 
        content: INITIAL_MESSAGE_CONTENT(lang), 
        timestamp: new Date() 
      };
      
      setMessages([newInitialMessage]);
      setView('chat');
      setIsSidebarOpen(false);
      setIsLangMenuOpen(false);
      
      // Force immediate re-render of components watching these storage keys if needed
      window.dispatchEvent(new Event('storage'));
      alert("System reset complete. All logs have been purged.");
    }
  };

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (text: string, imageBase64?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      image: imageBase64
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const location = await new Promise<{lat: number, lng: number} | undefined>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(undefined)
        );
      });

      const mappedHistory = updatedMessages.map(m => {
        const parts: any[] = [{ text: m.content }];
        if (m.image) {
          const mimeTypeMatch = m.image.match(/^data:(.*);base64,/);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
          const data = m.image.split(',')[1] || m.image;
          parts.push({
            inlineData: { mimeType, data }
          });
        }
        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts
        };
      });

      let conversationHistory = mappedHistory.slice(0, -1);
      if (conversationHistory.length > 0 && conversationHistory[0].role === 'model') {
        conversationHistory = conversationHistory.slice(1);
      }

      const langContext = ` (Respond strictly in ${TRANSLATIONS[lang].name} language)`;
      const response = await healBot.current.getResponse(text + langContext, conversationHistory, location, imageBase64);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        isEmergency: response.isEmergency,
        groundingUrls: (response.groundingChunks || [])
          .map((c: any) => c.web || c.maps)
          .filter(Boolean)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: '### Error\nI encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 bg-slate-50 transition-all duration-700 ${lang === Language.AR ? 'font-arabic' : ''}`} dir={lang === Language.AR ? 'rtl' : 'ltr'}>
        <div className="absolute top-8 flex gap-4 no-print">
           <button onClick={() => setIsLangMenuOpen(true)} className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2">
             <i className="fas fa-language text-blue-600"></i> {t.name}
           </button>
        </div>

        {isLangMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
             <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.selectLang}</h3>
                  <button onClick={() => setIsLangMenuOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-4 grid grid-cols-1 gap-2">
                  {Object.entries(TRANSLATIONS).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => { setLang(key as Language); setIsLangMenuOpen(false); }}
                      className={`p-5 rounded-2xl flex items-center justify-between transition-all font-black text-sm ${lang === key ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <span>{value.name}</span>
                      {lang === key && <i className="fas fa-check-circle"></i>}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}

        <div className="w-full max-w-md py-12 animate-in fade-in zoom-in-95 duration-1000">
           <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-6 shadow-2xl shadow-blue-100">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">HealBot AI</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                {authState === 'LOGIN' ? t.loginTitle : authState === 'REGISTER' ? t.registerTitle : t.resetTitle}
              </p>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-100">
              
              {authState === 'LOGIN' && (
                <div className="space-y-6">
                  {/* Role Selector */}
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {[UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN].map(role => (
                      <button
                        key={role}
                        onClick={() => setLoginRole(role)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginRole === role ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{t.emailLabel}</label>
                      <input 
                        type="email" required 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder={loginRole === UserRole.ADMIN ? "admin@gmail.com" : "user@gmail.com"}
                        value={loginForm.email}
                        onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{t.passLabel}</label>
                      <input 
                        type="password" required 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      />
                    </div>
                    <button type="submit" className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${loginRole === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'}`}>
                      {t.loginBtn}
                    </button>
                    <div className="flex justify-between mt-4">
                      <button type="button" onClick={() => setAuthState('FORGOT_PASSWORD')} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">{t.forgotPass}</button>
                      <button type="button" onClick={() => setAuthState('REGISTER')} className="text-[10px] font-black uppercase text-blue-600 hover:underline">{t.noAccount}</button>
                    </div>
                  </form>
                </div>
              )}

              {authState === 'REGISTER' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.usernameLabel}</label>
                      <input type="text" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.username} onChange={e => setRegisterForm({...registerForm, username: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.emailLabel}</label>
                      <input type="email" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.ageLabel}</label>
                      <input type="number" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.age || ''} onChange={e => setRegisterForm({...registerForm, age: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.genderLabel}</label>
                      <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.gender} onChange={e => setRegisterForm({...registerForm, gender: e.target.value})}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.passLabel}</label>
                    <input type="password" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.securityQ}</label>
                    <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.securityQuestion} onChange={e => setRegisterForm({...registerForm, securityQuestion: e.target.value})}>
                      {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{t.securityA}</label>
                    <input type="text" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold" value={registerForm.securityAnswer} onChange={e => setRegisterForm({...registerForm, securityAnswer: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                    {t.registerBtn}
                  </button>
                  <button type="button" onClick={() => setAuthState('LOGIN')} className="w-full text-[10px] font-black uppercase text-slate-400 text-center mt-4">{t.hasAccount}</button>
                </form>
              )}

              {authState === 'FORGOT_PASSWORD' && (
                <div className="space-y-6">
                  {resetForm.stage === 1 ? (
                    <form onSubmit={handleResetVerification} className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">{t.emailLabel}</label>
                        <input type="email" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={resetForm.email} onChange={e => setResetForm({...resetForm, email: e.target.value})} />
                      </div>
                      <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">{t.findAccount}</button>
                    </form>
                  ) : (
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-black uppercase text-blue-600 mb-1">{t.securityQ}</p>
                        <p className="text-sm font-bold text-slate-900">{resetUser?.securityQuestion}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">{t.securityA}</label>
                        <input type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={resetForm.answer} onChange={e => setResetForm({...resetForm, answer: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">New Password</label>
                        <input type="password" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={resetForm.newPassword} onChange={e => setResetForm({...resetForm, newPassword: e.target.value})} />
                      </div>
                      <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">{t.resetBtn}</button>
                    </form>
                  )}
                  <button type="button" onClick={() => { setAuthState('LOGIN'); setResetForm(prev => ({ ...prev, stage: 1 })); }} className="w-full text-[10px] font-black uppercase text-slate-400 text-center">Back to Login</button>
                </div>
              )}
              
              <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                <button onClick={() => setIsLoggedIn(true)} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all tracking-widest">
                  {t.guestBtn}
                </button>
              </div>
           </div>
           
           <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-10">
             Secure Clinical Gateway v6.1.0
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex overflow-hidden relative ${lang === Language.AR ? 'flex-row-reverse' : 'flex-row'} ${isLowBandwidth ? 'bg-white' : 'bg-slate-50'}`}>
      
      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 ${lang === Language.AR ? 'right-4' : 'left-4'} z-[60] w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-700 hover:text-blue-600 border border-slate-100 transition-all no-print`}
        aria-label="Menu"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Language Selection Modal */}
      {isLangMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.selectLang}</h3>
                <button onClick={() => setIsLangMenuOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 gap-2">
                {Object.entries(TRANSLATIONS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => { setLang(key as Language); setIsLangMenuOpen(false); }}
                    className={`p-5 rounded-2xl flex items-center justify-between transition-all font-black text-sm ${lang === key ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    <span>{value.name}</span>
                    {lang === key && <i className="fas fa-check-circle"></i>}
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}

      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 ${lang === Language.AR ? 'right-0 border-l' : 'left-0 border-r'} w-72 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out no-print flex flex-col border-slate-800 ${isSidebarOpen ? 'translate-x-0' : (lang === Language.AR ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="p-6 pt-20 flex items-center gap-3 border-b border-slate-800 cursor-pointer" onClick={() => navigateTo('chat')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h1 className="text-white font-black tracking-tight text-xl">HealBot AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
          {currentUser?.role === UserRole.ADMIN && (
            <button 
              onClick={() => navigateTo('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all mb-4 ${view === 'admin' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fas fa-user-shield w-5"></i> {t.adminPanel}
            </button>
          )}

          <button 
            onClick={() => navigateTo('live')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all mb-4 ${view === 'live' ? 'bg-red-600 text-white shadow-md animate-pulse' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <i className="fas fa-headset w-5"></i> {t.liveVoice}
          </button>

          <button 
            onClick={() => navigateTo('chat')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all mb-4 ${view === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <i className="fas fa-comment-medical w-5"></i> {t.mainChat}
          </button>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">{t.consult}</h3>
            <ul className="space-y-1">
              <li onClick={() => navigateTo('doctors')} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 text-sm font-medium ${view === 'doctors' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <i className="fas fa-user-md text-blue-400 w-5"></i> {t.doctors}
              </li>
              <li onClick={() => navigateTo('telemedicine')} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 text-sm font-medium ${view === 'telemedicine' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <i className="fas fa-video text-purple-400 w-5"></i> {t.telemedicine}
              </li>
              <li onClick={() => navigateTo('hospitals')} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 text-sm font-medium ${view === 'hospitals' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <i className="fas fa-hospital text-red-400 w-5"></i> {t.hospitals}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">{t.protection}</h3>
            <ul className="space-y-1">
              <li onClick={() => navigateTo('insurance')} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 text-sm font-medium ${view === 'insurance' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <i className="fas fa-shield-heart text-amber-400 w-5"></i> {t.insurance}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">{t.pharmacy}</h3>
            <ul className="space-y-1">
              <li onClick={() => navigateTo('medicines')} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 text-sm font-medium ${view === 'medicines' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <i className="fas fa-pills text-green-400 w-5"></i> {t.medicines}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">{t.wellness}</h3>
            <ul className="space-y-1">
              <li onClick={() => navigateTo('fitness')} className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 text-sm font-medium ${view === 'fitness' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <i className="fas fa-apple-alt text-orange-400 w-5"></i> {t.fitness}
              </li>
            </ul>
          </div>

          <button 
            onClick={() => navigateTo('about')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${view === 'about' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <i className="fas fa-circle-info w-5"></i> {t.about}
          </button>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{t.system}</h3>
          
          <div className="flex items-center gap-2 px-2">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border border-transparent ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:border-slate-700'}`}
              title={theme === 'light' ? t.darkMode : t.lightMode}
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
            </button>

            <button 
              onClick={() => setIsLangMenuOpen(true)}
              className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-slate-700 active:scale-95"
              title={t.selectLang}
            >
              <i className="fas fa-language text-sm"></i>
            </button>

            <button 
              onClick={() => setIsLowBandwidth(!isLowBandwidth)}
              className={`flex-1 h-10 px-3 rounded-xl text-[8px] font-black uppercase transition-colors flex items-center justify-center gap-2 ${isLowBandwidth ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              title={t.rural}
            >
              <i className="fas fa-signal"></i>
              <span>{isLowBandwidth ? 'Rural' : 'Rural'}</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-10 h-10 bg-slate-800 text-red-400 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-red-900/30"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-sm"></i>
            </button>
          </div>
          
          <button 
            onClick={clearHistory}
            className="w-full p-3 rounded-xl text-[9px] font-black uppercase text-red-400 border border-red-900/30 hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-trash-alt"></i> {t.clear}
          </button>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col min-w-0 bg-white transition-all duration-300`}>
        {view === 'chat' && (
          <ChatInterface 
            messages={messages} 
            onSend={handleSendMessage} 
            isLowBandwidth={isLowBandwidth}
            onGenerateReport={() => setView('report')}
            onClearHistory={clearHistory}
            lang={lang}
          />
        )}
        {view === 'live' && (
          <LiveVoiceMode 
            userProfile={userProfile} 
            sessionId={sessionId}
            onBack={() => setView('chat')} 
          />
        )}
        {view === 'report' && <HealthReport messages={messages} userProfile={userProfile} sessionId={sessionId} onBack={() => setView('chat')} />}
        {view === 'fitness' && <WellnessHub onBack={() => setView('chat')} />}
        {view === 'insurance' && <InsuranceModule onBack={() => setView('chat')} />}
        {view === 'admin' && <AdminDashboard onBack={() => setView('chat')} />}
        {view === 'about' && <AboutSupport userProfile={userProfile} sessionId={sessionId} onBack={() => setView('chat')} />}
        {view !== 'chat' && view !== 'report' && view !== 'fitness' && view !== 'insurance' && view !== 'admin' && view !== 'live' && view !== 'about' && (
          <MedicalServices type={view} onBack={() => setView('chat')} userProfile={userProfile} />
        )}
      </main>
    </div>
  );
};

export default App;
