import React, { useState, useEffect } from 'react';
import { ExternalLink, Calculator, Globe, Clock, Edit2 } from 'lucide-react';
import { Navigation } from 'lucide-react';
import QuickLinksEditor from './QuickLinksEditor';

function ToolsTab({ krwRate = 0.006, onChangeKrwRate, quickLinks = [], onQuickLinksChange }) {
  const [krwAmount, setKrwAmount] = useState('');
  const [hkdAmount, setHkdAmount] = useState('');
  const [calculatorDisplay, setCalculatorDisplay] = useState('');
  const [focusedCurrency, setFocusedCurrency] = useState(null);
  const [calcResult, setCalcResult] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEditor, setShowEditor] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleKrwRateChange = (e) => {
    if (onChangeKrwRate) {
      onChangeKrwRate(parseFloat(e.target.value) || 0);
    }
  };

  const convertKRWtoHKD = (krw) => {
    const amount = parseFloat(krw) || 0;
    return (amount * krwRate).toFixed(2);
  };

  const convertHKDtoKRW = (hkd) => {
    const amount = parseFloat(hkd) || 0;
    return (amount / krwRate).toFixed(0);
  };

  const handleCalculatorInput = (value) => {
    if (value === 'C') {
      setCalculatorDisplay('');
      setCalcResult(null);
    } else if (value === '=') {
      try {
        // Replace * with × and / with ÷ for eval safety
        const expression = calculatorDisplay
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        const result = eval(expression);
        if (!isNaN(result) && isFinite(result)) {
          const formattedResult = result % 1 === 0 ? result.toString() : result.toFixed(2);
          setCalcResult(formattedResult);
          setCalculatorDisplay(formattedResult);

          // Set the value to the focused input
          if (focusedCurrency === 'KRW') {
            setKrwAmount(formattedResult);
            setHkdAmount(convertKRWtoHKD(formattedResult));
          } else if (focusedCurrency === 'HKD') {
            setHkdAmount(formattedResult);
            setKrwAmount(convertHKDtoKRW(formattedResult));
          }
        }
      } catch {
        setCalcResult('Error');
      }
    } else {
      setCalculatorDisplay(calculatorDisplay + value);
      setCalcResult(null);
    }
  };

  const handleKRWChange = (e) => {
    const value = e.target.value;
    setKrwAmount(value);
    setHkdAmount(convertKRWtoHKD(value));
  };

  const handleHKDChange = (e) => {
    const value = e.target.value;
    setHkdAmount(value);
    setKrwAmount(convertHKDtoKRW(value));
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold">Tools & Widgets</h2>

      {/* Quick Links Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-600">Quick Links</h3>
          <button
            onClick={() => setShowEditor(true)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Edit links"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.length === 0 ? (
            <div className="col-span-2 text-center py-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs text-slate-500">No quick links yet. Tap edit to add.</p>
            </div>
          ) : (
            quickLinks.map((link, index) => {
              // Determine color classes based on link.color (default to blue)
              const colorMap = {
                blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', externalLink: 'text-blue-500' },
                white: { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-800', externalLink: 'text-slate-400' },
                green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', externalLink: 'text-green-500' },
                amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', externalLink: 'text-amber-500' },
                rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', externalLink: 'text-rose-500' },
                violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', externalLink: 'text-violet-500' },
              };
              const color = colorMap[link.color] || colorMap.blue;

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2 ${color.bg} ${color.border} border rounded-lg hover:brightness-95 transition-colors`}
                >
                  <span className="text-base flex-shrink-0">{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${color.text} truncate`}>{link.title}</div>
                  </div>
                  <ExternalLink className={`w-3 h-3 ${color.externalLink} flex-shrink-0`} />
                </a>
              );
            })
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Time Zone Widget */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow col-span-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-600 uppercase">Time Zone</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 bg-emerald-50/50 rounded-lg p-1.5">
                <div className="text-[9px] text-emerald-700 font-medium">Seoul</div>
                <div className="text-sm font-mono font-medium text-emerald-900">
                  {currentTime.toLocaleTimeString('en-US', {
                    timeZone: 'Asia/Seoul',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
              <div className="flex-1 bg-amber-50/50 rounded-lg p-1.5">
                <div className="text-[9px] text-amber-700 font-medium">Hong Kong</div>
                <div className="text-sm font-mono font-medium text-amber-900">
                  {currentTime.toLocaleTimeString('en-US', {
                    timeZone: 'Asia/Hong_Kong',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Currency Calculator */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-colors col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-semibold text-slate-600 uppercase">Currency Converter</span>
            </div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-1 h-5 bg-slate-300 rounded-full"></div>
              <span className="text-xs text-slate-500">Rate: 1 KRW =</span>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={krwRate}
                onChange={handleKrwRateChange}
                className="w-24 px-2 py-0.5 text-xs font-mono border border-indigo-200 rounded focus:outline-none focus:border-indigo-400"
                title="Set KRW to HKD conversion rate"
              />
              <span className="text-xs text-slate-600">HKD</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-600 mb-1 block">KRW</label>
                <input
                  type="number"
                  value={krwAmount}
                  onChange={handleKRWChange}
                  onFocus={() => setFocusedCurrency('KRW')}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm bg-indigo-50 border border-indigo-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1 block">HKD</label>
                <input
                  type="number"
                  value={hkdAmount}
                  onChange={handleHKDChange}
                  onFocus={() => setFocusedCurrency('HKD')}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm bg-indigo-50 border border-indigo-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Calculator</span>
                {focusedCurrency && (
                  <span className="text-[10px] text-indigo-600 font-medium">
                    Target: {focusedCurrency}
                  </span>
                )}
              </div>
              <div className="bg-white rounded-lg p-3 mb-3">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px] mb-0.5 min-h-[12px]">
                    {calculatorDisplay || 'Ready'}
                  </div>
                  <div className="text-lg font-light text-slate-800 font-mono">
                    {calcResult !== null ? (
                      <span>
                        {calculatorDisplay}
                        <span className="text-indigo-600 font-semibold ml-1">= {calcResult}</span>
                      </span>
                    ) : (
                      calculatorDisplay || '0'
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map(
                  (btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleCalculatorInput(btn)}
                      className={`py-2 text-sm font-medium rounded-lg transition-colors ${
                        ['+', '-', '×', '÷'].includes(btn)
                          ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                          : btn === '='
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {btn}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => handleCalculatorInput('C')}
                  className="col-span-4 py-2 text-xs font-medium bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Links Editor Modal */}
      <QuickLinksEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        links={quickLinks}
        onSave={(newLinks) => {
          onQuickLinksChange(newLinks);
          setShowEditor(false);
        }}
      />
    </div>
  );
}

export default ToolsTab;
