import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, MapPin, AlertCircle, Check, Loader2, 
    ChevronLeft, Sparkles, Send, Info, ShieldCheck,
    Target
} from 'lucide-react';
import './RequestNGOHelp.css';

const CATEGORIES = [
    { id: 'environment', label: 'Environment', icon: '🌿', description: 'Tree planting, pollution, green initiatives' },
    { id: 'animal_welfare', label: 'Animal Welfare', icon: '🐕', description: 'Stray animals, injured animals, shelters' },
    { id: 'sanitation', label: 'Sanitation', icon: '🧹', description: 'Clean-up drives, waste management' },
    { id: 'community', label: 'Community', icon: '🏘️', description: 'Infrastructure, education, health camps' },
    { id: 'other', label: 'Other', icon: '📋', description: 'Any other community issue' },
];

const SCALES = [
    { id: 'small', label: 'Small', description: '1-5 people', color: '#10b981' },
    { id: 'medium', label: 'Medium', description: '5-15 volunteers', color: '#f59e0b' },
    { id: 'large', label: 'Large', description: '15+ volunteers', color: '#f43f5e' },
];

const RequestNGOHelp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [ngoResponse, setNgoResponse] = useState(null);

    const [formData, setFormData] = useState({
        description: '',
        category: '',
        scale: 'medium',
        address: '',
        latitude: 28.6139,
        longitude: 77.2090
    });

    useEffect(() => {
        // Auto-detect location on mount
        detectLocation();
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, latitude, longitude }));
                
                try {
                    // Reverse geocoding using Nominatim
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
                    const data = await res.json();
                    if (data && data.display_name) {
                        setFormData(prev => ({ ...prev, address: data.display_name }));
                    } else {
                        setFormData(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    }
                } catch (err) {
                    console.error('Reverse geocoding failed', err);
                    setFormData(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                // Don't alert on mount auto-detect to avoid annoying users
                setDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!formData.description || !formData.category) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/v1/ngo/requests`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                setNgoResponse(res.data.request);
                setTimeout(() => setSubmitted(true), 1000);
            }
        } catch (err) {
            console.error('Failed to submit request', err);
            alert('Submission failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="ngo-help-page flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full glass-card rounded-[3rem] p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-indigo-500" />
                    
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <Check className="text-emerald-500" size={48} />
                    </motion.div>

                    <h1 className="text-4xl font-black text-slate-900 mb-4">Request Sent!</h1>
                    <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
                        Your petition for community assistance has been successfully broadcasted to our NGO partners.
                    </p>

                    <div className="bg-slate-50 rounded-3xl p-8 text-left space-y-4 mb-10 border border-slate-100">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                            <span className="text-slate-400 font-black uppercase text-xs tracking-widest">Tracking ID</span>
                            <code className="bg-white px-3 py-1 rounded-lg text-indigo-600 font-bold border border-indigo-50">
                                {ngoResponse?.id?.slice(0, 10).toUpperCase()}
                            </code>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold text-sm">Target Category</span>
                            <span className="text-slate-800 font-black capitalize">{formData.category.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold text-sm">Response Time</span>
                            <span className="text-indigo-600 font-black tracking-tight underline transition-all">~24 Hours</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                            Back to Dashboard
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="flex-1 bg-white text-slate-900 border-2 border-slate-100 px-8 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all"
                        >
                            Save Receipt
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="ngo-help-page px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <header className="mb-12">
                    <motion.button 
                        whileHover={{ x: -4 }}
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-400 font-black uppercase text-xs tracking-widest mb-10 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronLeft size={16} /> Back to Hub
                    </motion.button>
                    
                    <div className="flex flex-col items-center text-center">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-6 pulse-rose shadow-xl shadow-rose-100"
                        >
                            <Heart className="text-rose-500 fill-rose-500" size={32} />
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black text-slate-900 tracking-tighter mb-4"
                        >
                            Request NGO Help
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 text-lg font-medium max-w-md"
                        >
                            Get free assistance from verified community partners for local non-commercial issues.
                        </motion.p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                    {/* Category Grid */}
                    <section>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                <Sparkles className="text-amber-500" size={14} /> 1. Select Issue Category
                            </h3>
                            {formData.category && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-indigo-600 text-xs font-black">
                                    Selection saved
                                </motion.span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {CATEGORIES.map((cat, idx) => (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                                    className={`category-card-premium glass-card rounded-[2.5rem] p-8 cursor-pointer border-2 ${
                                        formData.category === cat.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent'
                                    }`}
                                >
                                    <div className="text-4xl mb-4">{cat.icon}</div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">{cat.label}</h4>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{cat.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Scale Selection */}
                    <section className="glass-card rounded-[3rem] p-10">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                            <Target className="text-indigo-500" size={14} /> 2. Scale of Assistance
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {SCALES.map((scale) => (
                                <button
                                    key={scale.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, scale: scale.id }))}
                                    className={`scale-btn-premium flex-1 min-w-[150px] p-6 rounded-3xl border-2 text-left flex items-center gap-4 ${
                                        formData.scale === scale.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 bg-slate-50/50'
                                    }`}
                                >
                                    <div className="scale-dot shadow-inner shadow-slate-200" style={{ backgroundColor: scale.color }} />
                                    <div>
                                        <div className="font-black text-slate-900 text-lg">{scale.label}</div>
                                        <div className="text-slate-500 text-xs font-bold uppercase tracking-tight">{scale.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Detailed Description */}
                    <section className="glass-card rounded-[3rem] p-10">
                        <label className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 block">
                            3. Issue Description
                        </label>
                        <textarea
                            required
                            className="w-full bg-slate-50/50 rounded-3xl p-8 text-xl font-medium text-slate-800 placeholder:text-slate-300 border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none modern-textarea"
                            rows={5}
                            placeholder="Tell us what's happening. The more detail, the faster an NGO can help..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </section>

                    {/* Location Detection */}
                    <section className="glass-card rounded-[3rem] p-10">
                        <div className="flex items-center justify-between mb-8">
                            <label className="font-black text-slate-900 uppercase tracking-widest text-xs">
                                4. Location Integration
                            </label>
                            <button 
                                type="button"
                                onClick={detectLocation}
                                disabled={detecting}
                                className="text-indigo-600 font-extrabold text-sm flex items-center gap-2 hover:underline disabled:opacity-50"
                            >
                                {detecting ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />}
                                {detecting ? 'Resolving Address...' : 'Detect My Location'}
                            </button>
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-6 text-slate-300" size={24} />
                            <input
                                required
                                type="text"
                                className="w-full bg-slate-50/50 rounded-[2.5rem] p-6 pl-16 text-lg font-bold text-slate-800 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Detect automatically or enter manually..."
                                value={formData.address}
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') e.preventDefault();
                                }}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </div>
                        
                        <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-4">
                            <ShieldCheck className="text-indigo-500 shrink-0" size={20} />
                            <p className="text-indigo-900/60 text-sm font-bold leading-snug">
                                Only verified NGOs in your immediate radius will see this request. No personal financial data is shared.
                            </p>
                        </div>
                    </section>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || !formData.description || !formData.category}
                        className="w-full bg-slate-900 text-white rounded-[2.5rem] py-8 text-2xl font-black flex items-center justify-center gap-4 shadow-3xl shadow-slate-200 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:hover:bg-slate-900"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={32} />
                        ) : (
                            <>
                                <Send size={28} />
                                <span>Broadcast Request</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default RequestNGOHelp;
