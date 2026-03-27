"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error("Auth Error:", error.code, error.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary-900)] px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-primary-800)] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-50" />
      
      <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-primary-800)] mb-4 shadow-lg shadow-black/40">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[#E8F0E4]">Agri<span className="text-[var(--color-gold)]">Forecast</span></h1>
          <p className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest mt-2 opacity-80">Precision Agriculture Platform</p>
        </div>

        <div className="glass-dark border border-[var(--color-gold)]/20 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-[#E8F0E4] font-bold text-center mb-8">Access Terminal</h2>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full bg-[#E8F0E4] hover:bg-white text-[var(--color-primary-900)] px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-3 active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          <div className="mt-8 pt-6 border-t border-[var(--color-gold)]/10 text-center">
            <p className="text-[9px] text-[#CBD5C9] font-medium uppercase tracking-widest leading-relaxed">
              Securely encrypted &bull; Mandi Integrated &bull; satellite verified
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-[9px] font-bold text-[var(--color-gold)] uppercase tracking-widest opacity-60">
          Developed for Indian Farmers &bull; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
