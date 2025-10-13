export const getColumnSize = (type: string) => {
  switch (type) {
    case "rich-text":
      return {
        size: 12,
        minSize: 12,
        maxSize: Number.MAX_SAFE_INTEGER,
      };
    case "text":
      return {
        size: 8,
        minSize: 8,
        maxSize: Number.MAX_SAFE_INTEGER,
      };
    case "number":
      return {
        size: 4,
        minSize: 4,
        maxSize: 8,
      };
    case "assignee":
      return {
        size: 15,
        minSize: 15,
        maxSize: 15,
      };
    case "date-time":
      return {
        size: 11,
        minSize: 11,
        maxSize: 11,
      };
    case "date":
      return {
        size: 8,
        minSize: 8,
        maxSize: 8,
      };
    case "enum":
      return {
        size: 12,
        minSize: 12,
        maxSize: Number.MAX_SAFE_INTEGER,
      };
    case "master-single":
    case "single-select":
      return {
        size: 12,
        minSize: 12,
        maxSize: Number.MAX_SAFE_INTEGER,
      };
    case "attachment":
    case "image-single":
    case "image-multi":
      return {
        size: 6,
        minSize: 6,
        maxSize: 12,
      };
    default:
      return {
        size: 8,
        minSize: 8,
        maxSize: Number.MAX_SAFE_INTEGER,
      };
  }
};
