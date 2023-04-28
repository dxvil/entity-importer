import { Donation } from '../donation.entity';

export function filterUSDDonation(donations: Donation[]) {
  const filteredByUSD: Donation[] = Object.values(
    donations.filter((d) => d.amount.includes('USD')),
  );

  if (filteredByUSD.length === 0) return [];

  return filteredByUSD.map((d) => {
    d.amount = d.amount.replace('USD', '').replace(' ', '');
    return d;
  });
}
