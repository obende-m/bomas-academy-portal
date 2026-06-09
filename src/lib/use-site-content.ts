import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = Record<string, string>;

export const DEFAULTS: SiteContent = {
  "home.hero.eyebrow": "Bomas Academy · Jos, Plateau State",
  "home.hero.title": "Where character meets excellence.",
  "home.hero.subtitle":
    "A nurturing learning community shaping confident, curious, and compassionate young minds in the heart of Jos.",
  "home.intro.title": "A school built on faith, discipline and discovery.",
  "home.intro.body":
    "For over a decade, Bomas Academy has guided students from early years through senior secondary with a balanced curriculum, dedicated educators, and a campus designed to inspire wonder.",
  "home.stats.students": "600+",
  "home.stats.teachers": "45",
  "home.stats.years": "15",
  "about.title": "About Bomas Academy",
  "about.mission": "",
  "about.vision": "",
  "about.story": "",
  "academics.title": "Academics",
  "academics.intro": "",
  "academics.early.title": "Early Years",
  "academics.early.body": "",
  "academics.primary.title": "Primary School",
  "academics.primary.body": "",
  "academics.secondary.title": "Secondary School",
  "academics.secondary.body": "",
  "admissions.title": "Admissions",
  "admissions.intro": "",
  "admissions.steps": "",
  "admissions.cta": "Apply now",
  "contact.address": "No 10 Metropolitan Crescent G.R.A, Jos, Nigeria",
  "contact.phone": "0803 605 8313",
  "contact.email": "bomasacademy@gmail.com",
  "contact.hours": "Mon – Fri · 7:30am – 4:00pm",
  "contact.facebook": "facebook.com/bomasacademy",
};

export function useSiteContent() {
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      const map: SiteContent = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return map;
    },
    staleTime: 30_000,
  });
  return { ...DEFAULTS, ...(data ?? {}) };
}