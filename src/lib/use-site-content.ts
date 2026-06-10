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
  "about.values.intro": "Five commitments that shape every classroom, every day.",
  "about.values.bravery": "Bravery\nWe replace the familiar with the adventurous. Our classrooms are \"brave spaces\" where curiosity is celebrated and stepping into the unknown is the standard.\nI am brave enough to try my best.",
  "about.values.opportunity": "Opportunity\nWe create platforms for every voice. Through participation and volunteering, students broaden their horizons and set ambitious goals.\nI am ready for every new challenge.",
  "about.values.mastery": "Mastery\nWe do not move on until we understand. We challenge our community to meet high standards, providing targeted intervention so no child is left behind.\nI am a master of my work and my words.",
  "about.values.authenticity": "Authenticity\nWe are real, honest, and transparent. We encourage students to share their true selves with the world.\nI am proud to be my true self.",
  "about.values.service": "Service\nExcellence is our goal, and service is our method. We ask daily: \"Is this my best work yet?\" We are a 24/7/365 support system for our community.\nI am a helper to my school and my world.",
  "about.aims.title": "Aims & Objectives",
  "about.aims.items": "To cultivate independent, lifelong learners who contribute positively to a global society.\nTo sustain a \"brave and happy\" environment where confidence and self-esteem flourish.\nTo deliver a balanced, tech-forward curriculum tailored to individual needs.\nTo nurture authentic home-school partnerships built on mutual respect.",
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
  "schoolLife.title": "School Life",
  "schoolLife.intro": "What every Bomas family can expect — on campus, at home, and in partnership with our teachers.",
  "schoolLife.campus.title": "The Bomas Campus Experience",
  "schoolLife.campus.environment.title": "The Prepared Environment",
  "schoolLife.campus.environment.body": "Our classrooms are child-sized worlds designed for comfort, security, and beauty. Every object has a purpose, arranged on low shelving to encourage independence from the earliest age.",
  "schoolLife.campus.day.title": "The School Day",
  "schoolLife.campus.day.body": "Learning begins at 7:30 AM and concludes at 2:30 PM.",
  "schoolLife.campus.uniform.title": "Uniform & Identity",
  "schoolLife.campus.uniform.body": "We believe in modesty and excellence. Students are expected to be impeccably turned out in grey and turquoise blue/white. Our appearance reflects our respect for our work.",
  "schoolLife.partnership.title": "The Home-School Partnership",
  "schoolLife.partnership.intro": "We operate an Open Door Policy. Education is a partnership; children achieve more when we work together.",
  "schoolLife.partnership.communication.title": "Communication",
  "schoolLife.partnership.communication.body": "Weekly newsletters, termly written reports, and regular parent-teacher mastery meetings keep you connected to your child's progress.",
  "schoolLife.partnership.family.title": "Family Participation",
  "schoolLife.partnership.family.body": "Bomas families are not \"visitors\" — you are part of the fabric of our school. While we require sign-in for security, we encourage your presence and ideas.",
  "schoolLife.partnership.headteacher.title": "Headteacher Hours",
  "schoolLife.partnership.headteacher.body": "Available for walk-ins every morning between 8:50 AM and 9:30 AM.",
  "schoolLife.homework.title": "Homework: Learning Together",
  "schoolLife.homework.intro": "Homework at Bomas is designed to build connections. It is an opportunity for students to practice initiative and responsibility.",
  "schoolLife.homework.bands": "Pre-Nursery – Grade 2 | 8-15+ minutes\nGrades 3 – 5 | 20+ minutes\nSecondary / Honors | Additional time based on subject mastery",
  "schoolLife.health.title": "Health, Safety & Discipline",
  "schoolLife.health.behaviour.title": "Positive Behaviour",
  "schoolLife.health.behaviour.body": "We manage behaviour through the lens of self-discipline and consequences. We expect respectful, obedient, and helpful conduct at all times.",
  "schoolLife.health.wellness.title": "Health",
  "schoolLife.health.wellness.body": "We prioritize student wellness. Please notify the office before 8:00 AM in the event of an absence.",
  "schoolLife.health.inclusion.title": "Inclusion",
  "schoolLife.health.inclusion.body": "Bomas Academy offers full, non-discriminatory access to our curriculum regardless of gender, ethnicity, or ability.",
  "schoolLife.agreement.title": "The 2026 Home/School Agreement",
  "schoolLife.agreement.intro": "Rooted in the UN Convention on the Rights of the Child (Articles 18, 19, 24, 28, 29).",
  "schoolLife.agreement.rows": "I will try my best and learn from my mistakes. | We will talk to our child about their learning daily. | We will provide a brave, creative, and balanced curriculum.\nI will seek support when I need it. | We will ensure the best possible attendance and punctuality. | We will track and support progress with dignity and respect.\nI will respect staff, peers, and my environment. | We will model positive behavior and respect school staff. | We will keep your child safe and honor their individual needs.",
  "contact.address": "No 10 Metropolitan Crescent G.R.A, Jos, Nigeria",
  "contact.phone": "0803 605 8313",
  "contact.email": "bomasacademy@gmail.com",
  "contact.hours": "Mon – Fri · 7:30am – 4:00pm",
  "contact.facebook": "https://www.facebook.com/bomasacademy",
  "contact.instagram": "https://www.instagram.com/bomasacademy/",
  "contact.x": "https://x.com/bomasacademy",
  "contact.youtube": "https://www.youtube.com/channel/UCzCvBd5tz2fYPScNrC_XUHQ",
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