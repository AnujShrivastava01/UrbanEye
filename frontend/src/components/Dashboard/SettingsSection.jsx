import React from 'react';
import { Settings, User, Bell, Shield, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SettingsSection = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Settings size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Account Settings</h2>
                    <p className="text-sm text-slate-500">Manage your profile and communication preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <User size={18} />
                        </div>
                        <h3 className="font-semibold text-slate-800">Profile Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</span>
                            <span className="text-slate-700 font-medium">{user?.name || 'UrbanEye User'}</span>
                        </div>
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</span>
                            <span className="text-slate-700 font-medium">{user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold w-fit capitalize">
                                {user?.role?.replace('_', ' ') || 'User'}
                            </span>
                        </div>
                        {user?.department && (
                            <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Department</span>
                                <span className="text-slate-700 font-medium">{user.department}</span>
                            </div>
                        )}
                        <button className="w-full mt-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                             Update Profile
                        </button>
                    </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Bell size={18} />
                        </div>
                        <h3 className="font-semibold text-slate-800">Preferences</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Email Notifications</p>
                                <p className="text-xs text-slate-500">Receive weekly city updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Push Notifications</p>
                                <p className="text-xs text-slate-500">Real-time alerts for your area</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-400">Enhance your account security</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>

                        <div className="pt-4 mt-2">
                             <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-3 border border-amber-100">
                                <Shield size={16} className="text-amber-600 mt-0.5" />
                                <p className="text-[11px] text-amber-700 leading-tight">
                                    Your data is encrypted and secure. UrbanEye follows strict privacy protocols to protect your identity.
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;
