# StudyOnd Knowledge Base -- START Hack 2026

> Kompakte Referenz fuer Agents. Alles Wesentliche aus 89 Context-Dateien in einem Dokument.

---

## 1. WAS IST STUDYOND

**Elevator Pitch:** Studyond ist ein Swiss government-backed Three-Sided Marketplace, der Studenten, Unternehmen und Universitaeten rund um Thesis-Themen, Forschungsprojekte und Talent Sourcing verbindet. Gegruendet 2023 als HSG-Spinoff, ETH-Startup-backed, gefoerdert von Innosuisse.

**Vision:** "As GitHub is to development and LinkedIn is to business identity, Studyond will be the central hub where academia-industry collaboration happens."

**Mission:** Infrastruktur-Layer fuer Wissens- und Technologietransfer zwischen Wissenschaft und Praxis.

**Three-Sided Marketplace:**
- **Students** (free): Karriererelevante Thesis-Topics, Industry-Pathways, AI-Matching
- **Companies** (paid): Talent-Pipeline, Innovation-Sprints, strukturierter Uni-Zugang
- **Universities** (free): Skalierbare Industry-Linkage ohne Kontrollverlust

**Kern-Insight:** Thesis-Projekte sind natuerliche Work Samples -- der staerkste Praediktor fuer Job-Performance (r=.54, Schmidt & Hunter 1998). Studyond verwandelt Thesis-Arbeit in strukturierte Hiring-Signale.

**Competitive Moat:** Curriculum-Embedded Distribution -- Adoption fliesst durch institutionelle Integration (ein Studiengangsleiter empfiehlt Studyond -> ganzer Jahrgang nutzt es). Wettbewerber koennen Features kopieren, aber nicht die interlocking Network Effects.

**Network Effects Flywheel:**
- Mehr Students -> mehr Companies (Talent Supply)
- Mehr Companies -> mehr Topics (Thesis Supply)
- Mehr Topics -> mehr Wert fuer Universities zum Einbetten
- Mehr Universities -> mehr Student Cohorts

---

## 2. START HACK CHALLENGE

**Aufgabe:** Design und Prototype einer AI-powered Thesis Journey, die modular, adaptiv und kontextakkumulierend ist.

**Core Problem:** Jeder Thesis-Student durchlaeuft denselben Prozess, aber in unterschiedlichen Stages. Studyond unterstuetzt aktuell nur Stage 1-2 (Topic Discovery + Matching). Stages 3-5 (Planning, Execution, Writing) sind voellig unterstuetzt.

**Drei Designprinzipien:**
1. **Modular Entry** -- Erkennen, wo der Student steht, und Erfahrung entsprechend anpassen (nicht jeder startet bei Null)
2. **Context Accumulation** -- Jede Interaktion baut das Thesis-Profil weiter auf, fuer zunehmend personalisierte Hilfe
3. **Academic Governance** -- AI schlaegt vor, Professor entscheidet. Akademische Aufsicht ist nicht verhandelbar.

**Bewertungskriterien:**
1. **Real Problem Solving** -- Echte Student Pain Points adressieren
2. **Creativity** -- Mehr als "just a chatbot"
3. **Coherence** -- Gut integrierter Flow, der als Ganzes Sinn ergibt
4. **Ecosystem Usage** -- Studyond Building Blocks nutzen (Topics, Supervisors, Companies, Experts, Matching, Messaging)
5. **Compelling UX** -- Editorial Minimalism: Content-first, Quiet Confidence, Functional Color, Consistent Rhythm, Progressive Disclosure

**Einreichungsformate:** Alle gueltig -- Prototype ohne Code, Working Agent mit rougher UI, oder konzeptuelles Framework mit Mockups. Qualitaet und Kreativitaet zaehlen mehr als technische Tiefe.

**Moegliche Richtungen:**
1. **Modular Flow Wizard** -- Erkennt Stage und adaptiert den Flow
2. **AI Mentor Chat** -- Konversations-Agent mit Context Accumulation ueber Sessions hinweg
3. **Thesis Dashboard** -- Visueller Workspace mit Progress-Tracking, Milestones, proaktiven Opportunities
4. **Autonomous Agents** -- AI-Agents, die im Hintergrund Interview Partners finden, Literatur vorschlagen, Company Partners identifizieren
5. **Context-Building System** -- Progressive Profile, das mit jeder Interaktion waechst

---

