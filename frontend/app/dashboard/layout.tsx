'use client';

import Sidebar from '../../src/components/Sidebar';
import Header from '../../src/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar />  
      <div className="flex-1 flex flex-col">
        
        <main className="p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}