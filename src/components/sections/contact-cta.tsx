
import { Mail } from 'lucide-react';
import { siteConfig } from '@/content/site';
import { Container, Section, ScrollFade, HireLinks, WhatsAppIcon } from '@/components/common';
import { Button } from '@/components/ui/button';

export function ContactCta() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <Section id="contact">
      <Container>
        <ScrollFade>
          <div className="flex flex-col items-center text-center">
            <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              Get in Touch
            </p>

            <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
              Got a problem worth solving?
            </h2>

            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
              I&rsquo;m not looking for just any project. I&rsquo;m looking for
              challenges that need real solutions — the kind where you need
              someone who listens, builds, and delivers. If that sounds like
              what you need, let&rsquo;s talk.
            </p>

            <div className="mt-10 flex justify-center">
              <HireLinks />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href={`mailto:${siteConfig.contact.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </ScrollFade>
      </Container>
    </Section>
  );
}
