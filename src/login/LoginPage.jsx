import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { login, tokenManager } from '../services/api';
import { Eye, EyeOff, AlertCircle, Loader, Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (tokenManager.isAuthenticated()) {
      navigate('/'); 
    }
  }, [navigate]);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(email, password);

      // 🟢 FIX 1: API response এ 'status' নয়, 'success' আসছে
      if (response?.success) {
        // 🟢 FIX 2: সফল হলে সাথে সাথে নেভিগেট করা
        navigate('/', { replace: true });
      } else {
        setError(response?.message || 'Invalid credentials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex">
    
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden items-center justify-center">
      
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 opacity-20 transform -rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 opacity-10 transform rotate-45 translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-72 bg-purple-300 opacity-10 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

     
        <div className="relative z-10 text-center px-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
           <img src="/images/palo-bangla.svg" alt="news image" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-purple-100 text-lg">Sign in to your account to continue</p>

          <div className="mt-8 flex justify-center">
            <div className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-4 shadow-lg">
              <p className="text-[10px] uppercase tracking-[0.35em] text-purple-100 mb-3">Simple Creative</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
                  <img src="/images/logo.png" alt="bangla tech" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-white">Bangla Tech</h3>
                  <p className="text-sm text-purple-100">Solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-1 h-96 bg-white transform -rotate-45 top-0 -left-48"></div>
          <div className="absolute w-1 h-96 bg-white transform -rotate-45 top-32 -left-32"></div>
        </div>
      </div>

     
      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
         
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 10a3 3 0 100-6 3 3 0 000 6zm0 1.5a6 6 0 100-12 6 6 0 000 12z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">LOGIN</h1>
          </div>

          
          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">LOGIN</h1>
            <p className="text-gray-600">Enter your credentials below</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-b-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="email"
                />
              </div>
            </div>

          
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 border-b-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-b-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

          
            <div className="text-right">
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition">
                Forgot Password?
              </a>
            </div>

           
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-full transition flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

         
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Or Login With</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={isLoading} 
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FcGoogle className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-2.324-.224-4.32-.224-4.33 0-7.32 2.64-7.32 7.494V8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}