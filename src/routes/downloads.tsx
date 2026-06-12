import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";
import { PageHero } from "./about";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads - Bomas Academy" },
      { name: "description", content: "Forms, prospectuses and policy documents for Bomas Academy families." },
      { property: "og:title", content: "Downloads - Bomas Academy" },
      { property: "og:description", content: "Forms, prospectuses and policy documents for Bomas Academy families." },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const c = useSiteContent();
  const items = (c["downloads.items"] || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [title, url] = line.split("|").map((s) => s.trim());
      return { title, url };
    });

  return (
    <>
      <PageHero eyebrow="Downloads" title={c["downloads.title"]} subtitle={c["downloads.intro"]} />
      <section className="container-wide pb-24">
        {items.length > 0 ? (
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 py-5 transition-colors hover:text-accent"
              >
                <FileText className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-lg">{item.title}</span>
                <Download className="h-5 w-5 shrink-0" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Documents will appear here soon.</p>
        )}
      </section>
    </>
  );
}