## 3. TEAM & TRACTION

### Gruender & Team
| Person | Rolle | Hintergrund |
|---|---|---|
| Dr. Philipp Wetzel | CEO | HSG, PhD Supply Chain Financing, 50+ Theses betreut |
| Micha Brugger | Brand & Research | Creator of Biddit, PhD-Kandidat Information Systems |
| Romeo Arpagaus | Head of Product | 20+ Jahre Produkterfahrung, Co-Founder Umantis |
| George Tsopouridis | CTO | 15+ Jahre Enterprise Software, AWS Certified |
| Dr. Alexandra Allgaier | Academic Partnerships | HSG, PhD Accounting, 50+ Theses betreut |
| Alex Cibotari | Senior Developer | 19 Jahre Erfahrung |
| Daniel Nydegger | Corporate Partnerships | 10+ Jahre Financial Services |
| Florence Hafner | Accounting | 5+ Jahre Uni-Administration |

Advisory Board: ETH-Professoren, Oekonomen, fuehrende Investoren.

### Traction & Kennzahlen
- **3,300+ Students** auf der Plattform
- **230+ Professors** (Supervisors)
- **185+ Companies** (darunter Big 4, Fortune 500)
- **7,500+ Topics** verfuegbar
- **20+ Swiss Universities** angebunden
- **1,680+ Study Programs** zugaenglich
- **7 Study Program Co-Creations** gestartet Q1 2026 (inkl. HSG, BFH university-wide Rollout 2026)
- **493 Studiengangsleiter** befragt (51.2% Response Rate)
- **302 oesterreichische Studiengangsleiter** befragt (laufend)
- **Thesis Impact Summit 2025** at HSG: 215 Entscheidungstraeger, 19 Schweizer Unis
- **Backing:** Innosuisse, ETH Zurich, HSG, OST, Swiss Employers Association

---

## 4. PLATTFORM

### Platform Overview
- Free fuer Students und Universities; Companies zahlen Subscription
- Students: Uni-Email-Signup, 7,500+ Topics filtern nach Field/Industry/Degree, direkt bewerben
- Companies: Company-Email-Registrierung, Topics publizieren, AI-Matching, Kandidaten connecten
- Universities: Institutionelle Email, Research Topics publizieren, Studyond in Thesis-Module einbetten

**Bestehende Features:**
- Topic Discovery (Browsing + Filter)
- Matching Engine (AI-powered)
- Application Management (Lightweight)
- Direct Messaging (Real-time Chat)
- Student & Expert AI Agents
- Directories (People, Companies, Universities)
- Bookmarking, Notifications, Analytics
- Company Profiles & Employer Branding

### Tech Stack
- **Frontend:** React 19 + TypeScript + Vite, Tailwind CSS v4, shadcn/ui (new-york style) + Radix UI, Tabler Icons
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Animation:** Framer Motion
- **Rich Text:** TipTap
- **i18n:** i18next (EN + DE)
- **AI:** Vercel AI SDK + Anthropic Models, Streaming Responses, "Fast" vs "Thinking" Mode Toggle
- **Auth:** Auth0
- **Design System:** Dokumentiert in `brand/` Ordner
- **Mock Data:** Human-readable IDs, TypeScript Types in `mock-data/types.ts`

### Data Model
**Core Entities:**
- **User** -- Base Profile (name, email, picture, about) + multiple Roles (student, expert, supervisor)
- **Student** -- degree, study program, university, skills, objectives
- **Expert** -- title, company, availability, expertise, `offerInterviews` flag
- **Supervisor** -- university, research interests, published topics
- **Topic** -- title, description, type (topic/job), employment status/type, workplace type, degree level, fields
- **Thesis Project** -- Core Collaboration Entity: links Student + Topic + Company + Supervisors + Experts. **Project-first Model:** kann ohne Topic existieren (`topicId: null`), akkumuliert progressiv Context
- **Company** -- organization entity
- **University** -- institution entity
- **Study Program** -- degree program at university (1,680+)
- **Field** -- academic/industry domain for matching (20+ in mock data)

**Thesis Project Lifecycle States:**
`proposed` -> `applied` -> `agreed` -> `in_progress` -> `completed`
Alternative: `withdrawn`, `rejected`, `canceled`

### AI Components

