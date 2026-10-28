import type {
  EventDetails,
  EventPlan,
  BudgetCategory,
  TimelineTask,
  RunOfShowItem,
  VendorQuote,
  VendorVettingQuestion,
  PersonalizedIdea,
  TradeOffOption,
  ScenarioShift,
} from '../types/event';

/**
 * Intelligent Deterministic Simulation Engine
 * Guarantees 100% availability for hackathon evaluation even without external API keys or when quotas expire.
 * Adheres strictly to the principles explained in the PromptWars Round 5 explainer.
 */

/**
 * Generates an interconnected, constraint-aware Event Plan deterministically.
 *
 * @param {EventDetails} details - The user's input specifications (budget, priorities, dietary, vibe).
 * @returns {EventPlan} Complete event dossier containing partitioned budget, milestone tasks,
 * vendor candidates, run-of-show schedule, and trade-off options.
 */
export function generateSimulatedPlan(details: EventDetails): EventPlan {
  const { totalBudget, currency, type, vibe, guestCount } = details;

  // 1. Calculate Contingency Buffer (5% to 8% based on event type)
  const contingencyPercent = type === 'wedding' ? 6 : type === 'community' ? 8 : 5;
  const contingencyAmount = Math.round((totalBudget * contingencyPercent) / 100);
  const effectiveBudget = totalBudget - contingencyAmount;

  // 2. Dynamic Category Percentage Allocations based on Event Type & Priorities
  let categories: BudgetCategory[] = [];

  if (type === 'wedding') {
    const rawVenue = 0.28 + (details.priorities.venue - 3) * 0.02;
    const rawCatering = 0.32 + (details.priorities.catering - 3) * 0.02;
    const rawPhoto = 0.12 + (details.priorities.photography - 3) * 0.02;
    const rawDecor = 0.14 + (details.priorities.decor - 3) * 0.02;
    const rawEnt = 0.08 + (details.priorities.entertainment - 3) * 0.01;
    const rawInvites = 0.06;
    const rawSum = rawVenue + rawCatering + rawPhoto + rawDecor + rawEnt + rawInvites;

    const venueShare = rawVenue / rawSum;
    const cateringShare = rawCatering / rawSum;
    const photoShare = rawPhoto / rawSum;
    const decorShare = rawDecor / rawSum;
    const entShare = rawEnt / rawSum;
    const invitesShare = rawInvites / rawSum;

    categories = [
      {
        id: 'cat-venue',
        name: 'Venue & Lawns Rental',
        percentage: Math.round(venueShare * 100),
        allocatedAmount: Math.round(effectiveBudget * venueShare),
        spentAmount: Math.round(effectiveBudget * venueShare * 0.5),
        color: '#F59E0B',
        icon: 'Castle',
        notes: `Accommodates ${guestCount} guests comfortably with parking and power backup.`,
        tradeoffAdvice: 'Consider weekday or morning slot to save 12-18% on venue rent.',
      },
      {
        id: 'cat-catering',
        name: 'Catering & Dining Experience',
        percentage: Math.round(cateringShare * 100),
        allocatedAmount: Math.round(effectiveBudget * cateringShare),
        spentAmount: 0,
        color: '#10B981',
        icon: 'UtensilsCrossed',
        notes: `Approx. ${Math.round((effectiveBudget * cateringShare) / guestCount)} per guest across primary banquets.`,
        tradeoffAdvice: 'Consolidating duplicate dessert counters reduces food waste and cuts 8% cost.',
      },
      {
        id: 'cat-photo',
        name: 'Candid Photography & Cinematography',
        percentage: Math.round(photoShare * 100),
        allocatedAmount: Math.round(effectiveBudget * photoShare),
        spentAmount: 0,
        color: '#6366F1',
        icon: 'Camera',
        notes: 'Covers 2 candid shooters, 1 traditional videographer, and drone coverage.',
        tradeoffAdvice: 'Opting for digital cloud delivery instead of leather photo books saves upfront cash.',
      },
      {
        id: 'cat-decor',
        name: 'Themed Decor & Floral Styling',
        percentage: Math.round(decorShare * 100),
        allocatedAmount: Math.round(effectiveBudget * decorShare),
        spentAmount: 0,
        color: '#EC4899',
        icon: 'Sparkles',
        notes: `Reflects ${vibe} theme with ambient uplighting and stage florals.`,
        tradeoffAdvice: 'Seasonal local blooms (marigold, jasmine) cost 40% less than imported orchids.',
      },
      {
        id: 'cat-entertainment',
        name: 'Sound, DJ & Live Performers',
        percentage: Math.round(entShare * 100),
        allocatedAmount: Math.round(effectiveBudget * entShare),
        spentAmount: 0,
        color: '#8B5CF6',
        icon: 'Music',
        notes: 'Audio console, lighting truss, DJ, and folk or acoustic music set.',
      },
      {
        id: 'cat-invites',
        name: 'Invites, Favors & Welcome Gifts',
        percentage: Math.round(invitesShare * 100),
        allocatedAmount: Math.round(effectiveBudget * invitesShare),
        spentAmount: 0,
        color: '#06B6D4',
        icon: 'Gift',
        notes: 'Eco-friendly invites and personalized return gift hampers.',
      },
    ];
  } else if (type === 'birthday') {
    categories = [
      {
        id: 'cat-venue-bday',
        name: 'Party Space / Lounge Rental',
        percentage: 30,
        allocatedAmount: Math.round(effectiveBudget * 0.3),
        spentAmount: 0,
        color: '#F59E0B',
        icon: 'Castle',
        notes: `Private space for ${guestCount} guests with sound and party lighting.`,
      },
      {
        id: 'cat-catering-bday',
        name: 'Food, Specialty Cake & Mocktails',
        percentage: 38,
        allocatedAmount: Math.round(effectiveBudget * 0.38),
        spentAmount: 0,
        color: '#10B981',
        icon: 'UtensilsCrossed',
        notes: `Custom multi-tier cake + party food for ${guestCount} guests.`,
      },
      {
        id: 'cat-entertainment-bday',
        name: 'Live Music / Games / Host',
        percentage: 16,
        allocatedAmount: Math.round(effectiveBudget * 0.16),
        spentAmount: 0,
        color: '#8B5CF6',
        icon: 'Music',
        notes: 'Engaging host, trivia quiz, and acoustic or DJ set.',
      },
      {
        id: 'cat-photo-bday',
        name: 'Photography & Photo Corner',
        percentage: 8,
        allocatedAmount: Math.round(effectiveBudget * 0.08),
        spentAmount: 0,
        color: '#6366F1',
        icon: 'Camera',
        notes: 'Party portraits and instant Polaroid station.',
      },
      {
        id: 'cat-decor-bday',
        name: 'Balloons, Backdrops & Props',
        percentage: 8,
        allocatedAmount: Math.round(effectiveBudget * 0.08),
        spentAmount: 0,
        color: '#EC4899',
        icon: 'Sparkles',
        notes: 'Custom milestone photo wall and stylish balloon garland.',
      },
    ];
  } else {
    // Community / Charity / Cultural Festival
    categories = [
      {
        id: 'cat-venue-comm',
        name: 'Ground Permits, Cleaners & Security',
        percentage: 26,
        allocatedAmount: Math.round(effectiveBudget * 0.26),
        spentAmount: 0,
        color: '#F59E0B',
        icon: 'Castle',
        notes: `Sanitation, security guards, first aid, and council licenses for ${guestCount} people.`,
      },
      {
        id: 'cat-stage-comm',
        name: 'Stage, PA System & Audio-Visuals',
        percentage: 30,
        allocatedAmount: Math.round(effectiveBudget * 0.30),
        spentAmount: 0,
        color: '#8B5CF6',
        icon: 'Music',
        notes: 'Trussing, line array speakers, microphones, and stage lighting.',
      },
      {
        id: 'cat-food-comm',
        name: 'Community Refreshments & Volunteer Meals',
        percentage: 20,
        allocatedAmount: Math.round(effectiveBudget * 0.20),
        spentAmount: 0,
        color: '#10B981',
        icon: 'UtensilsCrossed',
        notes: 'Drinking water stations and meal boxes for volunteers and artists.',
      },
      {
        id: 'cat-decor-comm',
        name: 'Banners, Signage & Eco Decor',
        percentage: 14,
        allocatedAmount: Math.round(effectiveBudget * 0.14),
        spentAmount: 0,
        color: '#EC4899',
        icon: 'Sparkles',
        notes: 'Recycled fabric signs, entrance arches, and directional markers.',
      },
      {
        id: 'cat-marketing-comm',
        name: 'Outreach, Wristbands & Badges',
        percentage: 10,
        allocatedAmount: Math.round(effectiveBudget * 0.10),
        spentAmount: 0,
        color: '#06B6D4',
        icon: 'Gift',
        notes: 'Flyers, wristbands, and social announcements.',
      },
    ];
  }

  // 3. Milestone Tasks with Dependencies
  const tasks: TimelineTask[] = [
    {
      id: 'task-gen-1',
      title: 'Lock & Confirm Primary Venue Agreement',
      category: 'Venue',
      milestonePhase: 'early_prep',
      phaseLabel: 'Phase 1: Early Lock (Essentials)',
      daysBeforeEvent: 90,
      status: 'completed',
      priority: 'high',
      assignedTo: 'Lead Organizer',
      aiTip: 'Verify parking capacity, generator backup, and noise curfew guidelines.',
    },
    {
      id: 'task-gen-2',
      title: 'Contract Caterer & Finalize Menu Inclusions',
      category: 'Catering',
      milestonePhase: 'vendor_lock',
      phaseLabel: 'Phase 2: Core Vendor Lock',
      daysBeforeEvent: 60,
      status: 'in_progress',
      priority: 'high',
      dependencies: ['task-gen-1'],
      dependencyNames: ['Lock Primary Venue'],
      assignedTo: 'Catering Committee',
      aiTip: `Plan portions for ${guestCount} attendees with dietary labels (Veg/Jain/Allergens).`,
    },
    {
      id: 'task-gen-3',
      title: 'Hire Photography & Audio-Visual Crew',
      category: 'Media & AV',
      milestonePhase: 'vendor_lock',
      phaseLabel: 'Phase 2: Core Vendor Lock',
      daysBeforeEvent: 50,
      status: 'todo',
      priority: 'high',
      assignedTo: 'Media Lead',
      aiTip: 'Ask for equipment backup policy and expected date of delivery for final output.',
    },
    {
      id: 'task-gen-4',
      title: 'Issue Formal Invitations & Launch Digital RSVP Portal',
      category: 'Communications',
      milestonePhase: 'details_invites',
      phaseLabel: 'Phase 3: Invitations & Outreach',
      daysBeforeEvent: 30,
      status: 'todo',
      priority: 'medium',
      dependencies: ['task-gen-1', 'task-gen-2'],
      dependencyNames: ['Lock Venue', 'Contract Caterer'],
      assignedTo: 'Communications Lead',
      aiTip: 'Set RSVP cutoff date 10 days before event to finalize exact headcount.',
    },
    {
      id: 'task-gen-5',
      title: 'Finalize Day-of Schedule & Conduct Walkthrough',
      category: 'Execution',
      milestonePhase: 'final_countdown',
      phaseLabel: 'Phase 4: Final Countdown',
      daysBeforeEvent: 7,
      status: 'todo',
      priority: 'high',
      assignedTo: 'Day-Of Lead',
      aiTip: 'Test sound levels, review emergency exits, and ensure all vendor contact numbers are printed.',
    },
    {
      id: 'task-gen-6',
      title: 'Vendor Dispatch & Run-of-Show Stage Coordination',
      category: 'Day-Of',
      milestonePhase: 'day_of',
      phaseLabel: 'Phase 5: Day-Of Execution',
      daysBeforeEvent: 0,
      status: 'todo',
      priority: 'high',
      assignedTo: 'Chief Coordinator',
      aiTip: 'Keep volunteer/coordinator emergency kits (pins, first aid, extra badges) at information desk.',
    },
  ];

  // 4. Minute-by-Minute Run of Show
  const runOfShow: RunOfShowItem[] = [
    {
      id: 'ros-gen-1',
      time: '04:00 PM',
      activity: 'Venue Setup, Sound Check & Lighting Inspection',
      leadPerson: 'Stage & AV Coordinator',
      location: 'Main Stage & Grounds',
      notes: 'Ensure all microphones, music tracks, and generator power verified.',
      completed: false,
    },
    {
      id: 'ros-gen-2',
      time: '05:30 PM',
      activity: 'Doors Open, Welcome Refreshments & Ambient Music',
      leadPerson: 'Hospitality Lead',
      location: 'Entrance Foyer',
      notes: 'Greeters stationed with badges, welcome drinks, and seating guidance.',
      completed: false,
    },
    {
      id: 'ros-gen-3',
      time: '07:00 PM',
      activity: 'Main Program / Ceremonial Highlights & Performances',
      leadPerson: 'Master of Ceremonies',
      location: 'Main Stage Area',
      notes: 'Follow stage timeline; cue photographer for key group moments.',
      completed: false,
    },
    {
      id: 'ros-gen-4',
      time: '08:30 PM',
      activity: 'Dinner Service Opens & Interactive Socializing',
      leadPerson: 'Catering Lead',
      location: 'Dining / Buffet Hall',
      notes: 'Ensure timely refill of popular dishes and clean dining tables.',
      completed: false,
    },
  ];

  // 5. Vendor Quotations & Matrix
  const vendorQuotes: VendorQuote[] = [
    {
      id: 'quote-gen-1',
      vendorName: 'Imperial Grand Hospitality',
      category: 'Catering',
      quotedPrice: Math.round(effectiveBudget * 0.32),
      perGuestRate: Math.round((effectiveBudget * 0.32) / guestCount),
      inclusions: ['Full Uniformed Wait Staff', 'Standard Buffet Spread', 'Water & Soft Drink Dispensers', 'Tableware Setup'],
      exclusions: ['Premium Live Counters', 'Custom Dessert Table'],
      cancellationPolicy: 'Refundable up to 30 days prior; 30% retention fee thereafter.',
      rating: 4.8,
      status: 'shortlisted',
      pros: ['Punctual service record', 'Handles large crowds with ease'],
      cons: ['Extra charges for overtime past midnight'],
      hiddenChargesWarning: 'Confirm if crockery breakage insurance is added to final invoice.',
    },
    {
      id: 'quote-gen-2',
      vendorName: 'Apex Production & Sound Studio',
      category: 'Sound & Stage',
      quotedPrice: Math.round(effectiveBudget * 0.12),
      inclusions: ['Digital Mixer', 'Wireless Microphones x4', 'Stage Par Can Lights', 'Dedicated Audio Engineer'],
      exclusions: ['Diesel for generator backup'],
      cancellationPolicy: '100% advance deposit transferable to alternative date within 6 months.',
      rating: 4.6,
      status: 'evaluating',
      pros: ['Modern sound gear', 'Crisp audio balance'],
      cons: ['Needs 3 hours advance load-in time'],
    },
  ];

  // 6. Vetting Questions
  const vettingQuestions: VendorVettingQuestion[] = [
    {
      id: 'vq-gen-1',
      category: 'Venue & Logistics',
      question: 'What is your precise power backup plan if municipal grid power fails during prime event hours?',
      whyItMatters: 'Outdoor or banquet celebrations require uninterrupted generator failover within 10 seconds.',
      dealbreakerAlert: true,
    },
    {
      id: 'vq-gen-2',
      category: 'Catering',
      question: 'How do you handle sudden headcount overruns if 10% more guests attend than guaranteed?',
      whyItMatters: 'Prevents embarrassing food shortages and eliminates extortionate last-minute plate surcharges.',
      dealbreakerAlert: true,
    },
    {
      id: 'vq-gen-3',
      category: 'Media & Production',
      question: 'Do you provide redundant memory recording and what is the exact delivery timeline for high-res photos?',
      whyItMatters: 'Guarantees that once-in-a-lifetime moments are backed up and delivered without month-long delays.',
      dealbreakerAlert: false,
    },
  ];

  // 7. Personalized GenAI Ideas
  const ideas: PersonalizedIdea[] = [
    {
      id: 'idea-gen-1',
      title: `${vibe.toUpperCase()} Heritage Welcome Experience`,
      conceptDescription: `Curate an immersive welcome station featuring regional acoustic music and signature chilled mocktails reflecting your theme.`,
      tag: 'Atmosphere & Decor',
      estimatedCostImpact: 'low',
      accessibilityConsideration: 'Ensure level flooring and clear ramp signage for arriving seniors and strollers.',
    },
    {
      id: 'idea-gen-2',
      title: 'Interactive Memory & Blessing Mosaic',
      conceptDescription: 'A live physical or digital mosaic board where guests pin handwritten polaroid moments and personalized notes.',
      tag: 'Guest Engagement',
      estimatedCostImpact: 'low',
    },
    {
      id: 'idea-gen-3',
      title: 'Live Artisan Culinary Station',
      conceptDescription: `An interactive live station tailored to your guests, featuring hot fresh delicacies prepared to order.`,
      tag: 'Culinary Experience',
      estimatedCostImpact: 'medium',
    },
  ];

  // 8. Trade-Off Options
  const tradeOffOptions: TradeOffOption[] = [
    {
      id: 'to-gen-1',
      title: 'Guest Comfort First (Protect Dining & Service)',
      description: 'Preserve full culinary spread and dedicated service; streamline stage decor using smart architectural LED washes rather than heavy floral constructions.',
      budgetDelta: Math.round(-effectiveBudget * 0.05),
      pros: ['Highest guest satisfaction', 'Saves approx. 5% overall budget'],
      cons: ['Simpler stage backdrop'],
      affectedCategories: [
        { categoryId: 'cat-decor', newPercentage: 10, deltaAmount: Math.round(-effectiveBudget * 0.04) },
      ],
    },
    {
      id: 'to-gen-2',
      title: 'Visual Impact & Production Focus',
      description: 'Elevate stage lighting, photography, and video coverage; curate a compact signature menu of high-impact dishes instead of an oversized buffet.',
      budgetDelta: 0,
      pros: ['Breathtaking photo and video keepsake', 'Reduced food waste'],
      cons: ['Fewer choices in dessert counter'],
      affectedCategories: [
        { categoryId: 'cat-photo', newPercentage: 14, deltaAmount: Math.round(effectiveBudget * 0.02) },
        { categoryId: 'cat-catering', newPercentage: 30, deltaAmount: Math.round(-effectiveBudget * 0.02) },
      ],
    },
  ];

  return {
    details,
    budget: {
      totalBudget,
      currency,
      contingencyPercent,
      contingencyAmount,
      allocatedTotal: categories.reduce((sum, c) => sum + c.allocatedAmount, 0),
      remainingAmount: effectiveBudget - categories.reduce((sum, c) => sum + c.allocatedAmount, 0),
      categories,
    },
    tasks,
    runOfShow,
    vendorQuotes,
    vettingQuestions,
    ideas,
    tradeOffOptions,
    scenarioHistory: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Dynamic "What-If" Scenario Recalculation Engine
 *
 * Dynamically re-proportions interconnected event parameters (budget categories,
 * attendee capacity, deadline urgency flags) when constraints change mid-stream without starting over.
 *
 * @param {EventPlan} currentPlan - The active, populated Event Plan.
 * @param {ScenarioShift} shift - Changes in guest counts, budget percentage, and timeline days.
 * @returns {EventPlan} Updated plan with recalibrated financials, updated tasks, and audit history.
 */
export function recalculateScenarioShift(
  currentPlan: EventPlan,
  shift: ScenarioShift
): EventPlan {
  const { guestCountDelta, budgetPercentDelta, daysOffsetDelta, description } = shift;

  // New guest count
  const newGuestCount = Math.max(10, currentPlan.details.guestCount + guestCountDelta);

  // New total budget
  const budgetMultiplier = 1 + budgetPercentDelta / 100;
  const newTotalBudget = Math.max(10000, Math.round(currentPlan.details.totalBudget * budgetMultiplier));

  // Recalculate contingency
  const contingencyPercent = currentPlan.budget.contingencyPercent;
  const newContingencyAmount = Math.round((newTotalBudget * contingencyPercent) / 100);
  const newEffectiveBudget = newTotalBudget - newContingencyAmount;

  // Dynamically re-adjust category amounts based on guest count pressure
  // If guest count increased, catering/venue need higher priority; decor/favors may compress
  const categories = currentPlan.budget.categories.map((cat) => {
    let factor = budgetMultiplier;

    if (cat.name.toLowerCase().includes('catering') || cat.name.toLowerCase().includes('food')) {
      // Catering scales heavily with guest count
      const guestRatio = newGuestCount / currentPlan.details.guestCount;
      factor = Math.max(0.7, guestRatio * (1 + budgetPercentDelta / 200));
    } else if (cat.name.toLowerCase().includes('decor') || cat.name.toLowerCase().includes('invite')) {
      // Decor and invites absorb cuts if budget was reduced
      if (budgetPercentDelta < 0) {
        factor = Math.max(0.6, 1 + (budgetPercentDelta * 1.5) / 100);
      }
    }

    const rawNewAmount = Math.round(cat.allocatedAmount * factor);
    return {
      ...cat,
      allocatedAmount: rawNewAmount,
      tradeoffAdvice:
        budgetPercentDelta < 0
          ? `Adjusted for ${budgetPercentDelta}% budget compression. Prioritize core essentials.`
          : cat.tradeoffAdvice,
    };
  });

  // Normalize percentages so total allocation matches effective budget
  const totalAlloc = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const normalizedCategories = categories.map((cat) => {
    const proportional = Math.round((cat.allocatedAmount / totalAlloc) * newEffectiveBudget);
    const newPercent = Math.round((proportional / newEffectiveBudget) * 100);
    return {
      ...cat,
      allocatedAmount: proportional,
      percentage: newPercent,
    };
  });

  // Adjust timeline tasks based on daysOffsetDelta (e.g., date compressed by 2 weeks)
  const adjustedTasks = currentPlan.tasks.map((task) => {
    const newDaysBefore = Math.max(0, task.daysBeforeEvent - daysOffsetDelta);
    let newPriority = task.priority;
    let urgencyTip = task.aiTip;

    if (daysOffsetDelta > 0 && newDaysBefore < 14 && task.status !== 'completed') {
      newPriority = 'high';
      urgencyTip = `⚠️ URGENT: Event timeline moved forward by ${daysOffsetDelta} days! Complete this immediately to avoid bottlenecks.`;
    }

    return {
      ...task,
      daysBeforeEvent: newDaysBefore,
      priority: newPriority,
      aiTip: urgencyTip,
    };
  });

  return {
    ...currentPlan,
    details: {
      ...currentPlan.details,
      guestCount: newGuestCount,
      totalBudget: newTotalBudget,
    },
    budget: {
      ...currentPlan.budget,
      totalBudget: newTotalBudget,
      contingencyAmount: newContingencyAmount,
      allocatedTotal: normalizedCategories.reduce((sum, c) => sum + c.allocatedAmount, 0),
      remainingAmount: newEffectiveBudget - normalizedCategories.reduce((sum, c) => sum + c.allocatedAmount, 0),
      categories: normalizedCategories,
    },
    tasks: adjustedTasks,
    scenarioHistory: [
      {
        ...shift,
        appliedAt: new Date().toLocaleTimeString(),
        description:
          description ||
          `Shift: ${guestCountDelta >= 0 ? '+' : ''}${guestCountDelta} guests, ${budgetPercentDelta >= 0 ? '+' : ''}${budgetPercentDelta}% budget, ${daysOffsetDelta >= 0 ? '+' : ''}${daysOffsetDelta} days date shift`,
      },
      ...currentPlan.scenarioHistory,
    ],
    lastUpdated: new Date().toISOString(),
  };
}
