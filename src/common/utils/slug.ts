import * as slug from 'slug';

export const slugify = (data: string) => {
  if (!data) {
    data = '';
  }
  return slug(data?.trim(), '_');
};
