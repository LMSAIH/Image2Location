import { FormEvent } from "react"
import { useState } from 'react'
import axios from "axios";


export default function Signup() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState<boolean>(false);

    const handleClick = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/signup', {
                email: email,
                password: password
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setError(null);
                setEmailSent(true);
            }

        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#111111] border border-[#222222] rounded-xl shadow-2xl">
                <div className="p-8">
                    <div className="space-y-2 mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
                        <p className="text-sm text-gray-400">Get started with AI Image Visualizer</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleClick}>


                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] text-white placeholder-gray-500 transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] text-white placeholder-gray-500 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-medium rounded-lg transition-colors duration-200 ease-in-out"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#333333]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#111111] px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] rounded-lg text-white transition-colors duration-200 ease-in-out"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign up with Google
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <a href="/login" className="text-[#2dd4bf] hover:underline">
                            Sign in
                        </a>
                    </p>

                    {error && <p className="text-center text-md mt-5 mb-2 bg-red-500 rounded-md p-2 text-white border-2 border-red-600">{error}</p>}
                    {emailSent && <p className="text-center text-md mt-5 mb-2 bg-green-700 rounded-md p-2 text-white border-2 border-green-400">An email has been sent to your inbox, please check it in order to log in</p>}
                </div>
            </div>
        </div>
    )
}

