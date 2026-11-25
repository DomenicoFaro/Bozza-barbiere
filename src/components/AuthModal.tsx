import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+39 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email.trim(), password);
      setIsSubmitting(false);
      if (error) {
        setError(error);
        return;
      }
      onClose();
    } else {
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || phone.trim() === '+39') {
        setError('Compila nome, cognome e telefono.');
        setIsSubmitting(false);
        return;
      }
      const { error } = await signUp({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      setIsSubmitting(false);
      if (error) {
        setError(error);
        return;
      }
      setSignupDone(true);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#151515] border border-[#2E2E2E] max-w-md w-full p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-3">
          <div className="flex items-center space-x-2">
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <h3 className="font-display uppercase tracking-wide text-lg font-light text-[#F2EFEA]">
              {mode === 'login' ? 'Accedi al tuo account' : 'Crea il tuo account'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#242424]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {signupDone ? (
          <div className="space-y-4 text-xs text-center py-4">
            <p className="text-[#F2EFEA]">
              Account creato! Controlla la tua email per confermare la registrazione, poi accedi.
            </p>
            <button
              onClick={() => {
                setSignupDone(false);
                setMode('login');
              }}
              className="w-full py-2.5 border border-[#C8102E] bg-[#C8102E] hover:bg-[#E3162F] text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
            >
              Vai al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#F2EFEA]">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 border border-[#2E2E2E] bg-[#0B0B0B] text-[#F2EFEA] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#F2EFEA]">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 border border-[#2E2E2E] bg-[#0B0B0B] text-[#F2EFEA] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#F2EFEA]">
                  Telefono *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-[#2E2E2E] bg-[#0B0B0B] text-[#F2EFEA] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#F2EFEA]">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-[#2E2E2E] bg-[#0B0B0B] text-[#F2EFEA] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[10px] uppercase tracking-wider block mb-1 text-[#F2EFEA]">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-[#2E2E2E] bg-[#0B0B0B] text-[#F2EFEA] focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-[11px] font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 border border-[#C8102E] bg-[#C8102E] hover:bg-[#E3162F] disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{mode === 'login' ? 'Accedi' : 'Registrati'}</span>
            </button>

            <p className="text-center text-[11px] text-[#F2EFEA]/70">
              {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode(mode === 'login' ? 'signup' : 'login');
                }}
                className="font-bold underline text-[#F2EFEA]"
              >
                {mode === 'login' ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
