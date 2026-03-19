-- generated seed orchestration: root seed + mock-data extension

-- ================================================================
-- Gini Platform — Seed Data
-- Generated from mock JSON files.
-- UUID format: {entity_prefix}-0000-4000-8000-{zero_padded_number}
-- Run after: npx supabase db push
-- Then run: deno run --allow-net --allow-env scripts/embed-seed.ts  (populates embeddings)
-- ================================================================

-- universities
INSERT INTO universities (id, name, country, website, about) VALUES
  ('aaaa0000-0000-4000-8000-000000000001', 'ETH Zurich', 'CH', 'ethz.ch', 'ETH Zurich is one of the world''s leading universities for technology and natural sciences. Known for cutting-edge research in engineering, computer science, and physics, it consistently ranks among the top 10 globally. ETH fosters strong industry partnerships and has produced 22 Nobel Prize laureates.'),
  ('aaaa0000-0000-4000-8000-000000000002', 'EPFL', 'CH', 'epfl.ch', 'EPFL is a research-intensive university specializing in engineering and life sciences, located on the shores of Lake Geneva. It hosts over 350 labs and research groups and is known for its entrepreneurial culture, with a thriving startup ecosystem through the EPFL Innovation Park.'),
  ('aaaa0000-0000-4000-8000-000000000003', 'University of St. Gallen (HSG)', 'CH', 'unisg.ch', 'HSG is one of Europe''s leading business universities, consistently ranked among the top for management, finance, and economics. With a strong practical orientation and close ties to the Swiss and international business community, HSG graduates are highly sought after by consulting, banking, and tech companies.'),
  ('aaaa0000-0000-4000-8000-000000000004', 'University of Zurich', 'CH', 'uzh.ch', 'The University of Zurich is Switzerland''s largest university, offering the widest range of programs in the country. It is particularly strong in medicine, economics, psychology, and informatics. UZH is a member of the League of European Research Universities and has close ties to ETH Zurich.'),
  ('aaaa0000-0000-4000-8000-000000000005', 'University of Bern', 'CH', 'unibe.ch', 'The University of Bern is a comprehensive research university with particular strengths in climate science, space research, and biomedical sciences. It plays a central role in Switzerland''s national research initiatives and benefits from its location in the Swiss capital.'),
  ('aaaa0000-0000-4000-8000-000000000006', 'University of Basel', 'CH', 'unibas.ch', 'The University of Basel is Switzerland''s oldest university, founded in 1460. Located in the heart of the Swiss pharma and life sciences cluster, it has deep connections to Roche, Novartis, and other industry leaders. Strong in molecular biology, pharmaceutical sciences, and digital humanities.'),
  ('aaaa0000-0000-4000-8000-000000000007', 'ZHAW', 'CH', 'zhaw.ch', 'ZHAW is one of Switzerland''s largest universities of applied sciences, with a strong focus on practice-oriented education and applied research. Programs span engineering, business, linguistics, health sciences, and social work, with mandatory industry internships and close ties to regional employers.'),
  ('aaaa0000-0000-4000-8000-000000000008', 'FHNW', 'CH', 'fhnw.ch', NULL),
  ('aaaa0000-0000-4000-8000-000000000009', 'OST – Eastern Switzerland University of Applied Sciences', 'CH', 'ost.ch', NULL),
  ('aaaa0000-0000-4000-8000-000000000010', 'USI – Università della Svizzera italiana', 'CH', 'usi.ch', NULL);

-- fields
INSERT INTO fields (id, name) VALUES
  ('bbbb0000-0000-4000-8000-000000000001', 'Computer Science'),
  ('bbbb0000-0000-4000-8000-000000000002', 'Data Science'),
  ('bbbb0000-0000-4000-8000-000000000003', 'Artificial Intelligence'),
  ('bbbb0000-0000-4000-8000-000000000004', 'Business Administration'),
  ('bbbb0000-0000-4000-8000-000000000005', 'Finance'),
  ('bbbb0000-0000-4000-8000-000000000006', 'Marketing'),
  ('bbbb0000-0000-4000-8000-000000000007', 'Supply Chain Management'),
  ('bbbb0000-0000-4000-8000-000000000008', 'Sustainability'),
  ('bbbb0000-0000-4000-8000-000000000009', 'Mechanical Engineering'),
  ('bbbb0000-0000-4000-8000-000000000010', 'Electrical Engineering'),
  ('bbbb0000-0000-4000-8000-000000000011', 'Biotechnology'),
  ('bbbb0000-0000-4000-8000-000000000012', 'Healthcare & Medicine'),
  ('bbbb0000-0000-4000-8000-000000000013', 'Economics'),
  ('bbbb0000-0000-4000-8000-000000000014', 'Law'),
  ('bbbb0000-0000-4000-8000-000000000015', 'Communication & Media'),
  ('bbbb0000-0000-4000-8000-000000000016', 'Psychology'),
  ('bbbb0000-0000-4000-8000-000000000017', 'Environmental Science'),
  ('bbbb0000-0000-4000-8000-000000000018', 'Architecture & Design'),
  ('bbbb0000-0000-4000-8000-000000000019', 'Education'),
  ('bbbb0000-0000-4000-8000-000000000020', 'Public Policy');

