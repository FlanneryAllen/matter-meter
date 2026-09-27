import React, { useState } from 'react';

const Mark = ({ className = '' }) => <span className={`font-bold ${className}`}>{'>'}</span>;

// Renders **bold** markers as real bold text
const RichText = ({ text }) =>
  text.split('\n').map((line, i) => (
    <p key={i} className={line.trim() ? 'mb-2 last:mb-0' : 'h-2'}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </p>
  ));

const priorityOptions = [
  { id: 'strengthen-team', label: "Strengthen team's strategic position", description: "Elevate your team's reputation and influence within the organization" },
  { id: 'hit-goals', label: 'Hit strategic goals', description: 'Focus on work that directly advances key business objectives for team or company' },
  { id: 'impress-leadership', label: 'Impress senior leadership', description: 'Build credibility and visibility with C-suite, SVPs, or key decision-makers' },
  { id: 'build-company-reputation', label: 'Build company/brand reputation', description: 'Enhance external perception with customers, analysts, or industry peers' },
  { id: 'advance-career', label: 'Advance my career', description: 'Build the portfolio, relationships, and visibility needed for your next role' },
  { id: 'navigate-politics', label: 'Navigate organizational politics', description: 'Build relationships and position yourself/team strategically' },
  { id: 'create-meaningful-work', label: 'Create meaningful work', description: 'Focus on projects that align with your values and create real impact' },
  { id: 'protect-wellbeing', label: 'Protect my wellbeing', description: 'Maintain sustainable work practices and avoid burnout' },
];

const stepOrder = [
  'priority', 'project', 'politicalBacking', 'executiveVisibility', 'strategicAlignment',
  'timeline', 'effort', 'reputationalUpside', 'consequences', 'bandwidth',
];

