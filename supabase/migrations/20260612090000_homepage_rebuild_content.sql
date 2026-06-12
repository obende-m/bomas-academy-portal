-- Homepage rebuild: content for new/expanded homepage sections, the Facilities and
-- Downloads pages, and the footer Quick Links restructure.

INSERT INTO public.site_content (key, value) VALUES
  -- Why BOMAS? (lead copy stays in home.intro.*; these are the three commitment cards)
  ('home.why.item1.title', 'Rigorous, joyful learning'),
  ('home.why.item1.body', 'A curriculum that meets each learner where they are, then takes them further than they thought possible.'),
  ('home.why.item2.title', 'Character first'),
  ('home.why.item2.body', 'Discipline, integrity, and empathy taught not as subjects but as a daily way of being on campus.'),
  ('home.why.item3.title', 'Made for Jos'),
  ('home.why.item3.body', 'Rooted in our highland community and connected to a wider world, proudly Plateau and proudly Nigerian.'),

  -- Vision & Mission (reuses about.mission / about.vision)
  ('home.visionMission.eyebrow', 'Our purpose'),
  ('home.visionMission.title', 'Mission & Vision.'),

  -- BOMAS Values teaser (reuses about.values.*)
  ('home.values.eyebrow', 'What we stand for'),
  ('home.values.title', 'The BOMAS way.'),

  -- Programs Overview (reuses academics.early/primary/secondary.*)
  ('home.programs.eyebrow', 'Academics'),
  ('home.programs.title', 'A program for every stage.'),

  -- School Snapshot (reuses home.stats.*)
  ('home.snapshot.eyebrow', 'By the numbers'),
  ('home.snapshot.title', 'Bomas Academy at a glance.'),

  -- Facilities (new page + homepage preview)
  ('facilities.title', 'Our Facilities'),
  ('facilities.intro', 'A safe, well-equipped campus designed to support learning, creativity and play.'),
  ('facilities.items', 'Library | A quiet, well-stocked space where students cultivate a lifelong love of reading and research.
Science Laboratory | Hands-on equipment for practical lessons in biology, chemistry and physics from primary through senior secondary.
ICT & Computer Lab | Modern computers and internet access support digital literacy across every subject.
Sports Field | A spacious field for football, athletics and PE, encouraging fitness and teamwork.
Music & Arts Room | Instruments, art supplies and a performance space for creative expression.
Dining Hall | A bright, welcoming hall serving nutritious meals every school day.'),

  -- Gallery preview
  ('home.gallery.eyebrow', 'Gallery'),
  ('home.gallery.title', 'Life at Bomas, in pictures.'),

  -- Testimonials
  ('home.testimonials.eyebrow', 'What families say'),
  ('home.testimonials.title', 'Loved by the Bomas community.'),
  ('home.testimonials.items', 'Mrs. Grace Adamu | Parent | Bomas Academy has given my daughter a love for learning I never thought possible. The teachers know her by name and care about her growth.
Daniel Pwajok | Class of 2022 | The brave spaces I found at Bomas gave me the confidence to lead. I carry the BOMAS values with me at university every day.
Mr. Samuel Bitrus | Teacher | What I love most about Bomas is the partnership between home and school, where every child is supported and every voice is heard.'),

  -- Contact preview (reuses contact.*)
  ('home.contactPreview.eyebrow', 'Get in touch'),
  ('home.contactPreview.title', 'Visit, call, or write to us.'),

  -- Downloads page
  ('downloads.title', 'Downloads'),
  ('downloads.intro', 'Forms, prospectuses and policy documents for Bomas Academy families.'),
  ('downloads.items', '')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
