
"use client";

import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function CompanyPoliciesPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Company Leave Policies
            </CardTitle>
            <CardDescription>General guidelines and policies regarding employee leaves at BUIDCO.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">General Leave Policy</h3>
              <p className="text-muted-foreground">
                BUIDCO is committed to providing employees with adequate time off for rest, relaxation, and personal needs. 
                All leave requests must be submitted through the CLMS portal for approval by the respective reporting manager or HR department.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Types of Leave</h3>
              <ul className="list-none space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                  <span>
                    <strong>Casual Leave:</strong> Granted for short-term personal exigencies. Refer to your leave balance for annual entitlement.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                  <span>
                    <strong>Sick Leave:</strong> For periods of illness. A medical certificate may be required for absences exceeding 2 consecutive days.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                  <span>
                    <strong>Annual Leave (Earned Leave):</strong> For longer vacations, accrued based on service period. Must be planned and approved in advance.
                  </span>
                </li>
                 <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                  <span>
                    <strong>Unpaid Leave:</strong> May be granted under special circumstances at the discretion of management.
                  </span>
                </li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Leave Application Process</h3>
              <p className="text-muted-foreground">
                Employees are encouraged to apply for leave as far in advance as possible. 
                In case of emergencies, the system allows for post-facto application, subject to manager approval.
                All approvals are at the discretion of the management and subject to business requirements.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Contact</h3>
              <p className="text-muted-foreground">
                For any clarifications regarding leave policies, please contact the HR department at <a href="mailto:hr@buidco.example.com" className="text-primary underline">hr@buidco.example.com</a>.
              </p>
            </section>
             <p className="text-xs text-muted-foreground pt-4 border-t">
              Note: This is a general overview. For detailed policies, please refer to the official BUIDCO Employee Handbook.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