const getSteps = (priorityLabel) => ({
  priority: {
    question: 'What matters most to you right now?',
    subtitle: 'Pick the thing that actually matters, not what sounds good in meetings.',
    type: 'choice',
    options: priorityOptions,
  },
  project: {
    question: "What's the project?",
    subtitle: `Since you want to ${priorityLabel}, let's see if this work serves that goal.`,
    type: 'open',
    placeholder: 'Describe the work: Executive messaging for product launch, crisis response deck, team newsletter redesign, strategic framework...',
  },
  politicalBacking: {
    question: 'Who wants this to succeed?',
    subtitle: 'Good work needs good champions. Who are yours?',
    type: 'choice',
    options: [
      { id: 'senior-champion', label: 'Senior leadership champion', description: 'C-suite, SVP, or board member actively supports this' },
      { id: 'influential-supporter', label: 'Influential internal supporter', description: 'Someone influential is championing this internally' },
      { id: 'manager-priority', label: 'Direct manager priority', description: 'Your immediate boss considers this important' },
      { id: 'team-initiative', label: 'Team/departmental initiative', description: 'Your team or department collectively supports this' },
      { id: 'solo-passion', label: 'Mainly your initiative', description: 'You see the value, but organizational support is unclear' },
      { id: 'unclear-support', label: 'Checkbox exercise', description: 'Limited sponsorship, unclear demand, work that exists to exist' },
    ],
  },
  executiveVisibility: {
    question: 'Who will see this work?',
    subtitle: 'If nobody sees it, did it really happen?',
    type: 'choice',
    options: [
      { id: 'cSuite', label: 'C-suite, board members, or major clients' },
      { id: 'leadership', label: 'SVPs, VPs, or senior leadership team' },
      { id: 'external', label: 'External audiences (analysts, press, industry)' },
      { id: 'internal', label: 'Other teams and managers' },
      { id: 'minimal', label: 'Limited internal audience (mostly your team)' },
      { id: 'no-one', label: 'Probably no one' },
    ],
  },
  strategicAlignment: {
    question: 'How does this connect to company strategy?',
    subtitle: 'Companies fund what they care about.',
    type: 'choice',
    options: [
      { id: 'core-priority', label: 'Directly advances a core company priority' },
      { id: 'supports-strategy', label: 'Clearly supports stated strategic goals' },
      { id: 'nice-to-have', label: 'Nice to have, not need to have' },
      { id: 'unclear-connection', label: "Can't tie this back to company goals" },
      { id: 'off-strategy', label: "Actually works against what we're trying to do" },
    ],
  },
  timeline: {
    question: "What's driving the timeline?",
    subtitle: 'Real deadlines vs. made-up urgency.',
    type: 'choice',
    options: [
      { id: 'board-deadline', label: 'Board meeting, earnings, or major milestone' },
      { id: 'leadership-timeline', label: 'Executive commitment or public deadline' },
      { id: 'quarterly-target', label: 'Quarterly goals or planned initiative' },
      { id: 'flexible', label: 'Flexible timeline with some business rationale' },
      { id: 'no-deadline', label: 'No real deadline or business driver' },
    ],
  },
  effort: {
    question: "What's the effort and complexity?",
    subtitle: 'How much work is this really?',
    type: 'choice',
    options: [
      { id: 'light', label: 'Light lift (few hours, straightforward execution)' },
      { id: 'moderate', label: 'Moderate effort (several days, some coordination)' },
      { id: 'significant', label: 'Significant investment (weeks, multiple stakeholders)' },
      { id: 'major', label: 'Major undertaking (months, high complexity, many dependencies)' },
    ],
  },
  reputationalUpside: {
    question: "What's the upside if this succeeds?",
    subtitle: 'Think beyond completion—what strategic value does success create?',
    type: 'choice',
    options: [
      { id: 'major', label: 'Major reputational/strategic win for company and team' },
      { id: 'significant', label: 'Significant positive impact on key relationships/perception' },
      { id: 'solid', label: 'Solid execution that strengthens credibility for myself or team' },
      { id: 'minor', label: 'Minor positive impact, meets basic expectations' },
      { id: 'none', label: 'Limited upside beyond checking a box' },
    ],
  },
  consequences: {
    question: 'What happens if you just…don’t?',
    subtitle: "Sometimes the best decision is the one you don't make.",
    type: 'choice',
    options: [
      { id: 'relationship-suffer', label: 'Someone might be disappointed' },
      { id: 'miss-opportunity', label: 'You may miss a strategic opportunity' },
      { id: 'nothing', label: 'Nothing. Literally nothing.' },
      { id: 'feel-guilty', label: 'Personal guilt (but no business impact)' },
    ],
  },
  bandwidth: {
    question: "What's your current bandwidth reality?",
    subtitle: 'Be real about what you can actually handle.',
    type: 'choice',
    options: [
      { id: 'available', label: 'Good capacity—can invest proper time and attention' },
      { id: 'stretched', label: 'Stretched but manageable with prioritization' },
      { id: 'maxed', label: 'Already maxed out—would require sacrifice elsewhere' },
      { id: 'crisis', label: 'In crisis mode—any new work risks everything else' },
    ],
  },
});

const baseWeights = {
  effort: { light: 1, moderate: 2, significant: 3, major: 4 },
  executiveVisibility: { 'no-one': -1, minimal: 0, internal: 1, external: 2, leadership: 3, cSuite: 4 },
  reputationalUpside: { none: 0, minor: 1, solid: 2, significant: 3, major: 4 },
  consequences: { 'relationship-suffer': 2, 'miss-opportunity': 3, nothing: 0, 'feel-guilty': 0 },
  politicalBacking: {
    'senior-champion': 4, 'influential-supporter': 3, 'manager-priority': 2,
    'team-initiative': 1, 'solo-passion': 0, 'unclear-support': -1,
  },
  strategicAlignment: {
    'core-priority': 3, 'supports-strategy': 2, 'nice-to-have': 1,
    'unclear-connection': 0, 'off-strategy': -1,
  },
  timeline: {
    'board-deadline': 3, 'leadership-timeline': 2.5, 'quarterly-target': 2,
    flexible: 1, 'no-deadline': 0,
  },
  bandwidth: { available: 2, stretched: 1, maxed: -1, crisis: -3 },
};

