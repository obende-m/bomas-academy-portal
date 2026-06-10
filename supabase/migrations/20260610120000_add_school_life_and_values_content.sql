-- Align mission/vision with the 2026 prospectus
UPDATE public.site_content SET value = 'We nurture every child''s potential in a brave environment to inspire joy and lifelong mastery.' WHERE key = 'about.mission';
UPDATE public.site_content SET value = 'To raise brave, global citizens who transform the world through mastery and service.' WHERE key = 'about.vision';

-- Update Facebook to a full URL and add the rest of the social profiles
UPDATE public.site_content SET value = 'https://www.facebook.com/bomasacademy' WHERE key = 'contact.facebook';

INSERT INTO public.site_content (key, value) VALUES
  ('contact.instagram', 'https://www.instagram.com/bomasacademy/'),
  ('contact.x', 'https://x.com/bomasacademy'),
  ('contact.youtube', 'https://www.youtube.com/channel/UCzCvBd5tz2fYPScNrC_XUHQ')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- BOMAS Core Values + Aims & Objectives (About page)
INSERT INTO public.site_content (key, value) VALUES
  ('about.values.intro', 'Five commitments that shape every classroom, every day.'),
  ('about.values.bravery', 'Bravery
We replace the familiar with the adventurous. Our classrooms are "brave spaces" where curiosity is celebrated and stepping into the unknown is the standard.
I am brave enough to try my best.'),
  ('about.values.opportunity', 'Opportunity
We create platforms for every voice. Through participation and volunteering, students broaden their horizons and set ambitious goals.
I am ready for every new challenge.'),
  ('about.values.mastery', 'Mastery
We do not move on until we understand. We challenge our community to meet high standards, providing targeted intervention so no child is left behind.
I am a master of my work and my words.'),
  ('about.values.authenticity', 'Authenticity
We are real, honest, and transparent. We encourage students to share their true selves with the world.
I am proud to be my true self.'),
  ('about.values.service', 'Service
Excellence is our goal, and service is our method. We ask daily: "Is this my best work yet?" We are a 24/7/365 support system for our community.
I am a helper to my school and my world.'),
  ('about.aims.title', 'Aims & Objectives'),
  ('about.aims.items', 'To cultivate independent, lifelong learners who contribute positively to a global society.
To sustain a "brave and happy" environment where confidence and self-esteem flourish.
To deliver a balanced, tech-forward curriculum tailored to individual needs.
To nurture authentic home-school partnerships built on mutual respect.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- School Life page content
INSERT INTO public.site_content (key, value) VALUES
  ('schoolLife.title', 'School Life'),
  ('schoolLife.intro', 'What every Bomas family can expect — on campus, at home, and in partnership with our teachers.'),
  ('schoolLife.campus.title', 'The Bomas Campus Experience'),
  ('schoolLife.campus.environment.title', 'The Prepared Environment'),
  ('schoolLife.campus.environment.body', 'Our classrooms are child-sized worlds designed for comfort, security, and beauty. Every object has a purpose, arranged on low shelving to encourage independence from the earliest age.'),
  ('schoolLife.campus.day.title', 'The School Day'),
  ('schoolLife.campus.day.body', 'Learning begins at 7:30 AM and concludes at 2:30 PM.'),
  ('schoolLife.campus.uniform.title', 'Uniform & Identity'),
  ('schoolLife.campus.uniform.body', 'We believe in modesty and excellence. Students are expected to be impeccably turned out in grey and turquoise blue/white. Our appearance reflects our respect for our work.'),
  ('schoolLife.partnership.title', 'The Home-School Partnership'),
  ('schoolLife.partnership.intro', 'We operate an Open Door Policy. Education is a partnership; children achieve more when we work together.'),
  ('schoolLife.partnership.communication.title', 'Communication'),
  ('schoolLife.partnership.communication.body', 'Weekly newsletters, termly written reports, and regular parent-teacher mastery meetings keep you connected to your child''s progress.'),
  ('schoolLife.partnership.family.title', 'Family Participation'),
  ('schoolLife.partnership.family.body', 'Bomas families are not "visitors" — you are part of the fabric of our school. While we require sign-in for security, we encourage your presence and ideas.'),
  ('schoolLife.partnership.headteacher.title', 'Headteacher Hours'),
  ('schoolLife.partnership.headteacher.body', 'Available for walk-ins every morning between 8:50 AM and 9:30 AM.'),
  ('schoolLife.homework.title', 'Homework: Learning Together'),
  ('schoolLife.homework.intro', 'Homework at Bomas is designed to build connections. It is an opportunity for students to practice initiative and responsibility.'),
  ('schoolLife.homework.bands', 'Pre-Nursery – Grade 2 | 8-15+ minutes
Grades 3 – 5 | 20+ minutes
Secondary / Honors | Additional time based on subject mastery'),
  ('schoolLife.health.title', 'Health, Safety & Discipline'),
  ('schoolLife.health.behaviour.title', 'Positive Behaviour'),
  ('schoolLife.health.behaviour.body', 'We manage behaviour through the lens of self-discipline and consequences. We expect respectful, obedient, and helpful conduct at all times.'),
  ('schoolLife.health.wellness.title', 'Health'),
  ('schoolLife.health.wellness.body', 'We prioritize student wellness. Please notify the office before 8:00 AM in the event of an absence.'),
  ('schoolLife.health.inclusion.title', 'Inclusion'),
  ('schoolLife.health.inclusion.body', 'Bomas Academy offers full, non-discriminatory access to our curriculum regardless of gender, ethnicity, or ability.'),
  ('schoolLife.agreement.title', 'The 2026 Home/School Agreement'),
  ('schoolLife.agreement.intro', 'Rooted in the UN Convention on the Rights of the Child (Articles 18, 19, 24, 28, 29).'),
  ('schoolLife.agreement.rows', 'I will try my best and learn from my mistakes. | We will talk to our child about their learning daily. | We will provide a brave, creative, and balanced curriculum.
I will seek support when I need it. | We will ensure the best possible attendance and punctuality. | We will track and support progress with dignity and respect.
I will respect staff, peers, and my environment. | We will model positive behavior and respect school staff. | We will keep your child safe and honor their individual needs.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
