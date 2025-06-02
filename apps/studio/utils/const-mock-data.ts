import { faker } from "@faker-js/faker";

import { capitalize, splitArray } from "./helper";

export const TITLE_EYEBROW_PAIRS = [
  {
    title: "Why We Are Unique",
    eyebrow: "Features & Benefits",
  },
  {
    title: "Our Key Features",
    eyebrow: "What Makes Us Different",
  },
  {
    title: "What Sets Us Apart",
    eyebrow: "Our Expertise",
  },
  {
    title: "Our Core Strengths",
    eyebrow: "Key Differentiators",
  },
  {
    title: "Why Choose Us",
    eyebrow: "Value Proposition",
  },
  {
    title: "Our Advantages",
    eyebrow: "Core Competencies",
  },
  {
    title: "What We Offer",
    eyebrow: "Unique Solutions",
  },
  {
    title: "Our Capabilities",
    eyebrow: "Industry Leadership",
  },
];

export const QUESTIONS = [
  {
    value: faker.helpers.fake("What is {{company.name}}'s return policy?"),
    answer: `
          <p>Our <strong>return policy</strong> allows returns within <em>30 days</em> of purchase with original receipt. Items must be <strong>unused</strong> and in <strong>original packaging</strong>. Refunds are processed within <em>5-7 business days</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake("How do I track my {{commerce.product}} order?"),
    answer: `
          <p>You can <strong>track your order</strong> by logging into your account and viewing the order status. We also send <em>tracking information</em> via email once your order ships.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What payment methods do you accept for {{commerce.product}}?",
    ),
    answer: `
          <p>We accept all <strong>major credit cards</strong> (<em>Visa</em>, <em>Mastercard</em>, <em>American Express</em>), <strong>PayPal</strong>, and <strong>Apple Pay</strong>. Payment information is securely encrypted.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How long does shipping take to {{location.city}}?",
    ),
    answer: `
          <p><strong>Standard shipping</strong> typically takes <em>3-5 business days</em>. <strong>Express shipping</strong> options are available for <em>1-2 day delivery</em> in most areas.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you offer international shipping to {{location.country}}?",
    ),
    answer: `
          <p>Yes, we offer <strong>international shipping</strong> to most countries. Delivery times vary by location, typically <em>7-14 business days</em>. Additional <strong>customs fees</strong> may apply.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What are your shipping rates to {{location.state}}?",
    ),
    answer: `
          <p><strong>Shipping rates</strong> are calculated based on weight and destination. <strong>Standard shipping</strong> starts at <em>$5.99</em>. <strong>Free shipping</strong> is available for orders over <em>$50</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake("Why should I choose {{company.buzzPhrase}}?"),
    answer: `
          <p>We offer <strong>industry-leading quality</strong>, <strong>exceptional customer service</strong>, and <strong>competitive pricing</strong>. Our products are backed by a <em>satisfaction guarantee</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What makes your {{commerce.productName}} different from competitors?",
    ),
    answer: `
          <p>Our products feature <strong>premium materials</strong>, <strong>innovative design</strong>, and <strong>rigorous quality testing</strong>. We also provide <em>comprehensive post-purchase support</em>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you have any {{commerce.productAdjective}} {{commerce.product}} in stock?",
    ),
    answer: `
          <p>Our <strong>inventory</strong> is updated in <em>real-time</em> on our website. You can check <strong>current availability</strong> and set up notifications for <strong>out-of-stock</strong> items.</p>
        `,
  },
  {
    value: faker.helpers.fake("Can I get a refund on my {{commerce.product}}?"),
    answer: `
          <p>Yes, <strong>refunds</strong> are available within our <em>30-day return window</em>. Contact our <strong>customer service team</strong> to initiate the refund process.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What is your {{company.name}}'s warranty policy?",
    ),
    answer: `
          <p>Our products come with a <strong>comprehensive warranty</strong> that covers <em>manufacturing defects</em> for up to <strong>one year</strong> from the purchase date. Extended warranty options are also available.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How can I contact {{company.name}}'s customer support?",
    ),
    answer: `
          <p>Our <strong>customer support team</strong> is available through multiple channels: <em>live chat</em>, <em>email</em>, and <em>phone</em>. Support hours are <strong>24/7</strong> for your convenience.</p>
        `,
  },
  {
    value: faker.helpers.fake("What is {{company.name}}'s price match policy?"),
    answer: `
          <p>We offer <strong>price matching</strong> on identical items from authorized retailers. Simply provide proof of the lower price within <em>14 days</em> of your purchase for a <strong>price adjustment</strong>.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you offer bulk discounts for {{commerce.product}}?",
    ),
    answer: `
          <p>Yes, we provide <strong>volume discounts</strong> for bulk orders. Discounts start at <em>10% off</em> for orders over $500 and increase based on quantity. Contact our <strong>sales team</strong> for custom quotes.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What is your {{company.name}}'s privacy policy?",
    ),
    answer: `
          <p>We take your privacy seriously. Your <strong>personal information</strong> is securely encrypted and never shared with third parties. View our detailed <em>privacy policy</em> for complete information.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How do I set up my {{commerce.product}} account?",
    ),
    answer: `
          <p>Setting up your account is <strong>quick and simple</strong>. Visit our website, click <em>'Create Account'</em>, and follow the <strong>step-by-step instructions</strong>. Verification is usually completed within minutes.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What loyalty programs does {{company.name}} offer?",
    ),
    answer: `
          <p>Our <strong>rewards program</strong> offers <em>points on every purchase</em>, <strong>exclusive member discounts</strong>, and <strong>early access</strong> to new products and sales. Membership is completely free.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "How do I report a defective {{commerce.product}}?",
    ),
    answer: `
          <p>For defective products, please <strong>document the issue</strong> with photos and contact our <em>quality assurance team</em>. We'll provide <strong>immediate assistance</strong> and arrange replacement if needed.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "What certifications does {{company.name}} have?",
    ),
    answer: `
          <p>We maintain <strong>ISO 9001 certification</strong> and are <em>industry-certified</em> in all operating regions. Our facilities undergo <strong>regular audits</strong> to ensure compliance with international standards.</p>
        `,
  },
  {
    value: faker.helpers.fake(
      "Do you offer custom {{commerce.product}} solutions?",
    ),
    answer: `
          <p>Yes, our <strong>customization team</strong> works directly with clients to develop <em>tailored solutions</em>. We offer <strong>flexible customization options</strong> to meet specific requirements and preferences.</p>
        `,
  },
];

