import { useState, useMemo } from 'react';

const RESOURCES_CATEGORIES = {
  llb: {
    title: ' LLB (Undergraduate)',
    icon: '',
    subjects: [
      {
        name: 'Constitutional Law',
        topics: ['Fundamental Rights', 'Directive Principles', 'Separation of Powers', 'Habeas Corpus'],
        resources: [
          'Constitution of India Study Materials',
          'Case Laws: Kesavananda Bharati, Shahbano Case',
          'Previous Question Papers (5 Years)'
        ]
      },
      {
        name: 'Contract Law',
        topics: ['Offer & Acceptance', 'Consideration', 'Indemnity & Guarantee', 'Bailment & Pledge'],
        resources: [
          'Indian Contract Act, 1872 - Full Text',
          'Case Analysis: Carlill v Carbolic Smoke Ball',
          'Sample Contracts & Clauses'
        ]
      },
      {
        name: 'Criminal Law',
        topics: ['Crimes Against Person', 'Crimes Against Property', 'Punishment', 'Criminal Procedure'],
        resources: [
          'Indian Penal Code (IPC) - Sections 1-228',
          'Criminal Procedure Code (CrPC) Overview',
          'Mock Case Study: Murder vs Culpable Homicide'
        ]
      },
      {
        name: 'Tort Law',
        topics: ['Negligence', 'Nuisance', 'Defamation', 'Strict Liability'],
        resources: [
          'Negligence Elements: Donoghue v Stevenson',
          'Vicarious Liability Cases',
          'Remedies in Tort Law'
        ]
      },
      {
        name: 'Property Law',
        topics: ['Ownership', 'Possession', 'Easement', 'Mortgage', 'Succession'],
        resources: [
          'Transfer of Property Act, 1882',
          'Registration Guide for Legal Practitioners',
          'Property Rights in Indian Context'
        ]
      },
      {
        name: 'Administrative Law',
        topics: ['Rule of Law', 'Natural Justice', 'Judicial Review', 'Writs'],
        resources: [
          'Constitutional Administrative Powers',
          'PIL (Public Interest Litigation) Framework',
          'Divorce from Government Accountability'
        ]
      }
    ]
  },
  specialization: {
    title: ' Specialization Areas',
    icon: '',
    subjects: [
      {
        name: 'Corporate Law',
        topics: ['Company Formation', 'Securities', 'Mergers & Acquisitions', 'Corporate Governance'],
        resources: [
          'Companies Act, 2013 - Key Provisions',
          'IBC (Insolvency & Bankruptcy Code) Guide',
          'M&A Due Diligence Checklist'
        ]
      },
      {
        name: 'Intellectual Property Law',
        topics: ['Patents', 'Copyright', 'Trademarks', 'Design Rights', 'Trade Secrets'],
        resources: [
          'Patents Act, 1970 & Rules',
          'Copyright Registration Process',
          'Trademark Opposition Strategy'
        ]
      },
      {
        name: 'Labour & Employment Law',
        topics: ['Wages Act', 'Industrial Disputes', 'Workmen Compensation', 'ESI & PF'],
        resources: [
          'Industrial Disputes Act, 1947',
          'Shops & Establishment Act Overview',
          'Wrongful Termination Case Laws'
        ]
      },
      {
        name: 'Environmental Law',
        topics: ['Environmental Protection', 'Pollution Control', 'Wildlife Protection', 'Climate Change'],
        resources: [
          'Environment Protection Act, 1986',
          'Water Pollution Control Rules',
          'Supreme Court Guidelines on Pollution'
        ]
      },
      {
        name: 'Criminal Practice',
        topics: ['Investigation Process', 'Trial Procedure', 'Evidence Collection', 'Appeal & Revision'],
        resources: [
          'Criminal Procedure Code - Detailed Commentary',
          'Indian Evidence Act, 1872',
          'Expert Witness Guidelines'
        ]
      },
      {
        name: 'Cyber Law',
        topics: ['IT Act 2000', 'Data Protection', 'Digital Signature', 'Cybercrime'],
        resources: [
          'Information Technology Act, 2000',
          'Data Privacy & GDPR Basics',
          'Cybersecurity Compliance Guide'
        ]
      }
    ]
  },
  practice: {
    title: ' Legal Practice & Skills',
    icon: '',
    subjects: [
      {
        name: 'Legal Writing & Drafting',
        topics: ['Pleadings', 'Memorandum', 'Opinions', 'Contracts', 'Wills'],
        resources: [
          'Drafting Guide: Petitions & Applications',
          'Sample Pleadings (Civil & Criminal)',
          'Contract Drafting Best Practices'
        ]
      },
      {
        name: 'Legal Research Methods',
        topics: ['Case Law Research', 'Statutory Interpretation', 'Legal Databases', 'Citation Formats'],
        resources: [
          'Supreme Court Case Citation Index',
          'High Court Judgments Database',
          'Legal Research Tools & Techniques'
        ]
      },
      {
        name: 'Courtroom Practice',
        topics: ['Examination-in-Chief', 'Cross-Examination', 'Arguments', 'Court Protocol'],
        resources: [
          'Examination Skills Guide',
          'Cross-Examination Strategy',
          'Oral Argument Preparation'
        ]
      },
      {
        name: 'Case Analysis',
        topics: ['Ratio Decidendi', 'Obiter Dictum', 'Precedent', 'Legal Principles'],
        resources: [
          'Case Brief Format & Examples',
          'Leading Cases by Subject',
          'Case Law Analysis Methods'
        ]
      },
      {
        name: 'Client Communication',
        topics: ['Client Counseling', 'Fee Agreements', 'Confidentiality', 'Ethics'],
        resources: [
          'Bar Council Code of Conduct',
          'Professional Responsibility Standards',
          'Client Management Best Practices'
        ]
      },
      {
        name: 'Bar Exam Preparation',
        topics: ['Aptitude Tests', 'Interview Prep', 'Case Summary', 'Legal Knowledge'],
        resources: [
          'Bar Admission Requirements India',
          'All India Bar Exam Syllabus',
          'Interview Question Bank'
        ]
      }
    ]
  }
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('llb');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryData = RESOURCES_CATEGORIES[selectedCategory];

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return categoryData.subjects;
    
    const query = searchQuery.toLowerCase();
    return categoryData.subjects.filter(subject => 
      subject.name.toLowerCase().includes(query) ||
      subject.topics.some(topic => topic.toLowerCase().includes(query)) ||
      subject.resources.some(resource => resource.toLowerCase().includes(query))
    );
  }, [searchQuery, categoryData.subjects]);

  return (
    <div className="page-container">
      <section className="page-header card">
        <div>
          <h2> Legal Education Resources</h2>
          <p>Comprehensive study materials and learning resources for LLB and legal specialization</p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="resource-tabs">
        {Object.entries(RESOURCES_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            className={`resource-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(key);
              setSelectedSubject(null);
            }}
          >
            {cat.icon} {cat.title.split('(')[0]}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <section className="card">
        <h3> Find Resources</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by subject, topic, or resource name..."
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #c7d7d1', borderRadius: '10px' }}
        />
        <small style={{ color: '#4e6661', marginTop: '6px', display: 'block' }}>
           {filteredSubjects.length} subject(s) found
        </small>
      </section>

      {/* Subjects Grid */}
      <section className="page-grid two-col">
        {filteredSubjects.map((subject, idx) => (
          <div
            key={idx}
            className="resource-card card"
            onClick={() => setSelectedSubject(selectedSubject === idx ? null : idx)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: '0 0 10px', color: '#1e3833' }}>{subject.name}</h3>
              <span style={{ fontSize: '1.2rem' }}>
                {selectedSubject === idx ? '▼' : '▶'}
              </span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#4e6661', fontSize: '0.85rem' }}>Key Topics:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {subject.topics.slice(0, 2).map((topic, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#e8ebe8',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#39544f'
                    }}
                  >
                    {topic}
                  </span>
                ))}
                {subject.topics.length > 2 && (
                  <span style={{ fontSize: '0.8rem', color: '#4e6661' }}>
                    +{subject.topics.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {selectedSubject === idx && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e3eeea' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#1e3833', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                    All Topics ({subject.topics.length}):
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {subject.topics.map((topic, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#e9f2ff',
                          color: '#1d426f',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong style={{ color: '#1e3833', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                     Learning Resources:
                  </strong>
                  <ul style={{ margin: '0', paddingLeft: '18px', color: '#39544f', fontSize: '0.9rem' }}>
                    {subject.resources.map((resource, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Study Tips */}
      <section className="card">
        <h3> Study Tips for Law Graduates</h3>
        <div className="page-grid two-col">
          <div>
            <strong style={{ color: '#1e3833' }}> During LLB:</strong>
            <ul className="plain-list" style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              <li>Master Constitutional & Contract law fundamentals</li>
              <li>Analyze landmark Supreme Court judgments</li>
              <li>Practice case brief writing regularly</li>
              <li>Join legal clinics for practical exposure</li>
              <li>Participate in moot courts & debates</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#1e3833' }}> Post-Graduation:</strong>
            <ul className="plain-list" style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              <li>Choose specialization based on career interest</li>
              <li>Focus on current case laws in your domain</li>
              <li>Build expertise through legal research</li>
              <li>Network with senior practitioners</li>
              <li>Stay updated with legislative changes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Important Links */}
      <section className="card">
        <h3> Important Official Resources</h3>
        <div className="page-grid two-col">
          {[
            { name: 'Supreme Court of India', url: 'https://www.supremecourtofindia.gov.in' },
            { name: 'Bar Council of India', url: 'https://www.barcouncilofindia.org' },
            { name: 'Indian Kanoon', url: 'https://indiankanoon.org' },
            { name: 'Ministry of Law & Justice', url: 'https://legislative.gov.in' },
            { name: 'Legal Information Institute', url: 'https://www.iileg.org' },
            { name: 'National Law Universities', url: 'https://nludelhi.ac.in' }
          ].map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                padding: '12px',
                background: '#f8faff',
                borderRadius: '8px',
                color: '#1f6b5d',
                textDecoration: 'none',
                fontWeight: '600',
                border: '1px solid #e8ebe8',
                hover: { background: '#e9f2ff' }
              }}
            >
               {link.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
