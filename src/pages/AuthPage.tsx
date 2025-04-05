
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/Auth/LoginForm';
import { SignupForm } from '@/components/Auth/SignupForm';
import { ListTodo } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <ListTodo className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">TaskKeeper</h1>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={() => {}} />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    className="text-blue-500 hover:underline focus:outline-none"
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSuccess={() => {}} />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    className="text-blue-500 hover:underline focus:outline-none"
                    onClick={() => setActiveTab('login')}
                  >
                    Log in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Demo credentials: user@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
