import React, { useMemo } from 'react';
import { formatBDT, formatBDTShort } from '../../lib/utils';
import { Property } from '../../types';

interface PriceHistogramSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
  properties: Property[];
}

export const PriceHistogramSlider: React.FC<PriceHistogramSliderProps> = ({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
  properties,
}) => {
  // Generate 24 histogram buckets based on property distribution
  const bucketCount = 20;
  const bucketWidth = (max - min) / bucketCount;

  const histogramData = useMemo(() => {
    const buckets = Array(bucketCount).fill(0);
    properties.forEach((p) => {
      if (p.price >= min && p.price <= max) {
        const bucketIndex = Math.min(
          bucketCount - 1,
          Math.floor((p.price - min) / bucketWidth)
        );
        buckets[bucketIndex] += 1;
      }
    });
    const maxCount = Math.max(...buckets, 1);
    return buckets.map((count) => count / maxCount);
  }, [properties, min, max, bucketWidth]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), currentMax - 5000);
    onChange(value, currentMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), currentMin + 5000);
    onChange(currentMin, value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#3f3531]">
        <span>Price Range (BDT / month)</span>
        <span className="text-[#c9996b]">
          {formatBDT(currentMin)} – {formatBDT(currentMax)}
        </span>
      </div>

      {/* Visual Histogram Bars */}
      <div className="h-14 flex items-end gap-1 px-1 pt-2">
        {histogramData.map((heightRatio, idx) => {
          const bucketPrice = min + idx * bucketWidth;
          const isInRange = bucketPrice >= currentMin && bucketPrice <= currentMax;
          const barHeight = Math.max(12, Math.round(heightRatio * 44));

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                style={{ height: `${barHeight}px` }}
                className={`w-full rounded-t-xs transition-all duration-200 ${
                  isInRange
                    ? 'bg-[#c9996b]'
                    : 'bg-[#5c4f4a]/20'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Dual Range Sliders Container */}
      <div className="relative pt-2 pb-1" role="group" aria-label="Price range filter controls">
        <div className="h-2 bg-stone-200 rounded-full relative" aria-hidden="true">
          <div
            className="absolute top-0 bottom-0 bg-[#c9996b] rounded-full"
            style={{
              left: `${((currentMin - min) / (max - min)) * 100}%`,
              right: `${100 - ((currentMax - min) / (max - min)) * 100}%`,
            }}
          />
        </div>

        <input
          type="range"
          id="price-range-min-slider"
          min={min}
          max={max}
          step={5000}
          value={currentMin}
          onChange={handleMinChange}
          aria-label="Minimum monthly rent price in BDT"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentMin}
          aria-valuetext={`${formatBDT(currentMin)} per month`}
          className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto h-6 -top-2"
        />
        <input
          type="range"
          id="price-range-max-slider"
          min={min}
          max={max}
          step={5000}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label="Maximum monthly rent price in BDT"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentMax}
          aria-valuetext={`${formatBDT(currentMax)} per month`}
          className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto h-6 -top-2"
        />
      </div>

      {/* Number Input Boxes */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 bg-white p-2 rounded-xl border border-[#5c4f4a]/20">
          <label className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase block">Minimum</label>
          <div className="text-xs font-bold text-[#3f3531] mt-0.5">{formatBDT(currentMin)}</div>
        </div>
        <span className="text-[#5c4f4a]/40 font-bold">-</span>
        <div className="flex-1 bg-white p-2 rounded-xl border border-[#5c4f4a]/20">
          <label className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase block">Maximum</label>
          <div className="text-xs font-bold text-[#3f3531] mt-0.5">{formatBDT(currentMax)}</div>
        </div>
      </div>
    </div>
  );
};