**Student AI Agent:**
- Conversational AI fuer Topic Discovery via Natural-Language Dialog
- Versteht Student Profile (study program, degree, fields, skills, objectives)
- Personalisierte Topic-Vorschlaege mit Reasoning
- Konversationen persistieren ueber Sessions
- "Fast" vs "Thinking" Mode Toggle
- **Limitierung:** NUR Topic Discovery. Kein Planning, Execution, Progress Tracking, Cross-Entity Recommendations, Milestone Tracking, proaktive Suggestions

**Expert AI Agent:**
- Conversational AI fuer Company Experts
- Transformiert Business Challenges in strukturierte Research Questions
- Chat-Interface: Klaerende Fragen, Structuring, direkte Topic-Erstellung
- **Limitierung:** NUR Topic Creation. Kein Candidate Evaluation, Project Management

**Matching Engine:**
- AI-System: Students <-> Topics basierend auf University, Field, Skills, Educational Level
- Multi-sided: Students-Topics, Supervisors-Opportunities, Companies-Candidates
- Powert "hire by skills, not by chance"
- Capability variiert nach Subscription Tier (Active Sourcing ab Professional)

### Data Protection
- GDPR (EU 2016/679) + Swiss FDPIC compliant
- Infrastructure hosted in Switzerland (Data Sovereignty)
- Compliance by Design: kein IT-Integration noetig, Uni-Datenpolicies respektiert
- Student Data bleibt auf Plattform (Unis kriegen nur Aggregate Analytics)
- DACH-Expansion (DE/AT Q3 2026) erfordert zusaetzliche DPA-Dokumentation

---

## 5. THESIS JOURNEY

### Die 5 Stages (~24 Wochen)

**Stage 1: Orientation (Wochen 1-4)**
- Student weiss, dass Thesis kommt, hat aber keine Richtung
- Emotional ueberwältigendste Phase: zu viele Optionen, keine Struktur, Angst vor falscher Wahl
- **Studyond unterstuetzt:** Student AI Agent, 7,500+ browsable Topics
- **Building Block:** Finding a Topic

**Stage 2: Topic & Supervisor Search (Wochen 2-8)**
- Vage Richtung -> konkretes Topic + akademischen Supervisor locken
- Topic und Supervisor sind interdependent (Topic formt wer betreuen kann, Supervisor formt Scope)
- **Studyond unterstuetzt:** Matching Engine, browsable Topics, Application Management, Expert/Student AI Agents
- **Building Blocks:** Finding a Topic, Finding a Supervisor

**Stage 3: Planning (Wochen 4-10)** -- NICHT UNTERSTUETZT
- Topic + Supervisor da -> Arbeit strukturieren
- Methodologie definieren, Timeline erstellen, Expectations alignen, Literatur-Review starten
- Pain Points: Scope-Unterschaetzung, keine Templates/Benchmarks, Company-Academic Misalignment
- AI koennte: Realistische Timelines generieren, Methodologie vorschlagen, Milestone-Plaene erstellen, Luecken identifizieren
- **Building Blocks:** Methodology, Timeline/Milestones, Literature

**Stage 4: Execution (Wochen 6-20)** -- NICHT UNTERSTUETZT
- Laengste, isolierendste Phase: Forschung durchfuehren, wo Plaene auf Realitaet treffen
- Pain Points: Interview Partners schwer zu finden, Data Access langsam, Supervisor-Feedback dauert Wochen, kein Progress Tracking, keine Peer-Unterstuetzung
- AI koennte: Interview Partner matchen, relevante Literatur surfacen, Progress tracken, Mentor/Feedback connecten, Sounding Board fuer Pivots
- **Building Blocks:** Interview Partners, Data Access, Literature, Mentor/Feedback

**Stage 5: Writing & Finalization (Wochen 16-24)** -- NICHT UNTERSTUETZT
- Alles in fertiges Thesis-Dokument ziehen und abgeben
- Pain Points: Schreiben dauert laenger als erwartet, Supervisor-Feedback langsam, Formatting/Citation-Checks
- AI koennte: Schreibstruktur vorschlagen, Feedback-Zyklen managen, Formatting assistieren, Luecken identifizieren
- **Building Blocks:** Literature, Mentor/Feedback, Timeline/Milestones

### Universal Building Blocks

