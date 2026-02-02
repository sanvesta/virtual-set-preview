import React, { useState, useEffect } from 'react';

// Mock data for dropdowns
const SHOW_TYPES = [
  'Talk Show', 'News Broadcast', 'Interview', 'Panel Discussion', 
  'Podcast', 'Corporate Presentation', 'Entertainment'
];

const MOOD_OPTIONS = [
  { id: 'professional', label: 'Professional', emoji: '💼', color: 'bg-slate-600' },
  { id: 'warm', label: 'Warm & Inviting', emoji: '🌅', color: 'bg-amber-500' },
  { id: 'modern', label: 'Modern & Sleek', emoji: '✨', color: 'bg-cyan-500' },
  { id: 'dramatic', label: 'Dramatic', emoji: '🎭', color: 'bg-purple-600' },
  { id: 'minimal', label: 'Minimal & Clean', emoji: '◻️', color: 'bg-gray-400' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: 'bg-orange-500' },
];

const ELEMENT_OPTIONS = [
  'City Skyline', 'Abstract Shapes', 'LED Screens', 'Plants/Greenery',
  'Bookshelves', 'World Map', 'Brand Logo Area', 'Animated Graphics',
  'Soft Lighting', 'Neon Accents', 'Wood Textures', 'Glass/Reflections'
];

const COLOR_PRESETS = [
  { name: 'Corporate Blue', colors: ['#1e3a5f', '#3b82f6', '#93c5fd'] },
  { name: 'Warm Studio', colors: ['#78350f', '#d97706', '#fcd34d'] },
  { name: 'Modern Dark', colors: ['#18181b', '#3f3f46', '#a1a1aa'] },
  { name: 'Fresh Green', colors: ['#14532d', '#22c55e', '#86efac'] },
  { name: 'Vibrant', colors: ['#7c2d12', '#dc2626', '#fbbf24'] },
];

