'use client';

import { Plus, Grid, Folder, Settings } from 'lucide-react';

interface CompactActionButtonsProps {
  onAddActivity?: () => void;
  onViewActivities?: () => void;
  onAddCategory?: () => void;
  onViewCategories?: () => void;
  onSettings?: () => void;
}

export default function CompactActionButtons({
  onAddActivity,
  onViewActivities,
  onAddCategory,
  onViewCategories,
  onSettings
}: CompactActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Quick Actions Title */}
      <div className="flex items-center">
        <span className="text-lg font-semibold text-gray-900">Quick Actions</span>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-300"></div>

      {/* Activities */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddActivity}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Activity
        </button>
        <button
          onClick={onViewActivities}
          className="flex items-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 text-sm font-medium"
        >
          <Grid className="h-4 w-4" />
          Activities
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddCategory}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Category
        </button>
        <button
          onClick={onViewCategories}
          className="flex items-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 text-sm font-medium"
        >
          <Folder className="h-4 w-4" />
          Categories
        </button>
      </div>
    </div>
  );
}