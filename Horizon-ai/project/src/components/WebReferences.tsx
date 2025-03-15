import React from 'react';
import { ExternalLink, BookOpen, Search } from 'lucide-react';

interface WebReference {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface WebReferencesProps {
  references: WebReference[];
  isLoading: boolean;
  query: string;
}

export function WebReferences({ references, isLoading, query }: WebReferencesProps) {
  if (!query) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Web References</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ask a question to see relevant web references here
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Searching for references...</p>
      </div>
    );
  }

  if (references.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No References Found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We couldn't find any relevant web references for your query
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Web References</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Related information from the web
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {references.map((reference, index) => (
          <a 
            key={index}
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1 flex-1">
                {reference.title}
              </h4>
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-3">
              {reference.description}
            </p>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {reference.source}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}