export const BUTTON_TEXT = [
  "Learn More",
  "Get Started",
  "Contact Us",
  "Sign Up Now",
  "Try It Free",
  "Book a Demo",
  "Join Today",
  "Explore More",
  "Get Access",
  "Schedule Call",
  "View Details",
  "Download Now",
  "Request Info",
  "Start Free Trial",
  "See Pricing",
  "Talk to Sales",
  "Watch Video",
  "Read Case Study",
  "Subscribe",
  "Register Now",
];

export function generatePageTitle() {
  const length = faker.number.int({ min: 40, max: 80 });
  const names = Array.from({ length }, () => {
    const adjective = capitalize(faker.company.catchPhraseAdjective());
    const descriptor = capitalize(faker.company.catchPhraseDescriptor());
    const noun = capitalize(faker.company.catchPhraseNoun());
    return `${adjective} ${descriptor} ${noun}`;
  });
  return faker.helpers.arrayElement(names);
}

export const BADGES = [
  "New Release",
  "Hot Deal",
  "Limited Time Offer",
  "Exclusive Access",
  "Special Offer",
];

export function generateButtons() {
  const url = "https://robotostudio.com?ref=template-sanity";
  return [
    {
      _key: faker.string.uuid(),
      _type: "button",
      text: faker.helpers.arrayElement(BUTTON_TEXT),
      url: {
        _type: "customUrl",
        type: "external",
        href: url,
        openInNewTab: faker.datatype.boolean(),
        external: url,
      },
      variant: "default",
    },
    {
      _key: faker.string.uuid(),
      _type: "button",
      text: faker.helpers.arrayElement(BUTTON_TEXT),
      url: {
        _type: "customUrl",
        type: "external",
        href: url,
        openInNewTab: faker.datatype.boolean(),
        external: url,
      },
      variant: "secondary",
    },
  ];
}

export const MOCK_ICONS = [
  {
    _type: "iconPicker",
    name: "anchor",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "navigation-2",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>',
  },
  {
    _type: "iconPicker",
    name: "arrow-up-left",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline></svg>',
  },
  {
    _type: "iconPicker",
    name: "alert-octagon",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  },
  {
    _type: "iconPicker",
    name: "chevrons-right",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>',
  },
  {
    _type: "iconPicker",
    name: "airplay",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>',
  },
  {
    _type: "iconPicker",
    name: "camera",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',
  },
  {
    _type: "iconPicker",
    name: "home",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  },
  {
    _type: "iconPicker",
    name: "key",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "layers",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  },
  {
    _type: "iconPicker",
    name: "map",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>',
  },
  {
    _type: "iconPicker",
    name: "trending-up",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  },
  {
    _type: "iconPicker",
    name: "truck",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
  },
  {
    _type: "iconPicker",
    name: "users",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "thumbs-up",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "tag",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
  },
  {
    _type: "iconPicker",
    name: "pocket",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline></svg>',
  },
  {
    _type: "iconPicker",
    name: "printer",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>',
  },
  {
    _type: "iconPicker",
    name: "radio",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "shopping-cart",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "watch",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>',
  },
  {
    _type: "iconPicker",
    name: "star",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  },
  {
    _type: "iconPicker",
    name: "inbox",
    provider: "fi",
    svg: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 1.5em; height: 1em;"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>',
  },
];

