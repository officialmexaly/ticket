'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Home,
  Ticket,
  Building2,
  Users,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Shield,
  HelpCircle,
  Phone,
  ChevronDown,
  ChevronRight,
  User,
  Briefcase,
  Clock,
  Award,
  UserPlus,
  Layers,
  Zap,
  Search,
  UserCheck,
  Handshake,
  GripVertical,
  Folder,
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DraggableSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobile?: boolean;
  editMode?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string; // Store icon name instead of React element
  view: string;
  badge?: string;
  children?: MenuItem[];
  parentId?: string;
  order?: number;
  isGroup?: boolean;
  isEditing?: boolean;
}

const DraggableSidebar: React.FC<DraggableSidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  currentView,
  setCurrentView,
  isMobile = false,
  editMode = false
}) => {
  const { user, signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'hr', 'talent-hunt', 'acquisition', 'project-management']);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [showGroupCreator, setShowGroupCreator] = useState(false);

  // Icon mapping function
  const getIcon = (iconName: string, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    switch (iconName) {
      case 'Home': return <Home className={sizeClass} />;
      case 'Ticket': return <Ticket className={sizeClass} />;
      case 'FileText': return <FileText className={sizeClass} />;
      case 'User': return <User className={sizeClass} />;
      case 'Zap': return <Zap className={sizeClass} />;
      case 'Target': return <Target className={sizeClass} />;
      case 'Layers': return <Layers className={sizeClass} />;
      case 'Building2': return <Building2 className={sizeClass} />;
      case 'CheckSquare': return <CheckSquare className={sizeClass} />;
      case 'Calendar': return <Calendar className={sizeClass} />;
      case 'Users': return <Users className={sizeClass} />;
      case 'Briefcase': return <Briefcase className={sizeClass} />;
      case 'Clock': return <Clock className={sizeClass} />;
      case 'Search': return <Search className={sizeClass} />;
      case 'UserPlus': return <UserPlus className={sizeClass} />;
      case 'UserCheck': return <UserCheck className={sizeClass} />;
      case 'Award': return <Award className={sizeClass} />;
      case 'Handshake': return <Handshake className={sizeClass} />;
      case 'BarChart3': return <BarChart3 className={sizeClass} />;
      case 'Shield': return <Shield className={sizeClass} />;
      case 'Settings': return <Settings className={sizeClass} />;
      case 'HelpCircle': return <HelpCircle className={sizeClass} />;
      case 'Phone': return <Phone className={sizeClass} />;
      case 'Folder': return <Folder className={sizeClass} />;
      case 'FolderOpen': return <FolderOpen className={sizeClass} />;
      default: return <Folder className={sizeClass} />;
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Load saved menu structure from localStorage
  useEffect(() => {
    const MENU_VERSION = '2.0'; // Increment this when structure changes
    const savedMenuItems = localStorage.getItem('sidebarMenuItems');
    const savedVersion = localStorage.getItem('sidebarMenuVersion');

    if (savedMenuItems && savedVersion === MENU_VERSION) {
      try {
        setMenuItems(JSON.parse(savedMenuItems));
      } catch (error) {
        console.error('Error parsing saved menu items:', error);
        setMenuItems(getDefaultMenuItems());
        localStorage.setItem('sidebarMenuVersion', MENU_VERSION);
      }
    } else {
      // Reset to new structure
      setMenuItems(getDefaultMenuItems());
      localStorage.setItem('sidebarMenuVersion', MENU_VERSION);
      localStorage.removeItem('sidebarMenuItems'); // Will be set by the save effect
    }
  }, []);

  // Save menu structure to localStorage
  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('sidebarMenuItems', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  const getDefaultMenuItems = (): MenuItem[] => {
    return [
      {
        id: 'home',
        label: 'Home',
        icon: 'Home',
        view: 'home'
      },
      {
        id: 'tickets',
        label: 'Ticket System',
        icon: 'Ticket',
        view: 'tickets',
        isGroup: true,
        children: [
          { id: 'all-tickets', label: 'All Tickets', icon: 'FileText', view: 'list' },
          { id: 'my-tickets', label: 'My Tickets', icon: 'User', view: 'my-tickets' },
          { id: 'create-ticket', label: 'Create Ticket', icon: 'Zap', view: 'create-ticket' }
        ]
      },
      {
        id: 'project-management',
        label: 'Project Management',
        icon: 'Target',
        view: 'projects',
        isGroup: true,
        children: [
          { id: 'professional-agile', label: 'Agile Workspace', icon: 'Layers', view: 'professional-agile' },
          { id: 'projects', label: 'Projects', icon: 'Building2', view: 'projects' },
          { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', view: 'tasks' },
          { id: 'sprints', label: 'Sprints', icon: 'Calendar', view: 'sprints' }
        ]
      },
      {
        id: 'hr',
        label: 'HR Management',
        icon: 'Users',
        view: 'hr',
        isGroup: true,
        children: [
          { id: 'employees', label: 'Employees', icon: 'User', view: 'hr-employees' },
          { id: 'departments', label: 'Departments', icon: 'Building2', view: 'hr-departments' },
          { id: 'positions', label: 'Positions', icon: 'Briefcase', view: 'hr-positions' },
          { id: 'time-off', label: 'Time Off', icon: 'Clock', view: 'hr-timeoff' },
          {
            id: 'talent-hunt',
            label: 'Talent Hunt',
            icon: 'Search',
            view: 'hr-talent-hunt',
            children: [
              { id: 'recruitment', label: 'Recruitment', icon: 'UserPlus', view: 'hr-recruitment' }
            ]
          },
          {
            id: 'acquisition',
            label: 'Acquisition',
            icon: 'UserCheck',
            view: 'hr-acquisition',
            children: [
              { id: 'performance', label: 'Performance', icon: 'Award', view: 'hr-performance' }
            ]
          },
          { id: 'outsourcing', label: 'Outsourcing', icon: 'Handshake', view: 'hr-outsourcing' }
        ]
      },
      {
        id: 'analytics',
        label: 'Analytics & Reports',
        icon: 'BarChart3',
        view: 'analytics',
        isGroup: true,
        children: [
          { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', view: 'analytics-dashboard' },
          { id: 'reports', label: 'Reports', icon: 'FileText', view: 'reports' },
          { id: 'insights', label: 'Insights', icon: 'Zap', view: 'insights' }
        ]
      },
      {
        id: 'administration',
        label: 'Administration',
        icon: 'Shield',
        view: 'admin',
        isGroup: true,
        children: [
          { id: 'users', label: 'Users', icon: 'Users', view: 'users' },
          { id: 'settings', label: 'Settings', icon: 'Settings', view: 'settings' },
          { id: 'security', label: 'Security', icon: 'Shield', view: 'security' }
        ]
      }
    ];
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !editMode) return;

    const { source, destination } = result;
    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    if (sourceDroppableId === destinationDroppableId && source.index === destination.index) {
      return;
    }

    // Create a copy of menu items
    const newMenuItems = [...menuItems];

    // Handle different drop scenarios
    if (sourceDroppableId === 'sidebar-main') {
      // Dragging from main menu
      const [draggedItem] = newMenuItems.splice(source.index, 1);

      if (destinationDroppableId === 'sidebar-main') {
        // Reordering in main menu
        newMenuItems.splice(destination.index, 0, draggedItem);
      } else if (destinationDroppableId.startsWith('group-')) {
        // Dropping into a group
        const groupId = destinationDroppableId.replace('group-', '');
        const groupIndex = newMenuItems.findIndex(item => item.id === groupId);

        if (groupIndex !== -1) {
          if (!newMenuItems[groupIndex].children) {
            newMenuItems[groupIndex].children = [];
          }
          draggedItem.parentId = groupId;
          newMenuItems[groupIndex].children!.splice(destination.index, 0, draggedItem);
        }
      }
    } else if (sourceDroppableId.startsWith('group-')) {
      // Dragging from a group
      const sourceGroupId = sourceDroppableId.replace('group-', '');
      const sourceGroupIndex = newMenuItems.findIndex(item => item.id === sourceGroupId);

      if (sourceGroupIndex !== -1 && newMenuItems[sourceGroupIndex].children) {
        const [draggedItem] = newMenuItems[sourceGroupIndex].children!.splice(source.index, 1);

        if (destinationDroppableId === 'sidebar-main') {
          // Moving to main menu
          delete draggedItem.parentId;
          newMenuItems.splice(destination.index, 0, draggedItem);
        } else if (destinationDroppableId.startsWith('group-')) {
          // Moving to another group
          const destGroupId = destinationDroppableId.replace('group-', '');
          const destGroupIndex = newMenuItems.findIndex(item => item.id === destGroupId);

          if (destGroupIndex !== -1) {
            if (!newMenuItems[destGroupIndex].children) {
              newMenuItems[destGroupIndex].children = [];
            }
            draggedItem.parentId = destGroupId;
            newMenuItems[destGroupIndex].children!.splice(destination.index, 0, draggedItem);
          }
        }
      }
    }

    setMenuItems(newMenuItems);
    setDraggedOver(null);
  };

  const createNewGroup = () => {
    const newGroup: MenuItem = {
      id: `group-${Date.now()}`,
      label: 'New Group',
      icon: 'Folder',
      view: '',
      isGroup: true,
      children: []
    };

    setMenuItems(prev => [...prev, newGroup]);
    setShowGroupCreator(false);
  };


  const deleteItem = (itemId: string) => {
    setMenuItems(prev => {
      const newItems = [...prev];
      const removeItem = (items: MenuItem[]): MenuItem[] => {
        return items.filter(item => {
          if (item.id === itemId) {
            return false;
          }
          if (item.children) {
            item.children = removeItem(item.children);
          }
          return true;
        });
      };
      return removeItem(newItems);
    });
  };

  const resetToDefault = () => {
    if (confirm('Reset sidebar to default layout? This will remove all custom groups and organization.')) {
      setMenuItems(getDefaultMenuItems());
      localStorage.removeItem('sidebarMenuItems');
    }
  };

  const renderMenuItem = (item: MenuItem, index: number, isChild = false, parentId?: string) => {
    const isActive = currentView === item.view;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);
    const droppableId = isChild ? `group-${parentId}` : 'sidebar-main';

    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group ${snapshot.isDragging ? 'opacity-75' : ''}`}
          >
            <div
              className={`
                group/item relative flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl cursor-pointer
                transition-all duration-300 ease-out
                ${isChild
                  ? 'ml-6 text-sm bg-gradient-to-r from-transparent to-transparent hover:from-sidebar-accent/30 hover:to-transparent'
                  : 'text-sm font-medium bg-gradient-to-r from-transparent to-transparent hover:from-sidebar-accent/40 hover:to-transparent'
                }
                ${isActive
                  ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-primary border-l-3 border-primary shadow-lg shadow-primary/10'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:shadow-md hover:shadow-sidebar-accent/20'
                }
                ${draggedOver === item.id ? 'bg-gradient-to-r from-primary/20 to-primary/10 shadow-lg shadow-primary/20 scale-105' : ''}
                hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {/* Drag Handle */}
              {!sidebarCollapsed && editMode && (
                <div
                  {...provided.dragHandleProps}
                  className="opacity-0 group-hover:opacity-60 group-hover:group/item:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110"
                >
                  <GripVertical className="w-4 h-4 text-sidebar-foreground/40 hover:text-sidebar-foreground/60" />
                </div>
              )}

              {/* Icon */}
              <div className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-current'} ${isChild ? 'ml-2' : ''}`}>
                {item.isGroup && isExpanded ? (
                  <FolderOpen className={`${isChild ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-300`} />
                ) : item.isGroup ? (
                  <Folder className={`${isChild ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-300`} />
                ) : (
                  getIcon(item.icon, isChild ? 'sm' : 'md')
                )}
              </div>

              {!sidebarCollapsed && (
                <>
                  {/* Label */}
                  <span
                    className="flex-1 font-medium tracking-wide"
                    onClick={() => {
                      if (hasChildren) {
                        toggleSection(item.id);
                      } else if (item.view) {
                        setCurrentView(item.view);
                      }
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Action Buttons - Only show in edit mode */}
                  {editMode && (
                    <div className="flex items-center gap-1 ml-auto">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        className="h-7 w-7 p-0 rounded-lg hover:bg-red-500/10 hover:scale-110 transition-all duration-200 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}

                  {/* Expand/Collapse Icon */}
                  {hasChildren && (
                    <div
                      className="flex-shrink-0 cursor-pointer p-1 rounded-lg hover:bg-sidebar-accent/30 transition-all duration-200 hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(item.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all duration-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all duration-200" />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Render children */}
            {hasChildren && isExpanded && !sidebarCollapsed && (
              <Droppable droppableId={`group-${item.id}`} type="menu-item">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`mt-1 space-y-1 min-h-[20px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10 rounded-lg' : ''
                    }`}
                  >
                    {item.children?.map((child, childIndex) => {
                      // For nested groups, we need to handle the depth
                      const childHasChildren = child.children && child.children.length > 0;
                      const childIsExpanded = expandedSections.includes(child.id);

                      return (
                        <div key={child.id}>
                          {renderMenuItem(child, childIndex, true, item.id)}

                          {/* Render nested children if this child is a group */}
                          {childHasChildren && childIsExpanded && (
                            <div className="ml-4 mt-1 space-y-1">
                              {child.children?.map((grandchild, grandchildIndex) =>
                                renderMenuItem(grandchild, grandchildIndex, true, child.id)
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  const supportItems: MenuItem[] = [
    {
      id: 'help',
      label: 'Help Center',
      icon: 'HelpCircle',
      view: 'help'
    },
    {
      id: 'contact',
      label: 'Contact Support',
      icon: 'Phone',
      view: 'contact'
    }
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`
        bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col
        ${isMobile
          ? sidebarCollapsed ? 'w-0 -translate-x-full overflow-hidden' : 'w-64 translate-x-0 fixed inset-y-0 left-0 z-50'
          : sidebarCollapsed ? 'w-16' : 'w-64'
        }
        ${isMobile && !sidebarCollapsed ? 'md:relative md:translate-x-0' : ''}
      `}>

        {/* Header */}
        <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar to-sidebar/95`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                <Ticket className="text-white w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-sidebar shadow-sm"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <h1 className="text-lg font-bold text-sidebar-foreground bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">
                  HelpDesk Pro
                </h1>
                <p className="text-xs text-sidebar-foreground/60 font-medium tracking-wide">
                  Enterprise Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-2 overflow-y-auto`}>
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between mb-6 px-2">
              <div>
                <h3 className="text-xs font-bold text-sidebar-foreground/80 uppercase tracking-wider mb-1">
                  Navigation
                </h3>
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-transparent rounded-full"></div>
              </div>
              {editMode && (
                <div className="flex items-center gap-1 bg-sidebar-accent/30 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetToDefault}
                    className="h-7 w-7 p-0 rounded-md hover:bg-sidebar-accent/50 hover:scale-110 transition-all duration-200"
                    title="Reset to default layout"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowGroupCreator(true)}
                    className="h-7 w-7 p-0 rounded-md hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                    title="Create new group"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary/70 hover:text-primary" />
                  </Button>
                </div>
              )}
            </div>
          )}

          <Droppable droppableId="sidebar-main" type="menu-item">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-1 min-h-[100px] ${
                  snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10 rounded-lg' : ''
                }`}
              >
                {menuItems.map((item, index) => renderMenuItem(item, index))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Group Creator */}
          {showGroupCreator && !sidebarCollapsed && editMode && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <Input
                placeholder="Group name"
                className="h-6 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createNewGroup();
                  if (e.key === 'Escape') setShowGroupCreator(false);
                }}
              />
              <Button size="sm" variant="ghost" onClick={createNewGroup} className="h-6 w-6 p-0">
                <Check className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowGroupCreator(false)} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Support Section */}
          {!sidebarCollapsed && (
            <div className="pt-6">
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-3">
                Support
              </h3>
              <div className="space-y-1">
                {supportItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentView(item.view)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                      text-sm font-medium
                      ${currentView === item.view
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <div className="flex-shrink-0">
                      {getIcon(item.icon)}
                    </div>
                    <span className="flex-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User Profile & Settings */}
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-sidebar-border`}>
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              {/* User Profile */}
              <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-sidebar-foreground/70 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView('notifications')}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-xs">Notifications</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setCurrentView('notifications')}
                className="w-full flex items-center justify-center p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default DraggableSidebar;