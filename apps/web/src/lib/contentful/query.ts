import { gql } from "../../__generated__";

/**
 * Contentful GraphQL Queries
 */

// GraphQL query fragments for reusability
export const PAGE_FRAGMENT = gql(`
  fragment PageFields on Page {
    sys {
      id
      firstPublishedAt
      publishedAt
    }
    title
    slug
    description
    seoTitle
    seoDescription
    seoNoIndex
    image {
      url
      title
      description
      width
      height
    }
    seoImage {
      url
      title
      description
      width
      height
    }
    pageBuilderCollection {
      items {
        __typename
        ... on Hero {
          sys {
            id
          }
          title
          badge
          image {
            url
            title
            description
            width
            height
          }
          buttonsCollection {
            items {
              label
              href
              variant
              internal {
                slug
                title
              }
            }
          }
        }
        ... on CallToAction {
          sys {
            id
          }
          title
          eyebrow
          richText {
            json
          }
          buttonsCollection {
            items {
              label
              href
              variant
              internal {
                slug
                title
              }
            }
          }
        }
        ... on FeatureCards {
          sys {
            id
          }
          title
          eyebrow
          richText {
            json
          }
          cardsCollection {
            items {
              title
              icon {
                url
                title
                description
                width
                height
              }
              richText {
                json
              }
            }
          }
        }
        ... on FaqAccordion {
          sys {
            id
          }
          title
          eyebrow
          faqsCollection {
            items {
              question
              answer {
                json
              }
            }
          }
        }
      }
    }
  }
`);

export const GET_PAGES = gql(`
  query GetPages($preview: Boolean) {
    pageCollection(preview: $preview, limit: 100) {
      total
      skip
      limit
      items {
        ...PageFields
      }
    }
  }
`);

export const GET_PAGE_BY_SLUG = gql(`
  query GetPageBySlug($slug: String!, $preview: Boolean) {
    pageCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        ...PageFields
      }
    }
  }
`);

export const SEARCH_CONTENT = gql(`
  query SearchContent($preview: Boolean) {
    pageCollection(preview: $preview, limit: 20) {
      total
      items {
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        title
        description
        slug
        __typename
      }
    }
  }
`);

export const GET_HEROES = gql(`
  query GetHeroes($preview: Boolean) {
    heroCollection(preview: $preview, limit: 100) {
      total
      skip
      limit
      items {
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        title
        badge
        image {
          url
          title
          description
          width
          height
        }
        buttonsCollection {
          items {
            label
            href
            variant
            internal {
              slug
              title
            }
          }
        }
      }
    }
  }
`);

export const GET_CALL_TO_ACTIONS = gql(`
  query GetCallToActions($preview: Boolean) {
    callToActionCollection(preview: $preview, limit: 100) {
      total
      skip
      limit
      items {
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        title
        eyebrow
        richText {
          json
        }
        buttonsCollection {
          items {
            label
            href
            variant
            internal {
              slug
              title
            }
          }
        }
      }
    }
  }
`);

export const GET_CONTENT_BY_TYPE = gql(`
  query GetContentByType($contentType: String!, $preview: Boolean, $limit: Int, $skip: Int) {
    collection: __type(name: $contentType) {
      name
    }
  }
`);

export const GET_CONTENT_WITH_PAGINATION = gql(`
  query GetContentWithPagination($contentType: String!, $preview: Boolean, $limit: Int, $skip: Int) {
    collection: __type(name: $contentType) {
      name
    }
  }
`);
