export interface Client {
  id: number;
  name: string;
  logo: string;
  indicators: {
    mouvements: number;
    joursRetards: number;
    etablissementsInconnus: number;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
    person: string;
  };
  meetings: {
    title: string;
    date: string;
    heure: string;
    with: string;
  }[];
  visits: {
    location: string;
    date: string;
    comment: string;
  }[];
  
  // Additional fields for client-assign component
  employees: Employee[];
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  contractType: string;
  contractStartDate: string;
  position: string;
  department: string;
  medicalMonitoring: string;
  employeeNumber: string;
  phone: string;
  pcsCode: string;
  
  assistant: {
    name: string;
    phone: string;
    email: string;
  };
  
  establishment: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    portalUrl: string;
    identifier: string;
  };
  
  visits: MedicalVisit[];
  appointments: MedicalAppointment[];
  
  currentAssistantStatus?: string;
}

export interface MedicalVisit {
  type: string;
  status: string;
  scheduledDate: string;
  performedDate?: string;
  monitoring?: string;
  fitForWork?: boolean;
}

export interface MedicalAppointment {
  date: string;
  sent?: boolean;
  received?: boolean;
  options?: string;
  accelerated?: boolean;
  external?: boolean;
  rescheduled?: boolean;
  tuesday?: boolean;
  comment?: string;
}