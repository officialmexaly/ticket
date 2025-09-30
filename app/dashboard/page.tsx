"use client"

import React from 'react';
import AuthGuard from '../../components/AuthGuard';
import ModernLayout from '../../components/ModernLayout';

const DashboardPage = () => {
  return (
    <AuthGuard>
      <ModernLayout />
    </AuthGuard>
  );
};

export default DashboardPage;