// ============ COMPONENTS ============

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
              ${index < currentStep ? 'bg-green-500 text-white' : 
                index === currentStep ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 
                'bg-gray-800 text-gray-500'}`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline transition-colors duration-300
              ${index === currentStep ? 'text-purple-400 font-medium' : 'text-gray-500'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-gray-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function BriefForm({ formData, setFormData, onSubmit }) {
  const [formStep, setFormStep] = useState(0);
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleElement = (element) => {
    setFormData(prev => ({
      ...prev,
      elements: prev.elements.includes(element)
        ? prev.elements.filter(e => e !== element)
        : [...prev.elements, element]
    }));
  };

  const formSteps = [
    // Step 1: Show Type - Buttons + Text field
    <div key="type" className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">What type of show is this for?</h2>
      <p className="text-gray-400">This helps us understand the context and typical conventions.</p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {SHOW_TYPES.map(type => (
          <button
            key={type}
            onClick={() => {
              updateField('showType', type);
              updateField('showTypeCustom', '');
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200
              ${formData.showType === type && !formData.showTypeCustom
                ? 'border-purple-500 bg-purple-500/20 text-purple-300' 
                : 'border-gray-700 hover:border-gray-600 text-gray-300 hover:bg-gray-800/50'}`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm text-gray-400 mb-2">Or describe your own:</label>
        <input
          type="text"
          placeholder="E.g., Sports commentary, Cooking show, Game stream..."
          className={`w-full p-4 rounded-xl border-2 bg-gray-800/50 text-gray-100 placeholder-gray-500 transition-all duration-200 focus:outline-none
            ${formData.showTypeCustom 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-gray-700 focus:border-purple-500'}`}
          value={formData.showTypeCustom || ''}
          onChange={(e) => {
            updateField('showTypeCustom', e.target.value);
            if (e.target.value) {
              updateField('showType', '');
            }
          }}
        />
      </div>
    </div>,

    // Step 2: Mood
    <div key="mood" className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">What mood are you going for?</h2>
      <p className="text-gray-400">Select the feeling you want the set to convey.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {MOOD_OPTIONS.map(mood => (
          <button
            key={mood.id}
            onClick={() => updateField('mood', mood.id)}
            className={`p-4 rounded-xl border-2 text-center transition-all duration-200
              ${formData.mood === mood.id 
                ? 'border-purple-500 bg-purple-500/20' 
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'}`}
          >
            <div className={`w-12 h-12 ${mood.color} rounded-full mx-auto mb-2 flex items-center justify-center text-2xl shadow-lg`}>
              {mood.emoji}
            </div>
            <span className="text-sm font-medium text-gray-200">{mood.label}</span>
          </button>
        ))}
      </div>
      <textarea
        placeholder="Any additional mood details? (optional)"
        className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 mt-4 h-24 focus:outline-none focus:border-purple-500 transition-colors"
        value={formData.moodNotes || ''}
        onChange={(e) => updateField('moodNotes', e.target.value)}
      />
    </div>,

    // Step 3: Colors
    <div key="colors" className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Color palette preference</h2>
      <p className="text-gray-400">Choose a preset or pick custom colors.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {COLOR_PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => updateField('colorPreset', preset.name)}
            className={`p-4 rounded-xl border-2 transition-all duration-200
              ${formData.colorPreset === preset.name 
                ? 'border-purple-500 bg-purple-500/20' 
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'}`}
          >
            <div className="flex gap-1 mb-2 justify-center">
              {preset.colors.map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-200">{preset.name}</span>
          </button>
        ))}
        <button
          onClick={() => updateField('colorPreset', 'Custom')}
          className={`p-4 rounded-xl border-2 transition-all duration-200
            ${formData.colorPreset === 'Custom' 
              ? 'border-purple-500 bg-purple-500/20' 
              : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'}`}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-200">Custom</span>
        </button>
      </div>
      {formData.colorPreset === 'Custom' && (
        <div className="flex gap-3 mt-4 justify-center">
          <input type="color" defaultValue="#6366f1" className="w-12 h-12 rounded-lg cursor-pointer bg-transparent" />
          <input type="color" defaultValue="#8b5cf6" className="w-12 h-12 rounded-lg cursor-pointer bg-transparent" />
          <input type="color" defaultValue="#a855f7" className="w-12 h-12 rounded-lg cursor-pointer bg-transparent" />
        </div>
      )}
    </div>,

    // Step 4: Elements
    <div key="elements" className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">What elements should appear?</h2>
      <p className="text-gray-400">Select all that apply. We'll compose them into the scene.</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {ELEMENT_OPTIONS.map(element => (
          <button
            key={element}
            onClick={() => toggleElement(element)}
            className={`px-4 py-2 rounded-full border-2 text-sm transition-all duration-200
              ${formData.elements.includes(element)
                ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'}`}
          >
            {element}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Any other elements or specific requests?"
        className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 mt-4 h-24 focus:outline-none focus:border-purple-500 transition-colors"
        value={formData.elementNotes || ''}
        onChange={(e) => updateField('elementNotes', e.target.value)}
      />
    </div>,

    // Step 5: References & Description
    <div key="references" className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Almost done! Any references?</h2>
      <p className="text-gray-400">Share images or describe your vision in detail.</p>
      
      <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mt-6 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer">
        <div className="text-4xl mb-2">📎</div>
        <p className="text-gray-300">Drop reference images here</p>
        <p className="text-sm text-gray-500">or click to browse</p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Reference URLs (optional)</label>
        <input
          type="text"
          placeholder="Paste image URLs, Pinterest boards, etc."
          className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          value={formData.referenceUrls || ''}
          onChange={(e) => updateField('referenceUrls', e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Anything else we should know?</label>
        <textarea
          placeholder="Describe your vision, specific requirements, brand guidelines..."
          className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 h-32 focus:outline-none focus:border-purple-500 transition-colors"
          value={formData.additionalNotes || ''}
          onChange={(e) => updateField('additionalNotes', e.target.value)}
        />
      </div>
    </div>
  ];

  const canProceed = () => {
    switch(formStep) {
      case 0: return !!(formData.showType || formData.showTypeCustom);
      case 1: return !!formData.mood;
      case 2: return !!formData.colorPreset;
      case 3: return formData.elements.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator 
        currentStep={formStep} 
        steps={['Type', 'Mood', 'Colors', 'Elements', 'Details']} 
      />
      
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 min-h-[400px] shadow-xl">
        {formSteps[formStep]}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setFormStep(s => s - 1)}
          disabled={formStep === 0}
          className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-400 disabled:opacity-30 hover:bg-gray-800 transition-all duration-200"
        >
          Back
        </button>
        
        {formStep < formSteps.length - 1 ? (
          <button
            onClick={() => setFormStep(s => s + 1)}
            disabled={!canProceed()}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white disabled:opacity-30 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="px-8 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 font-medium transition-all duration-200 flex items-center gap-2"
          >
            Generate Preview
            <span className="bg-green-500 px-2 py-0.5 rounded-full text-xs">🪙 1</span>
          </button>
        )}
      </div>
    </div>
  );
}

