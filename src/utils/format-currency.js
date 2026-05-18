import numeral from 'numeral';

export function fCurrency(number, currency = 'AED') {
  const formatted = numeral(number).format('0,0.00');
  return `${formatted} ${currency}`;
}

export function fNumber(number) {
  return numeral(number).format();
}
