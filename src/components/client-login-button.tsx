'use client';

import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import LoginDialog from './login-dialog';

interface ClientLoginButtonProps {
  session: Session | null;
}

const ClientLoginButton = ({ session }: ClientLoginButtonProps) => {
  return session ? (
    <div className="flex items-center space-x-4">
      <span className="text-[#7E4E3B]">{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        className="text-base font-medium text-[#7E4E3B] hover:text-[#6D3D2A]"
      >
        Log out
      </button>
    </div>
  ) : (
    <LoginDialog 
      trigger={
        <button className="text-base font-medium text-[#2D1810] hover:text-[#7E4E3B]">
          Login
        </button>
      } 
    />
  );
};

export default ClientLoginButton;