const formatUsername = (x: string) => {
  const y = x.replace(/[^A-Za-z._0-9]/g, '');

  return y.replace(/\s/g, '').toLowerCase();
};

export default formatUsername;
