import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  HeartHandshake,
  DollarSign,
  Star,
  Check,
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';
import type { EventDetails, Currency } from '../../types/event';
import {
  EVENT_TYPE_OPTIONS as eventTypes,
  EVENT_VIBE_OPTIONS as vibes,
  DIETARY_OPTIONS as dietaryOptions,
  getInitialEventDetails,
} from '../../constants/eventOptions';
import { sanitizePlanTitle } from '../../utils/sanitize';

export const IntakeWizard: React.FC = () => {
  const { isWizardOpen, setIsWizardOpen, createPlan, isLoading } = useEvent();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<EventDetails>(getInitialEventDetails);

  if (!isWizardOpen) return null;

  const toggleDietary = (item: string) => {
    setFormData((prev) => {
      const exists = prev.dietaryPreferences.includes(item);
      return {
        ...prev,
        dietaryPreferences: exists
          ? prev.dietaryPreferences.filter((d) => d !== item)
          : [...prev.dietaryPreferences, item],
      };
    });
  };

  const handlePriorityChange = (field: keyof EventDetails['priorities'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [field]: val,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawTitle = formData.title.trim() || `${formData.type.toUpperCase()} Celebration`;
    const finalTitle = sanitizePlanTitle(rawTitle);
    await createPlan({
      ...formData,
      title: finalTitle,
    });
  };

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
    >
      <div
        className="glass-modal p-6 w-full max-w-2xl"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setIsWizardOpen(false)}
          className="btn-ghost"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.4rem',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          aria-label="Close Wizard"
        >
          <X size={20} />
        </button>

        {/* Wizard Header & Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-gold">AI Intake Wizard</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Step {step} of 4</span>
          </div>
          <h2 id="wizard-title" style={{ fontSize: '1.6rem', margin: 0 }}>
            {step === 1 && 'What Celebration Are We Creating?'}
            {step === 2 && 'Dates, Scale & Total Budget'}
            {step === 3 && 'Atmosphere & Inclusivity'}
            {step === 4 && 'Priorities & Resource Allocation'}
          </h2>

          <div
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={4}
            aria-label={`Wizard step ${step} of 4`}
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              marginTop: '1rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(step / 4) * 100}%`,
                height: '100%',
                background: 'var(--accent-gold-gradient)',
                transition: 'width var(--transition-normal)',
              }}
            />
          </div>
        </div>

        {/* Wizard Step Forms */}
        <form onSubmit={handleSubmit}>
          {/* STEP 1: Occasion & Event Title */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div>
                <label className="input-label">Select Event Persona</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  {eventTypes.map((et) => {
                    const isSelected = formData.type === et.type;
                    return (
                      <div
                        key={et.type}
                        onClick={() => setFormData({ ...formData, type: et.type })}
                        className="glass-card"
                        style={{
                          cursor: 'pointer',
                          padding: '1rem',
                          borderColor: isSelected ? 'var(--accent-gold)' : undefined,
                          background: isSelected ? 'rgba(245, 158, 11, 0.12)' : undefined,
                          boxShadow: isSelected ? 'var(--shadow-gold)' : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: '1.5rem' }}>{et.icon}</span>
                          <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{et.label}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {et.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="event-title-input" className="input-label">
                  Event Title or Family Names
                </label>
                <input
                  id="event-title-input"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Aarav & Meera's Wedding or Rohan's 30th Bash"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Parameters (Date, Guests, Currency, Budget, Location) */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-date-input" className="input-label flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Target Event Date</span>
                  </label>
                  <input
                    id="event-date-input"
                    type="date"
                    className="input-field"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="guest-count-input" className="input-label flex items-center gap-1">
                    <Users size={14} />
                    <span>Expected Guests</span>
                  </label>
                  <input
                    id="guest-count-input"
                    type="number"
                    min="5"
                    max="5000"
                    className="input-field"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency-select" className="input-label">
                    Currency
                  </label>
                  <select
                    id="currency-select"
                    className="input-field"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                  >
                    <option value="INR">INR (₹ - Lakhs / Crores)</option>
                    <option value="USD">USD ($ - Dollars)</option>
                    <option value="EUR">EUR (€ - Euros)</option>
                    <option value="GBP">GBP (£ - Pounds)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="total-budget-input" className="input-label flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>Total Target Budget</span>
                  </label>
                  <input
                    id="total-budget-input"
                    type="number"
                    min="1000"
                    step="5000"
                    className="input-field"
                    value={formData.totalBudget}
                    onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location-input" className="input-label flex items-center gap-1">
                  <MapPin size={14} />
                  <span>City / Venue Preference</span>
                </label>
                <input
                  id="location-input"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Udaipur, Bangalore, Goa, Indoor Banquet"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Vibe, Dietary, Accessibility */}
          {step === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div>
                <label className="input-label">Atmosphere & Theme Vibe</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
                  {vibes.map((v) => {
                    const isSelected = formData.vibe === v.vibe;
                    return (
                      <div
                        key={v.vibe}
                        onClick={() => setFormData({ ...formData, vibe: v.vibe })}
                        className="glass-card"
                        style={{
                          cursor: 'pointer',
                          padding: '0.85rem',
                          borderColor: isSelected ? 'var(--accent-gold)' : undefined,
                          background: isSelected ? 'rgba(245, 158, 11, 0.12)' : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{v.emoji}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="input-label">Dietary Requirements & Counters</label>
                <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                  {dietaryOptions.map((opt) => {
                    const isChecked = formData.dietaryPreferences.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleDietary(opt)}
                        className={`btn ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                      >
                        {isChecked && <Check size={14} />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="special-needs-input" className="input-label flex items-center gap-1">
                  <HeartHandshake size={14} />
                  <span>Accessibility & Special Needs</span>
                </label>
                <textarea
                  id="special-needs-input"
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Wheelchair ramps required for grandparents, quiet sensory room for babies, pet friendly area..."
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Priority Sliders (Venue, Food, Photo, Decor, Music) */}
          {step === 4 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Rate how critical each element is to you (1 = Minimal spend, 5 = Non-negotiable luxury).
                The GenAI algorithm weights your budget allocation accordingly!
              </p>

              {(
                [
                  { key: 'catering', label: 'Catering & Dining Experience', icon: '🍽️' },
                  { key: 'venue', label: 'Venue & Scenic Grounds', icon: '🏰' },
                  { key: 'photography', label: 'Photography & Cinematic Video', icon: '📸' },
                  { key: 'decor', label: 'Themed Decor & Floral Styling', icon: '🌸' },
                  { key: 'entertainment', label: 'Music, Sound & Performers', icon: '🎶' },
                ] as const
              ).map(({ key, label, icon }) => (
                <div key={key} className="glass-card" style={{ padding: '0.85rem 1rem' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {icon} {label}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handlePriorityChange(key, star)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: star <= formData.priorities[key] ? 'var(--accent-gold)' : 'var(--text-muted)',
                            padding: '2px',
                          }}
                          aria-label={`${star} star`}
                        >
                          <Star size={18} fill={star <= formData.priorities[key] ? 'var(--accent-gold)' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary animate-glow"
                disabled={isLoading}
                style={{ padding: '0.75rem 1.75rem' }}
              >
                <Sparkles size={18} />
                <span>{isLoading ? 'Orchestrating Plan...' : 'Generate Plan with AI'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