function ProcessingView({ progress }) {
  const stages = [
    { id: 'analyzing', label: 'Analyzing brief', icon: '🔍' },
    { id: 'generating', label: 'Generating backgrounds', icon: '🎨' },
    { id: 'compositing', label: 'Compositing views', icon: '🖼️' },
    { id: 'finalizing', label: 'Final touches', icon: '✅' },
  ];

  const currentStageIndex = Math.floor(progress / 25);

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-xl">
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl animate-pulse">
            {stages[Math.min(currentStageIndex, stages.length - 1)]?.icon}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-100 mb-2">Creating your preview</h2>
        <p className="text-gray-400 mb-8">This usually takes 1-2 minutes</p>

        <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${index < currentStageIndex ? 'bg-green-500/10 text-green-400' :
                  index === currentStageIndex ? 'bg-purple-500/20 text-purple-300' :
                  'text-gray-600'}`}
            >
              <span className="text-lg">{stage.icon}</span>
              <span className="font-medium">{stage.label}</span>
              {index < currentStageIndex && <span className="ml-auto">✓</span>}
              {index === currentStageIndex && (
                <span className="ml-auto">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsView({ formData, onRevision, onNewBrief, onRegenerate }) {
  const [activeCamera, setActiveCamera] = useState(0);
  
  const cameras = [
    { id: 'wide', label: 'Wide Shot', description: 'Full set view' },
    { id: 'left', label: 'Camera Left', description: 'Guest perspective' },
    { id: 'right', label: 'Camera Right', description: 'Host perspective' },
  ];

  const bgColor = formData.colorPreset === 'Corporate Blue' ? 'from-blue-900 to-blue-600' :
                  formData.colorPreset === 'Warm Studio' ? 'from-amber-900 to-amber-500' :
                  formData.colorPreset === 'Modern Dark' ? 'from-zinc-900 to-zinc-700' :
                  formData.colorPreset === 'Fresh Green' ? 'from-green-900 to-green-500' :
                  formData.colorPreset === 'Vibrant' ? 'from-orange-900 to-red-600' :
                  'from-purple-900 to-purple-600';

  const showType = formData.showTypeCustom || formData.showType;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Your Virtual Set Preview</h1>
        <p className="text-gray-400">{showType} • {formData.mood} mood</p>
      </div>

      {/* Main Preview */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className={`aspect-video bg-gradient-to-br ${bgColor} relative`}>
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="w-64 h-16 bg-black/30 rounded-lg backdrop-blur" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/50 text-lg">
              [{cameras[activeCamera].label}]
            </div>
          </div>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
            {formData.elements.slice(0, 4).map(el => (
              <span key={el} className="bg-black/30 text-white/80 text-xs px-2 py-1 rounded backdrop-blur">
                {el}
              </span>
            ))}
          </div>
        </div>

        {/* Camera Selector */}
        <div className="flex border-t border-gray-800">
          {cameras.map((cam, index) => (
            <button
              key={cam.id}
              onClick={() => setActiveCamera(index)}
              className={`flex-1 p-4 text-center transition-all duration-200
                ${activeCamera === index 
                  ? 'bg-purple-500/20 border-b-2 border-purple-500' 
                  : 'hover:bg-gray-800/50'}`}
            >
              <div className={`font-medium ${activeCamera === index ? 'text-purple-300' : 'text-gray-300'}`}>
                {cam.label}
              </div>
              <div className="text-sm text-gray-500">{cam.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={onRegenerate}
          className="flex-1 px-6 py-3 border-2 border-gray-700 rounded-xl text-gray-300 hover:border-purple-500 hover:bg-purple-500/10 font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          🔄 Regenerate
          <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">🪙 1</span>
        </button>
        <button 
          onClick={onRevision}
          className="flex-1 px-6 py-3 border-2 border-gray-700 rounded-xl text-gray-300 hover:border-gray-600 hover:bg-gray-800/50 font-medium transition-all duration-200"
        >
          ✏️ Request Changes
        </button>
        <button className="flex-1 px-6 py-3 border-2 border-purple-500 rounded-xl text-purple-400 hover:bg-purple-500/20 font-medium transition-all duration-200">
          ⬇️ Download All
        </button>
        <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 font-medium transition-all duration-200">
          Book This Set →
        </button>
      </div>

      {/* Brief Summary */}
      <div className="mt-8 bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="font-medium text-gray-300 mb-4">Brief Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Show Type</div>
            <div className="font-medium text-gray-200">{showType}</div>
          </div>
          <div>
            <div className="text-gray-500">Mood</div>
            <div className="font-medium text-gray-200 capitalize">{formData.mood}</div>
          </div>
          <div>
            <div className="text-gray-500">Colors</div>
            <div className="font-medium text-gray-200">{formData.colorPreset}</div>
          </div>
          <div>
            <div className="text-gray-500">Elements</div>
            <div className="font-medium text-gray-200">{formData.elements.length} selected</div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={onNewBrief}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← Start New Brief
        </button>
      </div>
    </div>
  );
}

function RevisionPanel({ onSubmit, onBack }) {
  const [revisionNotes, setRevisionNotes] = useState('');
  
  const quickFixes = [
    'Make it brighter',
    'More contrast',
    'Less busy/cluttered',
    'Different angle',
    'Change colors',
    'Add more depth',
  ];

  const [selectedFixes, setSelectedFixes] = useState([]);

  const toggleFix = (fix) => {
    setSelectedFixes(prev => 
      prev.includes(fix) ? prev.filter(f => f !== fix) : [...prev, fix]
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Request Changes</h2>
        <p className="text-gray-400 mb-6">Tell us what to adjust. We'll generate a new version.</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Quick adjustments</label>
          <div className="flex flex-wrap gap-2">
            {quickFixes.map(fix => (
              <button
                key={fix}
                onClick={() => toggleFix(fix)}
                className={`px-4 py-2 rounded-full border-2 text-sm transition-all duration-200
                  ${selectedFixes.includes(fix)
                    ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'border-gray-700 text-gray-300 hover:border-gray-600'}`}
              >
                {fix}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Detailed feedback</label>
          <textarea
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            placeholder="Describe what you'd like changed in detail..."
            className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 h-32 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ fixes: selectedFixes, notes: revisionNotes })}
            className="flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
          >
            Submit Revision Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============

export default function VirtualSetApp() {
  const [view, setView] = useState('form');
  const [progress, setProgress] = useState(0);
  const [credits, setCredits] = useState(10); // Starting credits
  const [formData, setFormData] = useState({
    showType: '',
    showTypeCustom: '',
    mood: '',
    moodNotes: '',
    colorPreset: '',
    elements: [],
    elementNotes: '',
    referenceUrls: '',
    additionalNotes: '',
  });

  const handleSubmit = () => {
    if (credits < 1) {
      alert('Not enough credits! Please purchase more.');
      return;
    }
    setCredits(c => c - 1);
    setView('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setView('results'), 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 800);
  };

  const handleRegenerate = () => {
    if (credits < 1) {
      alert('Not enough credits! Please purchase more.');
      return;
    }
    setCredits(c => c - 1);
    setView('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setView('results'), 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 800);
  };

  const handleRevisionSubmit = (revision) => {
    console.log('Revision requested:', revision);
    setView('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setView('results'), 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 800);
  };

  const resetForm = () => {
    setFormData({
      showType: '',
      showTypeCustom: '',
      mood: '',
      moodNotes: '',
      colorPreset: '',
      elements: [],
      elementNotes: '',
      referenceUrls: '',
      additionalNotes: '',
    });
    setView('form');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
              VS
            </div>
            <div>
              <h1 className="font-semibold text-gray-100">Virtual Set Studio</h1>
              <p className="text-xs text-gray-500">Preview Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <span className="text-yellow-500">🪙</span>
              <span className="text-gray-200 font-medium">{credits}</span>
              <span className="text-gray-500 text-sm">credits</span>
            </div>
            {view !== 'form' && view !== 'processing' && (
              <button 
                onClick={resetForm}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                New Brief
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        {view === 'form' && (
          <BriefForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleSubmit}
          />
        )}
        
        {view === 'processing' && (
          <ProcessingView progress={Math.min(progress, 100)} />
        )}
        
        {view === 'results' && (
          <ResultsView 
            formData={formData} 
            onRevision={() => setView('revision')}
            onNewBrief={resetForm}
            onRegenerate={handleRegenerate}
          />
        )}
        
        {view === 'revision' && (
          <RevisionPanel 
            onSubmit={handleRevisionSubmit}
            onBack={() => setView('results')}
          />
        )}
      </main>
    </div>
  );
}
