
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, UserCircle, KeyRound } from 'lucide-react';
import type { User } from '@/types';

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  profilePhotoUrl: z.string().url("Must be a valid URL (e.g., https://placehold.co/100x100.png)").optional().or(z.literal('')),
}).refine(data => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormInputs = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const { user, updateUser, login } = useAuth(); // Added login to potentially re-auth if needed
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, register, reset, formState: { errors, isDirty } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      profilePhotoUrl: '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        profilePhotoUrl: user.profilePhotoUrl || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  if (!user) return <p>Loading user data...</p>;

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    setIsSubmitting(true);

    const updatePayload: Partial<User> = {
      name: data.name,
      email: data.email || undefined, // Store undefined if empty, not ''
      profilePhotoUrl: data.profilePhotoUrl || undefined, // Store undefined if empty
    };

    let passwordChanged = false;
    if (data.password) {
      if (data.password !== data.confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      updatePayload.password = data.password;
      passwordChanged = true;
    }
    
    const result = await updateUser(user.id, updatePayload);

    if (result.success) {
      toast({
        title: "Profile Updated",
        description: result.message,
      });
      // If password was changed, it's good practice to re-authenticate or inform user
      // For this version, we'll rely on the context update.
      // To refresh user data shown in form immediately, including potentially new photo URL from context:
      if (result.updatedUser) {
         reset({
            name: result.updatedUser.name || '',
            email: result.updatedUser.email || '',
            profilePhotoUrl: result.updatedUser.profilePhotoUrl || '',
            password: '', // Clear password fields
            confirmPassword: '',
        });
      } else {
         reset({ ...data, password: '', confirmPassword: ''}); // Clear password fields
      }

    } else {
      toast({
        title: "Update Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input id="employeeId" value={user.employeeId} readOnly className="bg-muted cursor-not-allowed" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="designation">Designation</Label>
        <Input id="designation" value={user.designation || 'N/A'} readOnly className="bg-muted cursor-not-allowed" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profilePhotoUrl">Profile Photo URL (Optional)</Label>
        <Input id="profilePhotoUrl" placeholder="e.g., https://placehold.co/100x100.png" {...register('profilePhotoUrl')} className={errors.profilePhotoUrl ? 'border-destructive' : ''} />
        {errors.profilePhotoUrl && <p className="text-sm text-destructive mt-1">{errors.profilePhotoUrl.message}</p>}
      </div>

      <div className="border-t pt-6 space-y-6">
        <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-muted-foreground"/>
            <h3 className="text-lg font-medium">Change Password (Optional)</h3>
        </div>
         <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-destructive' : ''} placeholder="Leave blank to keep current password"/>
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-destructive' : ''} />
            {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty} className="px-8 py-3 text-base">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
