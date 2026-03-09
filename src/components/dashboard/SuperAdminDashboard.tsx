'use client';

import React, { useState } from 'react';
import { Shield, Users, Building, MonitorSmartphone, ChevronRight, UserX, Trash2, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

// --- MOCK DATA ---
const initialAdmins = [
    { id: 'ad-1', name: 'Alice Admin', email: 'alice@admin.com', phone: '+1234567890', avatar: 'AA', joinDate: '2023-01-15', status: 'Active', requestedBy: 'System', approvedBy: 'Super Admin', accessGivenBy: 'Super Admin' },
    { id: 'ad-2', name: 'Bob Admin', email: 'bob@admin.com', phone: '+1987654321', avatar: 'BA', joinDate: '2023-03-22', status: 'Active', requestedBy: 'System', approvedBy: 'Super Admin', accessGivenBy: 'Super Admin' },
];

const initialAgencies = [
    { id: 'ag-1', adminId: 'ad-1', name: 'Alpha Agency', email: 'contact@alpha.co', phone: '+1122334455', avatar: 'AA', joinDate: '2023-02-10', status: 'Active', requestedBy: 'Alice Admin', approvedBy: 'Alice Admin', accessGivenBy: 'Alice Admin' },
    { id: 'ag-2', adminId: 'ad-1', name: 'Beta Talent', email: 'hello@betatalent.com', phone: '+1122334466', avatar: 'BT', joinDate: '2023-04-05', status: 'Pending', requestedBy: 'External', approvedBy: 'Alice Admin', accessGivenBy: 'Pending' },
    { id: 'ag-3', adminId: 'ad-2', name: 'Gamma Creators', email: 'info@gammacreators.net', phone: '+1122334477', avatar: 'GC', joinDate: '2023-05-12', status: 'Active', requestedBy: 'Bob Admin', approvedBy: 'Bob Admin', accessGivenBy: 'Bob Admin' },
    { id: 'ag-4', adminId: 'ad-2', name: 'Delta Management', email: 'mgmt@delta.org', phone: '+1122334488', avatar: 'DM', joinDate: '2023-06-20', status: 'Blocked', requestedBy: 'External', approvedBy: 'Bob Admin', accessGivenBy: 'Bob Admin' },
];

const initialHosts = [
    { id: 'h-1', agencyId: 'ag-1', adminId: 'ad-1', name: 'Charlie Host', email: 'charlie@host.com', phone: '+1555000111', avatar: 'CH', joinDate: '2023-02-15', status: 'Active', requestedBy: 'Alpha Agency', approvedBy: 'Alpha Agency', accessGivenBy: 'Alpha Agency' },
    { id: 'h-2', agencyId: 'ag-1', adminId: 'ad-1', name: 'Diana Streamer', email: 'diana@stream.tv', phone: '+1555000222', avatar: 'DS', joinDate: '2023-03-01', status: 'Active', requestedBy: 'Alpha Agency', approvedBy: 'Alpha Agency', accessGivenBy: 'Alpha Agency' },
    { id: 'h-3', agencyId: 'ag-3', adminId: 'ad-2', name: 'Eve Live', email: 'eve@live.com', phone: '+1555000333', avatar: 'EL', joinDate: '2023-05-20', status: 'Pending', requestedBy: 'Gamma Creators', approvedBy: 'Pending', accessGivenBy: 'Pending' },
    { id: 'h-4', agencyId: 'ag-3', adminId: 'ad-2', name: 'Frank Gamer', email: 'frank@play.net', phone: '+1555000444', avatar: 'FG', joinDate: '2023-06-01', status: 'Active', requestedBy: 'Gamma Creators', approvedBy: 'Gamma Creators', accessGivenBy: 'Gamma Creators' },
];

const initialUsers = [
    { id: 'u-1', hostId: 'h-1', agencyId: 'ag-1', adminId: 'ad-1', role: 'user', name: 'User One', email: 'u1@mail.com', phone: '+19998887701', avatar: 'U1', joinDate: '2023-02-20', status: 'Active', requestedBy: 'Self', approvedBy: 'System', accessGivenBy: 'System' },
    { id: 'u-2', hostId: 'h-1', agencyId: 'ag-1', adminId: 'ad-1', role: 'user', name: 'User Two', email: 'u2@mail.com', phone: '+19998887702', avatar: 'U2', joinDate: '2023-02-25', status: 'Blocked', requestedBy: 'Self', approvedBy: 'System', accessGivenBy: 'System' },
    { id: 'u-3', hostId: 'h-2', agencyId: 'ag-1', adminId: 'ad-1', role: 'user', name: 'User Three', email: 'u3@mail.com', phone: '+19998887703', avatar: 'U3', joinDate: '2023-03-10', status: 'Active', requestedBy: 'Self', approvedBy: 'System', accessGivenBy: 'System' },
    { id: 'u-4', hostId: 'h-4', agencyId: 'ag-3', adminId: 'ad-2', role: 'user', name: 'User Four', email: 'u4@mail.com', phone: '+19998887704', avatar: 'U4', joinDate: '2023-06-15', status: 'Active', requestedBy: 'Self', approvedBy: 'System', accessGivenBy: 'System' },
];

export default function SuperAdminDashboard() {
    const [admins, setAdmins] = useState(initialAdmins);
    const [agencies, setAgencies] = useState(initialAgencies);
    const [hosts, setHosts] = useState(initialHosts);
    const [users, setUsers] = useState(initialUsers);

    // 'users', 'admins', 'agencies', 'hosts'
    const [currentTab, setCurrentTab] = useState('users');

    // Breadcrumb structure: [{ id, name, type }] (type: 'root', 'admin', 'agency', 'host', 'user')
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: 'root', name: 'Users', type: 'root' }]);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, entityType: '', entityId: '', entityName: '' });

    // Helpers to get nested data
    const getAgenciesForAdmin = (adminId: string) => agencies.filter(a => a.adminId === adminId);
    const getHostsForAgency = (agencyId: string) => hosts.filter(h => h.agencyId === agencyId);
    const getUsersForHost = (hostId: string) => users.filter(u => u.hostId === hostId);

    // Entities maps for quick lookup based on ID
    const getEntityByIdAndType = (id: string, type: string) => {
        switch (type) {
            case 'admin': return admins.find(a => a.id === id);
            case 'agency': return agencies.find(a => a.id === id);
            case 'host': return hosts.find(h => h.id === id);
            case 'user': return users.find(u => u.id === id);
            default: return null;
        }
    };

    const updateEntityStatus = (id: string, type: string, newStatus: string) => {
        switch (type) {
            case 'admin': setAdmins(admins.map(a => a.id === id ? { ...a, status: newStatus } : a)); break;
            case 'agency': setAgencies(agencies.map(a => a.id === id ? { ...a, status: newStatus } : a)); break;
            case 'host': setHosts(hosts.map(h => h.id === id ? { ...h, status: newStatus } : h)); break;
            case 'user': setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u)); break;
        }
    };

    const deleteEntity = (id: string, type: string) => {
        switch (type) {
            case 'admin': setAdmins(admins.filter(a => a.id !== id)); break;
            case 'agency': setAgencies(agencies.filter(a => a.id !== id)); break;
            case 'host': setHosts(hosts.filter(h => h.id !== id)); break;
            case 'user': setUsers(users.filter(u => u.id !== id)); break;
        }
        setDeleteModal({ isOpen: false, entityType: '', entityId: '', entityName: '' });

        // If we're deleting the currently viewed entity, go back one step in breadcrumbs
        const currentIndex = breadcrumbs.findIndex(b => b.id === id);
        if (currentIndex > 0) {
            setBreadcrumbs(breadcrumbs.slice(0, currentIndex));
        }
    };

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
        setBreadcrumbs([{ id: 'root', name: tab.charAt(0).toUpperCase() + tab.slice(1), type: 'root' }]);
    };

    const handleEntityClick = (entity: any, type: string) => {
        setBreadcrumbs([...breadcrumbs, { id: entity.id, name: entity.name, type }]);
    };

    const handleBreadcrumbClick = (index: number) => {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    const renderStatusBadge = (status: string) => {
        let colorClass, Icon;
        switch (status) {
            case 'Active': colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; Icon = CheckCircle; break;
            case 'Pending': colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20'; Icon = Clock; break;
            case 'Blocked': colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20'; Icon = AlertCircle; break;
            default: colorClass = 'bg-slate-500/10 text-slate-400 border-slate-500/20'; Icon = CheckCircle; break;
        }
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                <Icon className="w-3.5 h-3.5" />
                {status}
            </span>
        );
    };

    const renderActionButtons = (entity: any, type: string) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => updateEntityStatus(entity.id, type, entity.status === 'Blocked' ? 'Active' : 'Blocked')}
                className={`p-2 rounded-xl transition-all duration-200 ${entity.status === 'Blocked' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'}`}
                title={entity.status === 'Blocked' ? 'Unblock' : 'Block'}
            >
                <UserX className="w-4 h-4" />
            </button>
            <button
                onClick={() => setDeleteModal({ isOpen: true, entityType: type, entityId: entity.id, entityName: entity.name })}
                className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    const CurrentEntityProfile = ({ entity, type }: { entity: any, type: string }) => {
        let parentInfo = null;
        if (type === 'user') {
            const host = hosts.find(h => h.id === entity.hostId);
            const agency = agencies.find(a => a.id === entity.agencyId);
            const admin = admins.find(a => a.id === entity.adminId);
            parentInfo = (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Connected Host</p>
                        <p className="font-medium text-slate-200">{host?.name || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Approved Agency</p>
                        <p className="font-medium text-slate-200">{agency?.name || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Under Admin</p>
                        <p className="font-medium text-slate-200">{admin?.name || 'N/A'}</p>
                    </div>
                </div>
            );
        } else if (type === 'host') {
            const agency = agencies.find(a => a.id === entity.agencyId);
            const admin = admins.find(a => a.id === entity.adminId);
            parentInfo = (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Belongs to Agency</p>
                        <p className="font-medium text-slate-200">{agency?.name || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Approved by Admin</p>
                        <p className="font-medium text-slate-200">{admin?.name || 'N/A'}</p>
                    </div>
                </div>
            );
        } else if (type === 'agency') {
            const admin = admins.find(a => a.id === entity.adminId);
            parentInfo = (
                <div className="mt-8 grid grid-cols-1 gap-4">
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Approved by Admin</p>
                        <p className="font-medium text-slate-200">{admin?.name || 'N/A'}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-800">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                            {entity.avatar}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-white">{entity.name}</h2>
                                {renderStatusBadge(entity.status)}
                            </div>
                            <p className="text-slate-400 font-medium capitalize flex items-center gap-2">
                                {type === 'admin' ? <Shield className="w-4 h-4" /> : type === 'agency' ? <Building className="w-4 h-4" /> : type === 'host' ? <MonitorSmartphone className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                {type} Profile
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {renderActionButtons(entity, type)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <p className="text-slate-500 text-sm font-medium">Email Address</p>
                        <p className="text-slate-200">{entity.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 text-sm font-medium">Phone Number</p>
                        <p className="text-slate-200">{entity.phone}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 text-sm font-medium">Join Date</p>
                        <p className="text-slate-200">{entity.joinDate}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 text-sm font-medium">Internal ID</p>
                        <p className="text-slate-200 font-mono">{entity.id}</p>
                    </div>
                </div>

                {parentInfo}

                <div className="mt-8 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Activity Trail</h3>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                            <p className="text-slate-500 text-sm mb-1">Requested By</p>
                            <p className="text-slate-300 font-medium flex items-center gap-2"><ArrowLeft className="w-4 h-4 text-emerald-400" /> {entity.requestedBy}</p>
                        </div>
                        <div className="hidden md:block w-px bg-slate-700"></div>
                        <div className="flex-1">
                            <p className="text-slate-500 text-sm mb-1">Approved By</p>
                            <p className="text-slate-300 font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-400" /> {entity.approvedBy}</p>
                        </div>
                        <div className="hidden md:block w-px bg-slate-700"></div>
                        <div className="flex-1">
                            <p className="text-slate-500 text-sm mb-1">Access Given By</p>
                            <p className="text-slate-300 font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-purple-400" /> {entity.accessGivenBy}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const EntityList = ({ title, entities, type }: { title: string, entities: any[], type: string }) => (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {title} <span className="bg-slate-800 text-slate-400 text-sm px-2.5 py-0.5 rounded-full ml-2">{entities.length}</span>
            </h3>
            {entities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {entities.map((entity: any) => (
                        <div
                            key={entity.id}
                            onClick={() => handleEntityClick(entity, type)}
                            className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-indigo-500/10"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-lg font-bold text-white group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                        {entity.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-slate-100 font-semibold text-lg">{entity.name}</h4>
                                        <p className="text-slate-400 text-sm">{entity.email}</p>
                                    </div>
                                </div>
                                {renderActionButtons(entity, type)}
                            </div>
                            <div className="flex items-center justify-between mt-4 p-3 bg-slate-900/50 rounded-xl">
                                {renderStatusBadge(entity.status)}
                                <span className="text-indigo-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-slate-700/30 border-dashed">
                    <p className="text-slate-400">No {title.toLowerCase()} found.</p>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

        if (currentBreadcrumb.type === 'root') {
            // Show root lists based on tabs
            if (currentTab === 'users') return <EntityList title="All Registered Users" entities={users} type="user" />;
            if (currentTab === 'admins') return <EntityList title="All System Admins" entities={admins} type="admin" />;
            if (currentTab === 'agencies') return <EntityList title="All Connected Agencies" entities={agencies} type="agency" />;
            if (currentTab === 'hosts') return <EntityList title="All Approved Hosts" entities={hosts} type="host" />;
        } else {
            // Drilled down view
            const entity = getEntityByIdAndType(currentBreadcrumb.id, currentBreadcrumb.type);
            if (!entity) return <div className="text-center py-20 text-slate-400">Entity not found.</div>;

            return (
                <div className="space-y-8 fade-in">
                    <CurrentEntityProfile entity={entity} type={currentBreadcrumb.type} />

                    {/* Show children based on entity type */}
                    {currentBreadcrumb.type === 'admin' && (
                        <EntityList title={`Agencies under ${entity.name}`} entities={getAgenciesForAdmin(entity.id)} type="agency" />
                    )}
                    {currentBreadcrumb.type === 'agency' && (
                        <EntityList title={`Hosts under ${entity.name}`} entities={getHostsForAgency(entity.id)} type="host" />
                    )}
                    {currentBreadcrumb.type === 'host' && (
                        <EntityList title={`Users connected to ${entity.name}`} entities={getUsersForHost(entity.id)} type="user" />
                    )}
                </div>
            );
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Sidebar */}
            <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col pt-6 z-10 relative">
                <div className="px-8 pb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Super Admin</h1>
                        <p className="text-xs font-medium text-slate-500 tracking-wider">PLATFORM CONTROL</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {[
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'admins', label: 'Admins', icon: Shield },
                        { id: 'agencies', label: 'Agencies', icon: Building },
                        { id: 'hosts', label: 'Hosts', icon: MonitorSmartphone },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${currentTab === tab.id && breadcrumbs.length === 1
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${currentTab === tab.id && breadcrumbs.length === 1 ? 'text-indigo-400' : 'text-slate-500'}`} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-400">
                        <p className="font-semibold text-slate-300 mb-1">Hierarchy Demo</p>
                        <p className="text-xs">Admin → Agency → Host → User Drilldown is fully functional.</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Topbar & Breadcrumbs */}
                <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center px-10 sticky top-0 z-20">
                    <div className="flex items-center text-sm font-medium">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={`${crumb.id}-${index}`}>
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className={`transition-colors flex items-center ${index === breadcrumbs.length - 1 ? 'text-white' : 'text-slate-400 hover:text-indigo-400'}`}
                                >
                                    {crumb.name}
                                </button>
                                {index < breadcrumbs.length - 1 && (
                                    <ChevronRight className="w-4 h-4 mx-3 text-slate-600" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto pb-20">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Delete {deleteModal.entityType}?</h3>
                        <p className="text-slate-400 mb-8">
                            Are you sure you want to delete <span className="text-white font-semibold">{deleteModal.entityName}</span>? This action cannot be undone and will permanently remove this record.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, entityType: '', entityId: '', entityName: '' })}
                                className="flex-1 px-5 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteEntity(deleteModal.entityId, deleteModal.entityType)}
                                className="flex-1 px-5 py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgb(30 41 59);
          border-radius: 20px;
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </div>
    );
}
