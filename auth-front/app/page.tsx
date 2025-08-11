'use client';

import { useState } from 'react';

// APIのベースURL（本番環境では環境変数から取得）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod';

export default function PasswordForm() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 追加: 表示/非表示トグル

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!password) {
      setMessage('パスワードを入力してください');
      return;
    }
    setIsLoading(true);

    try {
      // APIGateway経由でLambda関数を呼び出し
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('パスワードが正しいです - 認証成功！');
        
        // 認証成功時にリダイレクト
        if (data.redirectUrl) {
          setTimeout(() => {
            window.location.href = data.redirectUrl;
          }, 1500); // 1.5秒後にリダイレクト
        } else {
          // フォールバック用のリダイレクト先
          setTimeout(() => {
            window.location.href = 'https://example.com/dashboard';
          }, 1500);
        }
      } else {
        setMessage(data.message || 'パスワードが間違っています');
      }
    } catch (error) {
      console.error('API call error:', error);
      setMessage('APIの呼び出しでエラーが発生しました。ローカル認証を使用します。');
      // フォールバック：ローカル認証
      if (password === 'admin123') {
        setMessage('パスワードが正しいです（ローカル認証）');
        setTimeout(() => {
          window.location.href = 'https://example.com/dashboard';
        }, 1500);
      } else {
        setMessage('パスワードが間違っています');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f7f7f7',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px',
          borderRadius: '12px',
          background: '#fff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          minWidth: '320px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1 style={{ marginBottom: '24px', color: '#333', textAlign: 'center' }}>
          認証システム
        </h1>
        
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <label style={{ fontSize: '1.2rem', marginBottom: '16px', width: '100%', color: '#000', position: 'relative', display: 'block' }}>
            パスワード:
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="パスワードを入力してください"
                style={{
                  fontSize: '1.2rem',
                  padding: '12px 44px 12px 12px',
                  marginTop: '8px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  color: '#000',
                  background: isLoading ? '#f5f5f5' : '#fff',
                  outline: 'none',
                  transition: 'border-color .2s, box-shadow .2s'
                }}
                onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,112,243,0.25)')}
                onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
              />
              {password && !isLoading && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  title={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                    transition: 'background .18s, transform .12s',
                    color: '#555'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.currentTarget.style.transform = 'translateY(-50%) scale(.9)';
                  }}
                  onMouseUp={e => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
                  onKeyDown={e => {
                    if (e.key === 'Escape') setShowPassword(false);
                  }}
                >
                  {showPassword ? (
                    // eye-off icon
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.83 21.83 0 0 1-2.16 3.19M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // eye icon
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              fontSize: '1.2rem',
              padding: '12px 32px',
              borderRadius: '6px',
              border: 'none',
              background: isLoading ? '#ccc' : '#0070f3',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            {isLoading ? '認証中...' : 'ログイン'}
          </button>
        </form>

        {message && (
          <div style={{ 
            marginTop: '20px', 
            fontSize: '1.1rem', 
            color: message.includes('正しい') ? '#28a745' : '#dc3545',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '6px',
            background: message.includes('正しい') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('正しい') ? '#c3e6cb' : '#f5c6cb'}`,
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {message}
            {message.includes('正しい') && (
              <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                まもなくページに移動します...
              </div>
            )}
          </div>
        )}

        <div style={{ 
          marginTop: '24px', 
          fontSize: '0.9rem', 
          color: '#666',
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          <p>デフォルトパスワード: <strong>admin123</strong></p>
          <p style={{ marginTop: '8px' }}>
            認証成功後、指定されたページに自動的に移動します
          </p>
        </div>
      </div>
    </div>
  );
}