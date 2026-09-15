import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminPublicationsTab } from './tabs/AdminPublicationsTab';
import { AdminNewsTab } from './tabs/AdminNewsTab';
import { AdminFacilitiesTab } from './tabs/AdminFacilitiesTab';
import { AdminTeamTab } from './tabs/AdminTeamTab';
import { AdminCollaboratorsTab } from './tabs/AdminCollaboratorsTab';
import { AdminInquiriesTab } from './tabs/AdminInquiriesTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { Shield } from 'lucide-react';

const AdminDashboardInner: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 rounded-2xl bg-maroon-900/60 border border-maroon-700 flex items-center justify-center text-maroon-400 animate-pulse">
          <Shield className="w-5 h-5" />
        </div>
        <div className="text-xs font-semibold tracking-wider uppercase text-slate-500">
          Verifying security authorization...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' && <AdminOverviewTab onSelectTab={setActiveTab} />}
      {activeTab === 'publications' && <AdminPublicationsTab />}
      {activeTab === 'news' && <AdminNewsTab />}
      {activeTab === 'facilities' && <AdminFacilitiesTab />}
      {activeTab === 'team' && <AdminTeamTab />}
      {activeTab === 'collaborators' && <AdminCollaboratorsTab />}
      {activeTab === 'inquiries' && <AdminInquiriesTab />}
      {activeTab === 'settings' && <AdminSettingsTab />}
    </AdminLayout>
  );
};

export const AdminApp: React.FC = () => {
  return (
    <AdminAuthProvider>
      <AdminDashboardInner />
    </AdminAuthProvider>
  );
};

export default AdminApp;
