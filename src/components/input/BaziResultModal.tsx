import React, { useCallback, useEffect, useRef } from 'react';
import type { BaziSearchResult } from '../../utils/baziTimeSearcher';
import { Colors, FontSize } from '../../styles/constants';

interface BaziResultModalProps {
  show: boolean;
  results: BaziSearchResult[];
  selectedResult: BaziSearchResult | null;
  onSelect: (result: BaziSearchResult) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const BaziResultModal: React.FC<BaziResultModalProps> = ({
  show,
  results,
  selectedResult,
  onSelect,
  onConfirm,
  onClose
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedIndex = results.findIndex(r => r === selectedResult);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (selectedIndex < results.length - 1) {
            onSelect(results[selectedIndex + 1]);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (selectedIndex > 0) {
            onSelect(results[selectedIndex - 1]);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedResult) {
            onConfirm();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, results, selectedResult, onSelect, onConfirm, onClose]);

  useEffect(() => {
    if (selectedResult && listRef.current) {
      const index = results.findIndex(r => r === selectedResult);
      if (index >= 0) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        items[index]?.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedResult, results]);

  const handleCancelClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleConfirmClick = useCallback(() => {
    if (selectedResult) {
      onConfirm();
    }
  }, [selectedResult, onConfirm]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          padding: 20,
          width: 400,
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{
          marginBottom: 15,
          textAlign: 'center',
          fontSize: FontSize.lg,
          color: Colors.text
        }}>
          选择时间（共 {results.length} 个匹配）
        </h3>

        <div
          ref={listRef}
          role="listbox"
          aria-label="匹配的时间列表"
          style={{
            border: `1px solid ${Colors.border}`,
            borderRadius: 8,
            overflow: 'hidden',
            flex: 1,
            overflowY: 'auto',
            marginBottom: 15
          }}
        >
          {results.map((result, index) => {
            const isSelected = selectedResult === result;
            return (
              <div
                key={`${result.year}-${result.month}-${result.day}-${result.hour}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => onSelect(result)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(result);
                  }
                }}
                style={{
                  padding: '12px 15px',
                  borderBottom: index < results.length - 1 ? `1px solid ${Colors.border}` : 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgb(245, 245, 220)' : (index % 2 === 0 ? Colors.white : 'rgb(250, 250, 250)'),
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'rgb(245, 245, 247)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? Colors.white : 'rgb(250, 250, 250)';
                  }
                }}
              >
                <div style={{
                  fontSize: FontSize.base,
                  fontWeight: 500,
                  color: Colors.text,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    公历：{result.year}-{String(result.month).padStart(2, '0')}-{String(result.day).padStart(2, '0')} {String(result.hour).padStart(2, '0')}:00
                  </span>
                  <span style={{ color: isSelected ? Colors.primary : Colors.textLight }}>
                    {isSelected ? '✓' : '>'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={handleCancelClick}
            style={{
              flex: 1,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${Colors.border}`,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: FontSize.base,
              color: Colors.text,
              backgroundColor: Colors.white
            }}
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={!selectedResult}
            style={{
              flex: 1,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedResult ? Colors.primary : 'rgb(200, 200, 200)',
              borderRadius: 8,
              cursor: selectedResult ? 'pointer' : 'not-allowed',
              fontSize: FontSize.base,
              color: Colors.white,
              border: 'none'
            }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaziResultModal;
