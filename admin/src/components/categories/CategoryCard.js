import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, EyeOff, ChevronRight, Folder, Star } from 'lucide-react';

const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete,
  onViewSubcategories,
  isSubcategoriesView = false
}) => {
  const { 
    _id, 
    name, 
    description, 
    image, 
    isActive, 
    productCount = 0, 
    subcategoriesCount = 0,
    isFeatured,
    slug
  } = category;

  return (
    <motion.div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      {/* Image Section */}
      <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden">
        {image?.url ? (
          <img 
            src={image.url} 
            alt={image.alt || name} 
            className="object-cover w-full h-48"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Folder className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {isFeatured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                Active
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
                Inactive
              </>
            )}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2" title={name}>
          {name}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2" title={description}>
            {description}
          </p>
        )}
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex space-x-3">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {productCount}
              </span>
              
              {!isSubcategoriesView && subcategoriesCount > 0 && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onViewSubcategories(category);
                  }}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {subcategoriesCount} subcategories
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
              
              {isSubcategoriesView && subcategoriesCount > 0 && (
                <span className="inline-flex items-center">
                  <Folder className="w-4 h-4 mr-1" />
                  {subcategoriesCount} sub
                </span>
              )}
            </div>
            
            <div className="flex space-x-1">
              <Link 
                to={`/categories/${_id}`}
                className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(category);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(category);
                }}
                className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
