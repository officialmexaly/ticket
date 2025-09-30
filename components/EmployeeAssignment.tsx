'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { UserPlus, UserMinus } from 'lucide-react';
import { employeeService, Employee } from '@/lib/employeeService';
import { toast } from 'sonner';

interface EmployeeAssignmentProps {
  assignedEmployeeId?: string | null;
  taskId: string;
  taskType: 'epic' | 'feature' | 'task' | 'subtask';
  onAssignmentChange?: (employeeId: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const EmployeeAssignment: React.FC<EmployeeAssignmentProps> = ({
  assignedEmployeeId,
  taskId,
  taskType,
  onAssignmentChange,
  size = 'md',
  showName = false
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (assignedEmployeeId) {
      loadAssignedEmployee(assignedEmployeeId);
    } else {
      setAssignedEmployee(null);
    }
  }, [assignedEmployeeId]);

  const loadEmployees = async () => {
    const data = await employeeService.getActiveEmployees();
    setEmployees(data);
  };

  const loadAssignedEmployee = async (employeeId: string) => {
    const employee = await employeeService.getEmployeeById(employeeId);
    setAssignedEmployee(employee);
  };

  const handleAssign = async (employeeId: string | null) => {
    setLoading(true);
    try {
      const success = await employeeService.updateTaskAssignment(taskId, employeeId, taskType);

      if (success) {
        if (employeeId) {
          const employee = await employeeService.getEmployeeById(employeeId);
          setAssignedEmployee(employee);
        } else {
          setAssignedEmployee(null);
        }

        onAssignmentChange?.(employeeId);
        toast.success(employeeId ? 'Employee assigned successfully' : 'Assignment removed successfully');
      } else {
        toast.error('Failed to update assignment');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarSize = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-10 h-10';
      default: return 'w-8 h-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-sm';
      default: return 'text-xs';
    }
  };

  if (assignedEmployee) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent"
              disabled={loading}
            >
              <Avatar className={`${getAvatarSize()} cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all`}>
                <AvatarImage src={assignedEmployee.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                  {employeeService.getEmployeeInitials(assignedEmployee)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={assignedEmployee.avatar_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {employeeService.getEmployeeInitials(assignedEmployee)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{employeeService.getEmployeeDisplayName(assignedEmployee)}</div>
                  <div className="text-xs text-gray-500">{assignedEmployee.employee_id}</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAssign(null)}
              className="text-red-600 focus:text-red-600"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove Assignment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-gray-500">
              Reassign to:
            </DropdownMenuLabel>
            {employees
              .filter(emp => emp.id !== assignedEmployee.id)
              .slice(0, 5)
              .map(employee => (
                <DropdownMenuItem
                  key={employee.id}
                  onClick={() => handleAssign(employee.id)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={employee.avatar_url} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {employeeService.getEmployeeInitials(employee)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{employeeService.getEmployeeDisplayName(employee)}</div>
                      <div className="text-xs text-gray-500">{employee.employee_id}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showName && (
          <div className="flex flex-col">
            <span className={`font-medium text-slate-700 ${getTextSize()}`}>
              {employeeService.getEmployeeDisplayName(assignedEmployee)}
            </span>
            <span className="text-xs text-slate-500">{assignedEmployee.employee_id}</span>
          </div>
        )}
      </div>
    );
  }

  // Unassigned state
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 h-auto hover:bg-transparent"
          disabled={loading}
        >
          <div className={`${getAvatarSize()} rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all`}>
            <UserPlus className="w-3 h-3 text-gray-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Assign to:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {employees.map(employee => (
          <DropdownMenuItem
            key={employee.id}
            onClick={() => handleAssign(employee.id)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={employee.avatar_url} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                  {employeeService.getEmployeeInitials(employee)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm">{employeeService.getEmployeeDisplayName(employee)}</div>
                <div className="text-xs text-gray-500">{employee.employee_id}</div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        {employees.length === 0 && (
          <DropdownMenuItem disabled>
            <span className="text-gray-500">No employees available</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmployeeAssignment;