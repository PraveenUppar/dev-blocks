import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const jsdom = new JSDOM("");
const DOMPurify = createDOMPurify(jsdom.window);

// Sanitize content
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
    ALLOW_DATA_ATTR: false,
  });
};
