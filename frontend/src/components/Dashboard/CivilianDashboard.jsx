import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
const {
    MapPin, Calendar, CheckCircle, Zap, ArrowRight, TrendingUp,
    LayoutDashboard, FileText, Shield, LogOut, RefreshCw, X,
    Edit2, ExternalLink, BarChart3, Activity, PieChart: PieIcon, Map,
    ChevronLeft, ChevronRight, Building, Download, Sparkles, CloudRain,
    Newspaper, Plus, Clock, UserPlus, BadgeIndianRupee, Image, Loader2,
    Brain, Flame, Wifi, Link2, AlertOctagon, Gauge, History, Milestone,
    Gift, Coffee, ParkingCircle, Home: HomeIcon, Filter, Globe, Building2, Medal, Award, Users, Trophy, List, Map: MapIcon, AlertTriangle, Settings
} = Icons;
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import SettingsSection from './SettingsSection';
import VoiceCommandCenter from './VoiceCommandCenter';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Utility for combining tailwind classes
const cn = (...inputs) => twMerge(clsx(inputs));

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

const CivilianDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, resolved: 0, impact: 0 });
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [viewMode, setViewMode] = useState('list');
    const [selectedReport, setSelectedReport] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardType, setLeaderboardType] = useState('citizens'); // 'citizens' | 'municipalities'
    const [leaderboardFilter, setLeaderboardFilter] = useState('Global');
    const [rewardTab, setRewardTab] = useState('available');
    const [bookings, setBookings] = useState([]);
    const [ngoRequests, setNgoRequests] = useState([]);
    const [claimedRewards, setClaimedRewards] = useState([]);
    const [showPassport, setShowPassport] = useState(false);
    
    // Mock achievements for demo
    const achievements = [
        { id: 1, title: 'First Responder', desc: 'Submitted your first report', date: '2024-03-24', icon: Zap, color: 'bg-amber-400' },
        { id: 2, title: 'XP Centurion', desc: 'Reached 100+ XP milestone', date: '2024-03-28', icon: TrendingUp, color: 'bg-indigo-500' },
        { id: 3, title: 'Impact Pioneer', desc: 'Resolved a high-impact city issue', date: '2024-04-01', icon: Shield, color: 'bg-emerald-500' },
        { id: 4, title: 'City Strategist', desc: 'Used the Impact Map for bonus XP', date: '2024-04-02', icon: Brain, color: 'bg-purple-500' },
    ];
    const [predictions, setPredictions] = useState([
        { id: 1, type: 'Urban Cleanup', risk: 'High Reward', probability: 95, reasoning: 'High litter density detected in Sector 7. Resolve for bonus XP.', lat: 22.7196, lng: 75.8577, city: 'Indore', impact: '+100 XP' },
        { id: 2, type: 'Pothole Alert', risk: 'Medium Reward', probability: 82, reasoning: 'Cracking detected on MG Road junction. Early report prevents accidents.', lat: 22.7250, lng: 75.8650, city: 'Indore', impact: '+50 XP' },
        { id: 3, type: 'Streetlight Fix', risk: 'High Reward', probability: 88, reasoning: 'System detected blackout in Subhash Chowk. High impact zone.', lat: 22.7120, lng: 75.8450, city: 'Indore', impact: '+75 XP' }
    ]);

    const municipalityLeaderboard = useMemo(() => {
        // City stats aggregation from dynamic citizen data
        const cityStats = {};
        const colors = [
            'from-emerald-400 to-green-600',
            'from-blue-400 to-indigo-600',
            'from-purple-400 to-pink-600',
            'from-amber-400 to-orange-600',
            'from-rose-400 to-red-600',
            'from-indigo-400 to-blue-600'
        ];

        leaderboard.forEach(user => {
            const city = user.city || 'Global';
            if (!cityStats[city]) {
                cityStats[city] = { 
                    name: `${city}, UrbanEye`, 
                    efficiency: 85 + Math.floor(Math.random() * 10), // Base efficiency + random
                    resolved: 0, 
                    city: city, 
                    totalXP: 0 
                };
            }
            cityStats[city].resolved += (user.report_count || 0);
            cityStats[city].totalXP += (user.xp || 0);
        });

        return Object.values(cityStats)
            .sort((a, b) => b.totalXP - a.totalXP)
            .map((city, i) => ({
                ...city,
                rank: i + 1,
                color: colors[i % colors.length],
                resolved: city.resolved.toLocaleString() // Format for UI
            }));
    }, [leaderboard]);

    const rewards = [
        { id: 1, title: "Property Tax Rebate", desc: "Get 5% off your next property tax bill", cost: 500, icon: HomeIcon, category: "Municipal", color: "bg-blue-500" },
        { id: 2, title: "1 Month Free Parking", desc: "Valid at all smart city parking lots", cost: 300, icon: ParkingCircle, category: "Municipal", color: "bg-indigo-500" },
        { id: 3, title: "Starbucks Beverage", desc: "Any tall size beverage on us", cost: 200, icon: Coffee, category: "Lifestyle", color: "bg-emerald-600" },
        { id: 4, title: "Park Guardian Badge", desc: "Exclusive profile highlight & nft", cost: 150, icon: Award, category: "Digital", color: "bg-amber-500" },
        { id: 5, title: "Cinema Discount", desc: "Flat ₹200 off on PVR/Inox tickets", cost: 250, icon: Gift, category: "Lifestyle", color: "bg-rose-500" },
        { id: 6, title: "Waste Warrior Medal", desc: "Digital badge for top recyclers", cost: 100, icon: Medal, category: "Digital", color: "bg-purple-500" },
    ];

    useEffect(() => {
        fetchMyReports();
        fetchLeaderboard();
        fetchMyBookings();
        fetchMyNGORequests();
    }, []);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchMyReports = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/reports/my`, getAuthHeaders());
            if (res.data.success) {
                setReports(res.data.reports);
                calculateStats(res.data.reports);
            }
        } catch (err) {
            console.error("Failed to fetch reports", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${API_BASE}/auth/leaderboard`);
            if (res.data.success) setLeaderboard(res.data.leaderboard);
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const res = await axios.get(`${API_BASE}/bookings/my`, getAuthHeaders());
            if (res.data.success) setBookings(res.data.bookings);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        }
    };

    const fetchMyNGORequests = async () => {
        try {
            const res = await axios.get(`${API_BASE}/ngo/requests/my`, getAuthHeaders());
            if (res.data.success) setNgoRequests(res.data.requests);
        } catch (err) {
            console.error("Failed to fetch NGO requests", err);
        }
    };

    const fetchReportDetail = async (reportId) => {
        try {
            const res = await axios.get(`${API_BASE}/reports/${reportId}`, getAuthHeaders());
            if (res.data.success) setSelectedReport(res.data.report);
        } catch (err) {
            console.error("Failed to fetch report detail", err);
        }
    };

    const calculateStats = (data) => {
        const resolved = data.filter(r => r.status === 'resolved' || r.status === 'completed').length;
        setStats({
            total: data.length,
            resolved: resolved,
            impact: (resolved * 15) + (data.length * 5)
        });
    };

    const handleHireGig = async (reportId) => {
        if (!window.confirm("Do you want to hire a private Gig Worker for fast resolution (₹300)?")) return;
        try {
            await axios.post(`${API_BASE}/gig/jobs`, { report_id: reportId, service_type: 'gig' }, getAuthHeaders());
            alert("Gig Worker Request Sent! Tracking enabled.");
            fetchMyReports();
        } catch (err) {
            alert("Could not process request. Job might already exist.");
        }
    };

    const handleVoiceCommand = (cmd, speak) => {
        if (cmd.includes('overview') || cmd.includes('dashboard') || cmd.includes('home')) {
            setActiveTab('overview');
            speak('Opening your dashboard overview');
            return true;
        }
        if (cmd.includes('report') || cmd.includes('activity')) {
            setActiveTab('reports');
            speak('Showing your activity and reports');
            return true;
        }
        if (cmd.includes('leaderboard') || cmd.includes('ranking') || cmd.includes('points')) {
            setActiveTab('leaderboard');
            speak('Opening the community leaderboard');
            return true;
        }
        if (cmd.includes('map') || cmd.includes('location')) {
            setActiveTab('map');
            speak('Opening city map view');
            return true;
        }
        if (cmd.includes('ngo') || cmd.includes('social help')) {
            setActiveTab('ngo');
            speak('Opening NGO help requests');
            return true;
        }
        if (cmd.includes('booking') || cmd.includes('appointment')) {
            setActiveTab('bookings');
            speak('Showing your appointments');
            return true;
        }
        if (cmd.includes('setting') || cmd.includes('profile')) {
            setActiveTab('settings');
            speak('Opening your profile settings');
            return true;
        }
        if (cmd.includes('logout') || cmd.includes('sign out')) {
            speak('Logging you out of UrbanEye. Goodbye!');
            setTimeout(handleLogout, 2000);
            return true;
        }
        if (cmd.includes('status') || cmd.includes('how many')) {
            speak(`You have submitted ${reports.length} reports in total. ${stats.resolved} are resolved. Your total impact score is ${stats.impact}.`);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleClaimReward = (reward) => {
        if (stats.impact < reward.cost) return;
        setClaimedRewards([...claimedRewards, { ...reward, claimedAt: Date.now() }]);
        setStats(prev => ({ ...prev, impact: prev.impact - reward.cost }));
        // Add particle effect logic here if needed
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            open: "bg-blue-100 text-blue-700",
            in_progress: "bg-orange-100 text-orange-700",
            resolved: "bg-green-100 text-green-700",
            completed: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            assigned: "bg-purple-100 text-purple-700"
        };
        return (
            <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles[status] || "bg-slate-100 text-slate-600")}>
                {status?.replace('_', ' ')}
            </span>
        );
    };

    // ========== REPORT DETAIL MODAL ==========
    const CivicPassportModal = () => (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[120] flex items-center justify-center p-8 overflow-hidden"
            onClick={() => setShowPassport(false)}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50, rotateX: 10 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                className="bg-white max-w-sm w-full rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col mt-20 md:mt-0 border border-slate-100"
                onClick={e => e.stopPropagation()}
                style={{ height: 'auto', maxHeight: '85vh' }}
            >
                {/* Modern Card Design */}
                <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(255,255,255,0.2),transparent)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                </div>
                
                <div className="relative z-10 px-8 pt-16 pb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <Shield className="text-white" size={24} />
                            <span className="font-black tracking-widest text-[8px] uppercase text-indigo-100">Official UrbanEye Card</span>
                        </div>
                        <button onClick={() => setShowPassport(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl relative -mt-4 mb-4">
                            <div className="w-full h-full rounded-[1.25rem] bg-indigo-50 flex items-center justify-center overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Users size={40} className="text-indigo-200" />}
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || 'Urban Citizen'}</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mt-1">Silver Tier Guardian</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                            <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Impact Score</p>
                            <p className="text-xl font-black text-slate-900">{stats.impact} <span className="text-[10px] opacity-40">XP</span></p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                            <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Resolved</p>
                            <p className="text-xl font-black text-slate-900">{stats.resolved}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 text-center">Active Service Records</p>
                        <div className="flex justify-center gap-3">
                            {achievements.slice(0, 4).map(ach => (
                                <div key={ach.id} className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group cursor-pointer hover:bg-indigo-600 transition-all shadow-sm">
                                    <ach.icon size={20} className="text-indigo-400 group-hover:text-white group-hover:scale-110 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Wifi size={10} className="text-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase text-slate-400">Card Verified • ID: 0X84AE...</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} animate={{ width: '65%' }}
                                className="h-full bg-indigo-600 shadow-lg shadow-indigo-200" 
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    const ReportDetailModal = () => {
        if (!selectedReport) return null;
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                onClick={() => setSelectedReport(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 capitalize">{selectedReport.category}</h2>
                            <p className="text-slate-400 text-sm font-bold">{selectedReport.department} • {new Date(selectedReport.timestamp * 1000).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>

                    {selectedReport.image_url && (
                        <img src={selectedReport.image_url} alt={selectedReport.category} className="w-full h-64 object-cover rounded-2xl mb-6" />
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-2xl text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold">Severity</p>
                            <p className="text-lg font-black text-slate-800 capitalize">{selectedReport.severity}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                            <StatusBadge status={selectedReport.status} />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold">Location</p>
                            <p className="text-sm font-bold text-slate-600">{selectedReport.latitude?.toFixed(4)}, {selectedReport.longitude?.toFixed(4)}</p>
                        </div>
                    </div>

                    {selectedReport.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase mb-2">Description</h3>
                            <p className="text-slate-700">{selectedReport.description}</p>
                        </div>
                    )}

                    {selectedReport.logs && selectedReport.logs.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase mb-4">Activity Timeline</h3>
                            <div className="space-y-3">
                                {selectedReport.logs.map((log, i) => (
                                    <div key={i} className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                                        <div>
                                            <p className="font-bold text-slate-700 capitalize">{log.status}</p>
                                            <p className="text-sm text-slate-500">{log.message}</p>
                                            <p className="text-xs text-slate-400">{new Date(log.timestamp * 1000).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedReport.status === 'open' && (
                        <button
                            onClick={() => { handleHireGig(selectedReport.id); setSelectedReport(null); }}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all"
                        >
                            <Zap className="inline mr-2" size={20} /> Fast Track with Gig Worker (₹300)
                        </button>
                    )}
                </motion.div>
            </motion.div>
        );
    };

    // ========== REPORTS SECTION (LIST + MAP) ==========
    const ReportsSection = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
                    <p className="text-slate-400 font-bold text-sm">Monitor your contributions in real-time</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                    <button onClick={() => setViewMode('list')} className={cn("px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2", viewMode === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>
                        <List size={16} /> List
                    </button>
                    <button onClick={() => setViewMode('map')} className={cn("px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2", viewMode === 'map' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>
                        <MapIcon size={16} /> Map
                    </button>
                </div>
            </div>

            {viewMode === 'map' ? (
                <div className="h-[500px] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl">
                    <MapContainer center={[28.6139, 77.209]} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        {reports.filter(r => r.latitude && r.longitude).map(report => (
                            <Marker key={report.id} position={[report.latitude, report.longitude]}>
                                <Popup>
                                    <div style={{ minWidth: '200px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b', textTransform: 'capitalize', marginBottom: '4px' }}>
                                            {report.category}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                                            {report.department} • <span style={{ color: report.status === 'resolved' ? '#22c55e' : '#f59e0b', textTransform: 'capitalize' }}>{report.status?.replace('_', ' ')}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => fetchReportDetail(report.id)}
                                                style={{
                                                    background: '#4f46e5',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    fontSize: '11px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <MapPin size={12} /> Details
                                            </button>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    background: '#f1f5f9',
                                                    color: '#3b82f6',
                                                    textDecoration: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    fontSize: '11px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <MapPin size={12} /> Locate
                                            </a>
                                            <a
                                                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${report.latitude},${report.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    background: '#f1f5f9',
                                                    color: '#f97316',
                                                    textDecoration: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    fontSize: '11px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                🌐 Street View
                                            </a>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>



                        ))}
                    </MapContainer>
                </div>
            ) : (
                <div className="grid gap-5">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                <RefreshCw size={48} className="text-indigo-400/50 animate-spin" />
                                <p className="mt-6 text-slate-400 font-bold">Synchronizing data...</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-16 text-center shadow-2xl shadow-slate-100 border border-slate-50">
                                <AlertTriangle size={40} className="mx-auto mb-4 text-indigo-500" />
                                <h3 className="text-2xl font-black text-slate-800 mb-2">No reports yet</h3>
                                <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Start by creating a report to improve your locality.</p>
                                <button onClick={() => navigate('/analyze')} className="bg-black text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform">
                                    Get Started
                                </button>
                            </div>
                        ) : reports.map((report, idx) => (
                            <motion.div key={report.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                className="group bg-white p-6 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center border border-slate-100 hover:border-indigo-200 transition-all duration-500 hover:shadow-xl">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                                        {report.image_url ? <img src={report.image_url} alt="" className="w-full h-full object-cover" /> : <MapPin size={28} className="text-slate-300" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-black text-slate-900 capitalize truncate">{report.category}</h3>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(report.timestamp * 1000).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Shield size={12} /> {report.department}</span>
                                            <span className="flex items-center gap-1 text-indigo-600"><Zap size={12} /> {report.severity}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 lg:mt-0">
                                    <StatusBadge status={report.status} />
                                    {report.status === 'open' && (
                                        <button onClick={() => handleHireGig(report.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase">Fast Track</button>
                                    )}
                                    <button onClick={() => fetchReportDetail(report.id)} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );

    const ImpactHeatmapSection = () => (
        <div className="space-y-10 pb-20">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] -mr-64 -mt-64 opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4 border border-indigo-100">
                            <Brain size={16} className="text-indigo-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">AI-Powered Opportunities</span>
                        </div>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Impact Heatmap</h3>
                        <p className="text-slate-400 font-bold text-xl">Identify high-priority zones to earn bonus <span className="text-indigo-600">XP</span>.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 h-[600px] rounded-[3rem] overflow-hidden border-4 border-slate-100 shadow-inner relative group">
                        <MapContainer center={[22.7196, 75.8577]} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                            {predictions.map((pred) => (
                                <CircleMarker 
                                    key={pred.id} 
                                    center={[pred.lat, pred.lng]} 
                                    radius={25} 
                                    pathOptions={{ 
                                        fillColor: pred.risk.includes('High') ? '#ef4444' : '#6366f1', 
                                        color: 'white', weight: 4, fillOpacity: 0.4 
                                    }}
                                >
                                    <Popup className="custom-popup">
                                        <div className="p-4 min-w-[200px]">
                                            <h4 className="font-black text-slate-900 text-lg mb-1">{pred.type}</h4>
                                            <p className="text-xs text-slate-500 font-bold mb-3">{pred.reasoning}</p>
                                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-center font-black text-sm shadow-lg">
                                                Reward: {pred.impact}
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                        <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl pointer-events-none">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-slate-600">High Reward Zone</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black uppercase text-slate-600">Standard Zone</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-2">Prediction Feed</h4>
                        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                            {predictions.map((pred) => (
                                <motion.div 
                                    key={pred.id}
                                    whileHover={{ x: 10 }}
                                    className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-3 rounded-2xl text-white shadow-lg", pred.risk.includes('High') ? "bg-red-500" : "bg-indigo-500")}>
                                                <Icons.AlertTriangle size={20} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-slate-900 leading-none">{pred.type}</h5>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{pred.city}</p>
                                            </div>
                                        </div>
                                        <div className="text-indigo-600 font-black text-lg">{pred.impact}</div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold mb-4 line-clamp-2 leading-relaxed italic opacity-80 group-hover:opacity-100 italic transition-opacity">"{pred.reasoning}"</p>
                                    <button 
                                        onClick={() => navigate('/analyze')}
                                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-colors"
                                    >
                                        Inspect Zone
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const LeaderboardSection = () => {
        const filteredCitizens = leaderboard.filter(u => leaderboardFilter === 'Global' || u.city === leaderboardFilter);
        const filteredMunicipalities = municipalityLeaderboard.filter(m => leaderboardFilter === 'Global' || m.city === leaderboardFilter);
        const cities = ['Global', 'Indore', 'Delhi', 'Gwalior', 'Mumbai', 'Canberra'];

        return (
            <div className="dashboard-container">
                {/* Header & Filters */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60 animate-pulse" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-100 text-amber-500 rounded-3xl flex items-center justify-center shadow-xl border border-amber-200/50">
                                <Trophy size={40} className="animate-glow" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">City Hall of Fame</h2>
                                <p className="text-slate-400 font-bold text-lg">Top contributors building the cities of tomorrow</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                            {/* Type Toggle */}
                            <div className="bg-white p-1.5 rounded-2xl flex shadow-sm">
                                <button 
                                    onClick={() => setLeaderboardType('citizens')}
                                    className={cn("px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2", leaderboardType === 'citizens' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
                                >
                                    <Users size={18} /> Citizens
                                </button>
                                <button 
                                    onClick={() => setLeaderboardType('municipalities')}
                                    className={cn("px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2", leaderboardType === 'municipalities' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50")}
                                >
                                    <Building2 size={18} /> Councils
                                </button>
                            </div>

                            {/* City Filter */}
                            <div className="relative">
                                <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select 
                                    value={leaderboardFilter}
                                    onChange={(e) => setLeaderboardFilter(e.target.value)}
                                    className="pl-12 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-700 appearance-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm"
                                >
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Podium / Top Rankers */}
                {leaderboardType === 'citizens' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCitizens.slice(0, 3).map((entry, i) => (
                            <motion.div 
                                key={entry.user_id}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "p-10 rounded-[3.5rem] relative overflow-hidden group border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                                    i === 0 ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white border-amber-300 shadow-amber-200/50" :
                                    i === 1 ? "bg-white border-slate-200 shadow-slate-100" : "bg-white border-orange-100 shadow-orange-50"
                                )}
                            >
                                <div className="absolute top-6 right-8 text-8xl font-black opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">{i + 1}</div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className={cn(
                                        "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl relative",
                                        i === 0 ? "bg-white/20 backdrop-blur-md ring-4 ring-white/30" : "bg-slate-50 ring-4 ring-slate-100"
                                    )}>
                                        <Users size={40} className={i === 0 ? "text-white" : "text-slate-400"} />
                                        {i === 0 && <Sparkles className="absolute -top-4 -right-4 text-white animate-pulse" size={32} />}
                                    </div>
                                    <h3 className={cn("text-2xl font-black mb-2", i === 0 ? "text-white" : "text-slate-900")}>{entry.name}</h3>
                                    <p className={cn("text-xs font-black opacity-80 mb-6 uppercase tracking-[0.2em]", i === 0 ? "text-white" : "text-slate-400")}>{entry.city || 'Global contributor'}</p>
                                    <div className={cn("px-8 py-3 rounded-2xl font-black text-2xl shadow-inner", i === 0 ? "bg-white/20" : "bg-indigo-50 text-indigo-600")}>
                                        {entry.xp} <span className="text-sm opacity-60">XP</span>
                                    </div>
                                    
                                    <div className="flex gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-tighter opacity-70">Impact</p>
                                            <p className="text-sm font-black">Top 1%</p>
                                        </div>
                                        <div className="w-px h-8 bg-current opacity-20" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-tighter opacity-70">Badges</p>
                                            <p className="text-sm font-black">12</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMunicipalities.slice(0, 3).map((m, i) => (
                            <motion.div 
                                key={m.name}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "p-10 rounded-[3.5rem] relative overflow-hidden group border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                                    i === 0 ? "bg-gradient-to-br from-emerald-400 via-green-600 to-emerald-700 text-white border-emerald-300 shadow-emerald-200/50" :
                                    i === 1 ? "bg-white border-slate-200 shadow-slate-100" : "bg-white border-blue-100 shadow-blue-50"
                                )}
                            >
                                <div className="absolute top-6 right-8 text-8xl font-black opacity-10">{i + 1}</div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className={cn(
                                        "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl",
                                        i === 0 ? "bg-white/20 backdrop-blur-md ring-4 ring-white/30" : "bg-slate-50 ring-4 ring-slate-100"
                                    )}>
                                        <Building2 size={40} className={i === 0 ? "text-white" : "text-emerald-500"} />
                                    </div>
                                    <h3 className={cn("text-2xl font-black mb-2", i === 0 ? "text-white" : "text-slate-900")}>{m.name}</h3>
                                    <div className="grid grid-cols-2 gap-6 mt-6 w-full max-w-[200px]">
                                        <div className="text-center">
                                            <p className={cn("text-[10px] font-black uppercase tracking-tight opacity-70", i === 0 ? "text-white" : "text-slate-400")}>SLA Success</p>
                                            <p className={cn("text-2xl font-black", i === 0 ? "text-white" : "text-emerald-600")}>{m.efficiency}%</p>
                                        </div>
                                        <div className={cn("text-center border-l", i === 0 ? "border-white/20" : "border-slate-100")}>
                                            <p className={cn("text-[10px] font-black uppercase tracking-tight opacity-70", i === 0 ? "text-white" : "text-slate-400")}>Solved</p>
                                            <p className={cn("text-2xl font-black", i === 0 ? "text-white" : "text-emerald-600")}>{m.resolved}</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                                        <div className="h-full bg-white rounded-full" style={{ width: `${m.efficiency}%` }} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* List View */}
                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-indigo-100 to-transparent opacity-50" />
                    <div className="space-y-4">
                        {leaderboardType === 'citizens' ? (
                            filteredCitizens.slice(3).length === 0 ? (
                                <div className="py-20 text-center">
                                    <Globe size={48} className="mx-auto text-slate-100 mb-4" />
                                    <p className="text-slate-400 font-bold italic text-lg">Region boundaries reached. More contributors needed!</p>
                                </div>
                            ) : filteredCitizens.slice(3).map((entry, i) => (
                                <motion.div 
                                    key={entry.user_id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group border border-transparent hover:border-slate-100"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center font-black text-slate-400 shadow-md group-hover:bg-indigo-600 group-hover:text-white transition-colors text-xl">
                                        {i + 4}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-xl tracking-tight">{entry.name}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1.5 text-xs text-indigo-500 font-black uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                                <MapPin size={10} /> {entry.city || 'Global'}
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold">{entry.report_count} successful reports</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-indigo-600 text-3xl tabular-nums tracking-tighter">{entry.xp} <span className="text-sm uppercase opacity-50">XP</span></p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            filteredMunicipalities.slice(3).length === 0 ? (
                                <div className="py-20 text-center">
                                    <Building2 size={48} className="mx-auto text-slate-100 mb-4" />
                                    <p className="text-slate-400 font-bold italic text-lg">Council list synchronized.</p>
                                </div>
                            ) : filteredMunicipalities.slice(3).map((m, i) => (
                                <motion.div 
                                    key={m.name} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group border border-transparent hover:border-slate-100"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center font-black text-slate-400 shadow-md group-hover:bg-emerald-600 group-hover:text-white transition-colors text-xl">
                                        {i + 4}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-xl">{m.name}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                                            <CheckCircle size={12} className="text-emerald-500" /> {m.resolved} issues resolved • Peak efficiency reached
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Council Rating</p>
                                        <p className="font-black text-emerald-500 text-3xl tabular-nums">{m.efficiency}%</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ========== GIG WORKERS SECTION ==========
    const GigWorkersSection = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Gig Worker Bookings</h2>
                    <p className="text-slate-400 font-bold">Track your private service requests</p>
                </div>
                <button onClick={() => navigate('/book')} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={20} /> New Booking
                </button>
            </div>
            {bookings.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100">
                    <Users size={40} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-black text-slate-800 mb-2">No bookings yet</h3>
                    <p className="text-slate-500 mb-6">Book a gig worker for faster issue resolution</p>
                    <button onClick={() => navigate('/book')} className="bg-black text-white px-8 py-3 rounded-2xl font-black">Book Now</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="font-black text-slate-800 capitalize">{booking.service_type}</p>
                                <p className="text-sm text-slate-400">{booking.preferred_date} • {booking.preferred_time}</p>
                            </div>
                            <StatusBadge status={booking.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // ========== NGO HELP SECTION ==========
    const NGOHelpSection = () => (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">NGO Assistance</h2>
                    <p className="text-slate-400 font-bold">Request help from local NGOs</p>
                </div>
                <button onClick={() => navigate('/ngo-help')} className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-rose-600">
                    <Heart size={20} /> Request Help
                </button>
            </div>
            {ngoRequests.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100">
                    <Heart size={40} className="mx-auto mb-4 text-rose-300" />
                    <h3 className="text-xl font-black text-slate-800 mb-2">No requests yet</h3>
                    <p className="text-slate-500 mb-6">Reach out to NGOs for community support</p>
                    <button onClick={() => navigate('/ngo-help')} className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black">Get Help</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {ngoRequests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="font-black text-slate-800 capitalize">{req.category}</p>
                                <p className="text-sm text-slate-500 line-clamp-1">{req.description}</p>
                            </div>
                            <StatusBadge status={req.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // ========== REWARDS SECTION ==========
    const RewardsSection = () => (
        <div className="space-y-12 pb-20">
            {/* Header / Portfolio */}
            <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -mr-80 -mt-80 opacity-60 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50 rounded-full blur-[100px] -ml-40 -mb-40 opacity-40" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <motion.div 
                        whileHover={{ rotateY: 15, scale: 1.05 }}
                        className="w-56 h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-[4rem] shadow-[0_20px_50px_rgba(79,70,229,0.4)] flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden group cursor-pointer"
                        onClick={() => setShowPassport(true)}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent)] opacity-50" />
                        <Award size={96} className="mb-2 drop-shadow-2xl animate-glow" />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Open Passport</span>
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white rounded-full opacity-50" />)}
                        </div>
                    </motion.div>

                    <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Rewards Lounge</h3>
                                <p className="text-slate-400 font-bold text-xl">Balance: <span className="text-indigo-600 font-black tabular-nums">{stats.impact} XP</span></p>
                            </div>
                            <div className="bg-amber-50 px-8 py-5 rounded-[2rem] border border-amber-100 flex items-center gap-4 shadow-xl shadow-amber-900/5 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setShowPassport(true)}>
                                <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-amber-900 shadow-lg">
                                    <Medal size={32} />
                                </div>
                                <div className="text-left text-gradient bg-gradient-to-br from-amber-600 to-orange-600">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-slate-400">Contributor Tier</p>
                                    <p className="text-2xl font-black leading-none">Silver Elite</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Next Achievement: Gold Citizen (1500 XP)</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-indigo-600 tabular-nums">{Math.round((stats.impact / 1500) * 100)}%</span>
                                    <span className="text-xs font-black text-slate-400 uppercase">to level up</span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-8 rounded-3xl overflow-hidden shadow-inner border border-slate-50 relative group">
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${Math.min((stats.impact / 1500) * 100, 100)}%` }} 
                                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 h-full rounded-3xl relative shadow-lg shadow-indigo-500/20"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20 animate-[move_1s_linear_infinite]" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-Tabs (New) */}
            <div className="flex gap-8 border-b border-slate-100 pb-2">
                {['available', 'claimed', 'achievements'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setRewardTab(tab)}
                        className={cn(
                            "px-4 py-2 text-sm font-black uppercase tracking-widest border-b-4 transition-all",
                            rewardTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Rewards Grid / Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rewardTab === 'available' ? (
                    rewards.map((reward, i) => (
                        <motion.div 
                            key={reward.id}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-3 transition-all duration-500 group flex flex-col h-full relative overflow-hidden",
                                reward.id === 1 && "reward-card-epic"
                            )}
                        >
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={cn(
                                    "w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                                    reward.color
                                )}>
                                    <reward.icon size={36} />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-slate-200">{reward.category}</span>
                                    {reward.id === 1 && <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">Hot Deal</span>}
                                </div>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{reward.title}</h4>
                                <p className="text-slate-500 font-bold leading-relaxed text-lg">{reward.desc}</p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Redeem for</p>
                                    <p className="text-3xl font-black text-slate-900 tabular-nums">{reward.cost} <span className="text-sm opacity-40">XP</span></p>
                                </div>
                                <button 
                                    onClick={() => handleClaimReward(reward)}
                                    disabled={stats.impact < reward.cost || claimedRewards.some(cr => cr.id === reward.id)}
                                    className={cn(
                                        "px-10 py-5 rounded-[2rem] font-black transition-all shadow-2xl active:scale-95 text-lg",
                                        claimedRewards.some(cr => cr.id === reward.id)
                                            ? "bg-emerald-50 text-emerald-600 cursor-not-allowed shadow-none border border-emerald-100"
                                            : stats.impact >= reward.cost 
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40 hover:px-12" 
                                                : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                                    )}
                                >
                                    {claimedRewards.some(cr => cr.id === reward.id) ? "Claimed" : stats.impact >= reward.cost ? "Redeem" : "Locked"}
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : rewardTab === 'claimed' ? (
                    claimedRewards.length === 0 ? (
                        <div className="col-span-full py-24 text-center">
                            <History size={64} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold text-xl italic">No rewards redeemed yet. Start contributing!</p>
                        </div>
                    ) : (
                        claimedRewards.map((reward, i) => (
                            <motion.div key={reward.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50/50 rounded-[3rem] p-10 border border-emerald-100 flex flex-col items-center text-center">
                                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl mb-6", reward.color)}>
                                    <reward.icon size={36} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2">{reward.title}</h4>
                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-6">Redeemed officially</p>
                                <div className="w-full bg-white rounded-2xl p-4 border border-emerald-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Coupon Code</p>
                                    <p className="font-mono text-xl font-black text-slate-900 uppercase">URBAN-{reward.id}XE{Math.floor(Math.random() * 1000)}</p>
                                </div>
                            </motion.div>
                        ))
                    )
                ) : (
                    achievements.map((ach, i) => (
                        <motion.div key={ach.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-lg flex flex-col items-center text-center group hover:border-indigo-200 transition-all">
                            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-6 group-hover:scale-110 transition-transform", ach.color)}>
                                <ach.icon size={36} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{ach.title}</h4>
                            <p className="text-slate-500 font-bold mb-6 italic">"{ach.desc}"</p>
                            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Unlocked on {ach.date}</span>
                        </motion.div>
                    ))
                )}
            </div>

            {/* How to Earn */}
            <div className="bg-slate-900 rounded-[5rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_-20%,rgba(79,70,229,0.4),transparent)]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/20 px-4 py-2 rounded-full mb-8">
                            <Sparkles size={16} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Maximize your impact</span>
                        </div>
                        <h3 className="text-5xl font-black mb-6 tracking-tighter">Become a City Guardian.</h3>
                        <p className="text-slate-400 text-xl font-bold leading-relaxed mb-10 max-w-lg">
                            Every interaction makes UrbanEye smarter. Contribute daily to unlock exclusive municipal benefits and higher civic status.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors">
                                <p className="text-xs font-black uppercase opacity-60 mb-2 tracking-widest">Global Top 5</p>
                                <p className="text-3xl font-black text-indigo-400 leading-none">Indore</p>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Leading the charts</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors">
                                <p className="text-xs font-black uppercase opacity-60 mb-2 tracking-widest">Active Peers</p>
                                <p className="text-3xl font-black text-emerald-400 leading-none">12.4k</p>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Citizens live now</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-40 animate-pulse" />
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[4rem] shadow-2xl flex items-center justify-center relative z-10 border border-white/20"
                            >
                                <Shield size={128} className="text-white drop-shadow-2xl" />
                            </motion.div>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79,70,229,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-600 text-white px-16 py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center gap-4 group/btn"
                            onClick={() => navigate('/analyze')}
                        >
                            <Sparkles className="group-hover/btn:rotate-12 transition-transform" /> Start Earning XP
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'My Reports', icon: FileText },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'heatmap', label: 'Impact Map', icon: MapIcon },
        { id: 'rewards', label: 'Rewards Lounge', icon: Sparkles },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];



    return (
        <div className="fixed top-[44px] left-0 right-0 bottom-0 flex bg-[#f8fafc] font-sans antialiased text-slate-900 overflow-hidden">
            <AnimatePresence>
                {selectedReport && <ReportDetailModal />}
                {showPassport && <CivicPassportModal />}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn("relative h-full bg-white border-r border-slate-100 flex flex-col transition-all duration-500 z-50 shadow-xl shrink-0 overflow-visible", sidebarCollapsed ? "w-[90px]" : "w-[280px]")}>
                <div className="p-6 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                            <Shield size={28} />
                        </div>
                        {!sidebarCollapsed && <span className="text-2xl font-black tracking-tighter text-slate-900">UrbanEye</span>}
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={cn("w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all", activeTab === item.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900")}>
                            <item.icon size={22} className={activeTab === item.id ? "text-white" : "text-slate-300"} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}

                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all">
                        <LogOut size={22} />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>

                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-4 top-24 bg-white border border-slate-100 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-lg z-50">
                    {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 px-8 py-10 lg:px-16 h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-100 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
                            Hi, <span className="text-indigo-600">{user?.name?.split(' ')[0] || 'Citizen'}</span>!
                        </h1>
                        <p className="text-slate-400 font-bold">Your Impact: <span className="text-indigo-600">{stats.impact} XP</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchMyReports} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm">
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button onClick={() => navigate('/analyze')} className="flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-2xl font-black shadow-xl hover:-translate-y-0.5 transition-all">
                            <Plus size={22} /> New Report
                        </button>
                    </div>
                </header>

                <div className="space-y-12">
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Total Reports', value: stats.total, icon: FileText, color: 'indigo' },
                                    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'emerald' },
                                    { label: 'Impact XP', value: stats.impact, icon: TrendingUp, color: 'rose' },
                                ].map((stat, i) => (
                                    <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                                        className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 border border-slate-50 shadow-xl group">
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform",
                                            stat.color === 'indigo' && "bg-indigo-600",
                                            stat.color === 'emerald' && "bg-emerald-500",
                                            stat.color === 'rose' && "bg-rose-500")}>
                                            <stat.icon size={28} />
                                        </div>
                                        <div>
                                            <span className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</span>
                                            <span className="block text-4xl font-black text-slate-900">{stat.value}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <ReportsSection />
                        </>
                    )}
                    {activeTab === 'reports' && <ReportsSection />}
                    {activeTab === 'leaderboard' && <LeaderboardSection />}
                    {activeTab === 'heatmap' && <ImpactHeatmapSection />}
                    {activeTab === 'rewards' && <RewardsSection />}
                    {activeTab === 'settings' && <SettingsSection />}
                </div>
            </main>

            <VoiceCommandCenter 
                onCommand={handleVoiceCommand}
                commands={[
                    "Go to Dashboard",
                    "Show my Reports",
                    "Open Leaderboard",
                    "Show Map",
                    "Show NGO Help",
                    "View Bookings",
                    "Open Settings",
                    "How many reports?",
                    "Sign out"
                ]}
            />
        </div>
    );
};

export default CivilianDashboard;
