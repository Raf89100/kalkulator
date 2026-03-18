/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, RotateCcw, Equal, Plus, Minus, X, Divide, Percent } from 'lucide-react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(current);
      setEquation(`${current} ${op}`);
    } else if (operator) {
      const result = calculate(prevValue, current, operator);
      setPrevValue(result);
      setEquation(`${result} ${op}`);
      setDisplay(String(result));
    }
    
    setOperator(op);
    setIsNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (prevValue === null || operator === null) return;
    
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    
    setEquation(`${prevValue} ${operator} ${current} =`);
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setIsNewNumber(false);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleNumber(e.key);
      if (['+', '-', '*', '/'].includes(e.key)) {
        const opMap: Record<string, string> = { '*': '×', '/': '÷', '+': '+', '-': '-' };
        handleOperator(opMap[e.key]);
      }
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') handleClear();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === '.') handleDecimal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operator, isNewNumber]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-black/5"
        id="calculator-container"
      >
        {/* Display Area */}
        <div className="p-8 bg-white flex flex-col items-end justify-end min-h-[200px] relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={equation}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.5, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-sm font-medium text-black/40 mb-2 uppercase tracking-widest"
              id="equation-display"
            >
              {equation}
            </motion.div>
          </AnimatePresence>
          <motion.div 
            key={display}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-light tracking-tighter text-black truncate w-full text-right"
            id="main-display"
          >
            {display}
          </motion.div>
        </div>

        {/* Buttons Grid */}
        <div className="p-6 grid grid-cols-4 gap-3 bg-[#fafafa]" id="buttons-grid">
          {/* Row 1 */}
          <CalcButton onClick={handleClear} className="bg-black/5 text-black" id="btn-clear">
            <RotateCcw size={20} />
          </CalcButton>
          <button onClick={handleToggleSign} className="h-16 rounded-2xl flex items-center justify-center text-xl font-medium bg-black/5 text-black hover:bg-black/10 transition-colors" id="btn-toggle-sign">
            +/-
          </button>
          <CalcButton onClick={handlePercent} className="bg-black/5 text-black" id="btn-percent">
            <Percent size={20} />
          </CalcButton>
          <CalcButton onClick={() => handleOperator('÷')} className="bg-black text-white" id="btn-divide">
            <Divide size={20} />
          </CalcButton>

          {/* Row 2 */}
          <CalcButton onClick={() => handleNumber('7')} id="btn-7">7</CalcButton>
          <CalcButton onClick={() => handleNumber('8')} id="btn-8">8</CalcButton>
          <CalcButton onClick={() => handleNumber('9')} id="btn-9">9</CalcButton>
          <CalcButton onClick={() => handleOperator('×')} className="bg-black text-white" id="btn-multiply">
            <X size={20} />
          </CalcButton>

          {/* Row 3 */}
          <CalcButton onClick={() => handleNumber('4')} id="btn-4">4</CalcButton>
          <CalcButton onClick={() => handleNumber('5')} id="btn-5">5</CalcButton>
          <CalcButton onClick={() => handleNumber('6')} id="btn-6">6</CalcButton>
          <CalcButton onClick={() => handleOperator('-')} className="bg-black text-white" id="btn-minus">
            <Minus size={20} />
          </CalcButton>

          {/* Row 4 */}
          <CalcButton onClick={() => handleNumber('1')} id="btn-1">1</CalcButton>
          <CalcButton onClick={() => handleNumber('2')} id="btn-2">2</CalcButton>
          <CalcButton onClick={() => handleNumber('3')} id="btn-3">3</CalcButton>
          <CalcButton onClick={() => handleOperator('+')} className="bg-black text-white" id="btn-plus">
            <Plus size={20} />
          </CalcButton>

          {/* Row 5 */}
          <CalcButton onClick={() => handleNumber('0')} className="col-span-1" id="btn-0">0</CalcButton>
          <CalcButton onClick={handleDecimal} id="btn-decimal">.</CalcButton>
          <CalcButton onClick={handleBackspace} className="bg-black/5 text-black" id="btn-backspace">
            <Delete size={20} />
          </CalcButton>
          <CalcButton onClick={handleEqual} className="bg-emerald-500 text-white" id="btn-equal">
            <Equal size={24} />
          </CalcButton>
        </div>
      </motion.div>
    </div>
  );
}

function CalcButton({ 
  children, 
  onClick, 
  className = "", 
  id 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  className?: string;
  id: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      id={id}
      className={`
        h-16 rounded-2xl flex items-center justify-center text-xl font-medium
        transition-colors duration-200
        ${className || "bg-white text-black hover:bg-black/5 border border-black/5"}
      `}
    >
      {children}
    </motion.button>
  );
}

