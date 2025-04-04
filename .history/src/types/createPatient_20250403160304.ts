// export interface Address {
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
// }

// export type UUID = string;

// export interface Contact {
//   email: string;
//   phone: string;
//   mobilePhone: string;
// }

// export interface Identifier {
//   aadhar: string;
//   pan: string;
// }

// export interface EmergencyContact {
//   name: string;
//   relationship: string;
//   phone: string;
// }


// export interface Patient {
//   id:string;
//   networkId: string; // Disabled in UI
//   upid: string;
//   abha: string;
//   mrn: string;
//   identifier: Identifier;
//   namePrefix: string;
//   nameGiven: string;
//   nameMiddle?: string;
//   nameFamily: string;
//   nameSuffix?: string;
//   preferredName?: string;
//   birthDate: string;
//   deathDate?: string|null;
//   genderIdentity: "male" | "female" | "other";
//   biologicalSex: "male" | "female" | "other";
//   preferredPronouns?: string;
//   address: Address;
//   contact: Contact;
//   preferredLanguage?: string;
//   interpreterRequired: boolean;
//   maritalStatus?: string;
//   race?: object;
//   ethnicity?: string;
//   emergencyContacts?: EmergencyContact[];
//   preferredPharmacy?: UUID|null;
//   primaryCareProvider?: UUID|null;
//   active: boolean;
//   preferences?: object;
//   bloodType?: string;
//   organDonor: boolean;
//   advanceDirectives?: object;
// }
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



export interface Preferences {
  contactMethod: string;
  appointmentReminders: boolean;
}

export interface AdvanceDirectives {
  livingWill: boolean;
  powerOfAttorney: string;
}

export interface Race {
  category: string;
}

export interface Patient {
  abha: string;
  mrn: string;
  identifier: Identifier;
  namePrefix: string;
  nameGiven: string;
  nameMiddle: string;
  nameFamily: string;
  nameSuffix: string;
  preferredName: string;
  birthDate: string;
  deathDate: string | null;
  genderIdentity: "male" | "female" | "other";
  biologicalSex: "male" | "female" | "other";
  preferredPronouns: string;
  address: Address;
  contact: Contact;
  preferredLanguage: string;
  interpreterRequired: boolean;
  maritalStatus: string;
  race: Race;
  ethnicity: string;
  emergencyContacts: EmergencyContact[]; // Kept as an array
  active: boolean;
  preferences: Preferences;
  bloodType: string;
  organDonor: boolean;
  advanceDirectives: AdvanceDirectives;
  statusId: number;
}
