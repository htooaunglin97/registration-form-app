const LoginForm = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>
              User Name:
            </label>
            <input
              type='text'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
            />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>
              Password:
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
              />
              <span
                className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p
              className={`text-sm mt-2 ${
                passwordStrength === 'Weak'
                  ? 'text-red-500'
                  : passwordStrength === 'Medium'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              Password strength: {passwordStrength}
            </p>
            <div className='w-full bg-gray-200 h-2 rounded-full mt-2'>
              <div
                className={`${getPasswordStrengthColor()} h-2 rounded-full`}
                style={{
                  width:
                    passwordStrength === 'Weak'
                      ? '33%'
                      : passwordStrength === 'Medium'
                      ? '66%'
                      : '100%',
                }}
              ></div>
            </div>
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
