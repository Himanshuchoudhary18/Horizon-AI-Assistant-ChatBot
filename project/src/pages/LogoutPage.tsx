import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Check } from 'lucide-react';

export function LogoutPage() {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [logoutComplete, setLogoutComplete] = React.useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        // Clear any cookies or local storage if needed
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        localStorage.clear();
        
        // Show success animation
        setLogoutComplete(true);
        
        // Redirect after animation
        setTimeout(() => navigate('/auth'), 2000);
      } catch (error) {
        console.error("Logout error:", error);
        navigate('/auth');
      }
    };

    handleLogout();
  }, [signOut, navigate]);

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

      <div className="max-w-md w-full glass-effect dark:bg-gray-800/50 rounded-2xl shadow-lg p-8 text-center relative z-10 backdrop-blur-lg border border-gray-100 dark:border-gray-700">
        <div className="relative mb-6">
          {logoutComplete ? (
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-green-500" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <LogOut className="w-10 h-10 text-purple-500" />
              </div>
            </>
          )}
        </div>
        
        <h1 className={`text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-all duration-500 ${
          logoutComplete ? 'opacity-100' : 'opacity-80'
        }`}>
          {logoutComplete ? 'Successfully Signed Out!' : 'Signing Out...'}
        </h1>
        
        <p className={`text-gray-600 dark:text-gray-400 transition-all duration-500 ${
          logoutComplete ? 'opacity-100' : 'opacity-80'
        }`}>
          {logoutComplete 
            ? 'Thank you for using our AI Assistant. See you again soon!' 
            : 'Please wait while we securely log you out...'}
        </p>
        
        {logoutComplete && (
          <div className="mt-6 animate-fade-in">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting you to the login page...
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}