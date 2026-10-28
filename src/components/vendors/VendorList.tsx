import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Star,
  Check,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';
import { formatCurrency } from '../../utils/currency';
import type { VendorQuote } from '../../types/event';

export const VendorList: React.FC = () => {
  const { plan, addVendorQuote, updateVendorStatus } = useEvent();
  const { vendorQuotes, vettingQuestions, details } = plan;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New quote form state
  const [newQuote, setNewQuote] = useState({
    vendorName: '',
    category: 'Catering',
    quotedPrice: 100000,
    perGuestRate: 1000,
    inclusions: 'Buffet spread, cutlery, service staff',
    exclusions: 'Beverages, overtime',
    cancellationPolicy: 'Refundable up to 30 days prior',
    rating: 4.5,
    pros: 'High quality food',
    cons: 'Overtime charges',
    hiddenChargesWarning: '',
  });

  const categories = Array.from(new Set(vendorQuotes.map((q) => q.category)));

  const filteredQuotes = vendorQuotes.filter(
    (q) => activeCategoryFilter === 'all' || q.category === activeCategoryFilter
  );

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const created: VendorQuote = {
      id: `quote-${Date.now()}`,
      vendorName: newQuote.vendorName || 'Unnamed Vendor',
      category: newQuote.category,
      quotedPrice: Number(newQuote.quotedPrice),
      perGuestRate: Number(newQuote.perGuestRate),
      inclusions: newQuote.inclusions.split(',').map((s) => s.trim()),
      exclusions: newQuote.exclusions.split(',').map((s) => s.trim()),
      cancellationPolicy: newQuote.cancellationPolicy,
      rating: Number(newQuote.rating),
      status: 'evaluating',
      pros: newQuote.pros.split(',').map((s) => s.trim()),
      cons: newQuote.cons.split(',').map((s) => s.trim()),
      hiddenChargesWarning: newQuote.hiddenChargesWarning || undefined,
    };
    addVendorQuote(created);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header and Filter */}
      <div className="glass-panel p-6 flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Vendor Intelligence & Quotation Comparator</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Compare vendor proposals side-by-side, identify hidden costs, and access AI negotiation probes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>+ Add Quotation</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`btn ${activeCategoryFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
        >
          <span>All Quotes ({vendorQuotes.length})</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`btn ${activeCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
          >
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Side-by-Side Quotation Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {filteredQuotes.map((q) => {
          const isBooked = q.status === 'booked';
          return (
            <div
              key={q.id}
              className="glass-panel flex flex-col justify-between"
              style={{
                padding: '1.5rem',
                borderColor: isBooked ? 'var(--accent-emerald)' : undefined,
                background: isBooked ? 'rgba(16, 185, 129, 0.04)' : undefined,
                position: 'relative',
              }}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                    {q.category}
                  </span>
                  <div className="flex items-center gap-1 text-gold" style={{ color: 'var(--accent-gold)' }}>
                    <Star size={14} fill="var(--accent-gold)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{q.rating}</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.2rem', margin: '0.25rem 0' }}>{q.vendorName}</h4>

                {/* Quoted Amount */}
                <div style={{ margin: '0.75rem 0', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quoted Cost</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>
                    {formatCurrency(q.quotedPrice, details.currency)}
                  </div>
                  {q.perGuestRate && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      approx. {formatCurrency(q.perGuestRate, details.currency)} per guest
                    </span>
                  )}
                </div>

                {/* Inclusions */}
                <div style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--accent-emerald)' }}>✓ Included in Quote:</strong>
                  <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0', color: 'var(--text-secondary)' }}>
                    {q.inclusions.map((inc, idx) => (
                      <li key={idx}>{inc}</li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                {q.exclusions.length > 0 && (
                  <div style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    <strong style={{ color: 'var(--accent-rose)' }}>✗ Excluded (Extra Cost):</strong>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0', color: 'var(--text-secondary)' }}>
                      {q.exclusions.map((exc, idx) => (
                        <li key={idx}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hidden Charges Warning */}
                {q.hiddenChargesWarning && (
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      fontSize: '0.75rem',
                      color: '#FDA4AF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                    <span>{q.hiddenChargesWarning}</span>
                  </div>
                )}

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <strong>Policy: </strong>{q.cancellationPolicy}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span
                  className={`badge ${
                    q.status === 'booked'
                      ? 'badge-emerald'
                      : q.status === 'shortlisted'
                      ? 'badge-indigo'
                      : 'badge-slate'
                  }`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {q.status}
                </span>

                <div className="flex items-center gap-2">
                  {q.status !== 'booked' && (
                    <button
                      onClick={() => updateVendorStatus(q.id, 'booked')}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Check size={14} />
                      <span>Lock & Book</span>
                    </button>
                  )}
                  {q.status === 'booked' && (
                    <button
                      onClick={() => updateVendorStatus(q.id, 'evaluating')}
                      className="btn btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    >
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Negotiation & Vetting Prompts Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>AI Vendor Negotiation & Vetting Checklist</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Essential questions to ask each vendor before transferring deposit funds.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vettingQuestions.map((vq) => (
            <div
              key={vq.id}
              className="glass-card"
              style={{
                borderLeft: vq.dealbreakerAlert ? '4px solid var(--accent-rose)' : '4px solid var(--accent-gold)',
                padding: '1rem',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                  {vq.category}
                </span>
                {vq.dealbreakerAlert && (
                  <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                    Critical Dealbreaker
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '0.95rem', margin: '0.4rem 0', color: 'var(--text-primary)' }}>
                “{vq.question}”
              </h4>

              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: '#A5B4FC' }}>Why this matters: </strong>
                {vq.whyItMatters}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Quotation Modal */}
      {isAddModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div className="glass-modal p-6 w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Add Vendor Quotation</h3>
            <form onSubmit={handleCreateQuote} className="flex flex-col gap-3">
              <div>
                <label className="input-label">Vendor Business Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Royal Caterers & Event Decor"
                  value={newQuote.vendorName}
                  onChange={(e) => setNewQuote({ ...newQuote, vendorName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-field"
                    value={newQuote.category}
                    onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value })}
                  >
                    <option value="Catering">Catering</option>
                    <option value="Venue">Venue</option>
                    <option value="Photography">Photography</option>
                    <option value="Decor">Decor</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Total Quoted Price</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={newQuote.quotedPrice}
                    onChange={(e) => setNewQuote({ ...newQuote, quotedPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Inclusions (Comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={newQuote.inclusions}
                  onChange={(e) => setNewQuote({ ...newQuote, inclusions: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Exclusions / Surcharges (Comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={newQuote.exclusions}
                  onChange={(e) => setNewQuote({ ...newQuote, exclusions: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Hidden Charges or Overtime Warning</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Sound overtime ₹5,000/hr after 11 PM"
                  value={newQuote.hiddenChargesWarning}
                  onChange={(e) => setNewQuote({ ...newQuote, hiddenChargesWarning: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
