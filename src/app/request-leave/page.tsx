
"use client";

import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import LeaveRequestForm from '@/components/leave/leave-request-form';

export default function RequestLeavePage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <LeaveRequestForm />
      </div>
    </AppLayout>
  );
}
