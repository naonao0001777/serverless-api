'use client';

import { useState } from 'react';
import { PASSWORD } from './secret';

export default function PasswordForm() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // パスワードのバリデーション
    if (password === PASSWORD) {
      setMessage('パスワードが正しいです');
    } else {
      setMessage('パスワードが間違っています');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f7f7f7',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px',
          borderRadius: '12px',
          background: '#fff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          minWidth: '320px',
        }}
      >
        <label style={{ fontSize: '1.2rem', marginBottom: '16px', width: '100%', color: '#000', position: 'relative', display: 'block' }}>
          パスワード:
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                fontSize: '1.2rem',
                padding: '12px 40px 12px 12px', // 右側に余白
                marginTop: '8px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                color: '#000',
                background: '#fff',
              }}
            />
            {password && (
              <button
                type="button"
                onClick={() => setPassword('')}
                aria-label="入力をクリア"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#888',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
        </label>
        <button
          type="submit"
          style={{
            fontSize: '1.2rem',
            padding: '12px 32px',
            borderRadius: '6px',
            border: 'none',
            background: '#0070f3',
            color: '#fff',
            cursor: 'pointer',
            marginTop: '8px',
            fontWeight: 'bold',
          }}
        >
          送信
        </button>
        {message && (
          <p style={{ marginTop: '20px', fontSize: '1.1rem', color: '#333' }}>{message}</p>
        )}
      </form>
    </div>
  );
}