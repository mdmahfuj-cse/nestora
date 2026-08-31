import React, { useEffect } from 'react';
import { VirtualTourData, Property } from '../../types';
import { VirtualTourViewer } from './VirtualTourViewer';

interface VirtualTourModalProps {
  isOpen: boolean;
  tour: VirtualTourData;
  property?: Property;
  onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  isOpen,
  tour,
  property,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="virtual-tour-fullbrowser-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300 w-screen h-screen overflow-hidden"
    >
      <div className="relative w-full h-full">
        <VirtualTourViewer
          tour={tour}
          property={property}
          onClose={onClose}
          isModal={true}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
