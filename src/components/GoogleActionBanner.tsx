import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

export function GoogleActionBanner({ message, link }: { message: string, link?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-between mt-4 p-4 bg-green-50/50 border border-green-200 rounded-lg">
      <div className="flex items-center text-green-700 font-medium">
        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
        {message}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">
          View <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      )}
    </div>
  );
}
