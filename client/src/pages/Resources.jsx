import { useMemo, useState } from 'react';

const ROLE_PLAYBOOKS = [
  {
    key: 'citizen',
    label: 'Citizen',
    objective: 'Rights protection, complaint filing, bail readiness, and court tracking.',
    firstActions: [
      'Capture facts in timeline format: date, time, place, persons present, evidence available.',
      'Secure documents immediately: ID proof, relevant contracts/receipts, medical reports, call records, and notices.',
      'Use written complaints with receiving stamp/diary number wherever possible.',
      'Track each police/court step by date to avoid missed limitation or hearing dates.'
    ],
    workflows: [
      {
        title: 'FIR and Complaint Path',
        steps: [
          'Submit written complaint to jurisdictional police station and seek GD/DD entry number.',
          'For cognizable offences, insist on FIR copy free of cost after registration.',
          'If FIR is refused, escalate to Superintendent of Police in writing and preserve proof of dispatch.',
          'If still unresolved, move Magistrate route through counsel with supporting affidavit/documents.'
        ]
      },
      {
        title: 'Arrest and Bail Readiness',
        steps: [
          'Keep emergency contact chain and local counsel details ready for immediate coordination.',
          'Collect health records and dependency records if needed for bail parity/hardship submissions.',
          'Prepare surety documents and address proof in advance to reduce remand-to-bail delay.',
          'Track bail conditions strictly and retain compliance proof to avoid cancellation risk.'
        ]
      },
      {
        title: 'Civil Dispute Preparation',
        steps: [
          'Issue legal notice with clear claim amount/relief and supporting annexures.',
          'Preserve originals and create indexed scan set for filing and interim applications.',
          'Map limitation clock and urgent interim relief triggers (injunction/status quo/stay).',
          'Maintain appearance and order-sheet log from day one.'
        ]
      }
    ],
    criticalTimelines: [
      'Appeal/revision windows vary by forum/statute; verify limitation immediately after each order.',
      'Bail conditions and appearance timelines are strict; non-compliance can trigger coercive steps.',
      'Interim relief matters are time-sensitive; filing delay can prejudice urgency argument.'
    ]
  },
  {
    key: 'police',
    label: 'Police',
    objective: 'Lawful investigation, victim safety, evidentiary integrity, and procedural compliance.',
    firstActions: [
      'Classify offence as cognizable/non-cognizable and apply correct registration process.',
      'Record first information accurately, preserving complainant language and key identifiers.',
      'Secure scene, chain of custody, and digital evidence with documented seizure procedure.',
      'Trigger victim/witness protection steps in sensitive offences.'
    ],
    workflows: [
      {
        title: 'Investigation Control Checklist',
        steps: [
          'Case diary updates should mirror investigative acts and rationale for each step.',
          'Witness statements should be sequenced with contradiction matrix and recovery map.',
          'For digital evidence, capture hash values, device details, and forensic handover logs.',
          'Submit final report/chargesheet with annexure index, FSL status, sanction status, and pending leads.'
        ]
      },
      {
        title: 'Arrest and Search Safeguards',
        steps: [
          'Apply necessity/proportionality before arrest; document grounds clearly.',
          'Follow arrest memo, intimation, medical checks, and production timeline requirements.',
          'Conduct searches/seizures with independent witness support and inventory precision.',
          'Ensure women/juvenile/special category safeguards are not treated as optional.'
        ]
      },
      {
        title: 'Court-facing Quality Control',
        steps: [
          'Align witness examination sequence to narrative flow and evidentiary dependencies.',
          'Pre-verify exhibits, labels, and chain documents before each evidence date.',
          'Track summons service, warrant execution, and witness attendance metrics.',
          'Maintain prosecution coordination notes to reduce adjournment-driven delay.'
        ]
      }
    ],
    criticalTimelines: [
      'Arrest production and remand windows are non-negotiable and must be monitored in real time.',
      'Investigation completion and filing timelines should be tracked by offence category.',
      'Forensic pendency should be escalated early to avoid collapse of trial momentum.'
    ]
  },
  {
    key: 'lawyer',
    label: 'Lawyer',
    objective: 'Strategy-led representation from pre-litigation to appeal with procedural precision.',
    firstActions: [
      'Build fact matrix, issue matrix, and document admissibility matrix separately.',
      'Classify relief into interim/final/enforcement buckets before drafting.',
      'Create statute-plus-precedent sheet tailored to forum and factual posture.',
      'Define client communication cadence and document handoff protocol.'
    ],
    workflows: [
      {
        title: 'Criminal Defense / Prosecution Preparation',
        steps: [
          'Frame maintainability and jurisdiction objections at first available stage.',
          'Prepare bail/anticipatory bail briefs with parity and antecedent analysis.',
          'Design cross-examination tree linked to contradiction points and exhibit record.',
          'Maintain post-order playbook: compliance, appeal, suspension, or modification route.'
        ]
      },
      {
        title: 'Civil and Commercial Matter Flow',
        steps: [
          'Draft pleadings with prayer precision and fallback relief language.',
          'Map cause of action dates for limitation defense and condonation strategy.',
          'Prepare admission/denial and document exhibition plan early.',
          'Use execution strategy planning in parallel with trial to reduce post-decree delay.'
        ]
      },
      {
        title: 'Client Risk and Compliance',
        steps: [
          'Set realistic outcome bands (best/base/worst) with timeline assumptions.',
          'Document all settlement offers and without-prejudice communication clearly.',
          'Maintain conflict checks and confidentiality controls for multi-party matters.',
          'Track compliance obligations from each interim and final order.'
        ]
      }
    ],
    criticalTimelines: [
      'Limitation and condonation must be validated before drafting starts.',
      'Interim relief matters require rapid filing and service proof discipline.',
      'Appeal preparation should begin before certified copy arrives where urgency exists.'
    ]
  },
  {
    key: 'judge',
    label: 'Judge',
    objective: 'Docket control, procedural fairness, reasoned adjudication, and enforceable orders.',
    firstActions: [
      'Classify matter urgency and define hearing structure on first listing.',
      'Identify maintainability, jurisdiction, and statutory bar issues early.',
      'Set calendar discipline: pleadings, admission/denial, issues, evidence, arguments, judgment.',
      'Enforce focused filings to reduce record clutter and hearing drift.'
    ],
    workflows: [
      {
        title: 'Case Management Bench Checklist',
        steps: [
          'Use issue-framing and burden allocation as case-control anchors.',
          'Limit adjournments to reasoned necessity and track repeat defaults.',
          'Adopt witness scheduling windows to protect evidence continuity.',
          'Reserve and pronounce with reasoned structure: facts, law, analysis, relief.'
        ]
      },
      {
        title: 'Criminal Trial Discipline',
        steps: [
          'Monitor disclosure, charge framing, and examination sequencing consistency.',
          'Record reasons for bail/custody orders with statutory factors clearly addressed.',
          'Prioritize vulnerable witness protection and in-camera protocol where required.',
          'Ensure sentencing hearing addresses aggravating/mitigating factors explicitly.'
        ]
      },
      {
        title: 'Civil/Commercial Adjudication',
        steps: [
          'Apply proportionate case-management for injunction-heavy litigation.',
          'Keep documentary proof matrix visible across stages to avoid duplication.',
          'Use concise issue-wise findings to improve appellate sustainability.',
          'Frame executable relief language and compliance checkpoints in final order.'
        ]
      }
    ],
    criticalTimelines: [
      'Structured calendars reduce adjournment inflation and evidence attrition.',
      'Reasoned interim orders improve compliance and reduce repetitive applications.',
      'Execution-aware judgments reduce post-decree uncertainty.'
    ]
  }
];

