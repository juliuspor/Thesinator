# Studyond AI Matching - Required Input Reference

Everything the AI needs to know about a student to produce good matches.

---

## Student Profile (collected at signup / onboarding)

### 1. Identity & Contact
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `firstName` | string | yes | `"Luca"` |
| `lastName` | string | yes | `"Meier"` |
| `email` | string | yes | `"luca.meier@student.ethz.ch"` |

### 2. Academic Background
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `degree` | `"bsc"` \| `"msc"` \| `"phd"` | yes | `"msc"` |
| `universityId` | string (FK) | yes | `"uni-01"` (ETH Zurich) |
| `studyProgramId` | string (FK) | yes | `"program-01"` (MSc Computer Science) |

**10 universities** available (Swiss higher-ed landscape: ETH Zurich, EPFL, HSG, UZH, UniBE, UniBAS, ZHAW, FHNW, HSLU, BFH).
**30 study programs** across BSc/MSc/PhD levels.

### 3. Skills
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `skills` | string[] | yes | `["Python", "machine learning", "Kubernetes"]` |

- Free-text, self-reported
- Typically 3-7 per student
- Used as a core matching signal against topic requirements

### 4. Fields of Interest
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `fieldIds` | string[] | yes (multi-select) | `["field-01", "field-03"]` |

**20 predefined fields:**

| ID | Name |
|----|------|
| field-01 | Computer Science |
| field-02 | Data Science |
| field-03 | Artificial Intelligence |
| field-04 | Business Administration |
| field-05 | Finance |
| field-06 | Marketing |
| field-07 | Supply Chain Management |
| field-08 | Sustainability |
| field-09 | Mechanical Engineering |
| field-10 | Electrical Engineering |
| field-11 | Biotechnology |
| field-12 | Healthcare & Medicine |
| field-13 | Economics |
| field-14 | Law |
| field-15 | Communication & Media |
| field-16 | Psychology |
| field-17 | Environmental Science |
| field-18 | Architecture & Design |
| field-19 | Education |
| field-20 | Public Policy |

### 5. Study Objectives (what the student is looking for)
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `objectives` | StudentObjective[] | yes (multi-select) | `["topic", "career_start"]` |

**5 possible objectives:**

| Value | Meaning |
|-------|---------|
| `"topic"` | Looking for a thesis topic |
| `"supervision"` | Seeking academic guidance / a supervisor |
| `"career_start"` | Thesis as a pathway into a job |
| `"industry_access"` | Access to real-world problems & company data |
| `"project_guidance"` | Mentoring on thesis execution |

### 6. About / Bio
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `about` | string \| null | no (~70% fill it) | `"MSc CS student at ETH, specializing in ML systems..."` |

LinkedIn-style professional bio. Provides richer context for AI matching but ~30% of students leave it empty.

---

## The 4 Matching Signals

The Matching Engine ranks topics for a student based on these signals:

| Signal | How it works |
|--------|-------------|
| **University** | Institutional context & geographic relevance. Student's `universityId` compared to topic's `universityId`. |
| **Field of study** | Overlap between student `fieldIds` and topic `fieldIds`. Core relevance signal. |
| **Skills** | Student's self-reported `skills[]` matched against topic requirements and description. |
| **Degree level** | Student's `degree` (bsc/msc/phd) must appear in the topic's accepted `degrees[]` array. Hard filter. |

---

## What Gets Matched Against (Topic Structure)

Each topic the student could be matched to contains:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Topic name |
| `description` | string | Detailed description |
| `type` | `"topic"` \| `"job"` | Thesis/research vs. employment listing |
| `employment` | `"yes"` \| `"no"` \| `"open"` | Whether it can lead to a job |
| `employmentType` | `"internship"` \| `"working_student"` \| `"graduate_program"` \| `"direct_entry"` \| null | Type of employment (only if employment != "no") |
| `workplaceType` | `"on_site"` \| `"hybrid"` \| `"remote"` \| null | Work location (only if employment != "no") |
| `degrees` | Degree[] | Accepted degree levels |
| `fieldIds` | string[] | Academic/industry fields |
| `companyId` | string \| null | Company that posted it (XOR with universityId) |
| `universityId` | string \| null | University that posted it (XOR with companyId) |
| `supervisorIds` | string[] | Attached academic supervisors |
| `expertIds` | string[] | Attached industry experts |

