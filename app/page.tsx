import Image from "next/image";

const email = "info@kirstynjadephotography.com";
const phone = "587 597 0412";
const phoneHref = "tel:+15875970412";
const instagramHandle = "@kirstynjade_";
const instagram = "https://instagram.com/kirstynjade_";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kirstynjadephotography.com";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${siteUrl}/#business`,
      name: "Kirstyn Jade Photography",
      alternateName: "Kirstyn Jade",
      description:
        "Wedding, elopement and portrait photography by Kirstyn Jade, based in Calgary, Alberta.",
      url: siteUrl,
      email: `mailto:${email}`,
      telephone: "+1-587-597-0412",
      image: `${siteUrl}/images/photo-1.jpg`,
      logo: `${siteUrl}/images/logo.png`,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Calgary",
        addressRegion: "AB",
        addressCountry: "CA",
      },
      geo: { "@type": "GeoCoordinates", latitude: 51.0447, longitude: -114.0719 },
      areaServed: [
        { "@type": "City", name: "Calgary" },
        { "@type": "AdministrativeArea", name: "Alberta" },
      ],
      knowsAbout: ["Wedding photography", "Elopement photography", "Portrait photography"],
      sameAs: [instagram],
      founder: { "@id": `${siteUrl}/#kirstyn` },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photography services",
        itemListElement: [
          "Wedding photography",
          "Elopement photography",
          "Portrait photography",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, serviceType: name },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#kirstyn`,
      name: "Kirstyn Jade",
      jobTitle: "Photographer",
      url: siteUrl,
      sameAs: [instagram],
      worksFor: { "@id": `${siteUrl}/#business` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Calgary",
        addressRegion: "AB",
        addressCountry: "CA",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Kirstyn Jade Photography",
      inLanguage: "en-CA",
      publisher: { "@id": `${siteUrl}/#business` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Kirstyn Jade Photography — Coming Soon",
      description:
        "Coming soon — wedding, elopement and portrait photography by Kirstyn Jade, based in Calgary, Alberta.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#business` },
      primaryImageOfPage: `${siteUrl}/images/photo-1.jpg`,
    },
  ],
};

export default function Home() {
  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="masthead">
        <h1 className="wordmark">
          <span className="wordmark__name">Kirstyn Jade</span>
          <span className="wordmark__kicker">Photography</span>
        </h1>
        <p className="blurb">
          Our new, full website is on the way. Enquiries welcome.
        </p>
        <p className="contact">
          <a href={`mailto:${email}`}>{email}</a>
          <a href={phoneHref}>{phone}</a>
          <a href={instagram} target="_blank" rel="noreferrer">
            {instagramHandle}
          </a>
        </p>
      </header>

      <section className="gallery" aria-label="Selected work">
        <figure className="frame">
          <Image
            src="/images/photo-1.jpg"
            alt="A bride and groom together outside a brick storefront at golden hour"
            width={1364}
            height={2048}
            sizes="(max-width: 720px) 100vw, 33vw"
            priority
          />
        </figure>
        <figure className="frame">
          <Image
            src="/images/photo-2.jpg"
            alt="Close detail of the couple holding one another, rings showing"
            width={2048}
            height={1365}
            sizes="(max-width: 720px) 100vw, 33vw"
          />
        </figure>
        <figure className="frame">
          <Image
            src="/images/photo-3.jpg"
            alt="Black and white photograph of a ring being placed on the bride's finger"
            width={2048}
            height={1366}
            sizes="(max-width: 720px) 100vw, 33vw"
          />
        </figure>
      </section>

      <footer className="footer">
        <span>&copy; {new Date().getFullYear()} Kirstyn Jade Photography</span>
      </footer>
    </main>
  );
}
