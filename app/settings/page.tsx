'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User, Mail, Bell, Shield, Palette, Save, Eye, EyeOff, Camera } from 'lucide-react'

interface UserSettings {
  full_name: string
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  email_frequency: 'instant' | 'daily' | 'weekly'
}

export default function SettingsPage() {
  // No authentication required - settings work without login
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState<UserSettings>({
    full_name: '',
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    theme: 'light',
    language: 'en',
    timezone: 'America/Los_Angeles',
    email_frequency: 'instant'
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // Settings now work without authentication

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handlePasswordChange = (key: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Update profile
      if (profile?.id) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            full_name: settings.full_name,
            // Add other settings fields as needed
          })
          .eq('id', profile.id)

        if (error) throw error
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      setPasswords({ current: '', new: '', confirm: '' })
      alert('Password updated successfully')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{settings.full_name || 'User'}</h4>
            <p className="text-gray-600">user@example.com</p>
            <p className="text-sm text-gray-500">Member since {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={settings.full_name}
                onChange={(e) => handleSettingChange('full_name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={'user@example.com'}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Shield className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => handlePasswordChange('new', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => handlePasswordChange('confirm', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button
            onClick={changePassword}
            disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <h4 className="font-medium text-green-900">Two-Factor Authentication</h4>
              <p className="text-sm text-green-700">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Active Sessions</h4>
              <p className="text-sm text-gray-700">Manage your active login sessions</p>
            </div>
            <button className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              View Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.push_notifications}
                onChange={(e) => handleSettingChange('push_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Emails</h4>
              <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.marketing_emails}
                onChange={(e) => handleSettingChange('marketing_emails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Frequency</label>
            <select
              value={settings.email_frequency}
              onChange={(e) => handleSettingChange('email_frequency', e.target.value)}
              className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Preferences</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', preview: 'bg-white border-2' },
                { value: 'dark', label: 'Dark', preview: 'bg-gray-900 border-2' },
                { value: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900 border-2' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    settings.theme === theme.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-16 rounded-md ${theme.preview} mb-2`}></div>
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> }
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            Settings saved successfully!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'appearance' && renderAppearanceTab()}
      </div>

      {/* Save Button */}
      {activeTab !== 'security' && (
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}