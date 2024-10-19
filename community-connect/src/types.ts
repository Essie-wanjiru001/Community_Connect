// src/types.ts

export interface BaseProfile {
    id: string; // Add ID if needed
    telephone: string;
    location: string;
    profilePhoto?: string;
  }
  
  export interface ConsumerProfile extends BaseProfile {
    bio: string;
  }
  
  export interface ArtisanProfile extends BaseProfile {
    serviceType: string;
    charges: string;
    availability: { day: string; startTime: string; endTime: string }[];
    servicePhotos?: string[];
    calendarSettings?: {
      bookingNotice: number;
      maxAdvanceBooking: number;
      slotDuration: number;
    };
  }
  
  export interface BusinessProfile extends BaseProfile {
    businessCategory: string;
    openHours: string;
    availability: string;
    servicePhotos?: string[];
  }
  
  export type Profile = ConsumerProfile | ArtisanProfile | BusinessProfile;
  
  export interface User {
    id: string;
    name: string;
    email: string;
    userType: 'consumer' | 'artisan' | 'business';
  }
  