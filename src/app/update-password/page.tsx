"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const updatePasswordSchema = z.object({
  password: z.string().min(6, 'New password must be at least 6 characters'),
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    setIsMounted(true);
    // This effect handles the session recovery from the password reset link.
    // Supabase client automatically handles the token from the URL fragment.
  }, []);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password: data.password });

    setIsLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: `Failed to update password: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your password has been updated. You will be redirected to the homepage.",
      });
      setTimeout(() => router.push('/'), 3000);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#141414] text-[#F8F4EB] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Update Your Password</h1>
          <p className="text-[#F8F4EB]/80">Enter a new password below.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Enter new password"
              {...register('password')}
              className="bg-[#1E1E1E] border-[#9747FF]/20"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="default"
            className="w-full bg-[#9747FF] hover:bg-[#9747FF]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 