| Building Block | Beschreibung | Studyond Support |
|---|---|---|
| Finding a Topic | 7,500+ curated Topics, Matching, AI Agent | JA |
| Finding a Supervisor | 230+ Supervisors, Matching nach Research Alignment | JA (teilweise) |
| Company Partner | 185+ Companies mit Topics, Application Management | JA |
| Interview Partners | Experts mit `offerInterviews` Flag, Domain-Browsing | TEILWEISE |
| Data Access | Institutionelle Approvals, NDAs, Datenverfuegbarkeit | NEIN |
| Methodology | Qual/Quant/Mixed/Design Science/Literature-based | NEIN |
| Timeline & Milestones | Realistische Zeitplanung mit Bottleneck-Accounting | NEIN |
| Literature | Papers finden, lesen, organisieren, zitieren | NEIN |
| Mentor & Feedback | Ongoing Guidance jenseits formeller Supervisor-Beziehung | NEIN |

### Context Accumulation (Designprinzip)
Jede Interaktion soll das Student Thesis Profile ueber Zeit aufbauen -- Interessen, Stage, Field Preferences, Supervisor-Interaktionen, Topic-Explorationen. System wird mit jeder Interaktion nuetzlicher, statt jedes Mal bei Null zu starten. Aktuell NICHT implementiert.

### Modular Entry (Designprinzip)
Plattform soll erkennen wo Student ist und Erfahrung anpassen: Final-Year braucht Topic-Browsing, Mid-Stage braucht Interview Partners, Early-Stage braucht Orientation. One-size-fits-all Onboarding schafft Friction. Aktuell NICHT implementiert.

---

## 6. ZIELGRUPPEN

### Students (Primary Audience, Free)
**Emotional Arc:** Anxiety -> Discovery -> Confidence -> Action
**Core Driver:** Angst, falsches Thesis-Topic zu waehlen und Monate zu verschwenden
**Trust Triggers:** Uni-Endorsement, "Free for students", Topic-Volumen im eigenen Field, Peer Social Proof
**Key Objection:** "Is this legit? Is it really free? Will there be topics for MY field?"

**Sub-Segments:**
| Segment | Profil | Primaerer Need |
|---|---|---|
| Final-Year Students | Thesis-Start, ueberwaeltigt | Kuratierte Topics im eigenen Field |
| Early-Stage Students | 1-2 Semester vor Thesis | Volumen/Relevanz sehen, Bookmarking |
| Mid-Stage Students | Thesis laeuft, braucht Execution Support | Interview Partners, Data Access |
| Career-Transitioning | Studium endet, Jobmarkt | Thesis-to-Hire Pipeline |
| International Students | Sprachbarrieren, limitierte Netzwerke | Mehrsprachigkeit, strukturierter Zugang |
| Lateral-Entry Students | Peer/Prof-Referral, schnelle Orientierung | Fast Value, Modular Entry |
| PhD Candidates | 3-4 Jahre, tiefere Forschung | Research Partners, Data, Co-Publication |

**Student Value Proposition:** "Find your thesis topic in 20 minutes. Real topics from real companies. Free, no strings."

### Companies (Paying Side)
**Emotional Arc:** Inefficiency -> Opportunity -> Trust -> Commitment
**Core Drivers:** Talent Acquisition Cost, Innovation Velocity, Hiring Risk
**Trust Triggers:** Innosuisse-Backing, Uni-Partner-Logos, klares ROI-Framing, Case Studies (Big 4, Fortune 500)

**Sub-Segments:**
| Segment | Profil | Primaerer Need |
|---|---|---|
| HR & Talent Acquisition | Primaerer Buyer Talent Use Case | Cost-per-Hire senken, Work-Sample Evaluation |
| Innovation Managers | Primaerer Buyer Innovation Use Case | Low-Risk Exploration Sprints |
| SME Executives | Mehrere Huete, preissensitiv | Ein Tool fuer Talent + Innovation |
| Enterprise Executives | Strategisch, Governance-fokussiert | Talent-Infrastructure, SSO, Compliance |
| Partnership Managers (Uni) | Industry-Connections operativ managen | Workload-Reduktion, Automatisierung |

**Company Value Propositions:**
- **Talent:** "Hire by work sample, not by CV. 60% lower cost-per-hire than LinkedIn Recruiter." CHF 4,900-18,900/yr vs. CHF 15K+ LinkedIn, CHF 20K+ Career Fair
- **Innovation:** "Explore, validate, de-risk -- with academic rigor at a fraction of consulting cost." CHF 18,900/yr fuer 10 Exploration Sprints vs. CHF 50-150K Consulting
- **Employer Branding:** 365-Tage-Sichtbarkeit an 20+ Unis, besonders wichtig fuer SMEs ohne starke Employer Brand

