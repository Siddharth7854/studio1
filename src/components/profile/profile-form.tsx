
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import type { User } from '@/types';

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  profilePhotoUrl: z.string().url("Must be a valid URL (e.g., https://placehold.co/100x100.png)").optional().or(z.literal('')),
});

type ProfileFormInputs = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, reset, formState: { errors, isDirty } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      profilePhotoUrl: '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        profilePhotoUrl: user.profilePhotoUrl || '',
      });
    }
  }, [user, reset]);

  if (!user) return <p className="text-muted-foreground">Loading user data...</p>;

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    setIsSubmitting(true);

    const updatePayload: Partial<User> = {
      name: data.name,
      email: data.email || undefined,
      profilePhotoUrl: data.profilePhotoUrl || undefined,
    };
    
    const result = await updateUser(user.id, updatePayload);

    if (result.success) {
      toast({
        title: "Profile Updated",
        description: result.message,
      });
      if (result.updatedUser) {
         reset({ // Reset form with fresh data from context, including new photo URL
            name: result.updatedUser.name || '',
            email: result.updatedUser.email || '',
            profilePhotoUrl: result.updatedUser.profilePhotoUrl || '',
        });
      } else {
         reset(data); // Fallback to re-setting with submitted data if context update is delayed
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

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting || !isDirty} className="px-8 py-3 text-base">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
