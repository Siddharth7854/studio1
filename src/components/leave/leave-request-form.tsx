
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_LEAVE_TYPES } from '@/lib/mock-data';
import type { LeaveType } from '@/types';
import { cn } from '@/lib/utils';
import { CalendarIcon, Send, Loader2 } from 'lucide-react';
import { format, differenceInDays, isBefore, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth'; 
import { useLeave } from '@/contexts/leave-context'; 

const leaveRequestSchema = z.object({
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason must be at most 500 characters"),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
})
.refine(data => differenceInDays(data.endDate, data.startDate) >= 0, { 
  message: "Leave duration must be at least one day (select same start/end for one day)",
  path: ["endDate"],
})
.refine(data => !isBefore(startOfDay(data.startDate), startOfDay(new Date())), {
  message: "Start date cannot be in the past",
  path: ["startDate"],
});

type LeaveRequestFormInputs = z.infer<typeof leaveRequestSchema>;

const LeaveRequestForm: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); 
  const { submitLeaveRequest } = useLeave(); 

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<LeaveRequestFormInputs>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      reason: "",
      startDate: undefined,
      endDate: undefined,
      leaveTypeId: "",
    }
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    setLeaveTypes(MOCK_LEAVE_TYPES);
  }, []);
  
  const processSubmit: SubmitHandler<LeaveRequestFormInputs> = async (data) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to submit a request.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    const selectedLeaveType = leaveTypes.find(lt => lt.id === data.leaveTypeId);
    if (!selectedLeaveType) {
        toast({ title: "Error", description: "Invalid leave type selected.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const requestData = {
        leaveTypeId: data.leaveTypeId,
        leaveTypeName: selectedLeaveType.name,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
    };

    const result = await submitLeaveRequest(requestData);

    if (result.success) {
        toast({
        title: "Leave Request Submitted!",
        description: result.message,
        duration: 5000,
        });
        reset(); 
    } else {
        toast({
            title: "Submission Failed",
            description: result.message,
            variant: "destructive"
        });
    }
    setIsSubmitting(false);
  };

  const calculateDuration = () => {
    if (startDate && endDate && endDate >= startDate) {
      return differenceInDays(endDate, startDate) + 1;
    }
    return 0;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <CalendarIcon className="h-7 w-7 text-primary" />
          Request Leave
        </CardTitle>
        <CardDescription>Fill out the form below to submit your leave request.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="leaveTypeId">Leave Type</Label>
              <Controller
                name="leaveTypeId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""} >
                    <SelectTrigger id="leaveTypeId" className={cn(errors.leaveTypeId && "border-destructive")}>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.leaveTypeId && <p className="text-sm text-destructive mt-1">{errors.leaveTypeId.message}</p>}
            </div>
             <div>
                <Label>Duration</Label>
                <Input value={`${calculateDuration()} day(s)`} readOnly className="bg-muted" />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.startDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.endDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => startDate && isBefore(startOfDay(date), startOfDay(startDate))}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="reason"
                  placeholder="Briefly explain the reason for your leave..."
                  {...field}
                  className={cn("min-h-[100px]", errors.reason && "border-destructive")}
                />
              )}
            />
            {errors.reason && <p className="text-sm text-destructive mt-1">{errors.reason.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" variant="default" disabled={isSubmitting || Object.keys(errors).length > 0} className="px-8 py-3 text-base">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeaveRequestForm;