const DEEP_REFERENCE = [
  {
    area: 'Constitutional Framework',
    depth: [
      'Preamble and constitutional morality foundations for state action review.',
      'Part III fundamental rights in policing, detention, speech, privacy, and due process contexts.',
      'Part IV directive principles as policy-direction lens in welfare and governance disputes.',
      'Federal distribution (Seventh Schedule) for Centre-State competency disputes.',
      'Constitutional remedies through writ jurisdiction and supervisory structures.'
    ],
    practicalUse: [
      'Use Articles 14, 19, 21, 22 and 32/226 as primary rights-infringement response frame.',
      'Use proportionality and reasonableness tests in executive action challenges.',
      'Check legislative competence before merits in constitutional litigation.'
    ]
  },
  {
    area: 'Criminal Substantive and Procedure System (Current + Legacy Mapping)',
    depth: [
      'Bharatiya Nyaya Sanhita, 2023: substantive offences and punishment architecture.',
      'Bharatiya Nagarik Suraksha Sanhita, 2023: investigation, arrest, remand, trial and process architecture.',
      'Bharatiya Sakshya Adhiniyam, 2023: evidence admissibility, examination, documentary and digital proof.',
      'Legacy references: IPC 1860, CrPC 1973, Evidence Act 1872 for transition and precedent reading.',
      'Special criminal statutes continue to apply where not repealed/overridden.'
    ],
    practicalUse: [
      'Maintain a working concordance sheet between old and new criminal code provisions.',
      'Cite current statute text first, then map legacy precedent context where necessary.',
      'For police and trial teams, maintain arrest-search-seizure and evidence chain compliance templates.'
    ]
  },
  {
    area: 'Police Governance and Operational Law',
    depth: [
      'Police Acts and state police manuals/regulations govern internal command and procedure.',
      'Constitutional and procedural safeguards govern arrest, detention, interrogation and force use.',
      'Juvenile, women, and vulnerable witness procedures require differentiated safeguards.',
      'Forensics, cyber evidence handling, and digital chain-of-custody now central to trial quality.',
      'Departmental accountability and judicial oversight mechanisms run in parallel.'
    ],
    practicalUse: [
      'Treat procedural compliance as evidence integrity work, not paperwork overhead.',
      'Use checklists for arrest memo, search memo, seizure memo, medical examination, and production.',
      'Escalate forensic pendency and summon execution bottlenecks with data, not assumptions.'
    ]
  },
  {
    area: 'Civil, Commercial, Family, and Public Law Core Blocks',
    depth: [
      'Contract, specific relief, property transfer, registration, limitation, and civil procedure core stack.',
      'Corporate and insolvency stack: Companies Act, LLP regime, IBC process, securities compliance layers.',
      'Family law regimes: marriage, maintenance, guardianship, succession, and domestic violence process.',
      'Labour and social security codification with legacy enactments still operational in transition contexts.',
      'Public law controls: administrative fairness, delegated legislation review, and transparency law.'
    ],
    practicalUse: [
      'Use issue-led filing strategy: maintainability, interim relief, merits, enforcement.',
      'Anchor civil pleadings to limitation and documentary proof matrix from day zero.',
      'For family disputes, combine legal remedy route with immediate support and protection mechanisms.'
    ]
  }
];

