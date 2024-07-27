export const slugify = (data: string) => {
  if (!data) {
    data = '';
  }
  return data?.trim()?.split(' ').join('-');
};
