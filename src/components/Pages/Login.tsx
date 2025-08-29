import React, { useState } from 'react';
import Button from '../UI/Button';
import { signIn } from '../../utils/auth';

interface LoginProps {
  onLogin: (user: { id: string; name: string; email: string; role: 'admin' | 'supervisor' | 'operator' | 'dispatcher' | 'driver' | 'auditor' }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = signIn(email, password);
      if (user) {
        onLogin(user);
        setError(null);
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">MT</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">MineFlow</h2>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@company.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p className="text-center">Demo accounts:</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li><span className="font-medium">Admin</span>: admin@company.com / admin123</li>
            <li><span className="font-medium">Driver 1</span>: ram.sharma@company.com / driver123</li>
            <li><span className="font-medium">Driver 2</span>: abhay.patel@company.com / driver123</li>
            <li><span className="font-medium">Operator</span>: operator@company.com / operator123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;


