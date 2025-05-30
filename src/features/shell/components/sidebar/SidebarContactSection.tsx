'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Youtube,
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Copy,
  Check,
  MessageCircle,
  Share2,
  Link
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export const SidebarContactSection = () => {
  const { collapsed } = useSidebar();
  const [copied, setCopied] = useState(false);
  
  // Format the phone number for display (adding spaces for readability)
  const phoneNumber = "+92 311 1786440";
  const whatsappLink = "https://wa.me/923111786440";
  
  const handleCopyNumber = () => {
    navigator.clipboard.writeText("923111786440").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (collapsed) {
    // Collapsed view - only show icons
    return (
      <div className="mt-auto px-2 py-4 border-t">
        <div className="flex flex-col items-center space-y-4">
          {/* WhatsApp */}
          <a 
            href={whatsappLink} 
            className="w-9 h-9 flex items-center justify-center bg-green-100 rounded-full text-green-600 hover:bg-green-200 transition-all relative"
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp: ${phoneNumber}`}
            aria-label={`Contact us on WhatsApp at ${phoneNumber}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </a>
          
          {/* YouTube */}
          <a 
            href="https://www.youtube.com/@official.PharmacyHub" 
            className="w-8 h-8 flex items-center justify-center rounded-full text-red-600 hover:bg-gray-100 transition-all"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
          >
            <Youtube className="h-4 w-4" />
          </a>
          
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/official.pharmacyhub" 
            className="w-8 h-8 flex items-center justify-center rounded-full text-blue-600 hover:bg-gray-100 transition-all"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/official.pharmacyhub/" 
            className="w-8 h-8 flex items-center justify-center rounded-full text-pink-600 hover:bg-gray-100 transition-all"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/pharmacy-hub/" 
            className="w-8 h-8 flex items-center justify-center rounded-full text-blue-800 hover:bg-gray-100 transition-all"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          
          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@official.pharmacyhub" 
            className="w-8 h-8 flex items-center justify-center rounded-full text-black hover:bg-gray-100 transition-all"
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="mt-auto px-3 py-4 border-t space-y-4">
      {/* CONTACT US SECTION */}
      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        <div className="bg-gradient-to-r from-blue-50 to-white px-3 py-2 border-b">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <Phone className="h-3.5 w-3.5 mr-2 text-blue-600" />
            Contact Us
          </h3>
        </div>
        
        <div className="p-3 space-y-2.5">

          {/* WhatsApp Card */}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-3 cursor-pointer hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div className="ml-2.5">
                <div className="text-xs text-gray-500 font-medium">WhatsApp</div>
                <div className="text-sm font-semibold text-gray-800">Message Us</div>
              </div>
            </div>
            
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200">
              <MessageCircle className="h-3 w-3 text-gray-500" />
            </div>
          </a>
          <div onClick={() => window.open(`tel:+923111786440`, '_blank')}
               className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-3 cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="ml-2.5">
                <div className="text-xs font-semibold text-gray-800">+923111786440</div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyNumber();
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
              title="Copy number"
            >
              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-gray-500" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* SOCIAL MEDIA SECTION */}
      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        <div className="bg-gradient-to-r from-purple-50 to-white px-3 py-2 border-b">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <Share2 className="h-3.5 w-3.5 mr-2 text-purple-600" />
            Connect With Us
          </h3>
        </div>
        
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@official.PharmacyHub" 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mb-1.5">
                <Youtube className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-xs text-gray-600">YouTube</span>
            </a>
            
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/official.pharmacyhub" 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mb-1.5">
                <Facebook className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Facebook</span>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/official.pharmacyhub/" 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full mb-1.5">
                <Instagram className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-xs text-gray-600">Instagram</span>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/pharmacy-hub/" 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mb-1.5">
                <Linkedin className="h-4 w-4 text-blue-800" />
              </div>
              <span className="text-xs text-gray-600">LinkedIn</span>
            </a>
            
            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@official.pharmacyhub" 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mb-1.5">
                <svg className="h-4 w-4 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">TikTok</span>
            </a>
            
            {/* Website Link */}
            <a 
              href="https://pharmacyhub.pk" 
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Website"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full mb-1.5">
                <Link className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-xs text-gray-600">Website</span>
            </a>
          </div>
        </div>
      </div>


    </div>
  );
};
