import React from 'react';

function StatistikIcon(props) {
  return (
    <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 40H42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M6 40V6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M12 30L22 18L30 26L40 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="30" r="3" fill="currentColor"/>
      <circle cx="22" cy="18" r="3" fill="currentColor"/>
      <circle cx="30" cy="26" r="3" fill="currentColor"/>
      <circle cx="40" cy="10" r="3" fill="currentColor"/>
    </svg>
  );
}

export default StatistikIcon;