const OFFICIAL_LINKS = [
  {
    group: 'Primary Law and Gazette Sources',
    links: [
      { name: 'India Code (Central Acts and Rules)', url: 'https://www.indiacode.nic.in' },
      { name: 'eGazette of India', url: 'https://egazette.gov.in' },
      { name: 'Legislative Department', url: 'https://legislative.gov.in' },
      { name: 'Department of Justice', url: 'https://doj.gov.in' }
    ]
  },
  {
    group: 'Courts, Cause Lists, and Case Status',
    links: [
      { name: 'Supreme Court of India', url: 'https://www.sci.gov.in' },
      { name: 'eCourts Services', url: 'https://ecourts.gov.in' },
      { name: 'National Judicial Data Grid', url: 'https://njdg.ecourts.gov.in' },
      { name: 'High Court Services Portal', url: 'https://services.ecourts.gov.in/ecourtindiaHC' }
    ]
  },
  {
    group: 'Police, Home, and Investigation Ecosystem',
    links: [
      { name: 'Ministry of Home Affairs', url: 'https://www.mha.gov.in' },
      { name: 'Bureau of Police Research and Development', url: 'https://bprd.nic.in' },
      { name: 'National Crime Records Bureau', url: 'https://ncrb.gov.in' },
      { name: 'National Forensic Sciences University', url: 'https://nfsu.ac.in' }
    ]
  },
  {
    group: 'Citizens, Legal Aid, and Professional Bodies',
    links: [
      { name: 'National Legal Services Authority', url: 'https://nalsa.gov.in' },
      { name: 'Bar Council of India', url: 'https://www.barcouncilofindia.org' },
      { name: 'Department of Consumer Affairs', url: 'https://consumeraffairs.nic.in' },
      { name: 'National Commission for Women', url: 'https://ncw.nic.in' }
    ]
  }
];

