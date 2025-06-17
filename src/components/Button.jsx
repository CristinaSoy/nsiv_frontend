import React from 'react';

const Button = ({ text, onClick, type = 'primary' }) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${type}`}
    >
      {text}
    </button>
  );
};

export default Button; 