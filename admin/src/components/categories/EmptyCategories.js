import React from 'react';
import { FolderPlus } from 'lucide-react';
import Button from '../UI/Button';

const EmptyCategories = ({ onAddCategory, isFiltered = false }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
      <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {isFiltered ? 'No categories found' : 'No categories yet'}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {isFiltered 
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Get started by creating a new category.'}
      </p>
      {!isFiltered && (
        <div className="mt-6">
          <Button
            onClick={onAddCategory}
            variant="primary"
            size="md"
            icon={<FolderPlus className="w-5 h-5 mr-2" />}
          >
            Add Category
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyCategories;
