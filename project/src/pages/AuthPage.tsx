import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Github, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
            },
          },
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using email/password auth instead since Google OAuth is not enabled
      setError("Google authentication is not enabled on this Supabase project. Please use email/password instead.");
      setLoading(false);
      
      /* This would be the correct implementation if Google auth was enabled
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) throw error;
      */
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen mesh-background dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="max-w-md w-full glass-effect dark:bg-gray-800/50 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 relative z-10 backdrop-blur-lg">
        <div className="text-center mb-8">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-70 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-gray-800 rounded-full">
              <img src="/ai-assistant-logo.svg" alt="Logo" className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your AI-powered knowledge companion
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-300">
              <span className="w-2 h-2 mr-1 bg-green-400 rounded-full animate-pulse"></span>
              Powered by OpenAI
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isLogin
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                !isLogin
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 dark:text-white transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 dark:text-white transition-all duration-200"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              {isLogin && (
                <a href="#" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 dark:text-white transition-all duration-200"
                placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                required
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 dark:border-white"></div>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-purple-600 dark:text-purple-400 hover:underline transition-colors duration-200 font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By continuing, you agree to our 
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline"> Terms of Service </a> 
            and 
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline"> Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}