import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export const metadata = {
  title: "Contact Us | CompSciety BulSU",
  description: "Get in touch with the Computer Science Society of Bulacan State University.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    value: "compsciety.bulsu@gmail.com",
    href: "mailto:compsciety.bulsu@gmail.com",
    label: "Send an email",
  },
  {
    icon: Globe,
    title: "Official Facebook",
    value: "facebook.com/compscietybulsu",
    href: "https://www.facebook.com/compscietybulsu",
    label: "Follow on Facebook",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "College of Science, Bulacan State University, City of Malolos, Bulacan",
    href: "https://maps.google.com/?q=Bulacan+State+University",
    label: "View on Map",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-8 pt-14 pb-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h1 className="font-heading font-extrabold text-white text-5xl sm:text-6xl mb-3">
              Contact Us
            </h1>
            <p className="text-green-400 text-sm sm:text-base mb-12">
              Have questions, collaboration proposals, or inquiries? Reach out to CompSciety.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {CONTACT_INFO.map((item, idx) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.title} delay={idx * 100}>
                  <div className="h-full rounded-2xl border border-green-200/10 bg-[#132e1c]/60 backdrop-blur-md p-6 flex flex-col justify-between hover:border-green-400/40 transition-colors">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-4">
                        <Icon size={24} />
                      </div>
                      <h2 className="font-heading font-bold text-white text-lg mb-2">
                        {item.title}
                      </h2>
                      <p className="text-green-200/70 text-sm break-words mb-4">
                        {item.value}
                      </p>
                    </div>
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-green-400 hover:text-green-300 inline-flex items-center gap-1.5 transition-colors"
                      >
                        {item.label} &rarr;
                      </a>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={300}>
            <div className="rounded-2xl border border-green-200/10 bg-[#0d2818]/60 backdrop-blur-md p-8 text-center sm:text-left sm:flex items-center justify-between gap-6">
              <div>
                <h3 className="font-heading font-bold text-white text-xl mb-1 flex items-center justify-center sm:justify-start gap-2">
                  <MessageSquare size={20} className="text-green-400" />
                  Connect with the Student Body
                </h3>
                <p className="text-green-200/70 text-sm">
                  Join our events, workshops, and community channels throughout the academic year.
                </p>
              </div>
              <a
                href="https://www.facebook.com/compscietybulsu"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 sm:mt-0 inline-block shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold text-sm px-6 py-3 shadow-lg hover:opacity-90 transition-opacity"
              >
                Visit Facebook Page
              </a>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