// Weights shift based on what the user says matters most right now
const priorityWeightAdjustments = {
  'strengthen-team': { politicalBacking: 2.5, strategicAlignment: 2.0, reputationalUpside: 2.0, executiveVisibility: 1.8 },
  'hit-goals': { strategicAlignment: 2.8, politicalBacking: 1.8, reputationalUpside: 1.8, timeline: 1.5, effort: 1.0 },
  'impress-leadership': { executiveVisibility: 3.0, politicalBacking: 2.8, reputationalUpside: 2.5, strategicAlignment: 2.2, effort: 1.0 },
  'build-company-reputation': { reputationalUpside: 3.0, consequences: 2.5, strategicAlignment: 2.2, executiveVisibility: 2.0 },
  'advance-career': { executiveVisibility: 2.8, reputationalUpside: 2.5, politicalBacking: 2.2, effort: 1.1 },
  'navigate-politics': { politicalBacking: 3.2, executiveVisibility: 2.0, consequences: 2.0, effort: 0.8 },
  'create-meaningful-work': { strategicAlignment: 2.5, reputationalUpside: 2.0, executiveVisibility: 1.4, effort: 0.8 },
  'protect-wellbeing': { bandwidth: 3.0, effort: 2.8, consequences: 2.2, executiveVisibility: 0.8, timeline: 0.7 },
};

const getThresholds = (priority) => {
  if (priority === 'protect-wellbeing') return { goAllIn: 20, dialBack: 14 };
  if (priority === 'advance-career' || priority === 'impress-leadership') return { goAllIn: 15, dialBack: 9 };
  if (priority === 'create-meaningful-work') return { goAllIn: 14, dialBack: 8 };
  return { goAllIn: 16, dialBack: 10 };
};

// Keyword signals from the project description nudge the scores
const analyzeProjectDescription = (description) => {
  const text = description.toLowerCase();
  const has = (...words) => words.some((w) => text.includes(w));
  const adj = { executiveVisibility: 0, reputationalUpside: 0, consequences: 0, strategicAlignment: 0, politicalBacking: 0 };

  if (has('ceo', 'board', 'c-suite')) { adj.executiveVisibility += 1.0; adj.politicalBacking += 0.5; }
  if (has('svp', 'executive', 'leadership')) adj.executiveVisibility += 0.7;
  if (has('crisis', 'damage control')) { adj.consequences += 0.8; adj.executiveVisibility += 0.5; }
  if (has('launch', 'announcement', 'external')) adj.reputationalUpside += 0.4;
  if (has('analyst', 'media', 'press')) adj.consequences += 0.3;
  if (has('strategy', 'vision', 'roadmap')) { adj.strategicAlignment += 0.5; adj.executiveVisibility += 0.3; }
  if (has('internal', 'update', 'maintenance')) adj.executiveVisibility -= 0.3;

  return adj;
};

const DECISIONS = {
  goAllIn: { label: '✅ Go All In', color: 'text-green-600' },
  dialBack: { label: 'Dial It Back', color: 'text-yellow-600' },
  letGo: { label: '❌ Let It Go', color: 'text-red-600' },
};

const agentConfig = {
  strategist: {
    name: 'Strategic Context',
    icon: '◎',
    description: 'What this means for your career and company relationships',
    activeClass: 'border-purple-300 bg-purple-50',
    panelClass: 'border-purple-200 bg-purple-50',
  },
  riskAnalyst: {
    name: 'Risk Analysis',
    icon: '!',
    description: 'Downside assessment and mitigation strategies',
    activeClass: 'border-red-300 bg-red-50',
    panelClass: 'border-red-200 bg-red-50',
  },
};

