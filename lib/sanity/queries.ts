/**
 * GROQ projections for Sanity `post` documents.
 *
 * Listing omits full body and projects a short plain-text excerpt from the
 * first Portable Text block for card previews.
 */
// Added/Modified by Rajarshi for TBD — START
export const BLOGS_QUERY = /* groq */ `*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "excerpt": pt::text(body)
}`;

export const BLOG_BY_SLUG_QUERY = /* groq */ `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "excerpt": pt::text(body),
  body,
  carouselImages[defined(asset)]{
    _key,
    _type,
    alt,
    asset,
    hotspot,
    crop
  }
}`;

export const BLOG_SLUGS_QUERY = /* groq */ `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current
}`;

export const PDFS_QUERY = /* groq */ `*[_type == "pdf"] | order(title asc) {
  _id,
  title,
  cdnUrl,
  "fileUrl": file.asset->url,
  "filename": file.asset->originalFilename
}`;

export const PDF_BY_ID_QUERY = /* groq */ `*[_type == "pdf" && _id == $id][0] {
  _id,
  title,
  cdnUrl,
  "fileUrl": file.asset->url,
  "filename": file.asset->originalFilename
}`;

export const PDF_IDS_QUERY = /* groq */ `*[_type == "pdf"]{ "_id": _id }`;
// Added/Modified by Rajarshi for TBD — END
