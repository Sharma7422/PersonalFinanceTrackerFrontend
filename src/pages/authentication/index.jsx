import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

export const Auth = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
                <SignedOut>
                    <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
                    <div className="space-y-3">
                        <SignUpButton mode="modal">
                            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                Sign Up
                            </button>
                        </SignUpButton>
                        <SignInButton mode="modal">
                            <button className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    );
};