type Link = {
  id?: string;
  name: string;
};

export function generateNavbarColumns({ links }: { links: Link[] }) {
  const [firstPart, secondPart] = splitArray(links, 2);
  const buildLinks = (links: Link[]) => {
    return links.map((link) => ({
      _key: faker.string.uuid(),
      _type: "navbarColumnLink",
      description: faker.lorem.paragraph(),
      icon: faker.helpers.arrayElement(MOCK_ICONS),
      name: link.name,
      url: {
        _type: "customUrl",
        href: "#",
        external: link.id ? undefined : "https://example.com",
        internal: link.id
          ? {
              _ref: link.id,
              _type: "reference",
            }
          : undefined,
        openInNewTab: !link.id,
        type: link.id ? "internal" : "external",
      },
    }));
  };
  return [
    {
      _key: faker.string.uuid(),
      _type: "navbarLink",
      name: "Blogs",
      url: {
        _type: "customUrl",
        href: "#",
        internal: {
          _ref: "blogIndex",
          _type: "reference",
        },
        openInNewTab: false,
        type: "internal",
      },
    },
    {
      _key: faker.string.uuid(),
      _type: "navbarColumn",
      links: buildLinks(firstPart),
      title: "Resources",
    },
    {
      _key: faker.string.uuid(),
      _type: "navbarColumn",
      links: buildLinks(secondPart),
      title: "Products",
    },
  ];
}

export function generateFooterColumns({ links }: { links: Link[] }) {
  const [firstPart, secondPart, thirdPart] = splitArray(links, 3);
  const buildLinks = (links: Link[]) => {
    return links.map((link) => ({
      _key: faker.string.uuid(),
      _type: "footerColumnLink",
      name: link.name,
      url: {
        _type: "customUrl",
        external: link.id ? undefined : "https://example.com",
        internal: link.id
          ? {
              _ref: link.id,
              _type: "reference",
            }
          : undefined,
        href: "#",
        openInNewTab: !link.id,
        type: link.id ? "internal" : "external",
      },
    }));
  };

  return [
    {
      _key: faker.string.uuid(),
      _type: "footerColumn",
      links: buildLinks(firstPart),
      title: "Product",
    },
    {
      _key: faker.string.uuid(),
      _type: "footerColumn",
      links: buildLinks(secondPart),
      title: "Company",
    },
    {
      _key: faker.string.uuid(),
      _type: "footerColumn",
      links: buildLinks(thirdPart),
      title: "Resources",
    },
  ];
}

type NavbarColumns = ReturnType<typeof generateNavbarColumns>;
type FooterColumns = ReturnType<typeof generateFooterColumns>;

export const getMockNavbarData = ({ columns }: { columns: NavbarColumns }) => {
  return {
    _id: "navbar",
    _type: "navbar",
    buttons: generateButtons(),
    columns,
    label: "Navbar",
  };
};

export function generateMockFooterData({
  columns,
}: {
  columns: FooterColumns;
}) {
  return {
    _id: "footer",
    _type: "footer",
    _createdAt: "2025-01-17T11:55:54Z",
    label: "Footer",
    columns,
    subtitle:
      "Powered by Next.js and Sanity, crafted in a seamless monorepo architecture.",
  };
}

export function generateGlobalSettingsData(logoImageId?: string) {
  return {
    _id: "settings",
    _type: "settings",
    contactEmail: "hello@roboto.studio",
    label: "Settings",
    logo: logoImageId
      ? {
          _type: "image",
          asset: {
            _ref: logoImageId,
            _type: "reference",
          },
        }
      : undefined,
    siteDescription:
      "Powered by Next.js and Sanity, crafted in a seamless monorepo architecture.",
    siteTitle: "Template Robot Next Sanity",
    socialLinks: {
      linkedin: "https://uk.linkedin.com/company/robotostudio",
      twitter: "https://x.com/studioroboto",
      youtube: "https://www.youtube.com/@robotostudio",
    },
  };
}