### Universities (Third Side, Free)
**Emotional Arc:** Fragmentation -> Alignment -> Governance -> Partnership
**Core Drivers:** Industry Relevance Pressure, Akkreditierungs-Metriken, manuelle Partnership-Verwaltung
**Trust Triggers:** Peer-Unis nutzen es (HSG, BFH, 20+), Governance-Modell klar, Innosuisse-Backing, Free, GDPR-compliant
**Key Objection:** "Do we lose academic control?" -> Unequivocal No.

**Sub-Segments:**
| Segment | Profil | Primaerer Need |
|---|---|---|
| Program Directors | Primaere Persona, kontrollieren Curricula | Real-World Topics, Akkreditierungs-Metriken |
| Deans & Faculty | Strategisch, genehmigen Institutional Partnerships | Peer Adoption Evidence, Governance Clarity |
| Partnership Managers | Operativ, managen Industry Connections | Workload-Reduktion |
| Researchers | Brauchen Industry Partners fuer Applied Research | Domain-Browsing, Direct Access |
| Thesis Supervisors | Informeller Adoption-Pfad | Gute Topics fuer Studenten |

**University Value Proposition:** "Structured industry partnerships at scale. Free. Academic control stays with you."

---

## 7. EVIDENCE & RESEARCH

### Selection Validity Hierarchy (Schmidt & Hunter, 1998)
| Method | Validity (r) |
|---|---|
| **Work Sample Tests** | **.54** (staerkster Praediktor) |
| Structured Interviews | .51 |
| Cognitive Ability Tests | .51 |
| Job Knowledge Tests | .48 |
| Integrity Tests | .41 |
| Unstructured Interviews | .38 |
| Assessment Centers | .37 |
| **CVs / Resumes** | **.18-.26** (schwach) |
| Years of Experience | .18 |
| Reference Checks | .26 |

**Key Insight:** Thesis = natuerliches Work Sample (4-6 Monate, job-relevant, real conditions, multiple competencies, structured evaluation). Bewegt Hiring vom schwaechsten (CV) zum staerksten Praediktor (Work Sample).

### CV Signal Degradation
- GenAI inflated CV-Qualitaet ohne Capability-Verbesserung (HBR 2023)
- Recruiter verbringen 7-8 Sekunden auf CV-Review (The Ladders 2018)
- Students unsichtbar auf Professional Networks bis Wochen vor Graduation (LinkedIn 2022)
- Ergebnis: CVs werden noise, nicht signal

### Skills-Based Hiring
- McKinsey (2021): Skills-based outperforms pedigree-based hiring
- Konvergenz: CV Signal Degradation + schwache Validity + GenAI -> Skills-Based Hiring wird Notwendigkeit
- Studyond = praktische Implementation auf Early-Career Level

### Thesis as Work Sample
- 4-6 Monate observed, real-conditions work vs. 1-2 Stunden Interview
- Signal-to-Noise Ratio um Groessenordnungen hoeher
- Studyond's Structural Advantage: Keine andere Plattform captured Thesis Output als Hiring Signal

### Absorptive Capacity (Cohen & Levinthal, 1990)
- Firmen muessen interne Kapazitaet aufbauen bevor sie externes Wissen nutzen koennen
- Thesis-Kollaborationen bauen cognitive, organizational, institutional, social Proximity auf
- Hidden Effect: Selbst ohne unmittelbare Produkt-Outputs erhoehen Kollaborationen Innovation Probability
- Path-dependent: Fruehe Investition in Uni-Beziehungen = mehr Wert spaeter; Verzoegerung = compounding Disadvantage

### University-Industry Collaboration Research
- Alpaydin & Fitjar (2024, n=232): 41% der UIC-Firmen berichten konkrete Innovation Outcomes
- Education-oriented Collaborations: 24% Produktinnovation, 14% Prozessinnovation, 10% Organisationsinnovation
- 5 Proximity-Dimensionen (Boschma 2005): cognitive, organizational, institutional, social, geographic

---

## 8. BUSINESS MODEL

### Subscription Tiers (nur Companies zahlen)

