export interface CreatePatient {
    networkId: string;
    upid: string;
    abha: string;
    mrn: string;
    identifier: {
      aadhar: string;
      pan: string;
    };
    namePrefix?: string;
    nameGiven: string;
    nameMiddle?: string;
    nameFamily: string;
    nameSuffix?: string;
    preferredName?: string;
    birthDate: string;
    deathDate?: string | null;
    genderIdentity: string;
    biologicalSex: string;
    preferredPronouns?: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    contact: {
      email: string;
      phone: string;
      mobilePhone?: string;
    };
    preferredLanguage?: string;
    interpreterRequired: boolean;
    maritalStatus?: string;
    race?: { category: string };
    ethnicity?: string;
    emergencyContacts?: {
      name: string;
      relationship: string;
      phone: string;
    }[];
    preferredPharmacy?: string;
    primaryCareProvider?: string;
    active: boolean;
    preferences?: {
      contactMethod: string;
      appointmentReminders: boolean;
    };
    bloodType?: string;
    organDonor?: boolean;
    advanceDirectives?: {
      livingWill: boolean;
      powerOfAttorney?: string;
    };
  }
  