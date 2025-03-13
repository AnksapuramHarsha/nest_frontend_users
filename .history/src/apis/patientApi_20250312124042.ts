export interface Patient {
    id: string;
    abha: string;
    mrn: string;
    nameGiven: string;
    nameFamily: string;
    birthDate: string;
    genderIdentity: string;
    contact: {
      phone: string;
    };
  }
  