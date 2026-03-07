"use client";

import React from 'react';

const FloatingCard = ({ className = '', children }) => {
     return (
          <div className={`absolute bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 z-20 ${className}`}>
               {children}
          </div>
     );
};

export default FloatingCard;
