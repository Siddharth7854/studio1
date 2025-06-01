
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, Save } from 'lucide-react';
import type { User } from '@/types';

const passwordSettingsSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type PasswordSettingsFormInputs = z.infer<typeof passwordSettingsSchema>;

const SettingsForm: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, reset, formState: { errors, isDirty } } = useForm<PasswordSettingsFormInputs>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    }
  });

  if (!user) return <p className="text-muted-foreground">Loading user data...</p>;

  const onSubmit: SubmitHandler<PasswordSettingsFormInputs> = async (data) => {
    setIsSubmitting(true);

    const updatePayload: Partial<User> = {
      password: data.newPassword,
    };
    
    const result = await updateUser(user.id, updatePayload);

    if (result.success) {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      reset(); // Clear form fields
    } else {
      toast({
        title: "Update Failed",
        description: result.message || "Could not update password.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="border-t pt-6 space-y-6">
        <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-muted-foreground"/>
            <h3 className="text-lg font-medium text-foreground">Change Password</h3>
        </div>
         <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              type="password" 
              {...register('newPassword')} 
              className={errors.newPassword ? 'border-destructive' : ''} 
              placeholder="Enter your new password"
            />
            {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input 
              id="confirmNewPassword" 
              type="password" 
              {...register('confirmNewPassword')} 
              className={errors.confirmNewPassword ? 'border-destructive' : ''} 
              placeholder="Confirm your new password"
            />
            {errors.confirmNewPassword && <p className="text-sm text-destructive mt-1">{errors.confirmNewPassword.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting || !isDirty} className="px-8 py-3 text-base">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSubmitting ? 'Updating Password...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
