import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ListMusic } from 'lucide-react';

interface PaloSelectorProps {
  selectedPalo: string;
  onPaloChange: (palo: string) => void;
  disabled?: boolean;
}

export const PaloSelector: React.FC<PaloSelectorProps> = ({
  selectedPalo,
  onPaloChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const palos = [
    { key: 'tangos', name: 'Tangos' },
    { key: 'solea', name: 'Soleá' },
    { key: 'bulerias', name: 'Bulerías por Soleá' }
  ];

  const selectedPaloData = palos.find(palo => palo.key === selectedPalo);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (paloKey: string) => {
    onPaloChange(paloKey);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <ListMusic className="text-fire-500" size={28} />
        <h2 className="text-xl font-semibold text-gray-100">Selecciona un Palo</h2>
      </div>
      
      {/* Dropdown personalizado */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={`w-full flex items-center justify-between bg-dark-700 border border-dark-600 
                     rounded-lg px-4 py-3 text-left transition-all duration-200
                     ${disabled 
                       ? 'cursor-not-allowed opacity-50 bg-dark-800' 
                       : 'hover:border-fire-400 cursor-pointer hover:bg-dark-600'
                     }
                     ${isOpen ? 'border-fire-500 ring-2 ring-fire-500/20' : ''}`}
        >
          <div className="flex-1">
            <div className="text-gray-100 font-medium">
              {selectedPaloData?.name || 'Selecciona un Palo'}
            </div>
          </div>
          
          <ChevronDown 
            className={`w-5 h-5 transition-all duration-200 ${
              disabled ? 'text-gray-600' : 'text-gray-400'
            } ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {/* Menú desplegable */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 
                         rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
            {palos.map((palo, index) => (
              <button
                key={palo.key}
                onClick={() => handleSelect(palo.key)}
                className={`w-full text-left px-4 py-3 transition-all duration-200
                           hover:bg-dark-600 hover:border-l-4 hover:border-l-fire-500
                           ${selectedPalo === palo.key 
                             ? 'bg-dark-600 border-l-4 border-l-fire-500 text-fire-400' 
                             : 'text-gray-100'
                           }
                           ${index !== palos.length - 1 ? 'border-b border-dark-600' : ''}`}
              >
                <div className="font-medium text-center">{palo.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Información del palo seleccionado */}
      <div className="text-center">
        <div className="text-sm text-gray-400">
          Palo seleccionado: <span className="text-fire-400 font-medium">
            {selectedPaloData?.name || 'Ninguno'}
          </span>
        </div>
      </div>
    </div>
  );
};