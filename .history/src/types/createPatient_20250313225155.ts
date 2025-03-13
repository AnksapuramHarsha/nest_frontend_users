export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  email: string;
  phone: string;
  mobilePhone: string;
}

export interface Identifier {
  aadhar: string;
  pan: string;
}

export interface Patient {
  networkId: string; // Disabled in UI
  upid: string;
  abha: string;
  mrn: string;
  identifier: Identifier;
  namePrefix: string;
  nameGiven: string;
  nameMiddle?: string;
  nameFamily: string;
  nameSuffix?: string;
  preferredName?: string;
  birthDate: string;
  deathDate?: null;
  genderIdentity: "male" | "female" | "other";
  biologicalSex: "male" | "female" | "other";
  preferredPronouns?: string;
  address: Address;
  contact: Contact;
  preferredLanguage?: string;
  interpreterRequired: boolean;
  maritalStatus?: string;
  race?: object;
  ethnicity?: string;
  emergencyContacts?: string[];
  preferredPharmacy?: string;
  primaryCareProvider?: string;
  active: boolean;
  preferences?: object;
  bloodType?: string;
  organDonor: boolean;
  advanceDirectives?: object;
}
