'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusConfig {
  label: string;
  color: string;
  textColor: string;
  icon?: LucideIcon;
}

interface StatusConfigs {
  [key: string]: StatusConfig;
}

interface StatusBadgeProps {
  status: string;
  statusConfigs: StatusConfigs;
  showIcon?: boolean;
  className?: string;
}

export const defaultStatusConfigs: StatusConfigs = {
  open: {
    label: 'Open',
    color: 'bg-red-100',
    textColor: 'text-red-800'
  },
  replied: {
    label: 'Replied',
    color: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  active: {
    label: 'Active',
    color: 'bg-green-100',
    textColor: 'text-green-800'
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  }
};

export const priorityStatusConfigs: StatusConfigs = {
  high: {
    label: 'High',
    color: 'bg-red-100',
    textColor: 'text-red-800'
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  low: {
    label: 'Low',
    color: 'bg-green-100',
    textColor: 'text-green-800'
  }
};

export const typeStatusConfigs: StatusConfigs = {
  question: {
    label: 'Question',
    color: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  incident: {
    label: 'Incident',
    color: 'bg-red-100',
    textColor: 'text-red-800'
  },
  problem: {
    label: 'Problem',
    color: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  'feature request': {
    label: 'Feature Request',
    color: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  unspecified: {
    label: 'Unspecified',
    color: 'bg-gray-100',
    textColor: 'text-gray-800'
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusConfigs,
  showIcon = false,
  className = ''
}) => {
  const config = statusConfigs[status.toLowerCase()] || {
    label: status,
    color: 'bg-gray-100',
    textColor: 'text-gray-800'
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor} ${className}`}>
      {showIcon && Icon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;