export default function MatterMeter() {
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [responses, setResponses] = useState({});
  const [customInput, setCustomInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ helpful: null, followed: null });
  const [aiAgents, setAiAgents] = useState({});
  const [loadingAgents, setLoadingAgents] = useState({});
  const [openAgents, setOpenAgents] = useState({});

  const priorityChoice = priorityOptions.find((o) => o.id === responses.priority);
  const priorityLabel = priorityChoice ? priorityChoice.label.toLowerCase() : 'your priority';
  const steps = getSteps(priorityLabel);

  const labelFor = (stepKey) => {
    const step = steps[stepKey];
    const value = responses[stepKey];
    if (!step || !value) return 'not provided';
    if (step.type === 'open') return value;
    return step.options.find((o) => o.id === value)?.label || value;
  };

  const calculateScore = () => {
    const adjustments = priorityWeightAdjustments[responses.priority] || {};
    const descAdj = responses.project ? analyzeProjectDescription(responses.project) : {};
    let score = 0;

    Object.keys(baseWeights).forEach((factor) => {
      const answer = responses[factor];
      if (!answer) return;
      const weight = adjustments[factor] || 1;
      const value = (baseWeights[factor][answer] ?? 0) + (descAdj[factor] || 0);
      score += factor === 'effort' ? -value * weight : value * weight;
    });

    if (responses.timeline === 'no-deadline' && responses.politicalBacking === 'unclear-support') score -= 2;
    if (responses.executiveVisibility === 'cSuite' && responses.strategicAlignment === 'core-priority') score += 2;

    return Math.max(0, score);
  };

  const generateRationale = (score, decision, thresholds) => {
    const { priority, effort, executiveVisibility, reputationalUpside, politicalBacking, strategicAlignment, timeline, bandwidth } = responses;
    const r = [`You said you want to ${priorityLabel}. Here's what the work tells us:\n`];

    if (decision === 'goAllIn') {
      r.push('**This is the work that matters.**');
      if (politicalBacking === 'senior-champion') r.push('Senior leadership has chosen this hill. When they choose, you choose. That’s how trust builds.');
      if (executiveVisibility === 'cSuite') r.push('C-suite attention is earned, not given. They’ll remember how you handle this moment.');
      if (strategicAlignment === 'core-priority') r.push('This isn’t just aligned with strategy—it is strategy. The work that drives the work.');
      if (timeline === 'board-deadline') r.push('Board deadlines are promises the company makes to itself. Keep the promise.');
      if (reputationalUpside === 'major' || reputationalUpside === 'significant') r.push('Reputation isn’t built in a day. But it can be built in a project like this.');
      if (priority === 'advance-career') r.push('Career advancement happens at the intersection of visibility and excellence. This is that intersection.');
      if (priority === 'hit-goals') r.push('Strategic goals get hit by work like this—aligned, backed, and seen.');
      if (priority === 'create-meaningful-work') r.push('Meaningful work changes things. This has the conditions to change things.');
      if (effort === 'major') r.push('\n**A note on effort:** Big things require big effort. But big effort without focus becomes busy work. Stay focused.');
      if (bandwidth === 'stretched' || bandwidth === 'maxed') r.push('**A note on capacity:** You’re already full. Something else has to give way. Choose what gives way instead of letting chance choose.');
    } else if (decision === 'dialBack') {
      r.push('**Do this, but do it differently.**');
      if (politicalBacking === 'team-initiative' || politicalBacking === 'manager-priority') r.push('You have support, which means you have room to shape how this gets done.');
      if (executiveVisibility === 'internal') r.push('Internal work builds credibility. But it builds it slowly. Pace accordingly.');
      if (effort === 'significant' && bandwidth === 'stretched') r.push('The math of effort and time doesn’t work. Change the math or change the outcome.');
      if (timeline === 'flexible') r.push('Flexible timelines are gifts. Use the gift to do better work, not just faster work.');
      if (reputationalUpside === 'solid') r.push('Solid work creates solid reputations. There’s honor in that. Just know what you’re building.');
      if (priority === 'protect-wellbeing') r.push('Wellbeing is protected by choosing carefully, not by choosing nothing.');
      if (priority === 'hit-goals') r.push('Goals get hit by focus, not volume. Give this the version that moves the number.');
      r.push('\n**The opportunity:** Find the essential 30% that delivers the meaningful 70%. Then do that beautifully.');
    } else {
      r.push('**This isn’t the work.**');
      if (politicalBacking === 'unclear-support' || politicalBacking === 'solo-passion') r.push('Work without champions is work without impact. Find the champions first, then do the work.');
      if (timeline === 'no-deadline') r.push('No deadline signals no urgency. No urgency signals no importance. Believe the signal.');
      if (strategicAlignment === 'off-strategy' || strategicAlignment === 'unclear-connection') r.push('Off-strategy work is expensive. It costs time, attention, and credibility. The price is too high.');
      if (responses.consequences === 'nothing') r.push('If nothing happens when you don’t do it, that’s your answer.');
      if (bandwidth === 'crisis' || bandwidth === 'maxed') r.push('When you’re underwater, swimming harder isn’t the answer. Find the surface first.');
      if (executiveVisibility === 'minimal' || executiveVisibility === 'no-one') r.push('Invisible work is invisible impact. Make work that can be seen.');
      if (priority === 'protect-wellbeing') r.push('Protecting wellbeing means protecting energy for work that matters. This doesn’t matter enough.');
      if (priority === 'advance-career') r.push('Careers advance through choices that compound. This choice doesn’t compound.');
      if (politicalBacking === 'senior-champion') r.push('\n**Wait.** Senior leadership wants this. The answer isn’t no, it’s how. Go have that conversation.');
      if (timeline === 'board-deadline') r.push('\n**Reconsider.** Board deadlines are organizational promises. If you can’t keep the promise, help them understand why.');
    }

    r.push(`\n**Your Score: ${score.toFixed(1)}** (Go All In: ${thresholds.goAllIn}+, Dial Back: ${thresholds.dialBack}+)`);
    return r.join('\n');
  };

  const getRecommendation = () => {
    const score = calculateScore();
    const thresholds = getThresholds(responses.priority);
    const key = score >= thresholds.goAllIn ? 'goAllIn' : score >= thresholds.dialBack ? 'dialBack' : 'letGo';
    return { key, ...DECISIONS[key], rationale: generateRationale(score, key, thresholds) };
  };

  const generateStrategicAlternatives = (key) => {
    const sections = [];
    const { politicalBacking, executiveVisibility, strategicAlignment } = responses;

    if (key !== 'goAllIn') {
      const items = [];
      if (politicalBacking === 'solo-passion' || politicalBacking === 'unclear-support') items.push('Find your coalition - Stop pitching to the void. Find 2-3 people who actually benefit from this and get them bought in first.');
      if (['minimal', 'internal', 'no-one'].includes(executiveVisibility)) items.push('Create the moment - Nobody accidentally sees your work. Propose updates to leadership meetings. Make it board-material worthy.');
      if (strategicAlignment === 'unclear-connection') items.push("Connect the strategic dots - If this doesn't advance something the company publicly said it cares about, either reframe it or reconsider it.");
      if (items.length) sections.push({ heading: 'Want to make this actually matter?', items });
    }

    if (key === 'dialBack') {
      sections.push({
        heading: 'How to be strategic about dialing back:',
        items: [
          "The 80/20 rule is real - What's the 20% of this work that delivers 80% of the strategic value? Do that part.",
          'Phase like you mean it - Break this into 2-3 smaller wins over months. Build momentum instead of burning out.',
          'Make it collaborative - Partner with other teams. Share the effort, share the credit, get more stakeholder buy-in.',
          "Build the template - Create something reusable. If you're going to spend time on this, make it pay dividends later.",
        ],
      });
    }

    if (key === 'letGo') {
      sections.push({
        heading: "If saying no isn't an option:",
        items: [
          "Force the priority conversation - 'What should I deprioritize to make room for this?' Make them choose.",
          'Set expectations like an adult - Communicate your constraints and the likely outcomes. No heroic promises.',
          "Propose the alternative - Don't just say no. Suggest different approaches that achieve the same goal with less effort.",
          "Ask for what you need - Additional resources, timeline adjustment, or reduced scope. You're not a magician.",
        ],
      });
    }

    return sections;
  };

  const handleAgentClick = async (agentId) => {
    if (aiAgents[agentId]) {
      setOpenAgents((prev) => ({ ...prev, [agentId]: !prev[agentId] }));
      return;
    }

    setLoadingAgents((prev) => ({ ...prev, [agentId]: true }));
    const context = {
      project: responses.project,
      priority: priorityChoice?.label,
      recommendation: getRecommendation().label,
      politicalBacking: labelFor('politicalBacking'),
      executiveVisibility: labelFor('executiveVisibility'),
      strategicAlignment: labelFor('strategicAlignment'),
      timeline: labelFor('timeline'),
      effort: labelFor('effort'),
      consequences: labelFor('consequences'),
      bandwidth: labelFor('bandwidth'),
    };

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: agentId, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setAiAgents((prev) => ({ ...prev, [agentId]: data.text }));
      setOpenAgents((prev) => ({ ...prev, [agentId]: true }));
    } catch (err) {
      setAiAgents((prev) => ({ ...prev, [agentId]: `Having trouble connecting to ${agentConfig[agentId].name} right now. Please try again in a moment.` }));
      setOpenAgents((prev) => ({ ...prev, [agentId]: true }));
    } finally {
      setLoadingAgents((prev) => ({ ...prev, [agentId]: false }));
    }
  };

  const handleResponse = (value) => {
    setResponses((prev) => ({ ...prev, [currentStep]: value }));
    const i = stepOrder.indexOf(currentStep);
    setCurrentStep(i < stepOrder.length - 1 ? stepOrder[i + 1] : 'result');
    setCustomInput('');
  };

  const resetAssessment = () => {
    setCurrentStep('priority');
    setResponses({});
    setCustomInput('');
    setShowFeedback(false);
    setFeedback({ helpful: null, followed: null });
    setAiAgents({});
    setLoadingAgents({});
    setOpenAgents({});
  };

  const stepData = steps[currentStep];
  const recommendation = currentStep === 'result' ? getRecommendation() : null;
  const alternatives = recommendation ? generateStrategicAlternatives(recommendation.key) : [];
  const gradientBtn = 'w-full py-3 bg-gradient-to-r from-slate-700 to-blue-700 text-white rounded-lg hover:from-slate-800 hover:to-blue-800 transition-all';
  const pill = (active, activeClass) => `px-3 py-1 text-sm rounded ${active ? activeClass : 'bg-gray-200 text-gray-600'}`;

  return (
    <div className="pt-8 pb-8 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-blue-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Mark className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">The Matter Meter</h1>
              <p className="text-slate-100 text-sm">
                {priorityChoice ? `Strategic focus: ${priorityChoice.label}` : 'Strategic gut-checks for creative people'}
              </p>
            </div>
          </div>
        </div>

        {/* Priority indicator */}
        {priorityChoice && currentStep !== 'priority' && currentStep !== 'onboarding' && (
          <div className="bg-slate-50 p-3 border-b">
            <div className="flex items-center gap-2 text-sm">
              <Mark className="text-slate-600" />
              <span className="font-medium text-slate-800">Focus: {priorityChoice.label}</span>
              <button onClick={() => setCurrentStep('priority')} className="ml-auto text-slate-600 hover:text-slate-800 text-xs underline">
                Change
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Onboarding */}
          {currentStep === 'onboarding' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mark className="text-white text-3xl" />
              </div>
              <h2 className="text-xl font-semibold mb-3">The Matter Meter</h2>
              <p className="text-lg text-slate-600 mb-6">
                Helping you gut-check whether the thing you're about to
                <br />
                spend hours on...actually matters. Not the task. The effort.
              </p>

              <div className="text-left max-w-md mx-auto space-y-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">The questions we all ask ourselves:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• "Should I fight for this creative solution?"</li>
                    <li>• "Will this move the needle on my career?"</li>
                    <li>• "Could this make my team look brilliant?"</li>
                    <li>• "Is this the hill worth climbing?"</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Because:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Some projects change everything</li>
                    <li>• Others change nothing</li>
                    <li>• The difference is rarely what you think</li>
                    <li>• Strategy is choosing which work deserves your love</li>
                  </ul>
                </div>
              </div>

              <button onClick={() => setCurrentStep('priority')} className={gradientBtn}>
                Help Me Decide
              </button>
            </div>
          )}

          {/* Results */}
          {currentStep === 'result' && (
            <div className="text-center">
              <div className={`text-4xl mb-4 ${recommendation.color}`}>{recommendation.label}</div>

              <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 text-sm text-gray-700">
                <RichText text={recommendation.rationale} />
              </div>

              {/* Strategic Alternatives */}
              {alternatives.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-blue-800 mb-2">{'>>>'} Strategic Alternatives</h4>
                  <div className="text-sm text-blue-700 leading-relaxed">
                    {alternatives.map((section) => (
                      <div key={section.heading} className="mt-4 first:mt-0">
                        <div className="font-semibold mb-2">{section.heading}</div>
                        {section.items.map((item) => (
                          <div key={item} className="flex items-start gap-2 mb-2 ml-4">
                            <span className="text-blue-600 text-lg leading-5">•</span>
                            <span className="flex-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Advisors */}
              <div className="mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-2">Want deeper insights?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Get personalized strategic context and risk analysis from AI advisors.
                </p>
                <p className="text-xs text-gray-500 italic mb-4">Powered by Claude.</p>

                <div className="space-y-3">
                  {Object.entries(agentConfig).map(([id, agent]) => (
                    <div key={id}>
                      <button
                        onClick={() => handleAgentClick(id)}
                        disabled={loadingAgents[id]}
                        className={`w-full p-4 border rounded-lg text-left transition-all ${
                          aiAgents[id] ? agent.activeClass : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        } ${loadingAgents[id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold w-6 text-center">{agent.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-gray-600">{agent.description}</div>
                          </div>
                          {loadingAgents[id] && (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {aiAgents[id] && !loadingAgents[id] && (
                            <span className="text-gray-500 text-sm">{openAgents[id] ? 'Hide' : 'Show'}</span>
                          )}
                        </div>
                      </button>

                      {aiAgents[id] && openAgents[id] && (
                        <div className={`mt-3 border rounded-lg p-4 ${agent.panelClass}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold">{agent.icon}</span>
                            <div className="font-semibold text-gray-800">{agent.name}</div>
                          </div>
                          <div className="text-sm text-gray-800 leading-relaxed">
                            <RichText text={aiAgents[id]} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {!showFeedback ? (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="w-full mb-6 py-2 text-gray-600 text-sm hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Was this strategic assessment helpful?
                </button>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left">
                  <h4 className="font-medium text-gray-800 mb-3">Quick feedback:</h4>
                  <p className="text-sm text-gray-600 mb-2">Was this strategic guidance helpful?</p>
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => setFeedback((p) => ({ ...p, helpful: true }))} className={pill(feedback.helpful === true, 'bg-green-200 text-green-800')}>👍 Yes</button>
                    <button onClick={() => setFeedback((p) => ({ ...p, helpful: false }))} className={pill(feedback.helpful === false, 'bg-red-200 text-red-800')}>👎 No</button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Will you follow this recommendation?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setFeedback((p) => ({ ...p, followed: 'yes' }))} className={pill(feedback.followed === 'yes', 'bg-blue-200 text-blue-800')}>Yes</button>
                    <button onClick={() => setFeedback((p) => ({ ...p, followed: 'maybe' }))} className={pill(feedback.followed === 'maybe', 'bg-yellow-200 text-yellow-800')}>Maybe</button>
                    <button onClick={() => setFeedback((p) => ({ ...p, followed: 'no' }))} className={pill(feedback.followed === 'no', 'bg-gray-300 text-gray-700')}>No</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {feedback.helpful === true && feedback.followed === 'yes' && 'Excellent! The strategic framework is working as intended.'}
                    {feedback.helpful === false && 'Thanks for the feedback - helps refine the strategic logic.'}
                    {feedback.followed === 'maybe' && 'Context always matters more than algorithms in real organizations.'}
                  </p>
                </div>
              )}

              <button onClick={resetAssessment} className={gradientBtn}>
                Assess Another Project
              </button>
            </div>
          )}

          {/* Question flow */}
          {stepData && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 gap-4">
                  <h2 className="text-lg font-semibold">{stepData.question}</h2>
                  <span className="text-sm text-gray-500 shrink-0">
                    {stepOrder.indexOf(currentStep) + 1} / {stepOrder.length}
                  </span>
                </div>
                {stepData.subtitle && <p className="text-gray-600 text-sm mb-4">{stepData.subtitle}</p>}
              </div>

              {stepData.type === 'choice' ? (
                <div className="space-y-3">
                  {stepData.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleResponse(option.id)}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {currentStep === 'priority' && <Mark className="text-gray-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          {option.description && <div className="text-sm text-gray-600 mt-1">{option.description}</div>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={stepData.placeholder}
                    maxLength={1000}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <button
                    onClick={() => customInput.trim() && handleResponse(customInput.trim())}
                    disabled={!customInput.trim()}
                    className={`${gradientBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