**60 topics** in mock data (30 company-posted, 30 supervisor-posted).

---

## Additional Input at Application Time

When a student applies to a specific topic:

| Input | Type | Required |
|-------|------|----------|
| Full profile | (auto-included) | yes |
| Motivation | free text | yes |
| CV | file upload | yes |

---

## Thesis Journey Stage (context accumulation - future)

The student progresses through 5 stages over ~24 weeks. Detecting the current stage enables adaptive support:

| Stage | Weeks | What the student needs |
|-------|-------|----------------------|
| **Orientation** | 1-4 | Exploring what to write about |
| **Topic & Supervisor Search** | 2-8 | Locking in topic, supervisor, company partner |
| **Planning** | 4-10 | Structuring methodology, timeline, expectations |
| **Execution** | 6-20 | Research, data gathering, iterating |
| **Writing & Finalization** | 16-24 | Producing and submitting the thesis |

**Universal building blocks** needed across stages:
- Topic, Supervisor, Company Partner, Interview Partners
- Data Access, Methodology, Timeline & Milestones
- Literature, Mentor & Feedback

---

## Thesis Project (accumulated over time)

Once a student starts a project, additional data builds up:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Project title |
| `description` | string \| null | What the project is about |
| `motivation` | string \| null | Why the student chose this |
| `state` | ProjectState | Current lifecycle stage |
| `topicId` | string \| null | Linked topic (can be null = "project-first model") |
| `companyId` | string \| null | Company partner |
| `supervisorIds` | string[] | Assigned academic supervisors |
| `expertIds` | string[] | Industry mentors |

**Project lifecycle:** `proposed` -> `applied` -> `withdrawn` | `rejected` | `agreed` -> `in_progress` -> `canceled` | `completed`

---

## Related Entities (the AI also has access to)

### Supervisors (25 in mock data)
- Name, title (e.g. "Prof. Dr."), email
- `universityId`, `fieldIds`, `about`
- `researchInterests: string[]` (e.g. "NLP", "knowledge graphs")
- `objectives`: student_matching, research_collaboration, network_expansion, funding_access, project_management

### Experts (30 in mock data)
- Name, title (job role), email
- `companyId`, `fieldIds`, `about`
- `offerInterviews: boolean`
- `objectives`: recruiting, fresh_insights, research_collaboration, education_collaboration, brand_visibility

### Companies (15 in mock data)
- `name`, `description`, `about`, `size` (1-50 / 51-200 / 1000+), `domains[]` (industry sectors)

### Universities (10 in mock data)
- `name`, `country`, `domains[]` (email domains), `about`

### Study Programs (30 in mock data)
- `name`, `degree`, `universityId`, `about`

---

## Source Files

| File | Contents |
|------|----------|
| `mock-data/types.ts` | TypeScript type definitions (master reference) |
| `mock-data/students.json` | 40 student records |
| `mock-data/topics.json` | 60 topic records |
| `mock-data/projects.json` | 15 project records |
| `mock-data/fields.json` | 20 field definitions |
| `mock-data/supervisors.json` | 25 supervisor records |
| `mock-data/experts.json` | 30 expert records |
| `mock-data/companies.json` | 15 company records |
| `mock-data/universities.json` | 10 university records |
| `mock-data/study-programs.json` | 30 program records |
| `context/Matching Engine.md` | Matching algorithm description |
| `context/Student AI Agent.md` | AI agent capabilities & limits |
| `context/Data Model.md` | Entity relationships |
| `context/Thesis Journey.md` | 5-stage journey model |
| `context/Context Accumulation.md` | Progressive profiling concept |
