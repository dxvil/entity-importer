import { DonationSign } from '../donation-sign';
import { Donation } from '../donation.entity';

export const transformDonation = (donation: Donation): Donation => {
  const transoformByDonationSign: Donation = {
    ...donation,
    donationSign: DonationSign.USD,
  };

  const [value, sign] = transoformByDonationSign.amount.split(' ');

  transoformByDonationSign.amount = value;
  transoformByDonationSign.donationSign = DonationSign[sign];

  return transoformByDonationSign;
};