| Tier | Preis | Key Features |
|---|---|---|
| **Basic** | CHF 4,900/yr | 2 Jobs, 2 Owner + unlim. Expert Users, AI Topic Agent, Matching, Application Mgmt, Email Support |
| **Professional** | CHF 18,900/yr | 10 Jobs, 5 Owners, Active Sourcing, 365-day Employer Branding, Dedicated CSM, Study Program Targeting, Shortlists |
| **Enterprise** | ab CHF 48,200/yr | Custom: Modular Jobs, Unlim. Users, Co-Creation, Innovation Partner Label, SSO, Multi-Year Pipeline Planning |
| **Individual** | Free | Students, Supervisors, Experts (Topic Browsing, Talent Pipeline Exploration) |

### Market Data
- **50 Mio. Students** weltweit schreiben jaehrlich Thesis
- **23 Mio. EU-Unternehmen** mit unmet Innovation Challenges
- **99.7%** europaeischer Unternehmen haben kein zentrales System fuer akademische Kollaboration
- **TAM (Europe):** EUR 12.5-22.5B | **SAM (W&N Europe):** EUR 1.8-3.3B | **SOM (2% in 5-7yr):** EUR 36-66M ARR
- WEF Future of Jobs 2025: 78 Mio. neue Jobs bis 2030, dringender Upskilling-Bedarf

### Competitive Landscape
**99.7% der europaeischen Unternehmen haben kein zentrales System fuer akademische Kollaboration** -> Studyond schafft neue Kategorie.

| Competitor | Focus | Studyond Advantage |
|---|---|---|
| **Handshake** | Career Marketplace (Jobs/Internships) | Keine Thesis-Workflows, kein Professor-Side |
| **EURAXESS** | Researcher Mobility | Keine thesis-level Student-Company-Uni Collaboration |
| **The Forage** | Virtual Work Experience (simuliert) | Keine echten Projekte, kein 4-6 Monate Real Impact |

**5 strukturelle Vorteile:**
1. Thesis as Work Sample -- einzige Plattform die Thesis Output als Hiring Signal captured
2. Three-Sided Marketplace -- Network Effects nicht replizierbar
3. Curriculum-Embedded Distribution -- organische Student-Acquisition bei ~0 Marginalkosten
4. Dual Value (Talent + Innovation) -- hoehere Engagement/Retention
5. Academic Cycle Alignment -- natuerliche Engagement-Rhythmen

---

## 9. DESIGN SYSTEM

### Editorial Minimalism (Design-Philosophie)
- Monochrome Palette, generous Whitespace, Magazine-like Typographic Hierarchy
- Authority through Restraint, nicht Ornamentation

**5 Prinzipien:**
1. **Content First** -- UI fades, Typography und Imagery tragen die Seite
2. **Quiet Confidence** -- Keine flashy Gradients, Authority durch Praezision
3. **Functional Color** -- Farbe hat immer Bedeutung (Entity Badges, Status, AI Features), nie dekorativ
4. **Consistent Rhythm** -- Gleiche Spacing Scale und Grid Cadence ueberall
5. **Progressive Disclosure** -- Subtle Hover States, nichts schreit nach Aufmerksamkeit

**Brand Personality:** Approachable, Editorial, Minimal, Professional

### Color System
- **Monochrome by Default** mit semantischen Accents, OKLCH Color Space
- Light Mode: Weisse Backgrounds, near-black Text, light gray Surfaces
- Dark Mode: Automatische Token-basierte Inversion
- **Farbe NUR fuer:** Entity Type Badges (Greens, Blues), Status Indicators, AI Features (purple-blue Gradient)
- Text Selection: Warm Yellow (Light) / Muted Gold (Dark)
- Content Types: Monochrome geometric Animation, nicht Farbe

### Typography
- **Display Headlines:** Crimson Text (Serif) -- NUR fuer Hero Moments, max 1 pro Seite
- **Body & UI:** Geist Variable (Sans-serif) -- alles andere
- Scale: Display (3-5rem) > Headline (2.25-3.75rem) > Title (1.5-2.25rem) > Subtitle (17-18px) > Body (15px) > Caption (12px)
- Metadata: "Author . Date" (Middle Dot Separator), Label Style, Muted Color
- **Regel:** Nie Serif fuer Body Text oder kleine Headings

### AI Visual Language
- **Purple-Blue Gradient** -- einzige non-monochrome, non-badge Farbe im System
- CSS: `.text-ai`, `.bg-ai`, `.text-ai-solid`, `.border-ai`
- NUR fuer genuinely AI-powered Features (Badges, Buttons, Cards, Matching Interface)
- Tech: Vercel AI SDK, POST `/api/chat`, `useChat` Hook

