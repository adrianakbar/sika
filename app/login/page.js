'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi proses login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Login attempt:', formData);
    setIsLoading(false);
    
    // Di sini Anda bisa menambahkan logika autentikasi
    alert('Login berhasil!');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sisi Kiri - Gambar Perusahaan */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />
        <Image
          src="/images/pertamina-office.jpg"
          alt="Pertamina Office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-8 left-8 z-20 text-white">
          <div className="flex items-center mb-4">
            <Image
              src="/images/pertamina-logo.png"
              alt="Pertamina Logo"
              width={60}
              height={60}
              className="mr-3"
            />
            <h1 className="text-3xl font-bold">SIKA</h1>
          </div>
          <p className="text-lg opacity-90">
            Sistem Informasi Keselamatan & Kesehatan Kerja
          </p>
          <p className="text-sm opacity-75 mt-2">
            PT Pertamina (Persero)
          </p>
        </div>
      </div>

      {/* Sisi Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo untuk mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/images/pertamina-logo.png"
                alt="Pertamina Logo"
                width={50}
                height={50}
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-quaternary">SIKA</h1>
            </div>
            <p className="text-gray-600 text-sm">
              Sistem Informasi Keselamatan & Kesehatan Kerja
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-quaternary mb-2">
              Selamat Datang
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Silakan masuk ke akun Anda
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="Masukkan username Anda"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors pr-12"
                    placeholder="Masukkan password Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                </label>
                <a href="#" className="text-sm text-primary hover:text-primary/80">
                  Lupa password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  Hubungi Administrator
                </a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2025 PT Pertamina (Persero). All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}