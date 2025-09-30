import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Employee {
  id: string;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone?: string;
  department_id?: string;
  position_id?: string;
  manager_id?: string;
  hire_date: string;
  employment_status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary?: number;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  head_id?: string;
  created_at: string;
}

export interface Position {
  id: string;
  title: string;
  department_id?: string;
  level?: string;
  description?: string;
  created_at: string;
}

class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  async getActiveEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true)
        .eq('employment_status', 'active')
        .order('display_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active employees:', error);
      return [];
    }
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  }

  async getAllDepartments(): Promise<Department[]> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

  async getAllPositions(): Promise<Position[]> {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  getEmployeeInitials(employee: Employee): string {
    return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();
  }

  getEmployeeDisplayName(employee: Employee): string {
    return employee.display_name || `${employee.first_name} ${employee.last_name}`;
  }

  async updateTaskAssignment(taskId: string, employeeId: string | null, taskType: 'epic' | 'feature' | 'task' | 'subtask'): Promise<boolean> {
    try {
      const tableName = taskType === 'epic' ? 'epics' :
                       taskType === 'feature' ? 'features' :
                       taskType === 'task' ? 'tasks' : 'sub_tasks';

      const columnName = taskType === 'epic' ? 'epic_owner_id' :
                        taskType === 'feature' ? 'feature_owner_id' : 'assigned_to_id';

      const { error } = await supabase
        .from(tableName)
        .update({ [columnName]: employeeId })
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating task assignment:', error);
      return false;
    }
  }
}

export const employeeService = new EmployeeService();
export default employeeService;