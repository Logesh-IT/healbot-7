
import React, { useState, useEffect } from 'react';
import { User, InsuranceRequest } from '../types';

interface BookingRecord {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceType: string;
  patientName: string;
  patientEmail: string;
  details: string;
  timestamp: string;
  status: 'Pending' | 'Confirmed' | 'Delivered';
}

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [insuranceRequests, setInsuranceRequests] = useState<InsuranceRequest[]>([]);
  const [serviceBookings, setServiceBookings] = useState<BookingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'BOOKINGS' | 'STATS'>('STATS');

  useEffect(() => {
    loadData();
    // Listen for cross-component clear events
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const loadData = () => {
    const rawUsers = localStorage.getItem('hb_users');
    const rawIns = localStorage.getItem('hb_insurance_requests');
    const rawBook = localStorage.getItem('hb_service_bookings');
    
    setUsers(rawUsers ? JSON.parse(rawUsers) : []);
    setInsuranceRequests(rawIns ? JSON.parse(rawIns) : []);
    setServiceBookings(rawBook ? JSON.parse(rawBook) : []);
  };

  const deleteUser = (email: string) => {
    if (window.confirm(`Permanently remove user ${email}?`)) {
      const updated = users.filter(u => u.email !== email);
      setUsers(updated);
      localStorage.setItem('hb_users', JSON.stringify(updated));
    }
  };

  const updateBookingStatus = (id: string, status: any) => {
    const updated = serviceBookings.map(b => b.id === id ? { ...b, status } : b);
    setServiceBookings(updated);
    localStorage.setItem('hb_service_bookings', JSON.stringify(updated));
  };

  const deleteBooking = (id: string) => {
    if (window.confirm(`Remove clinical record ${id}?`)) {
      const updated = serviceBookings.filter(b => b.id !== id);
      setServiceBookings(updated);
      localStorage.setItem('hb_service_bookings', JSON.stringify(updated));
    }
  };

  const clearAllBookings = () => {
    if (window.confirm("WARNING: Are you sure you want to purge the ENTIRE Clinical Task Registry? This cannot be undone.")) {
      setServiceBookings([]);
      localStorage.removeItem('hb_service_bookings');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 h-full overflow-hidden">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-xl shadow-amber-900/40">
               <i className="fas fa-user-shield"></i>
             </div>
             <div>
               <h2 className="text-2xl font-black uppercase tracking-tighter">Command Center</h2>
               <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Clinical Governance Oversight</p>
             </div>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-2xl">
            {(['STATS', 'USERS', 'BOOKINGS'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {tab === 'BOOKINGS' ? 'Clinical Tasks' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'STATS' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Total Patients</p>
                  <p className="text-4xl font-black text-slate-900">{users.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Service Bookings</p>
                  <p className="text-4xl font-black text-blue-600">{serviceBookings.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Insurance Apps</p>
                  <p className="text-4xl font-black text-purple-600">{insuranceRequests.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Active Nodes</p>
                  <p className="text-4xl font-black text-green-600">82</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Master Patient Registry</h3>
                <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full">{users.length} Users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase text-slate-400 bg-slate-50/50">
                    <tr><th className="px-8 py-4">ID</th><th className="px-8 py-4">Name</th><th className="px-8 py-4">Age/Sex</th><th className="px-8 py-4">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs font-black text-blue-600">{u.patientId}</td>
                        <td className="px-8 py-6 font-bold text-slate-900 text-sm">{u.username}<p className="text-[10px] font-medium text-slate-400 lowercase">{u.email}</p></td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-700 uppercase">{u.age}Y | {u.gender}</td>
                        <td className="px-8 py-6"><button onClick={() => deleteUser(u.email)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash"></i></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'BOOKINGS' && (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Global Clinical Task Registry</h3>
                {serviceBookings.length > 0 && (
                  <button 
                    onClick={clearAllBookings}
                    className="text-[10px] font-black uppercase text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                  >
                    Purge All Records
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase text-slate-400 bg-slate-50/50">
                    <tr><th className="px-8 py-4">Ref ID</th><th className="px-8 py-4">Service & Type</th><th className="px-8 py-4">Patient Detail</th><th className="px-8 py-4">Status</th><th className="px-8 py-4">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {serviceBookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs font-black text-blue-600">{b.id}</td>
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-900 text-sm">{b.serviceTitle}</p>
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{b.serviceType}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-700 text-xs">{b.patientName}</p>
                           <p className="text-[10px] text-slate-400 font-medium max-w-xs truncate">{b.details}</p>
                        </td>
                        <td className="px-8 py-6">
                           <select 
                            value={b.status} 
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className={`bg-slate-100 border-none rounded-lg text-[9px] font-black uppercase p-2 focus:ring-2 focus:ring-blue-500 ${b.status === 'Confirmed' ? 'text-green-600' : 'text-amber-600'}`}
                           >
                             <option>Pending</option>
                             <option>Confirmed</option>
                             <option>Delivered</option>
                           </select>
                        </td>
                        <td className="px-8 py-6">
                           <button onClick={() => deleteBooking(b.id)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash-alt"></i></button>
                        </td>
                      </tr>
                    ))}
                    {serviceBookings.length === 0 && (
                      <tr><td colSpan={5} className="py-32 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No clinical tasks currently active</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="bg-white p-4 border-t border-slate-200 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
        <i className="fas fa-microchip text-blue-500 mr-2"></i> Neural-Link Operational • Clinical Governance Console v9.2
      </div>
    </div>
  );
};

export default AdminDashboard;
