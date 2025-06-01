
"use client";

import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2, Briefcase } from 'lucide-react';
import type { User } from '@/types';

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(2, "Designation is required"),
  profilePhotoUrl: z.string().url("Must be a valid URL (e.g., https://placehold.co/100x100.png)").optional().or(z.literal('')),
  isAdmin: z.boolean().default(false),
});

type CreateEmployeeFormInputs = z.infer<typeof createEmployeeSchema>;

const CreateEmployeeForm: React.FC = () => {
  const { addUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<CreateEmployeeFormInputs>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      employeeId: '',
      name: '',
      email: '',
      password: '',
      designation: '',
      profilePhotoUrl: '',
      isAdmin: false,
    }
  });

  const onSubmit: SubmitHandler<CreateEmployeeFormInputs> = async (data) => {
    setIsSubmitting(true);
    
    const newUser: User = {
      id: '', // Will be set by addUser context function
      employeeId: data.employeeId,
      name: data.name,
      email: data.email || undefined,
      password: data.password, // Password will be handled by AuthContext
      designation: data.designation,
      profilePhotoUrl: data.profilePhotoUrl || `https://placehold.co/100x100.png?text=${data.name.substring(0,2).toUpperCase()}`,
      isAdmin: data.isAdmin,
    };

    const result = await addUser(newUser);

    if (result.success) {
      toast({
        title: "Employee Created",
        description: result.message,
      });
      reset(); // Reset form fields
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <UserPlus className="h-7 w-7 text-primary" />
          Create New Employee
        </CardTitle>
        <CardDescription>Fill in the details to add a new employee to the system.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input id="employeeId" {...register('employeeId')} className={errors.employeeId ? 'border-destructive' : ''} />
              {errors.employeeId && <p className="text-sm text-destructive mt-1">{errors.employeeId.message}</p>}
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-destructive' : ''} />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" {...register('designation')} className={errors.designation ? 'border-destructive' : ''} />
              {errors.designation && <p className="text-sm text-destructive mt-1">{errors.designation.message}</p>}
            </div>
             <div>
              <Label htmlFor="profilePhotoUrl">Profile Photo URL (Optional)</Label>
              <Input id="profilePhotoUrl" placeholder="e.g., https://placehold.co/100x100.png" {...register('profilePhotoUrl')} className={errors.profilePhotoUrl ? 'border-destructive' : ''} />
              {errors.profilePhotoUrl && <p className="text-sm text-destructive mt-1">{errors.profilePhotoUrl.message}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
                name="isAdmin"
                control={control}
                render={({ field }) => (
                    <input 
                        id="isAdmin"
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                )}
            />
            <Label htmlFor="isAdmin" className="text-sm font-medium">
                Make this user an Admin?
            </Label>
          </div>


        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="px-8 py-3 text-base">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
            {isSubmitting ? 'Creating Employee...' : 'Create Employee'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateEmployeeForm;
