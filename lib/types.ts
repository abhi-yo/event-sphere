export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export interface User {
  _id: string;
  email: string;
  isAdmin: boolean;
  adminLevel: string;
  isActive: boolean;
}
