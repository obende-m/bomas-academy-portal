UPDATE public.site_content SET value = 'No 10 Metropolitan Crescent G.R.A, Jos, Nigeria' WHERE key = 'contact.address';
UPDATE public.site_content SET value = '0803 605 8313' WHERE key = 'contact.phone';
UPDATE public.site_content SET value = 'bomasacademy@gmail.com' WHERE key = 'contact.email';
INSERT INTO public.site_content (key, value) VALUES ('contact.facebook', 'facebook.com/bomasacademy')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
