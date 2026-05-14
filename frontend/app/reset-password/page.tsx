'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authResetPassword } from '../lib/api';

function passwordStrengthMessage(password: string): { text: string; tone: 'muted' | 'warn' | 'ok' } {
  if (!password) {
    return { text: 'Use at least 6 characters.', tone: 'muted' };
  }
  if (password.length < 6) {
    const remaining = 6 - password.length;
    return { text: `Add ${remaining} more character${remaining === 1 ? '' : 's'} to continue.`, tone: 'warn' };
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if ((hasLetter && hasNumber) || hasSymbol) {
    return { text: 'Password strength looks good.', tone: 'ok' };
  }

  return { text: 'For a stronger password, mix letters, numbers, and symbols.', tone: 'warn' };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token')?.trim() || params.get('reset')?.trim() || '');
  }, []);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => {
      router.push('/checkout?login=1');
    }, 1800);
    return () => clearTimeout(timer);
  }, [router, success]);

  const strength = useMemo(() => passwordStrengthMessage(password), [password]);

  const handleSubmit = async () => {
    if (!token) {
      setError('This reset link is invalid or missing its token.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await authResetPassword(token, password, confirmPassword);
      if (res.success) {
        setSuccess(res.message || 'Password updated successfully.');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Unable to reset password.');
      }
    } catch {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push('/checkout?login=1');
  };

  return (
    <main className="register-modal-overlay reset-password-page">
      <div className="register-modal reset-password-card">
        <button type="button" className="register-modal-close" onClick={handleClose} aria-label="Close">
          &#x2715;
        </button>

        <p className="register-modal-title">Set a new password</p>
        <p className="register-modal-sub">
          Choose a strong password and confirm it below. Once saved, you can log in with the new password.
        </p>

        {!token ? (
          <p className="register-modal-err">
            This reset link is invalid or incomplete. Please request a new password reset from the checkout page.
          </p>
        ) : (
          <div>
            <div className="register-modal-field">
              <label className="register-modal-label">
                New Password <span>*</span>
              </label>
              <input
                className="register-modal-input"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSubmit();
                }}
              />
              <p className={`reset-password-strength ${strength.tone}`}>{strength.text}</p>
            </div>

            <div className="register-modal-field">
              <label className="register-modal-label">
                Confirm Password <span>*</span>
              </label>
              <input
                className="register-modal-input"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSubmit();
                }}
              />
            </div>

            {error && <p className="register-modal-err">{error}</p>}
            {success && <p className="register-modal-success">{success}</p>}

            <button
              type="button"
              className="btn-view-product reset-password-submit"
              onClick={() => void handleSubmit()}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}

        <div className="reset-password-foot">
          <Link href="/checkout?login=1">Back to checkout login</Link>
        </div>
      </div>
    </main>
  );
}