-- study_programs
INSERT INTO study_programs (id, university_id, name, degree, about) VALUES
  ('cccc0000-0000-4000-8000-000000000001', 'aaaa0000-0000-4000-8000-000000000001', 'MSc Computer Science', 'msc', 'Covers advanced topics in systems, algorithms, machine learning, and software engineering. Students choose from specializations including data management, visual computing, and theoretical CS. Thesis projects often involve industry partners in the Zurich tech ecosystem.'),
  ('cccc0000-0000-4000-8000-000000000002', 'aaaa0000-0000-4000-8000-000000000001', 'MSc Mechanical Engineering', 'msc', 'Focuses on robotics, energy systems, micro/nanotechnology, and product development. Strong lab infrastructure and close collaboration with Swiss precision manufacturing companies. Many theses are co-supervised with industry partners like ABB, Hilti, or Stadler Rail.'),
  ('cccc0000-0000-4000-8000-000000000003', 'aaaa0000-0000-4000-8000-000000000001', 'BSc Electrical Engineering and Information Technology', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000004', 'aaaa0000-0000-4000-8000-000000000002', 'MSc Data Science', 'msc', 'A highly interdisciplinary program combining statistics, machine learning, and domain-specific applications. Students work with large-scale datasets and modern ML frameworks. Thesis topics range from computational biology to NLP to climate modeling.'),
  ('cccc0000-0000-4000-8000-000000000005', 'aaaa0000-0000-4000-8000-000000000002', 'MSc Communication Systems', 'msc', 'Combines networking, security, and signal processing with a strong systems engineering perspective. Graduates work at the intersection of telecommunications, cybersecurity, and IoT. Close ties to Swisscom, Qualcomm, and the EPFL security labs.'),
  ('cccc0000-0000-4000-8000-000000000006', 'aaaa0000-0000-4000-8000-000000000002', 'PhD Computational and Quantitative Biology', 'phd', NULL),
  ('cccc0000-0000-4000-8000-000000000007', 'aaaa0000-0000-4000-8000-000000000003', 'MSc Business Innovation', 'msc', 'HSG''s flagship program at the intersection of business, technology, and design thinking. Students work on real innovation challenges with corporate partners and build prototypes. Many graduates launch startups or join consulting firms focused on digital transformation.'),
  ('cccc0000-0000-4000-8000-000000000008', 'aaaa0000-0000-4000-8000-000000000003', 'MA International Affairs and Governance', 'msc', 'Prepares students for careers in international organizations, diplomacy, and public policy. Covers global governance, political economy, and sustainability. Thesis topics often address Swiss foreign policy, trade, or development cooperation.'),
  ('cccc0000-0000-4000-8000-000000000009', 'aaaa0000-0000-4000-8000-000000000003', 'MSc Finance', 'msc', 'One of Europe''s top-ranked finance programs. Covers asset management, risk analysis, fintech, and sustainable finance. Strong alumni network in Swiss banking and insurance. Many students do thesis projects with UBS, Credit Suisse, or Swiss Re.'),
  ('cccc0000-0000-4000-8000-000000000010', 'aaaa0000-0000-4000-8000-000000000003', 'BSc Business Administration', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000011', 'aaaa0000-0000-4000-8000-000000000004', 'MSc Informatics', 'msc', 'Covers software systems, data science, AI, and people-oriented computing. The program benefits from UZH''s proximity to ETH and the Zurich tech scene. Thesis projects often involve the university''s AI research groups or industry partners in fintech and health tech.'),
  ('cccc0000-0000-4000-8000-000000000012', 'aaaa0000-0000-4000-8000-000000000004', 'MSc Economics', 'msc', 'Strong quantitative focus with specializations in econometrics, behavioral economics, and public economics. Zurich''s position as a financial center provides unique thesis opportunities in banking regulation, monetary policy, and labor market analysis.'),
  ('cccc0000-0000-4000-8000-000000000013', 'aaaa0000-0000-4000-8000-000000000004', 'PhD Psychology', 'phd', NULL),
  ('cccc0000-0000-4000-8000-000000000014', 'aaaa0000-0000-4000-8000-000000000005', 'MSc Biomedical Sciences', 'msc', 'Combines molecular biology, neuroscience, and clinical research. Students access cutting-edge facilities at the Bern Biomedical Research center. Thesis projects often connect to Inselspital (Bern University Hospital) or Swiss pharma companies.'),
  ('cccc0000-0000-4000-8000-000000000015', 'aaaa0000-0000-4000-8000-000000000005', 'BSc Economics and Social Sciences', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000016', 'aaaa0000-0000-4000-8000-000000000005', 'MSc Climate Sciences', 'msc', 'One of Europe''s leading climate science programs, leveraging Bern''s Oeschger Centre for Climate Change Research. Students work with real climate data, ice cores, and atmospheric models. Thesis topics range from carbon cycle dynamics to climate policy analysis.'),
  ('cccc0000-0000-4000-8000-000000000017', 'aaaa0000-0000-4000-8000-000000000006', 'MSc Molecular Biology', 'msc', 'Located in the Basel life sciences hub alongside Roche and Novartis. Covers structural biology, genomics, and cell biology with access to world-class facilities at the Biozentrum. Many students do thesis projects directly embedded in pharma R&D labs.'),
  ('cccc0000-0000-4000-8000-000000000018', 'aaaa0000-0000-4000-8000-000000000006', 'MSc Business and Technology', 'msc', NULL),
  ('cccc0000-0000-4000-8000-000000000019', 'aaaa0000-0000-4000-8000-000000000006', 'BSc Pharmaceutical Sciences', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000020', 'aaaa0000-0000-4000-8000-000000000007', 'MSc Applied Linguistics', 'msc', 'Focuses on language technology, multilingual communication, and corpus linguistics. Students explore NLP, machine translation, and language assessment. Thesis projects often involve collaboration with Swiss media companies or public sector communication offices.'),
  ('cccc0000-0000-4000-8000-000000000021', 'aaaa0000-0000-4000-8000-000000000007', 'MSc Engineering (Industrial Engineering)', 'msc', 'Practice-oriented program covering production systems, supply chain optimization, and Industry 4.0. Strong ties to Swiss manufacturing SMEs and large industrials. Students complete thesis projects embedded in real production environments.'),
  ('cccc0000-0000-4000-8000-000000000022', 'aaaa0000-0000-4000-8000-000000000007', 'BSc Business Information Technology', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000023', 'aaaa0000-0000-4000-8000-000000000008', 'MSc Data Science', 'msc', 'Applied data science program with a focus on real-world projects in healthcare, finance, and smart manufacturing. Students learn Python, R, deep learning, and cloud computing. Thesis projects are typically done in partnership with regional industry partners.'),
  ('cccc0000-0000-4000-8000-000000000024', 'aaaa0000-0000-4000-8000-000000000008', 'BSc Mechanical Engineering', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000025', 'aaaa0000-0000-4000-8000-000000000008', 'MSc Business Administration (Digital Transformation)', 'msc', 'Prepares students to lead digital transformation in organizations. Covers digital strategy, IT governance, change management, and data-driven decision-making. Many thesis projects are done in collaboration with Swiss SMEs undergoing digitalization.'),
  ('cccc0000-0000-4000-8000-000000000026', 'aaaa0000-0000-4000-8000-000000000009', 'MSc Computer Science', 'msc', 'OST''s computer science master emphasizes software engineering, cloud-native development, and applied AI. Small class sizes and close mentorship from faculty. Thesis projects often involve the university''s research institutes or Eastern Swiss tech companies.'),
  ('cccc0000-0000-4000-8000-000000000027', 'aaaa0000-0000-4000-8000-000000000009', 'BSc Renewable Energies and Environmental Engineering', 'bsc', NULL),
  ('cccc0000-0000-4000-8000-000000000028', 'aaaa0000-0000-4000-8000-000000000010', 'MSc Computational Science', 'msc', 'USI''s computational science program bridges mathematics, computer science, and scientific modeling. Students work on simulation, high-performance computing, and numerical methods. The program benefits from USI''s Swiss National Supercomputing Centre (CSCS) partnership.'),
  ('cccc0000-0000-4000-8000-000000000029', 'aaaa0000-0000-4000-8000-000000000010', 'MSc Finance', 'msc', NULL),
  ('cccc0000-0000-4000-8000-000000000030', 'aaaa0000-0000-4000-8000-000000000010', 'MSc Communication, Management and Health', 'msc', NULL);

-- supervisors
INSERT INTO supervisors (id, university_id, title, first_name, last_name, email, about) VALUES
  ('dddd0000-0000-4000-8000-000000000001', 'aaaa0000-0000-4000-8000-000000000001', 'Prof. Dr.', 'Martin', 'Vechev', 'martin.vechev@ethz.ch', 'Full professor at ETH Zurich leading research on building reliable and trustworthy AI systems. My group develops novel methods at the intersection of machine learning and programming languages, with over 80 publications at top venues.'),
  ('dddd0000-0000-4000-8000-000000000002', 'aaaa0000-0000-4000-8000-000000000001', 'Prof. Dr.', 'Sibylle', 'Hechberger', 'sibylle.hechberger@ethz.ch', 'I lead the Computational Mechanics group at ETH Zurich, focusing on simulation-driven design and digital twin technologies for advanced manufacturing. Previously held positions at TU Munich and MIT.'),
  ('dddd0000-0000-4000-8000-000000000003', 'aaaa0000-0000-4000-8000-000000000002', 'Prof. Dr.', 'Carmela', 'Troncoso', 'carmela.troncoso@epfl.ch', 'Associate professor at EPFL heading the SPRING lab. My research focuses on developing tools and methods to protect users'' privacy in digital systems. Co-designed the DP-3T protocol used in COVID contact-tracing apps across Europe.'),
  ('dddd0000-0000-4000-8000-000000000004', 'aaaa0000-0000-4000-8000-000000000002', 'Prof. Dr.', 'Bruno', 'Correia', 'bruno.correia@epfl.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000005', 'aaaa0000-0000-4000-8000-000000000002', 'Prof. Dr.', 'Jean-Philippe', 'Bonardi', 'jean-philippe.bonardi@epfl.ch', 'Full professor at EPFL and director of the Enterprise for Society Center (E4S). I study how firms and governments can accelerate the transition to a sustainable economy. My work spans environmental regulation, corporate strategy, and public policy.'),
  ('dddd0000-0000-4000-8000-000000000006', 'aaaa0000-0000-4000-8000-000000000003', 'Prof. Dr.', 'Andreas', 'Herrmann', 'andreas.herrmann@unisg.ch', 'Director of the Institute for Customer Insight at the University of St. Gallen. My research bridges marketing science and technology, with a particular focus on how autonomous systems reshape consumer decisions. Author of five books and frequent keynote speaker.'),
  ('dddd0000-0000-4000-8000-000000000007', 'aaaa0000-0000-4000-8000-000000000003', 'Prof. Dr.', 'Miriam', 'Meckel', 'miriam.meckel@unisg.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000008', 'aaaa0000-0000-4000-8000-000000000003', 'Prof. Dr.', 'Wolfgang', 'Stölzle', 'wolfgang.stoelzle@unisg.ch', 'Chair of Logistics Management at HSG with over 20 years of experience in supply chain research and consulting. I work closely with Swiss industry leaders on real-world logistics challenges and sustainable transport solutions.'),
  ('dddd0000-0000-4000-8000-000000000009', 'aaaa0000-0000-4000-8000-000000000004', 'Prof. Dr.', 'Abraham', 'Bernstein', 'abraham.bernstein@uzh.ch', 'Professor of Informatics at the University of Zurich and co-director of the Digital Society Initiative. My group investigates how humans and AI systems can work together more effectively, using semantic technologies and knowledge representation.'),
  ('dddd0000-0000-4000-8000-000000000010', 'aaaa0000-0000-4000-8000-000000000004', 'Prof. Dr.', 'Lena', 'Doppel', 'lena.doppel@uzh.ch', 'Associate professor at the University of Zurich specializing in behavioral and experimental economics. My lab studies how people make decisions under risk and ambiguity, with applications to consumer finance and public health policy.'),
  ('dddd0000-0000-4000-8000-000000000011', 'aaaa0000-0000-4000-8000-000000000005', 'Prof. Dr.', 'Isabelle', 'Stadelmann-Steffen', 'isabelle.stadelmann@unibe.ch', 'Full professor of Comparative Politics at the University of Bern. I study how citizens engage with policy issues, especially around climate change and energy transitions. PI of multiple SNF-funded projects.'),
  ('dddd0000-0000-4000-8000-000000000012', 'aaaa0000-0000-4000-8000-000000000005', 'Prof. Dr.', 'Thomas', 'Stocker', 'thomas.stocker@unibe.ch', 'Professor of Climate and Environmental Physics at the University of Bern and former co-chair of IPCC Working Group I. My research aims to understand past, present, and future climate change through modeling and ice core analysis.'),
  ('dddd0000-0000-4000-8000-000000000013', 'aaaa0000-0000-4000-8000-000000000006', 'Prof. Dr.', 'Torsten', 'Schwede', 'torsten.schwede@unibas.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000014', 'aaaa0000-0000-4000-8000-000000000006', 'Prof. Dr.', 'Claudia', 'Buser', 'claudia.buser@unibas.ch', 'Associate professor at the University of Basel researching the economics of pharmaceutical innovation and regulation. I collaborate with the Swiss Tropical and Public Health Institute on access-to-medicine projects in low-income countries.'),
  ('dddd0000-0000-4000-8000-000000000015', 'aaaa0000-0000-4000-8000-000000000006', 'Prof. Dr.', 'Georg', 'von Krogh', 'georg.vonkrogh@unibas.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000016', 'aaaa0000-0000-4000-8000-000000000007', 'Prof. Dr.', 'Elena', 'Gavagnin', 'elena.gavagnin@zhaw.ch', 'Professor at ZHAW''s Institute of Applied Information Technology. My research applies NLP and machine learning to multilingual text analysis, with a focus on Swiss language diversity. I have supervised over 30 master theses at the intersection of linguistics and computer science.'),
  ('dddd0000-0000-4000-8000-000000000017', 'aaaa0000-0000-4000-8000-000000000007', 'Prof. Dr.', 'Daniel', 'Schilter', 'daniel.schilter@zhaw.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000018', 'aaaa0000-0000-4000-8000-000000000007', 'Prof. Dr.', 'Petra', 'Kugler', 'petra.kugler@zhaw.ch', 'Head of the Center for Digital Business at ZHAW School of Management and Law. I bridge research and practice, working with SMEs and large enterprises to design sustainable digital transformation strategies.'),
  ('dddd0000-0000-4000-8000-000000000019', 'aaaa0000-0000-4000-8000-000000000008', 'Prof. Dr.', 'Manfred', 'Vogel', 'manfred.vogel@fhnw.ch', 'Professor at FHNW''s School of Engineering, leading the Applied Machine Learning group. Prior industry experience at Google Zurich and several Swiss startups. I enjoy connecting students with real-world ML challenges.'),
  ('dddd0000-0000-4000-8000-000000000020', 'aaaa0000-0000-4000-8000-000000000008', 'Prof. Dr.', 'Regula', 'Baertschi', 'regula.baertschi@fhnw.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000021', 'aaaa0000-0000-4000-8000-000000000008', 'Prof. Dr.', 'Nicole', 'Bischof', 'nicole.bischof@fhnw.ch', 'Professor of Digital Marketing at FHNW School of Business. My research focuses on how data-driven marketing can be implemented ethically and effectively in Swiss and European markets. I lead several Innosuisse projects with retail partners.'),
  ('dddd0000-0000-4000-8000-000000000022', 'aaaa0000-0000-4000-8000-000000000009', 'Prof. Dr.', 'Marco', 'Züger', 'marco.zueger@ost.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000023', 'aaaa0000-0000-4000-8000-000000000009', 'Prof. Dr.', 'Sandra', 'Tretter', 'sandra.tretter@ost.ch', 'Professor of Energy Systems at OST, where I lead research on integrating renewable energy sources into Switzerland''s electricity grid. Former engineer at Axpo and active member of the Swiss Academy of Engineering Sciences.'),
  ('dddd0000-0000-4000-8000-000000000024', 'aaaa0000-0000-4000-8000-000000000010', 'Prof. Dr.', 'Marc', 'Langheinrich', 'marc.langheinrich@usi.ch', NULL),
  ('dddd0000-0000-4000-8000-000000000025', 'aaaa0000-0000-4000-8000-000000000010', 'Prof. Dr.', 'Silvia', 'Bentivegna', 'silvia.bentivegna@usi.ch', 'Associate professor at USI''s Faculty of Communication, Culture and Society. My research explores how digital platforms shape health information seeking and decision-making. I collaborate with the Swiss School of Public Health and WHO Europe.');

-- supervisor_fields
INSERT INTO supervisor_fields (supervisor_id, field_id) VALUES
  ('dddd0000-0000-4000-8000-000000000001', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000001', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000002', 'bbbb0000-0000-4000-8000-000000000009'),
  ('dddd0000-0000-4000-8000-000000000002', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000003', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000003', 'bbbb0000-0000-4000-8000-000000000002'),
  ('dddd0000-0000-4000-8000-000000000004', 'bbbb0000-0000-4000-8000-000000000011'),
  ('dddd0000-0000-4000-8000-000000000004', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000008'),
  ('dddd0000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000017'),
  ('dddd0000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000013'),
  ('dddd0000-0000-4000-8000-000000000006', 'bbbb0000-0000-4000-8000-000000000006'),
  ('dddd0000-0000-4000-8000-000000000006', 'bbbb0000-0000-4000-8000-000000000004'),
  ('dddd0000-0000-4000-8000-000000000007', 'bbbb0000-0000-4000-8000-000000000015'),
  ('dddd0000-0000-4000-8000-000000000007', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000008', 'bbbb0000-0000-4000-8000-000000000007'),
  ('dddd0000-0000-4000-8000-000000000008', 'bbbb0000-0000-4000-8000-000000000004'),
  ('dddd0000-0000-4000-8000-000000000009', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000009', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000010', 'bbbb0000-0000-4000-8000-000000000013'),
  ('dddd0000-0000-4000-8000-000000000010', 'bbbb0000-0000-4000-8000-000000000016'),
  ('dddd0000-0000-4000-8000-000000000011', 'bbbb0000-0000-4000-8000-000000000020'),
  ('dddd0000-0000-4000-8000-000000000011', 'bbbb0000-0000-4000-8000-000000000008'),
  ('dddd0000-0000-4000-8000-000000000012', 'bbbb0000-0000-4000-8000-000000000017'),
  ('dddd0000-0000-4000-8000-000000000012', 'bbbb0000-0000-4000-8000-000000000008'),
  ('dddd0000-0000-4000-8000-000000000013', 'bbbb0000-0000-4000-8000-000000000011'),
  ('dddd0000-0000-4000-8000-000000000013', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000014', 'bbbb0000-0000-4000-8000-000000000012'),
  ('dddd0000-0000-4000-8000-000000000014', 'bbbb0000-0000-4000-8000-000000000013'),
  ('dddd0000-0000-4000-8000-000000000015', 'bbbb0000-0000-4000-8000-000000000004'),
  ('dddd0000-0000-4000-8000-000000000015', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000016', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000016', 'bbbb0000-0000-4000-8000-000000000015'),
  ('dddd0000-0000-4000-8000-000000000017', 'bbbb0000-0000-4000-8000-000000000009'),
  ('dddd0000-0000-4000-8000-000000000017', 'bbbb0000-0000-4000-8000-000000000007'),
  ('dddd0000-0000-4000-8000-000000000018', 'bbbb0000-0000-4000-8000-000000000004'),
  ('dddd0000-0000-4000-8000-000000000018', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000019', 'bbbb0000-0000-4000-8000-000000000002'),
  ('dddd0000-0000-4000-8000-000000000019', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000020', 'bbbb0000-0000-4000-8000-000000000009'),
  ('dddd0000-0000-4000-8000-000000000020', 'bbbb0000-0000-4000-8000-000000000010'),
  ('dddd0000-0000-4000-8000-000000000021', 'bbbb0000-0000-4000-8000-000000000006'),
  ('dddd0000-0000-4000-8000-000000000021', 'bbbb0000-0000-4000-8000-000000000002'),
  ('dddd0000-0000-4000-8000-000000000022', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000023', 'bbbb0000-0000-4000-8000-000000000010'),
  ('dddd0000-0000-4000-8000-000000000023', 'bbbb0000-0000-4000-8000-000000000017'),
  ('dddd0000-0000-4000-8000-000000000024', 'bbbb0000-0000-4000-8000-000000000001'),
  ('dddd0000-0000-4000-8000-000000000024', 'bbbb0000-0000-4000-8000-000000000003'),
  ('dddd0000-0000-4000-8000-000000000025', 'bbbb0000-0000-4000-8000-000000000015'),
  ('dddd0000-0000-4000-8000-000000000025', 'bbbb0000-0000-4000-8000-000000000012');

-- companies
INSERT INTO companies (id, name, industry, website, about) VALUES
  ('eeee0000-0000-4000-8000-000000000001', 'Nestlé', 'Consumer Goods', NULL, 'Nestlé actively collaborates with Swiss universities on research topics spanning supply chain sustainability, AI-driven quality assurance, consumer nutrition science, and packaging innovation. We offer thesis students access to real production data, mentorship from R&D professionals, and potential pathways into graduate programs.'),
  ('eeee0000-0000-4000-8000-000000000002', 'Roche', 'Pharma & Healthcare', NULL, 'Roche partners with universities across Switzerland to advance research in computational biology, personalized medicine, clinical trial design, and digital health. Thesis students can work alongside scientists at our Basel innovation campus, with access to anonymized clinical datasets and cutting-edge lab infrastructure.'),
  ('eeee0000-0000-4000-8000-000000000003', 'ABB', 'Industrial Technology', NULL, 'ABB offers thesis opportunities in robotics, industrial IoT, energy management, and smart manufacturing. Students work on real engineering challenges with access to ABB''s research centers and test facilities in Switzerland. We value interdisciplinary thinkers who can bridge hardware and software.'),
  ('eeee0000-0000-4000-8000-000000000004', 'Swisscom', 'Telecommunications', NULL, 'Swisscom collaborates with universities on topics including network optimization, AI for customer experience, cybersecurity, and 5G applications. Thesis students get access to anonymized network data and can work embedded in our engineering teams in Bern or Zurich.'),
  ('eeee0000-0000-4000-8000-000000000005', 'SBB', 'Transportation', NULL, 'SBB supports thesis research in predictive maintenance, passenger flow optimization, sustainability in transport, and AI for operations. We offer access to real ridership and infrastructure data, making us an ideal partner for students interested in data-driven transportation solutions.'),
  ('eeee0000-0000-4000-8000-000000000006', 'Swiss Re', 'Insurance', NULL, 'Swiss Re welcomes thesis students working on climate risk modeling, catastrophe analytics, actuarial innovation, and ESG quantification. Our data science teams can provide mentorship and access to proprietary risk datasets for academic research purposes.'),
  ('eeee0000-0000-4000-8000-000000000007', 'Zurich Insurance', 'Insurance', NULL, NULL),
  ('eeee0000-0000-4000-8000-000000000008', 'Novartis', 'Pharma & Healthcare', NULL, 'Novartis partners with Swiss universities on AI in drug discovery, real-world evidence studies, and digital therapeutics. Our campus in Basel hosts visiting thesis students who contribute to active research projects with publication potential.'),
  ('eeee0000-0000-4000-8000-000000000009', 'Logitech', 'Consumer Electronics', NULL, NULL),
  ('eeee0000-0000-4000-8000-000000000010', 'Hilti', 'Construction', NULL, 'Hilti supports thesis projects in digital construction, BIM integration, IoT-enabled tool management, and construction site safety. Students can access real project data from construction sites and work with our R&D team in Schaan.'),
  ('eeee0000-0000-4000-8000-000000000011', 'Sonova', 'MedTech', NULL, NULL),
  ('eeee0000-0000-4000-8000-000000000012', 'Bühler Group', 'Food Processing', NULL, 'Bühler collaborates with universities on process optimization, food waste reduction, and sustainable manufacturing. Thesis students work on real production challenges with access to our innovation campus in Uzwil and pilot plants for testing new approaches.'),
  ('eeee0000-0000-4000-8000-000000000013', 'On Running', 'Sportswear', NULL, NULL),
  ('eeee0000-0000-4000-8000-000000000014', 'Migros', 'Retail', NULL, 'Migros supports thesis research in retail analytics, personalized commerce, supply chain sustainability, and consumer behavior. As Switzerland''s largest retailer, we can offer students access to real transaction data and e-commerce analytics for their research.'),
  ('eeee0000-0000-4000-8000-000000000015', 'Stadler Rail', 'Manufacturing', NULL, NULL);

-- experts
INSERT INTO experts (id, company_id, title, first_name, last_name, email, about) VALUES
  ('ff000000-0000-4000-8000-000000000001', 'eeee0000-0000-4000-8000-000000000001', 'Head of Data Science', 'Laura', 'Fischer', 'laura.fischer@nestle.com', 'Leading Nestle''s global data science team, transforming consumer insights into actionable strategies. 12+ years of experience in FMCG analytics, previously at Procter & Gamble and McKinsey. Passionate about mentoring the next generation of data-driven leaders.'),
  ('ff000000-0000-4000-8000-000000000002', 'eeee0000-0000-4000-8000-000000000001', 'Director of Sustainability', 'Philippe', 'Dubois', 'philippe.dubois@nestle.com', 'Driving Nestle''s sustainability roadmap across packaging, sourcing, and carbon reduction. Background in environmental engineering from EPFL and an MBA from IMD. I believe collaboration with academia is essential to solve the climate challenge.'),
  ('ff000000-0000-4000-8000-000000000003', 'eeee0000-0000-4000-8000-000000000002', 'Principal Scientist, Computational Biology', 'Nadia', 'Kessler', 'nadia.kessler@roche.com', 'Leading computational approaches to drug target identification at Roche Pharma Research. PhD in bioinformatics from ETH Zurich. I supervise several student projects each year and value fresh perspectives from academic collaborators.'),
  ('ff000000-0000-4000-8000-000000000004', 'eeee0000-0000-4000-8000-000000000002', 'Head of Digital Health Innovation', 'Thomas', 'Reinhardt', 'thomas.reinhardt@roche.com', 'Leading digital health innovation at Roche, exploring how wearables, real-world data, and AI can transform patient monitoring and clinical trials. MD from the University of Basel with a decade of experience in clinical informatics.'),
  ('ff000000-0000-4000-8000-000000000005', 'eeee0000-0000-4000-8000-000000000003', 'VP Robotics R&D', 'Sven', 'Eriksson', 'sven.eriksson@abb.com', 'Vice President of Robotics R&D at ABB, overseeing the development of next-generation collaborative robots. 18 years in industrial automation, with a background in control systems from KTH Stockholm. Strong advocate for university-industry partnerships.'),
  ('ff000000-0000-4000-8000-000000000006', 'eeee0000-0000-4000-8000-000000000003', 'Senior Manager, AI & Analytics', 'Katharina', 'Widmer', 'katharina.widmer@abb.com', NULL),
  ('ff000000-0000-4000-8000-000000000007', 'eeee0000-0000-4000-8000-000000000004', 'Head of Machine Learning Engineering', 'Marco', 'Bentivoglio', 'marco.bentivoglio@swisscom.com', 'Building and scaling Swisscom''s ML platform that serves millions of customers daily. Computer science background from USI, with stints at Google and a Zurich-based startup. I actively recruit master''s graduates and offer thesis collaborations.'),
  ('ff000000-0000-4000-8000-000000000008', 'eeee0000-0000-4000-8000-000000000004', 'Innovation Manager, Digital Business', 'Stephanie', 'Burger', 'stephanie.burger@swisscom.com', 'Managing Swisscom''s open innovation program, connecting startups and universities with our product teams. HSG alumna with a passion for digital ecosystems and platform business models.'),
  ('ff000000-0000-4000-8000-000000000009', 'eeee0000-0000-4000-8000-000000000005', 'Head of Data Analytics & AI', 'Patrick', 'Zollinger', 'patrick.zollinger@sbb.ch', 'Leading SBB''s data analytics and AI division, applying machine learning to optimize train scheduling, predictive maintenance, and passenger flow. ETH-trained engineer who transitioned into data science. Open to supervising student projects on mobility challenges.'),
  ('ff000000-0000-4000-8000-000000000010', 'eeee0000-0000-4000-8000-000000000005', 'Director of Sustainability & Environment', 'Annette', 'Grossenbacher', 'annette.grossenbacher@sbb.ch', NULL),
  ('ff000000-0000-4000-8000-000000000011', 'eeee0000-0000-4000-8000-000000000006', 'Chief Data Officer', 'Julian', 'Kraft', 'julian.kraft@swissre.com', 'As CDO at Swiss Re, I oversee data strategy, governance, and advanced analytics across our global reinsurance business. Previously led analytics at AXA and Allianz. Zurich MBA, actuarial background. Frequent guest lecturer at ETH and HSG.'),
  ('ff000000-0000-4000-8000-000000000012', 'eeee0000-0000-4000-8000-000000000006', 'Senior Underwriter, Climate Risk', 'Fabian', 'Roth', 'fabian.roth@swissre.com', NULL),
  ('ff000000-0000-4000-8000-000000000013', 'eeee0000-0000-4000-8000-000000000007', 'Head of InsurTech Innovation', 'Carolina', 'Meyer', 'carolina.meyer@zurich.com', 'Leading Zurich Insurance''s InsurTech innovation lab, scouting and integrating emerging technologies into our insurance value chain. Background in computer science and finance. I offer internship and thesis opportunities for motivated students.'),
  ('ff000000-0000-4000-8000-000000000014', 'eeee0000-0000-4000-8000-000000000007', 'VP Customer Experience & Analytics', 'Andreas', 'Locher', 'andreas.locher@zurich.com', NULL),
  ('ff000000-0000-4000-8000-000000000015', 'eeee0000-0000-4000-8000-000000000008', 'Director of AI in Drug Discovery', 'Rahel', 'Ammann', 'rahel.ammann@novartis.com', 'Directing AI-driven drug discovery programs at Novartis, where we apply deep learning and generative models to accelerate the identification of novel therapeutic candidates. PhD in computational chemistry from the University of Basel, postdoc at Stanford.'),
  ('ff000000-0000-4000-8000-000000000016', 'eeee0000-0000-4000-8000-000000000008', 'Global Head of Talent Acquisition', 'Dominik', 'Brunner', 'dominik.brunner@novartis.com', 'Leading Novartis''s global talent acquisition strategy, connecting the company with top scientific and business talent. I focus on building early-career pipelines through university partnerships and graduate programs.'),
  ('ff000000-0000-4000-8000-000000000017', 'eeee0000-0000-4000-8000-000000000009', 'Senior UX Research Manager', 'Yves', 'Chatagny', 'yves.chatagny@logitech.com', NULL),
  ('ff000000-0000-4000-8000-000000000018', 'eeee0000-0000-4000-8000-000000000009', 'Head of Sustainability Engineering', 'Nina', 'Pellegrini', 'nina.pellegrini@logitech.com', 'Responsible for integrating sustainability into Logitech''s product development lifecycle, from materials selection to end-of-life recycling. Mechanical engineering degree from EPFL, MBA from INSEAD. Passionate about circular design.'),
  ('ff000000-0000-4000-8000-000000000019', 'eeee0000-0000-4000-8000-000000000010', 'Director of Digital Construction', 'Reto', 'Huber', 'reto.huber@hilti.com', 'Leading Hilti''s digital construction initiatives, including BIM integration, IoT-connected tools, and AI-powered site management. Civil engineering background with 15 years in construction technology. Strong believer in applied research partnerships.'),
  ('ff000000-0000-4000-8000-000000000020', 'eeee0000-0000-4000-8000-000000000010', 'Innovation Manager', 'Lisa', 'Hartmann', 'lisa.hartmann@hilti.com', NULL),
  ('ff000000-0000-4000-8000-000000000021', 'eeee0000-0000-4000-8000-000000000011', 'Head of AI & Signal Processing', 'Christian', 'Moser', 'christian.moser@sonova.com', 'Leading the AI and signal processing team at Sonova, developing next-generation hearing aid algorithms. PhD in electrical engineering from ETH Zurich. My team regularly collaborates with university labs on auditory neuroscience and speech enhancement research.'),
  ('ff000000-0000-4000-8000-000000000022', 'eeee0000-0000-4000-8000-000000000011', 'Clinical Research Director', 'Sandra', 'Frei', 'sandra.frei@sonova.com', NULL),
  ('ff000000-0000-4000-8000-000000000023', 'eeee0000-0000-4000-8000-000000000012', 'Head of Process Innovation', 'Oliver', 'Kuster', 'oliver.kuster@buhlergroup.com', 'Driving process innovation at Buhler Group, where we develop technologies to make food production more efficient and sustainable. Mechanical engineering PhD from ETH, with expertise in thermal processing and grain milling. I supervise 2-3 student projects annually.'),
  ('ff000000-0000-4000-8000-000000000024', 'eeee0000-0000-4000-8000-000000000012', 'Digital Transformation Lead', 'Melanie', 'Steiner', 'melanie.steiner@buhlergroup.com', NULL),
  ('ff000000-0000-4000-8000-000000000025', 'eeee0000-0000-4000-8000-000000000013', 'VP of Product & Innovation', 'David', 'Allemann', 'david.allemann@on-running.com', 'Overseeing product development and innovation at On Running, from concept to market. I lead a team of 40+ engineers and designers creating performance footwear and apparel. Industrial design background, passionate about sustainable materials and biomechanics.'),
  ('ff000000-0000-4000-8000-000000000026', 'eeee0000-0000-4000-8000-000000000013', 'Head of Supply Chain Operations', 'Simone', 'Bachmann', 'simone.bachmann@on-running.com', 'Managing On Running''s global supply chain from sourcing to last-mile delivery. HSG supply chain management graduate with experience at Zalando and DHL. Focused on building resilient, sustainable supply networks for a fast-growing brand.'),
  ('ff000000-0000-4000-8000-000000000027', 'eeee0000-0000-4000-8000-000000000014', 'Head of Digital Commerce', 'Beat', 'Zahnd', 'beat.zahnd@migros.ch', 'Leading Migros''s digital commerce strategy, including e-grocery, marketplace development, and omnichannel integration. 10+ years in Swiss retail, previously at Coop and Digitec Galaxus. ETH computer science alumnus.'),
  ('ff000000-0000-4000-8000-000000000028', 'eeee0000-0000-4000-8000-000000000014', 'Sustainability Manager', 'Michela', 'Cavadini', 'michela.cavadini@migros.ch', NULL),
  ('ff000000-0000-4000-8000-000000000029', 'eeee0000-0000-4000-8000-000000000015', 'Chief Technology Officer', 'Lukas', 'Pfister', 'lukas.pfister@stadlerrail.com', 'CTO at Stadler Rail, responsible for technology strategy, R&D, and innovation. Mechanical engineering degree from ETH and 20 years in the rail industry. I lead our collaboration with Swiss universities on lightweight materials, energy efficiency, and autonomous rail systems.'),
  ('ff000000-0000-4000-8000-000000000030', 'eeee0000-0000-4000-8000-000000000015', 'Head of HR & Early Careers', 'Eva', 'Wenger', 'eva.wenger@stadlerrail.com', NULL);

-- expert_fields
INSERT INTO expert_fields (expert_id, field_id) VALUES
  ('ff000000-0000-4000-8000-000000000001', 'bbbb0000-0000-4000-8000-000000000002'),
  ('ff000000-0000-4000-8000-000000000001', 'bbbb0000-0000-4000-8000-000000000003'),
  ('ff000000-0000-4000-8000-000000000002', 'bbbb0000-0000-4000-8000-000000000008'),
  ('ff000000-0000-4000-8000-000000000002', 'bbbb0000-0000-4000-8000-000000000007'),
  ('ff000000-0000-4000-8000-000000000003', 'bbbb0000-0000-4000-8000-000000000011'),
  ('ff000000-0000-4000-8000-000000000003', 'bbbb0000-0000-4000-8000-000000000012'),
  ('ff000000-0000-4000-8000-000000000004', 'bbbb0000-0000-4000-8000-000000000012'),
  ('ff000000-0000-4000-8000-000000000004', 'bbbb0000-0000-4000-8000-000000000003'),
  ('ff000000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000009'),
  ('ff000000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000010'),
  ('ff000000-0000-4000-8000-000000000006', 'bbbb0000-0000-4000-8000-000000000003'),
  ('ff000000-0000-4000-8000-000000000006', 'bbbb0000-0000-4000-8000-000000000002'),
  ('ff000000-0000-4000-8000-000000000007', 'bbbb0000-0000-4000-8000-000000000001'),
  ('ff000000-0000-4000-8000-000000000007', 'bbbb0000-0000-4000-8000-000000000003'),
  ('ff000000-0000-4000-8000-000000000008', 'bbbb0000-0000-4000-8000-000000000004'),
  ('ff000000-0000-4000-8000-000000000008', 'bbbb0000-0000-4000-8000-000000000015'),
  ('ff000000-0000-4000-8000-000000000009', 'bbbb0000-0000-4000-8000-000000000002'),
  ('ff000000-0000-4000-8000-000000000009', 'bbbb0000-0000-4000-8000-000000000001'),
  ('ff000000-0000-4000-8000-000000000010', 'bbbb0000-0000-4000-8000-000000000008'),
  ('ff000000-0000-4000-8000-000000000010', 'bbbb0000-0000-4000-8000-000000000017'),
  ('ff000000-0000-4000-8000-000000000011', 'bbbb0000-0000-4000-8000-000000000002'),
  ('ff000000-0000-4000-8000-000000000011', 'bbbb0000-0000-4000-8000-000000000005'),
  ('ff000000-0000-4000-8000-000000000012', 'bbbb0000-0000-4000-8000-000000000005'),
  ('ff000000-0000-4000-8000-000000000012', 'bbbb0000-0000-4000-8000-000000000017'),
  ('ff000000-0000-4000-8000-000000000013', 'bbbb0000-0000-4000-8000-000000000005'),
  ('ff000000-0000-4000-8000-000000000013', 'bbbb0000-0000-4000-8000-000000000001'),
  ('ff000000-0000-4000-8000-000000000014', 'bbbb0000-0000-4000-8000-000000000006'),
  ('ff000000-0000-4000-8000-000000000014', 'bbbb0000-0000-4000-8000-000000000002'),
  ('ff000000-0000-4000-8000-000000000015', 'bbbb0000-0000-4000-8000-000000000003'),
  ('ff000000-0000-4000-8000-000000000015', 'bbbb0000-0000-4000-8000-000000000011'),
  ('ff000000-0000-4000-8000-000000000016', 'bbbb0000-0000-4000-8000-000000000004'),
  ('ff000000-0000-4000-8000-000000000016', 'bbbb0000-0000-4000-8000-000000000012'),
  ('ff000000-0000-4000-8000-000000000017', 'bbbb0000-0000-4000-8000-000000000016'),
  ('ff000000-0000-4000-8000-000000000017', 'bbbb0000-0000-4000-8000-000000000018'),
  ('ff000000-0000-4000-8000-000000000018', 'bbbb0000-0000-4000-8000-000000000008'),
  ('ff000000-0000-4000-8000-000000000018', 'bbbb0000-0000-4000-8000-000000000009'),
  ('ff000000-0000-4000-8000-000000000019', 'bbbb0000-0000-4000-8000-000000000001'),
  ('ff000000-0000-4000-8000-000000000019', 'bbbb0000-0000-4000-8000-000000000018'),
  ('ff000000-0000-4000-8000-000000000020', 'bbbb0000-0000-4000-8000-000000000009'),
  ('ff000000-0000-4000-8000-000000000020', 'bbbb0000-0000-4000-8000-000000000004'),
  ('ff000000-0000-4000-8000-000000000021', 'bbbb0000-0000-4000-8000-000000000010'),
  ('ff000000-0000-4000-8000-000000000021', 'bbbb0000-0000-4000-8000-000000000003'),
  ('ff000000-0000-4000-8000-000000000022', 'bbbb0000-0000-4000-8000-000000000012'),
  ('ff000000-0000-4000-8000-000000000022', 'bbbb0000-0000-4000-8000-000000000016'),
  ('ff000000-0000-4000-8000-000000000023', 'bbbb0000-0000-4000-8000-000000000009'),
  ('ff000000-0000-4000-8000-000000000023', 'bbbb0000-0000-4000-8000-000000000008'),
  ('ff000000-0000-4000-8000-000000000024', 'bbbb0000-0000-4000-8000-000000000001'),
  ('ff000000-0000-4000-8000-000000000024', 'bbbb0000-0000-4000-8000-000000000004'),
  ('ff000000-0000-4000-8000-000000000025', 'bbbb0000-0000-4000-8000-000000000018'),
  ('ff000000-0000-4000-8000-000000000025', 'bbbb0000-0000-4000-8000-000000000008'),
  ('ff000000-0000-4000-8000-000000000026', 'bbbb0000-0000-4000-8000-000000000007'),
  ('ff000000-0000-4000-8000-000000000027', 'bbbb0000-0000-4000-8000-000000000001'),
  ('ff000000-0000-4000-8000-000000000027', 'bbbb0000-0000-4000-8000-000000000006'),
  ('ff000000-0000-4000-8000-000000000028', 'bbbb0000-0000-4000-8000-000000000008'),
  ('ff000000-0000-4000-8000-000000000029', 'bbbb0000-0000-4000-8000-000000000009'),
  ('ff000000-0000-4000-8000-000000000029', 'bbbb0000-0000-4000-8000-000000000010'),
  ('ff000000-0000-4000-8000-000000000030', 'bbbb0000-0000-4000-8000-000000000004'),
  ('ff000000-0000-4000-8000-000000000030', 'bbbb0000-0000-4000-8000-000000000019');

-- topics
INSERT INTO topics (id, title, description, type, status, company_id, university_id, location_city, remote_ok, duration_months, paid, nda_required, publish_allowed) VALUES
  ('10100000-0000-4000-8000-000000000001', 'AI-Driven Demand Forecasting for Perishable Goods', 'Develop a machine learning model to predict demand for short-shelf-life products across Nestle''s European distribution network. The thesis should explore how weather, seasonal trends, and promotional calendars can be integrated into a unified forecasting pipeline. Accuracy improvements of even a few percent translate into millions of francs in reduced food waste.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000001', NULL, NULL, true, 6, NULL, false, true),
  ('10100000-0000-4000-8000-000000000002', 'Circular Packaging Design Assessment Framework', 'Create a quantitative framework for evaluating the environmental impact of alternative packaging materials across Nestle''s product lines. The student will compare lifecycle assessments of bio-based plastics, paper composites, and reusable container systems. Results should feed into the company''s 2030 sustainability roadmap.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000001', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000003', 'Biomarker Discovery Using Multi-Omics Data Integration', 'Apply computational biology methods to integrate transcriptomic, proteomic, and metabolomic datasets for identifying novel biomarkers in oncology. The project will leverage Roche''s proprietary clinical datasets and open-source bioinformatics tools. A successful thesis could contribute to early-stage drug target validation.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000002', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000004', 'Wearable-Based Patient Monitoring for Clinical Trials', 'Design and evaluate a digital health pipeline that ingests data from consumer wearables to generate clinically meaningful endpoints for decentralized clinical trials. The thesis should address signal quality, data privacy, and regulatory requirements under EU MDR.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000002', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000005', 'Digital Twin for Collaborative Robot Work Cells', 'Build a simulation-based digital twin of a collaborative robot work cell using ABB''s RobotStudio platform. The thesis will explore how real-time sensor feedback can calibrate the twin and predict maintenance needs. The outcome should be a demonstrable prototype for predictive maintenance scheduling.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000003', NULL, NULL, false, 6, NULL, false, true),
  ('10100000-0000-4000-8000-000000000006', 'Edge AI for Industrial Quality Inspection', 'Develop and benchmark computer vision models that can run on edge devices for real-time quality inspection in manufacturing environments. The student will compare inference speed and accuracy of lightweight architectures deployed on ABB''s industrial edge hardware. Energy efficiency and explainability are key evaluation criteria.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000003', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000007', 'Federated Learning for Telecom Network Optimization', 'Investigate how federated learning can be applied to optimize Swisscom''s mobile network without centralizing sensitive user data. The thesis should design a privacy-preserving ML pipeline that improves network resource allocation while complying with Swiss data protection law.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000004', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000008', 'Platform Ecosystem Strategy for Swiss SME Digitalization', 'Analyze how Swisscom can design a digital platform ecosystem to accelerate digitalization among Swiss SMEs. The student will conduct case studies, expert interviews, and a conjoint analysis to identify which bundled services drive adoption and long-term platform engagement.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000004', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000009', 'Predictive Maintenance for Rolling Stock Using IoT Data', 'Design a predictive maintenance model for SBB train bogies using sensor telemetry from onboard IoT systems. The thesis should evaluate different anomaly detection approaches and estimate potential cost savings compared to current schedule-based maintenance regimes.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000005', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000010', 'Carbon Footprint Optimization of Swiss Rail Freight', 'Develop a decision-support tool that optimizes routing and scheduling of SBB freight operations to minimize carbon emissions. The model should consider electrification status, load factors, and intermodal transfer points across the Swiss rail network.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000005', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000011', 'Climate Risk Modeling with Alternative Data Sources', 'Explore how satellite imagery, social media signals, and IoT sensor networks can augment traditional actuarial models for climate-related catastrophe risk at Swiss Re. The thesis should prototype a data fusion pipeline and benchmark it against existing nat-cat models.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000006', NULL, NULL, true, 6, NULL, false, true),
  ('10100000-0000-4000-8000-000000000012', 'Parametric Insurance Products for Agricultural Climate Risk', 'Design a parametric insurance product for Swiss and European farmers exposed to drought and frost events. The student will model payout triggers using weather index data and assess basis risk. The thesis contributes to Swiss Re''s emerging markets strategy for climate adaptation.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000006', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000013', 'InsurTech Adoption Barriers Among Swiss Consumers', 'Investigate why Swiss consumers are slow to adopt digital insurance products compared to other European markets. The thesis will combine a large-scale survey with behavioral experiments to identify trust barriers and design interventions that increase digital insurance uptake.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000007', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000014', 'Personalized Customer Journey Analytics in Insurance', 'Build a customer segmentation and journey analytics engine for Zurich Insurance''s retail business. The model should identify churn signals, cross-sell opportunities, and optimal touchpoints using transactional and behavioral data from multiple channels.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000007', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000015', 'Generative Models for Molecular Lead Optimization', 'Apply generative AI techniques to optimize lead compounds in Novartis''s oncology pipeline. The thesis should compare variational autoencoders, diffusion models, and reinforcement learning approaches for generating molecules with improved binding affinity and ADMET properties.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000008', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000016', 'Employer Branding Effectiveness in Life Sciences Recruiting', 'Measure the impact of Novartis''s employer branding initiatives on attracting early-career talent in competitive life sciences markets. The student will analyze recruitment funnel data, run A/B tests on messaging, and benchmark against pharma industry peers.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000008', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000017', 'User Experience Research on Ergonomic Input Devices', 'Conduct a mixed-methods UX study to evaluate the ergonomic impact of Logitech''s next-generation mice and keyboards on long-term user comfort. The thesis should combine biomechanical measurements with longitudinal user diaries and propose evidence-based design recommendations.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000009', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000018', 'Lifecycle Assessment of Recycled Plastics in Consumer Electronics', 'Perform a comparative lifecycle assessment of post-consumer recycled plastics versus virgin materials used in Logitech products. The thesis should quantify carbon, water, and toxicity impacts across the value chain and identify breakeven points for scaling recycled content.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000009', NULL, NULL, false, 6, NULL, false, true),
  ('10100000-0000-4000-8000-000000000019', 'BIM-Integrated IoT Platform for Construction Site Monitoring', 'Design an IoT data platform that integrates with Building Information Modeling (BIM) systems to enable real-time monitoring of construction progress and tool utilization at Hilti customer sites. The prototype should demonstrate automated progress tracking and resource optimization.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000010', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000020', 'Lean Innovation Processes in Construction Tool Manufacturing', 'Analyze how lean startup principles can be adapted to accelerate innovation cycles in Hilti''s power tools division. The student will map current stage-gate processes, identify bottlenecks, and propose a hybrid framework validated through pilot projects with product teams.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000010', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000021', 'Deep Learning for Personalized Hearing Aid Fitting', 'Develop a deep learning model that personalizes hearing aid settings based on audiometric profiles, listening environments, and user preferences. The thesis should leverage Sonova''s clinical data to train and validate the model, aiming to reduce the number of fitting sessions needed.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000011', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000022', 'Patient-Reported Outcomes in Hearing Rehabilitation', 'Design and validate a digital patient-reported outcome measure (PROM) for tracking hearing rehabilitation progress over time. The thesis should review existing instruments, conduct psychometric analysis, and pilot the digital tool with Sonova clinic patients.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000011', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000023', 'Energy-Efficient Grain Drying Using Process Simulation', 'Model and optimize the energy consumption of industrial grain drying processes using computational fluid dynamics and process simulation tools. The thesis should propose modifications to Buhler''s existing dryer designs that reduce energy use by at least 15% without compromising grain quality.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000012', NULL, NULL, false, 6, NULL, false, true),
  ('10100000-0000-4000-8000-000000000024', 'Digital Supply Chain Visibility for Food Processing', 'Develop a proof-of-concept digital supply chain visibility platform for Buhler''s food processing customers. The thesis should evaluate blockchain, IoT, and cloud architectures for tracing raw materials from farm to factory and assess adoption barriers among mid-size food manufacturers.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000012', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000025', 'Biomechanical Performance Testing of Running Shoe Midsoles', 'Conduct a systematic biomechanical comparison of On Running''s CloudTec midsole technology against competitor designs using motion capture, force plate analysis, and metabolic testing. The thesis should yield quantitative performance benchmarks and design improvement recommendations.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000013', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000026', 'Resilient Supply Chain Network Design for Fast-Growing DTC Brands', 'Model and optimize On Running''s direct-to-consumer supply chain network to improve resilience against disruptions. The student will use network optimization tools to evaluate warehouse placement, dual-sourcing strategies, and last-mile delivery options across European and North American markets.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000013', NULL, NULL, true, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000027', 'Recommendation Engine for Omnichannel Grocery Retail', 'Design and prototype a product recommendation engine that works seamlessly across Migros''s online shop, mobile app, and in-store digital touchpoints. The thesis should explore hybrid collaborative-content filtering approaches and evaluate their impact on basket size and customer satisfaction.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000014', NULL, NULL, true, 6, NULL, false, true),
  ('10100000-0000-4000-8000-000000000028', 'Scope 3 Emissions Measurement in Swiss Retail Supply Chains', 'Develop a practical methodology for measuring and reporting Scope 3 greenhouse gas emissions across Migros''s supply chain. The thesis should evaluate data collection strategies, emission factor databases, and reporting frameworks, with a pilot on three product categories.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000014', NULL, NULL, false, 6, false, false, true),
  ('10100000-0000-4000-8000-000000000029', 'Lightweight Composite Materials for Next-Generation Train Bodies', 'Investigate the feasibility of carbon-fiber-reinforced polymer composites for structural components in Stadler Rail''s regional train bodies. The thesis should compare weight savings, crash performance, and manufacturing cost against current aluminum designs using FEA simulations and material testing.', 'topic', 'open', 'eeee0000-0000-4000-8000-000000000015', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000030', 'Graduate Talent Pipeline Strategy for Swiss Rail Manufacturing', 'Analyze Stadler Rail''s current graduate recruitment funnel and design an improved early-career talent strategy. The student will benchmark against European engineering competitors, conduct alumni surveys, and propose a data-driven approach to campus recruitment and employer branding.', 'job', 'open', 'eeee0000-0000-4000-8000-000000000015', NULL, NULL, false, 6, true, false, true),
  ('10100000-0000-4000-8000-000000000031', 'Formal Verification of Neural Network Robustness', 'Develop scalable formal methods for verifying the robustness of deep neural networks against adversarial perturbations. The thesis will extend existing abstract interpretation techniques to handle transformer architectures, with evaluation on safety-critical applications in autonomous systems.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000001', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000032', 'Multi-Physics Simulation for Additive Manufacturing of Metal Parts', 'Create a coupled thermal-mechanical simulation framework for predicting residual stresses and distortion in laser powder bed fusion of titanium alloys. The thesis will validate the model against experimental measurements and demonstrate its use in optimizing build orientations.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000001', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000033', 'Privacy-Preserving Analytics for Health Data Sharing', 'Design and implement a differential privacy framework that enables secure sharing of patient health records for research purposes. The thesis should evaluate the utility-privacy tradeoff across different medical datasets and propose practical deployment guidelines for Swiss hospitals.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000002', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000034', 'Machine Learning for De Novo Protein Design', 'Apply deep generative models to design novel protein sequences with targeted functional properties. The thesis will train models on protein structure databases and validate computational designs through molecular dynamics simulations, with potential for experimental validation in the lab.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000002', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000035', 'Carbon Pricing Mechanisms and Corporate Decarbonization in Switzerland', 'Analyze the effectiveness of current Swiss carbon pricing instruments in driving corporate emission reductions. The thesis will combine econometric analysis of firm-level data with qualitative case studies of companies in the ETS and voluntary offset markets.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000002', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000036', 'Consumer Trust in Autonomous Vehicle Services', 'Investigate the factors that drive or inhibit consumer trust in autonomous mobility services in Swiss cities. The thesis will use a combination of conjoint analysis, eye-tracking experiments, and focus groups to understand how service design features affect willingness to adopt.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000003', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000037', 'AI Ethics Governance Frameworks for European Media Organizations', 'Develop a practical governance framework for the ethical deployment of AI in newsrooms and media companies. The thesis should review existing guidelines, interview media professionals across Europe, and propose an actionable compliance toolkit aligned with the EU AI Act.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000003', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000038', 'Last-Mile Logistics Optimization for Swiss E-Commerce', 'Model and optimize last-mile delivery networks for Swiss e-commerce using vehicle routing algorithms and real-time demand data. The thesis should evaluate the impact of micro-fulfillment centers, cargo bikes, and time-window constraints on delivery cost and carbon footprint.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000003', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000039', 'Knowledge Graph Construction from Unstructured Scientific Literature', 'Build an automated pipeline for extracting entities and relationships from scientific publications to construct domain-specific knowledge graphs. The thesis will evaluate large language models for information extraction and measure graph quality against expert-curated benchmarks.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000004', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000040', 'Nudging Sustainable Financial Decisions Among Young Adults', 'Design and test behavioral nudges that encourage sustainable investment choices among Swiss young adults. The thesis will run a randomized controlled trial using a simulated investment platform, measuring how different information framings affect ESG fund allocation decisions.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000004', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000041', 'Public Opinion Dynamics on Swiss Energy Transition Policies', 'Analyze how public opinion on energy transition policies evolves in response to extreme weather events and energy price shocks. The thesis will combine longitudinal survey data with media content analysis to identify causal mechanisms driving opinion shifts in Swiss direct democracy.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000005', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000042', 'Ice Core Records of Anthropogenic Aerosol Deposition in the Alps', 'Analyze high-resolution ice core data from Alpine glaciers to reconstruct the history of industrial aerosol deposition over the past 200 years. The thesis will use chemical tracers to distinguish natural and anthropogenic sources and assess implications for regional climate forcing.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000005', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000043', 'AlphaFold-Based Drug Target Validation Pipeline', 'Build an automated computational pipeline that uses AlphaFold-predicted protein structures to prioritize and validate potential drug targets. The thesis should integrate structural analysis with binding site prediction and druggability scoring for targets in neglected tropical diseases.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000006', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000044', 'Health Economic Evaluation of Gene Therapies in Switzerland', 'Conduct a cost-effectiveness analysis of emerging gene therapies for rare diseases within the Swiss healthcare system. The thesis should model long-term outcomes, compare reimbursement scenarios, and assess the budgetary impact on mandatory health insurance.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000006', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000045', 'Open Innovation Practices in Swiss Deep-Tech Startups', 'Investigate how Swiss deep-tech startups manage open innovation partnerships with universities and corporations. The thesis will conduct multiple case studies, analyze IP management strategies, and identify success factors for collaborative R&D in highly technical domains.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000006', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000046', 'Multilingual Sentiment Analysis for Swiss Public Discourse', 'Develop and evaluate a multilingual sentiment analysis system capable of handling German, French, Italian, and Romansh text from Swiss news and social media. The thesis should compare fine-tuned transformer models with few-shot prompting approaches and analyze sentiment trends on political topics.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000007', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000047', 'Industry 4.0 Maturity Assessment for Swiss Manufacturing SMEs', 'Develop a diagnostic tool that assesses the Industry 4.0 maturity level of Swiss manufacturing SMEs. The thesis should define maturity dimensions, validate the assessment instrument through pilot studies, and create a roadmap template for digital transformation in production.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000007', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000048', 'IT Governance Frameworks for Hybrid Cloud Adoption in Swiss Enterprises', 'Analyze how Swiss enterprises adapt their IT governance frameworks when migrating to hybrid cloud architectures. The thesis should conduct expert interviews with CIOs, review governance maturity models, and propose an updated framework that balances agility with compliance requirements.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000007', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000049', 'Time-Series Anomaly Detection for Smart Building Energy Systems', 'Design and evaluate anomaly detection algorithms for identifying energy waste patterns in smart building sensor data. The thesis should compare statistical, machine learning, and deep learning approaches on real building datasets, with a focus on false alarm rates and interpretability.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000008', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000050', 'Cobotic Assembly System Design for Swiss Watchmaking', 'Design a collaborative robotic assembly system for precision tasks in Swiss watchmaking. The thesis will evaluate cobot-human interaction paradigms, develop force-control strategies for delicate component handling, and prototype a demonstration cell for a specific assembly operation.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000008', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000051', 'Data-Driven Attribution Modeling for Multi-Channel Retail Marketing', 'Develop a data-driven marketing attribution model that accurately allocates credit across online and offline channels for Swiss retailers. The thesis should compare algorithmic approaches, implement a prototype using real campaign data, and assess the impact on marketing budget allocation decisions.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000008', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000052', 'Developer Experience Metrics for CI/CD Pipeline Optimization', 'Define and validate a set of developer experience metrics that can guide the optimization of CI/CD pipelines. The thesis should instrument real software teams, collect quantitative and qualitative data, and identify which pipeline characteristics have the strongest impact on developer productivity.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000009', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000053', 'Optimal Battery Storage Sizing for Alpine Microgrid Communities', 'Model and optimize battery energy storage systems for off-grid Alpine communities that rely on a mix of solar, small hydro, and wind generation. The thesis should simulate year-round scenarios, account for seasonal demand variation, and perform techno-economic sensitivity analysis.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000009', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000054', 'Privacy-Aware Smart Home Interaction Design', 'Explore user perceptions of privacy in smart home environments and design interaction paradigms that give users meaningful control over their data. The thesis should combine design science methodology with user studies to create and evaluate privacy-enhancing interface prototypes.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000010', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000055', 'Health Misinformation Detection on Italian-Language Social Media', 'Develop an NLP-based system for detecting health misinformation in Italian-language social media posts. The thesis should create a labeled dataset, train and evaluate classification models, and analyze the spread patterns of misinformation during recent health events in Ticino and Italy.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000010', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000056', 'Topology Optimization Under Uncertainty for Aerospace Structures', 'Extend topology optimization methods to account for manufacturing uncertainties and loading variability in aerospace structural components. The thesis will implement robust formulations in an open-source FEA framework and compare deterministic versus probabilistic designs for weight and reliability.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000001', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000057', 'Citizen Attitudes Toward Direct Democratic Instruments in Climate Policy', 'Survey and analyze Swiss citizens'' preferences for different direct democratic instruments (referenda, popular initiatives, citizens'' assemblies) in shaping climate policy. The thesis will use a choice experiment design and link attitudes to political ideology and personal climate risk perception.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000005', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000058', 'Pharmaceutical Supply Chain Disruption Risk Assessment', 'Develop a quantitative risk assessment framework for pharmaceutical supply chain disruptions affecting the Swiss market. The thesis should model disruption scenarios, evaluate mitigation strategies such as safety stock and dual sourcing, and estimate the public health impact of prolonged drug shortages.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000006', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000059', 'Computer Vision for Automated Quality Control in Precision Manufacturing', 'Develop a computer vision system for automated visual inspection of precision-manufactured components. The thesis should evaluate transfer learning, few-shot learning, and active learning strategies to handle the typically small defect datasets found in specialized Swiss manufacturing.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000008', NULL, false, NULL, false, false, true),
  ('10100000-0000-4000-8000-000000000060', 'Grid Integration Challenges for Vehicle-to-Grid Technology in Switzerland', 'Analyze the technical and regulatory challenges of deploying vehicle-to-grid (V2G) technology in Switzerland''s electricity grid. The thesis should simulate V2G scenarios with different EV adoption rates, assess grid stability impacts, and propose regulatory recommendations for Swiss energy policy.', 'topic', 'open', NULL, 'aaaa0000-0000-4000-8000-000000000009', NULL, false, NULL, false, false, true);

-- topic_fields
INSERT INTO topic_fields (topic_id, field_id) VALUES
  ('10100000-0000-4000-8000-000000000001', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000001', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000002', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000002', 'bbbb0000-0000-4000-8000-000000000007'),
  ('10100000-0000-4000-8000-000000000003', 'bbbb0000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000003', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000004', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000004', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000005', 'bbbb0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000006', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000006', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000007', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000007', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000008', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000008', 'bbbb0000-0000-4000-8000-000000000015'),
  ('10100000-0000-4000-8000-000000000009', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000009', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000010', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000010', 'bbbb0000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000011', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000011', 'bbbb0000-0000-4000-8000-000000000005'),
  ('10100000-0000-4000-8000-000000000012', 'bbbb0000-0000-4000-8000-000000000005'),
  ('10100000-0000-4000-8000-000000000012', 'bbbb0000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000013', 'bbbb0000-0000-4000-8000-000000000005'),
  ('10100000-0000-4000-8000-000000000013', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000014', 'bbbb0000-0000-4000-8000-000000000006'),
  ('10100000-0000-4000-8000-000000000014', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000015', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000015', 'bbbb0000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000016', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000016', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000017', 'bbbb0000-0000-4000-8000-000000000016'),
  ('10100000-0000-4000-8000-000000000017', 'bbbb0000-0000-4000-8000-000000000018'),
  ('10100000-0000-4000-8000-000000000018', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000018', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000019', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000019', 'bbbb0000-0000-4000-8000-000000000018'),
  ('10100000-0000-4000-8000-000000000020', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000020', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000021', 'bbbb0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000021', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000022', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000022', 'bbbb0000-0000-4000-8000-000000000016'),
  ('10100000-0000-4000-8000-000000000023', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000023', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000024', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000024', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000025', 'bbbb0000-0000-4000-8000-000000000018'),
  ('10100000-0000-4000-8000-000000000025', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000026', 'bbbb0000-0000-4000-8000-000000000007'),
  ('10100000-0000-4000-8000-000000000027', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000027', 'bbbb0000-0000-4000-8000-000000000006'),
  ('10100000-0000-4000-8000-000000000028', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000029', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000029', 'bbbb0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000030', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000030', 'bbbb0000-0000-4000-8000-000000000019'),
  ('10100000-0000-4000-8000-000000000031', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000031', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000032', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000032', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000033', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000033', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000034', 'bbbb0000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000034', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000035', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000035', 'bbbb0000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000035', 'bbbb0000-0000-4000-8000-000000000013'),
  ('10100000-0000-4000-8000-000000000036', 'bbbb0000-0000-4000-8000-000000000006'),
  ('10100000-0000-4000-8000-000000000036', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000037', 'bbbb0000-0000-4000-8000-000000000015'),
  ('10100000-0000-4000-8000-000000000037', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000038', 'bbbb0000-0000-4000-8000-000000000007'),
  ('10100000-0000-4000-8000-000000000038', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000039', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000039', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000040', 'bbbb0000-0000-4000-8000-000000000013'),
  ('10100000-0000-4000-8000-000000000040', 'bbbb0000-0000-4000-8000-000000000016'),
  ('10100000-0000-4000-8000-000000000041', 'bbbb0000-0000-4000-8000-000000000020'),
  ('10100000-0000-4000-8000-000000000041', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000042', 'bbbb0000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000042', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000043', 'bbbb0000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000043', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000044', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000044', 'bbbb0000-0000-4000-8000-000000000013'),
  ('10100000-0000-4000-8000-000000000045', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000045', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000046', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000046', 'bbbb0000-0000-4000-8000-000000000015'),
  ('10100000-0000-4000-8000-000000000047', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000047', 'bbbb0000-0000-4000-8000-000000000007'),
  ('10100000-0000-4000-8000-000000000048', 'bbbb0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000048', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000049', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000049', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000050', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000050', 'bbbb0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000051', 'bbbb0000-0000-4000-8000-000000000006'),
  ('10100000-0000-4000-8000-000000000051', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000052', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000053', 'bbbb0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000053', 'bbbb0000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000054', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000054', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000055', 'bbbb0000-0000-4000-8000-000000000015'),
  ('10100000-0000-4000-8000-000000000055', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000056', 'bbbb0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000056', 'bbbb0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000057', 'bbbb0000-0000-4000-8000-000000000020'),
  ('10100000-0000-4000-8000-000000000057', 'bbbb0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000058', 'bbbb0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000058', 'bbbb0000-0000-4000-8000-000000000013'),
  ('10100000-0000-4000-8000-000000000059', 'bbbb0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000059', 'bbbb0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000060', 'bbbb0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000060', 'bbbb0000-0000-4000-8000-000000000017');

-- topic_supervisors
INSERT INTO topic_supervisors (topic_id, supervisor_id) VALUES
  ('10100000-0000-4000-8000-000000000031', 'dddd0000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000032', 'dddd0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000033', 'dddd0000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000034', 'dddd0000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000035', 'dddd0000-0000-4000-8000-000000000005'),
  ('10100000-0000-4000-8000-000000000036', 'dddd0000-0000-4000-8000-000000000006'),
  ('10100000-0000-4000-8000-000000000037', 'dddd0000-0000-4000-8000-000000000007'),
  ('10100000-0000-4000-8000-000000000038', 'dddd0000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000039', 'dddd0000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000040', 'dddd0000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000041', 'dddd0000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000042', 'dddd0000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000043', 'dddd0000-0000-4000-8000-000000000013'),
  ('10100000-0000-4000-8000-000000000044', 'dddd0000-0000-4000-8000-000000000014'),
  ('10100000-0000-4000-8000-000000000045', 'dddd0000-0000-4000-8000-000000000015'),
  ('10100000-0000-4000-8000-000000000046', 'dddd0000-0000-4000-8000-000000000016'),
  ('10100000-0000-4000-8000-000000000047', 'dddd0000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000048', 'dddd0000-0000-4000-8000-000000000018'),
  ('10100000-0000-4000-8000-000000000049', 'dddd0000-0000-4000-8000-000000000019'),
  ('10100000-0000-4000-8000-000000000050', 'dddd0000-0000-4000-8000-000000000020'),
  ('10100000-0000-4000-8000-000000000051', 'dddd0000-0000-4000-8000-000000000021'),
  ('10100000-0000-4000-8000-000000000052', 'dddd0000-0000-4000-8000-000000000022'),
  ('10100000-0000-4000-8000-000000000053', 'dddd0000-0000-4000-8000-000000000023'),
  ('10100000-0000-4000-8000-000000000054', 'dddd0000-0000-4000-8000-000000000024'),
  ('10100000-0000-4000-8000-000000000055', 'dddd0000-0000-4000-8000-000000000025'),
  ('10100000-0000-4000-8000-000000000056', 'dddd0000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000057', 'dddd0000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000058', 'dddd0000-0000-4000-8000-000000000014'),
  ('10100000-0000-4000-8000-000000000059', 'dddd0000-0000-4000-8000-000000000019'),
  ('10100000-0000-4000-8000-000000000060', 'dddd0000-0000-4000-8000-000000000023');

-- topic_experts
INSERT INTO topic_experts (topic_id, expert_id) VALUES
  ('10100000-0000-4000-8000-000000000001', 'ff000000-0000-4000-8000-000000000001'),
  ('10100000-0000-4000-8000-000000000002', 'ff000000-0000-4000-8000-000000000002'),
  ('10100000-0000-4000-8000-000000000003', 'ff000000-0000-4000-8000-000000000003'),
  ('10100000-0000-4000-8000-000000000004', 'ff000000-0000-4000-8000-000000000004'),
  ('10100000-0000-4000-8000-000000000005', 'ff000000-0000-4000-8000-000000000005'),
  ('10100000-0000-4000-8000-000000000006', 'ff000000-0000-4000-8000-000000000006'),
  ('10100000-0000-4000-8000-000000000007', 'ff000000-0000-4000-8000-000000000007'),
  ('10100000-0000-4000-8000-000000000008', 'ff000000-0000-4000-8000-000000000008'),
  ('10100000-0000-4000-8000-000000000009', 'ff000000-0000-4000-8000-000000000009'),
  ('10100000-0000-4000-8000-000000000010', 'ff000000-0000-4000-8000-000000000010'),
  ('10100000-0000-4000-8000-000000000011', 'ff000000-0000-4000-8000-000000000011'),
  ('10100000-0000-4000-8000-000000000012', 'ff000000-0000-4000-8000-000000000012'),
  ('10100000-0000-4000-8000-000000000013', 'ff000000-0000-4000-8000-000000000013'),
  ('10100000-0000-4000-8000-000000000014', 'ff000000-0000-4000-8000-000000000014'),
  ('10100000-0000-4000-8000-000000000015', 'ff000000-0000-4000-8000-000000000015'),
  ('10100000-0000-4000-8000-000000000016', 'ff000000-0000-4000-8000-000000000016'),
  ('10100000-0000-4000-8000-000000000017', 'ff000000-0000-4000-8000-000000000017'),
  ('10100000-0000-4000-8000-000000000018', 'ff000000-0000-4000-8000-000000000018'),
  ('10100000-0000-4000-8000-000000000019', 'ff000000-0000-4000-8000-000000000019'),
  ('10100000-0000-4000-8000-000000000020', 'ff000000-0000-4000-8000-000000000020'),
  ('10100000-0000-4000-8000-000000000021', 'ff000000-0000-4000-8000-000000000021'),
  ('10100000-0000-4000-8000-000000000022', 'ff000000-0000-4000-8000-000000000022'),
  ('10100000-0000-4000-8000-000000000023', 'ff000000-0000-4000-8000-000000000023'),
  ('10100000-0000-4000-8000-000000000024', 'ff000000-0000-4000-8000-000000000024'),
  ('10100000-0000-4000-8000-000000000025', 'ff000000-0000-4000-8000-000000000025'),
  ('10100000-0000-4000-8000-000000000026', 'ff000000-0000-4000-8000-000000000026'),
  ('10100000-0000-4000-8000-000000000027', 'ff000000-0000-4000-8000-000000000027'),
  ('10100000-0000-4000-8000-000000000028', 'ff000000-0000-4000-8000-000000000028'),
  ('10100000-0000-4000-8000-000000000029', 'ff000000-0000-4000-8000-000000000029'),
  ('10100000-0000-4000-8000-000000000030', 'ff000000-0000-4000-8000-000000000030');

-- ================================================================
-- students + thesis_projects require auth.users to exist first.
-- Use scripts/seed-students.ts (Supabase Admin API) to create
-- demo auth users + matching students rows.
-- ================================================================

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


-- Fill deterministic source IDs for seed rows if missing.
update public.universities set source_id = public.make_source_id('uni', id) where source_id is null;
update public.fields set source_id = public.make_source_id('field', id) where source_id is null;
update public.study_programs set source_id = public.make_source_id('program', id) where source_id is null;
update public.companies set source_id = public.make_source_id('company', id) where source_id is null;
update public.supervisors set source_id = public.make_source_id('supervisor', id) where source_id is null;
update public.experts set source_id = public.make_source_id('expert', id) where source_id is null;
update public.topics set source_id = public.make_source_id('topic', id) where source_id is null;

-- Build topic search text payload used for embeddings/matching.
select public.refresh_topic_search_documents();

-- Data shape verification expected by the Thesinator matching pipeline.
do $$
declare
  v_count integer;
begin
  select count(*) into v_count from public.universities;
  if v_count <> 10 then raise exception 'seed check failed: universities %, expected 10', v_count; end if;

  select count(*) into v_count from public.fields;
  if v_count <> 20 then raise exception 'seed check failed: fields %, expected 20', v_count; end if;

  select count(*) into v_count from public.study_programs;
  if v_count <> 30 then raise exception 'seed check failed: study_programs %, expected 30', v_count; end if;

  select count(*) into v_count from public.companies;
  if v_count <> 15 then raise exception 'seed check failed: companies %, expected 15', v_count; end if;

  select count(*) into v_count from public.supervisors;
  if v_count <> 25 then raise exception 'seed check failed: supervisors %, expected 25', v_count; end if;

  select count(*) into v_count from public.experts;
  if v_count <> 30 then raise exception 'seed check failed: experts %, expected 30', v_count; end if;

  select count(*) into v_count from public.topics;
  if v_count <> 60 then raise exception 'seed check failed: topics %, expected 60', v_count; end if;

  select count(*) into v_count from public.students;
  if v_count <> 40 then raise exception 'seed check failed: students %, expected 40', v_count; end if;

  select count(*) into v_count from public.thesis_projects;
  if v_count <> 15 then raise exception 'seed check failed: thesis_projects %, expected 15', v_count; end if;

  select count(*) into v_count from public.supervisor_fields;
  if v_count <> 50 then raise exception 'seed check failed: supervisor_fields %, expected 50', v_count; end if;

  select count(*) into v_count from public.expert_fields;
  if v_count <> 58 then raise exception 'seed check failed: expert_fields %, expected 58', v_count; end if;

  select count(*) into v_count from public.topic_fields;
  if v_count <> 118 then raise exception 'seed check failed: topic_fields %, expected 118', v_count; end if;

  select count(*) into v_count from public.topic_supervisors;
  if v_count <> 30 then raise exception 'seed check failed: topic_supervisors %, expected 30', v_count; end if;

  select count(*) into v_count from public.topic_experts;
  if v_count <> 30 then raise exception 'seed check failed: topic_experts %, expected 30', v_count; end if;

  select count(*) into v_count from public.student_fields;
  if v_count <> 103 then raise exception 'seed check failed: student_fields %, expected 103', v_count; end if;

  select count(*) into v_count from public.project_supervisors;
  if v_count <> 8 then raise exception 'seed check failed: project_supervisors %, expected 8', v_count; end if;

  select count(*) into v_count from public.project_experts;
  if v_count <> 4 then raise exception 'seed check failed: project_experts %, expected 4', v_count; end if;
end;
$$;