### Component Guidelines
- **Buttons:** Alle fully rounded (Core Brand Element). Variants: default, secondary, outline, ghost, link, destructive
- **Cards:** ~10px Radius, Shadow NUR on hover. Types: InsightCard (4:5 Portrait), Featured (3:2 Landscape), Compact (Text-only)
- **Layout:** 3+9 Editorial Grid (3-col Margin + 9-col Content), aktiviert bei lg/1024px. Card Grid: 1->2->3->4 Columns
- **Icons:** Tabler Icons (Website) / Lucide React (App), 16px Standard
- **Responsive:** Mobile (<768px) -> sm (640px) -> md (768px) -> lg (1024px) -> xl (1280px)

### Animation & Motion
- Smooth, measured, minimal. Kein Bounce, kein Elastic.
- 150ms (micro) -> 200ms (dropdown) -> 300ms (standard/cards) -> 500ms (slow/crossfade)
- Card Hover: Image scale 1.05x, Title color shift. Shadows NUR on hover.
- `prefers-reduced-motion` respektieren

### Voice & Tone
- **Students:** Warm, supportiv, peer-like. "Du"-Form (DE). Action Verbs. Stress anerkennen, nie herablassend.
- **Companies:** Professional, outcome-driven, ROI-fokussiert. Quantifizieren. Lead mit Outcomes.
- **Universities:** Formal aber zugaenglich, governance-aware, Partnership-orientiert. Academic Autonomy respektieren.
- **"Missing Out" Pattern:** Status-quo-Kosten framen, dann mit Studyond-Wert aufloesen. Sparsam einsetzen (1-2 pro Seite).

---

## 10. EXPANSION

### DACH Expansion (Primary Growth Vector)
| Markt | Unis | Charakter |
|---|---|---|
| Schweiz | ~50 | Klein, konzentriert, bekannt |
| Deutschland | 400+ | Gross, fragmentiert, regionale Cluster |
| Oesterreich | ~75 | Medium, zentralisiert (Wien, Graz, Innsbruck) |

**Was transferiert:** Academic Evidence, internationale Client-Logos, Platform Metrics, Product Capabilities, Academic Governance Model
**Was lokalisiert werden muss:** Uni-Partner-Logos, Pricing (CHF->EUR), Akkreditierungs-Framing, Marktsizing, regulatorischer Kontext, akademischer Kalender

**Deutschland:** Regionale Strategie (Bayern, NRW, BaWue, Berlin). Mittelstand preissensitiver. Fragmentierte Akkreditierung (ACQUIN, AQAS, FIBAA, evalag, ZEvA).
**Oesterreich:** Aehnlich Schweiz in Scale. Zentralisierte Akkreditierung (AQ Austria). Laufende Survey mit 302 Studiengangsleitern.

### Curriculum-Embedded Distribution (Core Growth Mechanic)
1. Program Directors unlock Cohorts (1 Empfehlung = ganzer Jahrgang)
2. Professors drive Peer Adoption (Word-of-mouth in tight Academic Networks)
3. Company Success creates Referrals (Abteilungen und Geographien)

Jede neue institutionelle Einbettung schafft compounding Switching Costs. Replacement = Institutional Change Management >> SaaS Tool Switch.

### Modular Entry
Students kommen in verschiedenen Stages an. Plattform soll Stage erkennen und UX anpassen. Aktuell: alle bekommen denselben linearen Flow. Implementierung ist Teil der Challenge.

---

## 11. OPPORTUNITY SPACE & MOEGLICHE RICHTUNGEN

### Was heute existiert (AI)
- Student AI Agent (Topic Discovery)
- Expert AI Agent (Topic Creation)
- Matching Engine (Student-Topic Matching)
- Profile Checking

### Was NICHT existiert (= Opportunity Space)

| Gap | Beschreibung |
|---|---|
| **Adaptive Onboarding** | Kein System erkennt wo Student in Thesis Journey steht |
| **Planning & Execution Support** | Kein AI-Support nach Topic Discovery (Stages 3-5 voellig unterstuetzt) |
| **Context Persistence** | Keine Context Accumulation ueber Konversationen |
| **Autonomous Agents** | Keine proaktiven Agents (Interview Partners finden, Literatur vorschlagen, Company Partners identifizieren) |
| **Structured Mentor Access** | Kein System fuer Mentor-Matching, Progress Tracking, Nudges |
| **Cross-Entity Intelligence** | Keine Empfehlungen die Entity-Typen spannen (Supervisor + Company + Expert Alignment) |

