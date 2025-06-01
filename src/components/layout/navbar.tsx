
"use client";

import React from 'react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
           <SidebarTrigger className="md:hidden" />
          {!isMobile && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="https://placehold.co/28x28.png" 
                alt="CLMS BUIDCO Logo" 
                width={28} 
                height={28}
                data-ai-hint="logo buidco" 
              />
              <span className="text-xl font-semibold text-primary">CLMS BUIDCO</span>
            </Link>
          )}
        </div>
        
        {/* Notification bell and profile menu have been moved to the sidebar footer */}
        <div></div> {/* Empty div to maintain flex layout if needed, or can be removed if justify-between handles it */}
      </div>
    </header>
  );
};

export default Navbar;
