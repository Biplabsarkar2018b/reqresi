import { useState, useEffect } from 'react';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ If token exists, redirect to User List
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
  
    if (token && tokenExpiry) {
      if (new Date().getTime() > tokenExpiry) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        navigate('/login');
      } else {
        navigate('/users');
      }
    }
  }, [navigate]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  console.log(email, password);
    try {
      const { data } = await login({email, password});
      const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenExpiry', expiryTime);
      toast.success('Login successful');
      navigate('/users');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full mb-3"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full mb-3"
        />

        {/* Login Button with Loader */}
        <button
          type="submit"
          className={`w-full p-2 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
          } text-white rounded`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
