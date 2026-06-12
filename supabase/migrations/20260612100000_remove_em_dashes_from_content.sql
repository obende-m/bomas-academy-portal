-- Rephrase existing site_content copy that used an em dash, replacing it with
-- plain punctuation/wording per updated content guidelines.

INSERT INTO public.site_content (key, value) VALUES
  ('about.vision', 'To be the school of first choice in Plateau State, celebrated for academic depth, character and creativity.'),
  ('academics.early.body', 'Play-based learning, phonics, numeracy and the joy of discovery for ages 2 to 5.'),
  ('academics.primary.body', 'Strong literacy, numeracy, science and creative arts foundations for Primary 1 to 6.'),
  ('academics.secondary.body', 'JSS and SSS streams preparing students for WAEC, NECO and university, with mentorship and career guidance.'),
  ('schoolLife.intro', 'What every Bomas family can expect at school, at home, and in partnership with our teachers.'),
  ('schoolLife.partnership.family.body', 'Bomas families are part of the fabric of our school, not just "visitors." While we require sign-in for security, we encourage your presence and ideas.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
