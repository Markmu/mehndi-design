'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginDialogProps {
  trigger: React.ReactNode;
}

const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleGoogleLogin = () => {
    signIn('google');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Login with Google Account
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <Button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center space-x-2 w-full"
          >
            <FcGoogle className="text-xl mr-2" />
            <span>Login</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;