function flattenSearchCorpus(rolePlaybooks, references, officialLinks) {
  const roleText = rolePlaybooks
    .flatMap((role) => [role.label, role.objective, ...role.firstActions, ...role.criticalTimelines, ...role.workflows.flatMap((w) => [w.title, ...w.steps])])
    .join(' ')
    .toLowerCase();

  const referenceText = references
    .flatMap((entry) => [entry.area, ...entry.depth, ...entry.practicalUse])
    .join(' ')
    .toLowerCase();

  const linkText = officialLinks
    .flatMap((g) => [g.group, ...g.links.flatMap((l) => [l.name, l.url])])
    .join(' ')
    .toLowerCase();

  return `${roleText} ${referenceText} ${linkText}`;
}

export default function Resources() {
  const [activeRole, setActiveRole] = useState('citizen');
  const [query, setQuery] = useState('');

  const activeRoleData = useMemo(
    () => ROLE_PLAYBOOKS.find((r) => r.key === activeRole) || ROLE_PLAYBOOKS[0],
    [activeRole]
  );

  const searchCorpus = useMemo(
    () => flattenSearchCorpus(ROLE_PLAYBOOKS, DEEP_REFERENCE, OFFICIAL_LINKS),
    []
  );

  const hasSearchHit = useMemo(() => {
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return true;
    return searchCorpus.includes(cleaned);
  }, [query, searchCorpus]);

  return (
    <div className="page-container legal-portal">
      <section className="card legal-portal-hero">
        <h2>National Legal Operations Resource Desk</h2>
        <p>
          Detailed legal-operational references for citizens, police officers, lawyers, and judges.
          This page is structured for field and court use, not for academic coursework.
        </p>
        <div className="legal-portal-meta">
          <span>Updated through: March 23, 2026</span>
          <span>Owner: Rohit Chauhan</span>
        </div>
        <small>
          This tool is informational and workflow-oriented. For live legal strategy in any active matter,
          consult qualified counsel and official notifications/orders.
        </small>
      </section>

      <section className="card legal-search-block">
        <label htmlFor="legal-resource-search">Search across statutes, process, and links</label>
        <input
          id="legal-resource-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: bail, arrest memo, constitutional remedy, chargesheet"
        />
        <small>{hasSearchHit ? 'Matching references are available below.' : 'No direct match found. Try broader legal terms.'}</small>
      </section>

      <section className="card role-switcher-block">
        <h3>Role-specific operational playbooks</h3>
        <div className="role-switcher-grid">
          {ROLE_PLAYBOOKS.map((role) => (
            <button
              key={role.key}
              type="button"
              className={`role-switcher-btn ${activeRole === role.key ? 'active' : ''}`}
              onClick={() => setActiveRole(role.key)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card role-deep-dive">
        <h3>{activeRoleData.label} Operational Blueprint</h3>
        <p>{activeRoleData.objective}</p>

        <div className="page-grid two-col role-columns">
          <article>
            <h4>First actions checklist</h4>
            <ul className="plain-list">
              {activeRoleData.firstActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article>
            <h4>Critical timeline controls</h4>
            <ul className="plain-list">
              {activeRoleData.criticalTimelines.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="workflow-stack">
          {activeRoleData.workflows.map((workflow) => (
            <article className="workflow-card" key={workflow.title}>
              <h4>{workflow.title}</h4>
              <ol>
                {workflow.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="card statute-depth-block">
        <h3>Constitution, Penal Codes, Procedure, and Police-rule depth</h3>
        <div className="statute-depth-grid">
          {DEEP_REFERENCE.map((entry) => (
            <article className="statute-depth-card" key={entry.area}>
              <h4>{entry.area}</h4>
              <strong>What this covers in depth</strong>
              <ul className="plain-list">
                {entry.depth.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <strong>Operational usage</strong>
              <ul className="plain-list">
                {entry.practicalUse.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="card links-depth-block">
        <h3>Working legal and justice links</h3>
        <p>
          These are official or institution-level portals used for statutes, notifications, case status,
          court data, police ecosystem references, and legal aid.
        </p>
        <div className="links-group-stack">
          {OFFICIAL_LINKS.map((group) => (
            <article className="link-group-card" key={group.group}>
              <h4>{group.group}</h4>
              <div className="link-grid">
                {group.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="official-link-card">
                    <span>{link.name}</span>
                    <small>{link.url}</small>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
