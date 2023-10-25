import jwt from 'jsonwebtoken';

export const signJWTToken = () => {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 10000,
      data: JSON.stringify({
        _id: 'allow',
      }),
    },
    process.env.COCKPIT_TOKEN_SECRET
  );
};

export const nonGermanSlugify = (string: string) => {
  const a =
    'äàáâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñöòóôœøṕŕřßşśšșťțüùúûǘůűūųẃẍÿýźžż·/_,:;ÄÀÁÂÃÅĂÆĄÇĆČĐĎÈÉĚĖËÊĘĞǴḦÌÍÏÎĮŁḾǸŃŇÑÖÒÓÔŒØṔŔŘSSŞŚŠȘŤȚÜÙÚÛǗŮŰŪŲẂẌŸÝŹŽŻ';
  const b =
    'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrssssssttuuuuuuuuuwxyyzzz';
  const p = new RegExp(a.split('').join('|'), 'g');

  const f = string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '-') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  return f;
};

export const unflatObject = (o: Object) => {
  const unflatObject = {};

  Object.keys(o).forEach((k) => {
    if (k.includes('@@@')) {
      const split = k.split('@@@');
      const result = unflatObject;
      let temp = result;
      for (let i = 0; i < split.length; i++) {
        const subkey = split[i];
        if (i < split.length - 1) {
          temp[subkey] = {};
          temp = temp[subkey];
        } else {
          temp[subkey] = o[k];
        }
      }
    } else {
      unflatObject[k] = o[k];
    }
  });

  return unflatObject;
};

export const getParentId = (s: string) => {
  return s.split('.')[0];
};

export const emailValidation =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
