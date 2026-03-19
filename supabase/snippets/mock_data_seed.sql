-- generated from mock-data/*.json
-- do not hand-edit: re-run generation script if mock data changes

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-01', 'Luca', 'Meier', 'luca.meier@student.ethz.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-01'), (select id from public.universities where source_id = 'uni-01'),
  array['Python', 'machine learning', 'distributed systems', 'Kubernetes']::text[], array['topic', 'career_start']::text[], 'MSc Computer Science student at ETH Zurich, specializing in machine learning systems. Currently exploring thesis topics around efficient inference for large language models. Previously interned at Google Zurich.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-01'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-01'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-02', 'Sarah', 'Brunner', 'sarah.brunner@student.ethz.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-02'), (select id from public.universities where source_id = 'uni-01'),
  array['MATLAB', 'finite element analysis', 'CAD', '3D printing', 'Python']::text[], array['topic', 'supervision', 'industry_access']::text[], 'Passionate about sustainable product design and additive manufacturing. My semester project on topology-optimized lightweight structures won the department''s best project award. Looking for a thesis that combines simulation and real-world manufacturing.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-09'
where sref.source_id = 'student-02'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-02'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-18'
where sref.source_id = 'student-02'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-03', 'Jan', 'Keller', 'jan.keller@student.ethz.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-03'), (select id from public.universities where source_id = 'uni-01'),
  array['C/C++', 'embedded systems', 'circuit design', 'signal processing']::text[], array['topic', 'project_guidance']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-10'
where sref.source_id = 'student-03'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-03'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-04', 'Elena', 'Rossi', 'elena.rossi@student.ethz.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-01'), (select id from public.universities where source_id = 'uni-01'),
  array['deep learning', 'PyTorch', 'NLP', 'data engineering', 'SQL']::text[], array['topic', 'supervision', 'career_start']::text[], 'Italian-Swiss student researching natural language understanding at ETH. Interested in multilingual NLP and its applications in healthcare. Seeking a thesis topic that bridges AI and real-world impact.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-04'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-04'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-04'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-05', 'Antoine', 'Durand', 'antoine.durand@student.epfl.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-04'), (select id from public.universities where source_id = 'uni-02'),
  array['R', 'Python', 'statistical modeling', 'Bayesian inference', 'data visualization']::text[], array['topic', 'industry_access']::text[], 'MSc Data Science student at EPFL with a strong foundation in statistics and applied mathematics. Interested in applying data science to climate and environmental problems. Fluent in French, English, and German.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-05'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-17'
where sref.source_id = 'student-05'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-05'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-06', 'Priya', 'Sharma', 'priya.sharma@student.epfl.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-05'), (select id from public.universities where source_id = 'uni-02'),
  array['network protocols', '5G systems', 'Python', 'simulation tools']::text[], array['topic', 'career_start']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-06'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-10'
where sref.source_id = 'student-06'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-07', 'Nicolas', 'Favre', 'nicolas.favre@student.epfl.ch', 'phd',
  (select id from public.study_programs where source_id = 'program-06'), (select id from public.universities where source_id = 'uni-02'),
  array['bioinformatics', 'genomics', 'Python', 'R', 'single-cell analysis', 'machine learning']::text[], array['supervision', 'project_guidance']::text[], 'First-year PhD student in Computational Biology at EPFL. My research focuses on using single-cell RNA sequencing data to understand cell-type-specific regulatory networks in cancer. Previously completed my MSc in Bioinformatics at the University of Geneva.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-11'
where sref.source_id = 'student-07'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-07'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-07'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-08', 'Chloé', 'Martin', 'chloe.martin@student.epfl.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-04'), (select id from public.universities where source_id = 'uni-02'),
  array['Python', 'deep learning', 'computer vision', 'TensorFlow']::text[], array['topic', 'career_start', 'industry_access']::text[], 'Data science student with a focus on computer vision and generative models. Currently working on a semester project about synthetic data generation for autonomous driving. Looking for industry thesis opportunities.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-08'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-08'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-09', 'Florian', 'Wirth', 'florian.wirth@student.unisg.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-07'), (select id from public.universities where source_id = 'uni-03'),
  array['business model design', 'design thinking', 'market research', 'financial modeling', 'Figma']::text[], array['topic', 'industry_access', 'career_start']::text[], 'MSc Business Innovation student at HSG with a keen interest in digital health startups. Co-founded a campus venture during my bachelor''s. Seeking a thesis that combines innovation management with real company challenges.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-09'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-06'
where sref.source_id = 'student-09'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-09'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-10', 'Amélie', 'Rochat', 'amelie.rochat@student.unisg.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-08'), (select id from public.universities where source_id = 'uni-03'),
  array['policy analysis', 'qualitative research', 'stakeholder management', 'public speaking']::text[], array['topic', 'supervision']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-20'
where sref.source_id = 'student-10'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-13'
where sref.source_id = 'student-10'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-14'
where sref.source_id = 'student-10'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-11', 'Maximilian', 'Hofer', 'maximilian.hofer@student.unisg.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-09'), (select id from public.universities where source_id = 'uni-03'),
  array['financial analysis', 'Bloomberg Terminal', 'Python', 'risk modeling', 'Excel/VBA']::text[], array['topic', 'career_start']::text[], 'Finance student at HSG with internship experience at UBS and Credit Suisse (now UBS). Interested in quantitative finance, ESG investing, and fintech. Looking for a thesis topic at the intersection of AI and financial risk management.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-05'
where sref.source_id = 'student-11'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-11'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-11'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-12', 'Anna', 'Bachmann', 'anna.bachmann@student.unisg.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-10'), (select id from public.universities where source_id = 'uni-03'),
  array['accounting', 'business analytics', 'Excel', 'SAP']::text[], array['topic', 'project_guidance', 'industry_access']::text[], 'BSc Business Administration student at HSG, exploring my interests in sustainability reporting and corporate governance. Active member of the student consulting club.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-12'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-12'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-05'
where sref.source_id = 'student-12'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-13', 'David', 'Nguyen', 'david.nguyen@student.unisg.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-07'), (select id from public.universities where source_id = 'uni-03'),
  array['product management', 'agile methodologies', 'user research', 'SQL', 'Tableau']::text[], array['topic', 'career_start', 'industry_access']::text[], 'Vietnamese-Swiss student in Business Innovation at HSG. Previously completed an internship at a Zurich-based SaaS startup where I worked on product analytics. Looking for a thesis that combines digital product management with data-driven decision making.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-13'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-13'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-06'
where sref.source_id = 'student-13'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-14', 'Simon', 'Aebischer', 'simon.aebischer@student.uzh.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-11'), (select id from public.universities where source_id = 'uni-04'),
  array['Java', 'software architecture', 'cloud computing', 'Docker', 'REST APIs']::text[], array['topic', 'supervision']::text[], 'Informatics student at UZH with a focus on cloud-native software engineering. Part-time developer at a Zurich fintech startup. Looking for a research-oriented thesis in distributed systems or software reliability.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-14'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-14'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-15', 'Meret', 'Zimmermann', 'meret.zimmermann@student.uzh.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-12'), (select id from public.universities where source_id = 'uni-04'),
  array['econometrics', 'Stata', 'R', 'causal inference', 'survey design']::text[], array['topic', 'supervision', 'project_guidance']::text[], 'Economics student researching the labor market effects of AI adoption. Interested in applied microeconomics and evidence-based policy. Teaching assistant for econometrics at UZH.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-13'
where sref.source_id = 'student-15'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-20'
where sref.source_id = 'student-15'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-15'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-16', 'Leonie', 'Gerber', 'leonie.gerber@student.uzh.ch', 'phd',
  (select id from public.study_programs where source_id = 'program-13'), (select id from public.universities where source_id = 'uni-04'),
  array['experimental design', 'SPSS', 'R', 'neuroimaging', 'academic writing']::text[], array['supervision', 'industry_access']::text[], 'PhD candidate in psychology at UZH, studying the cognitive effects of digital technology use in adolescents. Looking for industry collaborations that involve screen-time data or digital wellbeing interventions.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-16'
where sref.source_id = 'student-16'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-19'
where sref.source_id = 'student-16'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-16'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-17', 'Robin', 'Schmid', 'robin.schmid@student.uzh.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-11'), (select id from public.universities where source_id = 'uni-04'),
  array['Python', 'cybersecurity', 'network analysis', 'Linux administration']::text[], array['topic', 'career_start']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-17'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-17'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-18', 'Noemi', 'Bärtschi', 'noemi.baertschi@student.unibe.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-14'), (select id from public.universities where source_id = 'uni-05'),
  array['cell biology', 'flow cytometry', 'R', 'lab techniques', 'scientific writing']::text[], array['topic', 'supervision']::text[], 'Biomedical sciences student at Unibe, passionate about immunology and cancer research. Currently completing a lab rotation at the Institute of Pathology. Seeking a thesis project with translational potential.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-18'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-11'
where sref.source_id = 'student-18'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-19', 'Samuel', 'Wyss', 'samuel.wyss@student.unibe.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-15'), (select id from public.universities where source_id = 'uni-05'),
  array['data analysis', 'R', 'microeconomics', 'academic writing']::text[], array['topic', 'project_guidance']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-13'
where sref.source_id = 'student-19'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-20'
where sref.source_id = 'student-19'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-20', 'Tamara', 'Ruiz', 'tamara.ruiz@student.unibe.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-16'), (select id from public.universities where source_id = 'uni-05'),
  array['climate modeling', 'GIS', 'Python', 'remote sensing', 'data visualization']::text[], array['topic', 'supervision', 'industry_access']::text[], 'Climate sciences student at Unibe with a focus on Alpine glacier retreat and water resource management. Completed a summer internship at MeteoSwiss. Fluent in Spanish, German, and English.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-17'
where sref.source_id = 'student-20'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-20'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-20'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-21', 'Jonas', 'Aregger', 'jonas.aregger@student.unibe.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-16'), (select id from public.universities where source_id = 'uni-05'),
  array['atmospheric science', 'Python', 'statistical analysis', 'scientific computing']::text[], array['topic', 'supervision']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-17'
where sref.source_id = 'student-21'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-21'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-22', 'Laura', 'Tobler', 'laura.tobler@student.unibas.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-17'), (select id from public.universities where source_id = 'uni-06'),
  array['molecular cloning', 'CRISPR', 'Python', 'bioinformatics', 'microscopy']::text[], array['topic', 'supervision', 'career_start']::text[], 'Molecular biology student at the University of Basel with hands-on experience in CRISPR gene editing. Currently working in a structural biology lab at the Biozentrum. Looking for a thesis at the interface of computational and experimental biology.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-11'
where sref.source_id = 'student-22'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-22'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-22'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-23', 'Rafael', 'Gomes', 'rafael.gomes@student.unibas.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-18'), (select id from public.universities where source_id = 'uni-06'),
  array['business process modeling', 'ERP systems', 'Python', 'project management']::text[], array['topic', 'industry_access', 'career_start']::text[], 'Brazilian-Swiss student pursuing MSc Business and Technology at Basel. Previously worked in IT consulting in Sao Paulo. Interested in digital transformation in pharma and how technology reshapes traditional business models.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-23'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-23'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-23'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-24', 'Sophie', 'Koller', 'sophie.koller@student.unibas.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-19'), (select id from public.universities where source_id = 'uni-06'),
  array['pharmaceutical analysis', 'organic chemistry', 'lab techniques', 'documentation']::text[], array['topic', 'project_guidance']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-24'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-11'
where sref.source_id = 'student-24'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-25', 'Yuki', 'Tanaka', 'yuki.tanaka@student.unibas.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-17'), (select id from public.universities where source_id = 'uni-06'),
  array['protein biochemistry', 'mass spectrometry', 'R', 'data analysis']::text[], array['topic', 'supervision']::text[], 'Japanese student studying molecular biology at Unibas with a focus on proteomics. Completed my BSc at the University of Tokyo. Interested in applying computational methods to large-scale protein interaction studies.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-11'
where sref.source_id = 'student-25'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-25'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-26', 'Michelle', 'Weber', 'michelle.weber@student.zhaw.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-20'), (select id from public.universities where source_id = 'uni-07'),
  array['corpus analysis', 'NLP tools', 'Python', 'qualitative research', 'translation']::text[], array['topic', 'career_start']::text[], 'Applied linguistics student at ZHAW with a focus on computational approaches to multilingual communication. Working part-time as a technical writer at a Winterthur software company. Fluent in German, French, English, and Portuguese.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-15'
where sref.source_id = 'student-26'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-26'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-19'
where sref.source_id = 'student-26'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-27', 'Patrick', 'Bühler', 'patrick.buehler@student.zhaw.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-21'), (select id from public.universities where source_id = 'uni-07'),
  array['lean manufacturing', 'Six Sigma', 'MATLAB', 'process simulation', 'Python']::text[], array['topic', 'industry_access']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-09'
where sref.source_id = 'student-27'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-07'
where sref.source_id = 'student-27'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-28', 'Aisha', 'Hassan', 'aisha.hassan@student.zhaw.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-22'), (select id from public.universities where source_id = 'uni-07'),
  array['web development', 'JavaScript', 'React', 'SQL', 'UX design']::text[], array['topic', 'project_guidance', 'career_start']::text[], 'Business IT student at ZHAW with a passion for user-centered design. Built several web apps during hackathons and personal projects. Looking for a bachelor thesis that involves developing a real product.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-28'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-28'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-18'
where sref.source_id = 'student-28'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-29', 'Fabian', 'Rüegg', 'fabian.rueegg@student.zhaw.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-21'), (select id from public.universities where source_id = 'uni-07'),
  array['robotics', 'PLC programming', 'CAD', 'project management', 'Python']::text[], array['topic', 'supervision', 'industry_access']::text[], 'Industrial engineering student focusing on automation and robotics at ZHAW. Three years of industry experience as a production engineer at Bühler Group before returning to academia. Seeking a thesis bridging smart manufacturing and sustainability.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-09'
where sref.source_id = 'student-29'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-10'
where sref.source_id = 'student-29'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-29'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-30', 'Mirjam', 'Steffen', 'mirjam.steffen@student.fhnw.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-23'), (select id from public.universities where source_id = 'uni-08'),
  array['Python', 'scikit-learn', 'Spark', 'data pipelines', 'SQL']::text[], array['topic', 'career_start', 'industry_access']::text[], 'Data science student at FHNW, focused on building scalable ML solutions. Working part-time as a data engineer at a Basel pharma company. Interested in applying ML to real-world business problems for my thesis.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-30'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-30'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-30'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-31', 'Kevin', 'Schumacher', 'kevin.schumacher@student.fhnw.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-24'), (select id from public.universities where source_id = 'uni-08'),
  array['SolidWorks', 'manufacturing processes', 'materials science', 'technical drawing']::text[], array['topic', 'project_guidance']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-09'
where sref.source_id = 'student-31'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-31'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-32', 'Vanessa', 'Hirt', 'vanessa.hirt@student.fhnw.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-25'), (select id from public.universities where source_id = 'uni-08'),
  array['change management', 'stakeholder analysis', 'Scrum', 'business analytics', 'PowerBI']::text[], array['topic', 'industry_access']::text[], 'Digital transformation student at FHNW with prior experience in retail management at Migros. My thesis will explore how traditional Swiss retailers can accelerate their digital transformation journey.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-32'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-06'
where sref.source_id = 'student-32'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-32'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-33', 'Andrin', 'Casutt', 'andrin.casutt@student.fhnw.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-23'), (select id from public.universities where source_id = 'uni-08'),
  array['Python', 'TensorFlow', 'computer vision', 'MLOps', 'Git']::text[], array['topic', 'career_start']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-33'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-33'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-34', 'Nina', 'Eigenmann', 'nina.eigenmann@student.ost.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-26'), (select id from public.universities where source_id = 'uni-09'),
  array['full-stack development', 'TypeScript', 'React', 'Node.js', 'PostgreSQL']::text[], array['topic', 'career_start']::text[], 'Computer science student at OST with experience in building full-stack web applications. Interned at Ergon Informatik in Zurich. Interested in a thesis on developer tooling or software quality.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-34'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-34'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-35', 'Tobias', 'Lutz', 'tobias.lutz@student.ost.ch', 'bsc',
  (select id from public.study_programs where source_id = 'program-27'), (select id from public.universities where source_id = 'uni-09'),
  array['energy systems', 'PV design', 'AutoCAD', 'Python', 'data analysis']::text[], array['topic', 'project_guidance', 'industry_access']::text[], 'Renewable energies student at OST, passionate about solar energy and building-integrated photovoltaics. Completed a practical semester at a solar installation company in St. Gallen.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-17'
where sref.source_id = 'student-35'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-10'
where sref.source_id = 'student-35'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-08'
where sref.source_id = 'student-35'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-36', 'Selina', 'Fässler', 'selina.faessler@student.ost.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-26'), (select id from public.universities where source_id = 'uni-09'),
  array['Java', 'microservices', 'AWS', 'CI/CD', 'Kotlin']::text[], array['topic', 'career_start', 'industry_access']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-36'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-04'
where sref.source_id = 'student-36'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-37', 'Matteo', 'Bernasconi', 'matteo.bernasconi@student.usi.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-28'), (select id from public.universities where source_id = 'uni-10'),
  array['numerical methods', 'C++', 'Python', 'high-performance computing', 'linear algebra']::text[], array['topic', 'supervision']::text[], 'Computational science student at USI with a strong background in applied mathematics. Interested in scientific computing applications for engineering and physics simulations. Previously studied at Politecnico di Milano.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-37'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-09'
where sref.source_id = 'student-37'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-37'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-38', 'Chiara', 'Bentivoglio', 'chiara.bentivoglio@student.usi.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-29'), (select id from public.universities where source_id = 'uni-10'),
  array['portfolio management', 'Python', 'financial modeling', 'Bloomberg Terminal', 'risk analysis']::text[], array['topic', 'career_start']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-05'
where sref.source_id = 'student-38'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-13'
where sref.source_id = 'student-38'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-39', 'Giulia', 'Ferretti', 'giulia.ferretti@student.usi.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-30'), (select id from public.universities where source_id = 'uni-10'),
  array['social media analytics', 'content strategy', 'qualitative research', 'health communication']::text[], array['topic', 'supervision', 'project_guidance']::text[], 'Communication student at USI exploring the intersection of health communication and digital media. My research examines how misinformation spreads on social platforms during health crises. Native Italian, fluent in English and French.'
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-15'
where sref.source_id = 'student-39'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-12'
where sref.source_id = 'student-39'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-16'
where sref.source_id = 'student-39'
on conflict do nothing;

insert into public.students (
  source_id, first_name, last_name, email, degree, study_program_id, university_id, skills, objectives, about
) values (
  'student-40', 'Marc', 'Christen', 'marc.christen@student.usi.ch', 'msc',
  (select id from public.study_programs where source_id = 'program-28'), (select id from public.universities where source_id = 'uni-10'),
  array['Python', 'machine learning', 'optimization', 'parallel computing']::text[], array['topic', 'career_start']::text[], null
)
on conflict (source_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  degree = excluded.degree,
  study_program_id = excluded.study_program_id,
  university_id = excluded.university_id,
  skills = excluded.skills,
  objectives = excluded.objectives,
  about = excluded.about,
  updated_at = now();

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-01'
where sref.source_id = 'student-40'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-02'
where sref.source_id = 'student-40'
on conflict do nothing;

insert into public.student_fields (student_id, field_id)
select sref.id, fref.id
from public.students sref
join public.fields fref on fref.source_id = 'field-03'
where sref.source_id = 'student-40'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-01', 'Applying NLP to Automate Knowledge Discovery in Academic Research', null, 'I want to explore how large language models can accelerate literature review and hypothesis generation in multidisciplinary research.', 'proposed',
  (select id from public.students where source_id = 'student-04'), null, null, (select id from public.universities where source_id = 'uni-01'), '2026-02-28T10:15:00Z'::timestamptz, '2026-02-28T10:15:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-02', 'Sustainable Supply Chain Strategies for Swiss Food Retail', null, null, 'proposed',
  (select id from public.students where source_id = 'student-12'), null, null, (select id from public.universities where source_id = 'uni-03'), '2026-03-05T14:30:00Z'::timestamptz, '2026-03-05T14:30:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-03', 'Exploring Behavioral Nudges for Sustainable Consumer Choices', null, 'Having studied behavioral economics, I believe nudge theory can measurably shift consumer behavior toward sustainable products.', 'proposed',
  (select id from public.students where source_id = 'student-15'), null, null, (select id from public.universities where source_id = 'uni-04'), '2026-03-10T09:00:00Z'::timestamptz, '2026-03-10T09:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-04', 'Applying Federated Learning to Telecom Network Optimization', 'Investigating privacy-preserving machine learning approaches for mobile network resource allocation at Swisscom.', 'I am fascinated by the challenge of training ML models without centralizing sensitive user data and see Swiss telecom as the ideal testing ground.', 'applied',
  (select id from public.students where source_id = 'student-01'), (select id from public.topics where source_id = 'topic-07'), (select id from public.companies where source_id = 'company-04'), (select id from public.universities where source_id = 'uni-01'), '2026-02-10T11:00:00Z'::timestamptz, '2026-02-18T16:45:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-05', 'Digital Health Pipeline for Wearable-Based Clinical Endpoints', 'Building a data ingestion and analysis pipeline for consumer wearable data to support decentralized clinical trials at Roche.', 'My background in data science and interest in healthcare make this the perfect intersection of my skills and career goals.', 'applied',
  (select id from public.students where source_id = 'student-30'), (select id from public.topics where source_id = 'topic-04'), (select id from public.companies where source_id = 'company-02'), (select id from public.universities where source_id = 'uni-08'), '2026-01-20T09:30:00Z'::timestamptz, '2026-02-05T14:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-06', 'Climate Risk Assessment Using Satellite and IoT Data for Reinsurance', 'Augmenting traditional actuarial catastrophe models with alternative data sources including satellite imagery and IoT sensor networks at Swiss Re.', 'I want to bridge my finance background with environmental data science to address the growing challenge of climate risk pricing.', 'agreed',
  (select id from public.students where source_id = 'student-11'), (select id from public.topics where source_id = 'topic-11'), (select id from public.companies where source_id = 'company-06'), (select id from public.universities where source_id = 'uni-03'), '2025-12-01T10:00:00Z'::timestamptz, '2026-01-15T11:30:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-06'
where pref.source_id = 'project-06'
on conflict do nothing;

insert into public.project_experts (project_id, expert_id)
select pref.id, eref.id
from public.thesis_projects pref
join public.experts eref on eref.source_id = 'expert-11'
where pref.source_id = 'project-06'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-07', 'Privacy-Preserving Health Data Analytics Framework', 'Designing a differential privacy framework for secure sharing of patient records, with deployment guidelines for Swiss hospitals.', 'After working on a cryptography semester project, I want to apply privacy-enhancing technologies to the sensitive domain of health data.', 'agreed',
  (select id from public.students where source_id = 'student-06'), (select id from public.topics where source_id = 'topic-33'), null, (select id from public.universities where source_id = 'uni-02'), '2025-11-15T08:00:00Z'::timestamptz, '2026-01-10T10:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-03'
where pref.source_id = 'project-07'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-08', 'Predictive Maintenance System for SBB Train Bogies', 'Building an anomaly detection model using IoT sensor telemetry from SBB rolling stock to predict bogie failures before they occur. Currently evaluating isolation forests, autoencoders, and transformer-based approaches on historical maintenance logs.', 'Combining my data engineering skills with Switzerland''s world-class rail infrastructure is a dream thesis opportunity.', 'in_progress',
  (select id from public.students where source_id = 'student-14'), (select id from public.topics where source_id = 'topic-09'), (select id from public.companies where source_id = 'company-05'), (select id from public.universities where source_id = 'uni-04'), '2025-10-15T09:00:00Z'::timestamptz, '2026-03-01T14:30:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-09'
where pref.source_id = 'project-08'
on conflict do nothing;

insert into public.project_experts (project_id, expert_id)
select pref.id, eref.id
from public.thesis_projects pref
join public.experts eref on eref.source_id = 'expert-09'
where pref.source_id = 'project-08'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-09', 'Multilingual Sentiment Analysis for Swiss Public Discourse', 'Developing a transformer-based sentiment analysis system for German, French, Italian, and Romansh text from Swiss news and social media. Currently fine-tuning multilingual models and building the evaluation dataset.', 'As a multilingual person in a multilingual country, I want to build NLP tools that truly serve Switzerland''s linguistic diversity.', 'in_progress',
  (select id from public.students where source_id = 'student-26'), (select id from public.topics where source_id = 'topic-46'), null, (select id from public.universities where source_id = 'uni-07'), '2025-10-01T10:00:00Z'::timestamptz, '2026-02-20T16:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-16'
where pref.source_id = 'project-09'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-10', 'Generative Models for Lead Optimization in Oncology', 'Comparing variational autoencoders, diffusion models, and RL-based approaches for generating molecules with improved binding affinity and drug-like properties. Working with Novartis''s proprietary compound library and docking simulations.', 'My PhD background in computational biology positions me well to push the boundaries of AI-driven drug discovery.', 'in_progress',
  (select id from public.students where source_id = 'student-07'), (select id from public.topics where source_id = 'topic-15'), (select id from public.companies where source_id = 'company-08'), (select id from public.universities where source_id = 'uni-02'), '2025-09-20T08:00:00Z'::timestamptz, '2026-03-10T11:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-04'
where pref.source_id = 'project-10'
on conflict do nothing;

insert into public.project_experts (project_id, expert_id)
select pref.id, eref.id
from public.thesis_projects pref
join public.experts eref on eref.source_id = 'expert-15'
where pref.source_id = 'project-10'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-11', 'Battery Storage Optimization for Alpine Microgrids', 'Modeling and optimizing battery energy storage sizing for off-grid Alpine communities using mixed-integer linear programming. Simulating year-round scenarios with solar, small hydro, and wind inputs under varying demand profiles.', 'Growing up in a rural Alpine community, I have seen first-hand the energy challenges that motivate this research.', 'in_progress',
  (select id from public.students where source_id = 'student-35'), (select id from public.topics where source_id = 'topic-53'), null, (select id from public.universities where source_id = 'uni-09'), '2025-10-10T09:00:00Z'::timestamptz, '2026-02-28T13:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-23'
where pref.source_id = 'project-11'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-12', 'Knowledge Graphs for Scientific Literature Discovery', 'Built an automated NLP pipeline that extracts entities and relations from biomedical publications to construct a domain-specific knowledge graph. Evaluated the pipeline against expert-curated benchmarks and achieved a 78% F1-score on relation extraction.', 'I wanted to combine my informatics skills with the challenge of making scientific knowledge more accessible and interconnected.', 'completed',
  (select id from public.students where source_id = 'student-17'), (select id from public.topics where source_id = 'topic-39'), null, (select id from public.universities where source_id = 'uni-04'), '2025-09-01T08:00:00Z'::timestamptz, '2026-02-15T17:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-09'
where pref.source_id = 'project-12'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-13', 'Digital Twin Prototype for Collaborative Robot Work Cells', 'Developed a simulation-based digital twin of an ABB collaborative robot work cell that ingests real-time sensor data for calibration and predictive maintenance scheduling. The prototype demonstrated a 22% improvement in maintenance prediction accuracy over schedule-based baselines.', 'Industrial robotics and simulation are my core interests, and this project let me combine both in a real-world setting.', 'completed',
  (select id from public.students where source_id = 'student-29'), (select id from public.topics where source_id = 'topic-05'), (select id from public.companies where source_id = 'company-03'), (select id from public.universities where source_id = 'uni-07'), '2025-09-10T10:00:00Z'::timestamptz, '2026-02-01T15:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.project_supervisors (project_id, supervisor_id)
select pref.id, sref.id
from public.thesis_projects pref
join public.supervisors sref on sref.source_id = 'supervisor-17'
where pref.source_id = 'project-13'
on conflict do nothing;

insert into public.project_experts (project_id, expert_id)
select pref.id, eref.id
from public.thesis_projects pref
join public.experts eref on eref.source_id = 'expert-05'
where pref.source_id = 'project-13'
on conflict do nothing;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-14', 'BIM-Integrated IoT Monitoring for Construction Sites', 'Exploring the integration of IoT sensor data with BIM models for automated construction progress tracking at Hilti.', 'I applied because this topic perfectly matches my software development skills with my interest in construction technology.', 'withdrawn',
  (select id from public.students where source_id = 'student-34'), (select id from public.topics where source_id = 'topic-19'), (select id from public.companies where source_id = 'company-10'), (select id from public.universities where source_id = 'uni-09'), '2026-01-05T10:00:00Z'::timestamptz, '2026-02-10T09:30:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.thesis_projects (
  source_id, title, description, motivation, state, student_id, topic_id, company_id, university_id, created_at, updated_at
) values (
  'project-15', 'Recommendation Engine for Migros Omnichannel Retail', 'Proposing to build a hybrid recommendation system for Migros''s online and in-store channels.', 'My experience in digital commerce and data science makes me well-suited to tackle this real-world retail challenge.', 'rejected',
  (select id from public.students where source_id = 'student-32'), (select id from public.topics where source_id = 'topic-27'), (select id from public.companies where source_id = 'company-14'), (select id from public.universities where source_id = 'uni-08'), '2026-01-15T13:00:00Z'::timestamptz, '2026-02-20T10:00:00Z'::timestamptz
)
on conflict (source_id) do update set
  title = excluded.title,
  description = excluded.description,
  motivation = excluded.motivation,
  state = excluded.state,
  student_id = excluded.student_id,
  topic_id = excluded.topic_id,
  company_id = excluded.company_id,
  university_id = excluded.university_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

