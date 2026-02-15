export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};
// URLs like /posts/how-to-learn-javascript are user-friendly and SEO-friendly
// Better than /posts/550e8400-e29b-41d4-a716-446655440000
export const calculateReadingTime = (content) => {
    const text = content.replace(/<[^>]*>/g, "");
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / 200);
    return Math.max(5, minutes);
};
//# sourceMappingURL=helper.js.map