export const extractPath = (s = ''): string[] => {
  let paths = [];

  if (s.includes('zkb')) {
    if (s.includes('zkb-referral')) paths.push('zkb-referral');
    paths.push('zkb-direct');
  }
  if (s.includes('heyflow')) paths.push('jurata-heyflow');
  if (s.includes('retool')) paths.push('jurata-retool');
  if (s.includes('checkout')) paths.push('jurata-checkout');
  if (s.includes('forestadmin')) paths.push('jurata-forestadmin');
  if (s.includes('consultation')) paths.push('jurata-consultation');

  if (s.includes('gclid%3D') || s.includes('gclid=')) {
    // https://traffic3.net/wissen/datenschutz/google-cookies
    paths.push('google-paid');
  } else if (s.includes('_gcl_aw')) {
    paths.push('google-paid');
  } else if (s.includes('https://www.google.')) {
    paths.push('google-organic');
  }

  return paths;
};
