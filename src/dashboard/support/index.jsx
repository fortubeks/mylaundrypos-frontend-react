import {
  FaComments,
  FaEnvelope,
  FaExternalLinkAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const SUPPORT_CHANNELS = [
  {
    title: "Email",
    description: "Reach our team for product guidance and account support.",
    value: "info@fortranhouse.com",
    href: "mailto:info@fortranhouse.com",
    responseTime: "Response time: 24 hours",
    icon: <FaEnvelope className="text-lg" />,
    accent: "bg-[#F5F8FF] text-[#2156C9]",
  },
  {
    title: "WhatsApp",
    description: "Best for urgent help with billing, access, and onboarding.",
    value: "+2349165426799",
    href: "https://wa.me/2349165426799",
    responseTime: "Response time: under 1 hour",
    icon: <FaWhatsapp className="text-lg" />,
    accent: "bg-[#EEFDF4] text-[#1F9D55]",
  },
  {
    title: "Live Chat",
    description: "In-app live chat will be available in a future release.",
    value: "Coming soon",
    disabled: true,
    responseTime: "Status: coming soon",
    icon: <FaComments className="text-lg" />,
    accent: "bg-[#FFF7E8] text-[#B7791F]",
  },
  {
    title: "Call",
    description: "Speak with our team during business hours.",
    value: "+2349165426799",
    href: "tel:+2349165426799",
    responseTime: "Availability: 9am to 5pm GMT+1",
    icon: <FaPhoneAlt className="text-lg" />,
    accent: "bg-[#FFF1F2] text-[#C53030]",
  },
];

const LEGAL_LINKS = [
  {
    title: "Privacy Policy",
    href: "https://mylaundrypos.com/privacy-policy",
  },
  {
    title: "Terms of Service",
    href: "https://mylaundrypos.com/terms-of-use",
  },
];

function SupportChannelCard({ channel }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${channel.accent}`}>
          {channel.icon}
        </div>
        {!channel.disabled && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A9A9A]">
            Open
          </span>
        )}
      </div>

      <div className="mt-5">
        <h2 className="text-xl font-bold text-[#212121]">{channel.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#666666]">{channel.description}</p>
      </div>

      <div className="mt-6 rounded-2xl bg-[#FAFAFA] px-4 py-4">
        <p className="text-sm font-semibold text-[#212121]">{channel.value}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8D8D8D]">
          {channel.responseTime}
        </p>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        {channel.disabled ? "Not yet available" : "Contact support"}
        {!channel.disabled && <FaExternalLinkAlt className="text-xs" />}
      </div>
    </>
  );

  if (channel.disabled) {
    return (
      <div className="rounded-[28px] border border-[#E7E7E7] bg-white p-6 shadow-sm opacity-80">
        {content}
      </div>
    );
  }

  return (
    <a
      href={channel.href}
      target={channel.href?.startsWith("http") ? "_blank" : undefined}
      rel={channel.href?.startsWith("http") ? "noreferrer" : undefined}
      className="block rounded-[28px] border border-[#E7E7E7] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
    >
      {content}
    </a>
  );
}

export default function Support() {
  return (
    <main className="h-full grow overflow-y-auto bg-[#F8F8F8]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 xl:px-8">
        <section className="rounded-[32px] border border-[#E7E7E7] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Support
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#212121] sm:text-4xl">
            Choose the fastest way to reach us.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#666666] sm:text-base">
            Contact the support team through email, WhatsApp, or a phone call. You can also review our privacy policy and terms of service from this page.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {SUPPORT_CHANNELS.map((channel) => (
            <SupportChannelCard key={channel.title} channel={channel} />
          ))}
        </section>

        <section className="rounded-[32px] border border-[#E7E7E7] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Legal
            </p>
            <h2 className="text-2xl font-bold text-[#212121]">
              Terms and privacy
            </h2>
            <p className="text-sm leading-6 text-[#666666]">
              Review the policies that govern the use of MyLaundryPOS.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-[#E7E7E7] bg-[#FAFAFA] px-5 py-4 text-sm font-semibold text-[#212121] transition hover:border-primary hover:bg-white"
              >
                <span>{link.title}</span>
                <FaExternalLinkAlt className="text-xs text-[#666666]" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}