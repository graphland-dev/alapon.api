function variableInjector(
  obj: any,
  data: string,
  variableIdentifiers = ['#_#', '{{_}}', '%_%'],
) {
  let newString = data;
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    variableIdentifiers.forEach((identifier) => {
      const [start, end] = identifier.split('_');
      const regEx = new RegExp(`${start}\\s*${key}\\s*${end}`, 'g');
      newString = newString.replace(regEx, obj[key]);
    });
  });
  return newString;
}

export default variableInjector;