### Thesis-to-Hire Pipeline
- Traditional: CV -> Interview (1-2h) -> Offer -> Hope
- Studyond: Topic -> Thesis (4-6 Mo) -> Observed Work -> Informed Decision
- **Cost Comparison:** LinkedIn CHF 15K+ | Career Fair CHF 20K/Event | Studyond Pro CHF 6,300 (bei 30% Conversion) | Miss-Hire CHF 20K+
- Dual Value: Innovation Path (Evidence, Hypothesenvalidierung, Absorptive Capacity) + Talent Path (Work Sample Evaluation)

### Academic Governance (Nicht verhandelbar)
- Faculty approve Topics
- Academic Supervision bleibt intakt
- Student Data bleibt aggregiert
- Kein IT-Integration noetig
- Keine Curriculum-Aenderungen noetig
- Key Objection: "Verlieren wir akademische Kontrolle?" -> Eindeutiges Nein

---

## QUICK REFERENCE: Key Numbers

| Metric | Value |
|---|---|
| Students | 3,300+ |
| Professors/Supervisors | 230+ |
| Companies | 185+ |
| Topics | 7,500+ |
| Swiss Universities | 20+ |
| Study Programs | 1,680+ |
| Work Sample Validity | r=.54 |
| CV Validity | r=.18-.26 |
| Basic Tier | CHF 4,900/yr |
| Pro Tier | CHF 18,900/yr |
| Enterprise Tier | ab CHF 48,200/yr |
| UIC Innovation Outcome Rate | 41% |
| EU TAM | EUR 12.5-22.5B |
| Cost per Hire (Studyond) | ~CHF 6,300 |
| Cost per Hire (LinkedIn) | CHF 15,000+ |
| Thesis Duration | 4-6 Monate (~24 Wochen) |
| Thesis Journey Stages | 5 |
| Currently Supported Stages | 1-2 (von 5) |

---

## QUICK REFERENCE: Context File Index

Alle Source-Dateien liegen in `start-hack-2026-studyond/context/`:

**Core & Vision:** Studyond, Vision and Mission, Three-Sided Marketplace, Challenge Brief, Evaluation Criteria, Opportunity Space, Possible Directions
**Team & Traction:** Team and Founders, Traction, Timeline and Milestones
**Platform:** Platform Overview, Tech Stack, Data Model, Data Access, Data Protection, Studyond Brain
**AI:** Student AI Agent, Expert AI Agent, Matching Engine
**Thesis Journey:** Thesis Journey, Thesis Project Lifecycle, Orientation Stage, Planning Stage, Execution Stage, Writing and Finalization, Finding a Topic, Finding a Supervisor, Topic and Supervisor Search
**Building Blocks:** Company Partner, Interview Partners, Data Access, Methodology, Timeline and Milestones, Literature, Mentor and Feedback, Context Accumulation, Direct Messaging, Application Management
**Students:** Students, Student Value Proposition, Final-Year Students, Early-Stage Students, Mid-Stage Students, Career-Transitioning Students, International Students, Lateral-Entry Students, PhD Candidates
**Companies:** Companies, Company Partner, Company VP Talent, Company VP Innovation, Company VP Employer Branding, Enterprise Executives, SME Executives, HR and Talent Acquisition, Innovation Managers
**Universities:** Universities, University Value Proposition, Program Directors, Deans and Faculty Leadership, Partnership Managers, Researchers, Thesis Supervisors, Academic Governance
**Platform Entities:** Supervisors, Experts, Thesis Projects, Topics, Fields, Study Programs, Study Program Features
**Evidence:** Selection Validity Hierarchy, Skills-Based Hiring, Work Sample Tests, Thesis as Work Sample, CV Signal Degradation, Absorptive Capacity, University-Industry Collaboration Research, Thesis-to-Hire Pipeline
**Business:** Subscription Tiers, Market Data, Competitive Landscape
**Design:** Editorial Minimalism, Color System, Typography, AI Visual Language, Animation and Motion, Voice and Tone, Component Guidelines
**Expansion:** DACH Expansion, Modular Entry, Curriculum-Embedded Distribution
