"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "../components/Input";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "", // Changed from username to email
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Gunakan API yang proper untuk authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Simpan user data ke localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sisi Kiri - Gambar Perusahaan */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />
        <Image
          src="/images/pertamina-office.jpeg"
          alt="Pertamina Office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-8 left-8 z-20 text-white">
          <div className="flex items-center mb-4">
            <Image
              src="/images/pertamina-logo.png"
              alt="Pertamina Logo"
              width={150}
              height={150}
              className="mr-3"
            />
          </div>
        </div>
      </div>

      {/* Sisi Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-12 py-12 bg-white">
        <div className="w-full max-w-lg">
          {/* Logo untuk mobile */}
          <div className="lg:hidden text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/images/pertamina-logo.png"
                alt="Pertamina Logo"
                width={60}
                height={60}
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-quaternary">SIKA</h1>
            </div>
            <p className="text-gray-600 text-sm">Sistem Izin Kerja Selamat</p>
          </div>

          {/* Header untuk desktop */}
          <div className="hidden lg:block text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/images/pertamina-logo.png"
                alt="Pertamina Logo"
                width={50}
                height={50}
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-quaternary">SIKA</h1>
            </div>
            <p className="text-gray-600 text-lg mb-2">Sistem Izin Kerja Selamat</p>
            <p className="text-gray-500 text-sm">PT Pertamina Hulu Energi West Madura Offshore</p>
          </div>

          {/* Header Welcome */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Selamat Datang
            </h2>
            <p className="text-gray-600 text-lg">
              Silakan masuk ke akun Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              required
            />

            {/* Password Field */}
            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary/20"
                />
                <span className="ml-3 text-gray-600 font-medium">
                  Ingat saya
                </span>
              </label>
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="medium"
              isLoading={isLoading}
              className="w-full"
            >
              Masuk
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-600">
              Belum punya akun?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Hubungi Administrator
              </a>
            </p>
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
