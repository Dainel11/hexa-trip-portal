export type Row = Record<string, string>;

export interface EventInfo {
  eventName: string;
  location: string;
  startDate: string;
  endDate: string;
  tagline: string;
  heroImage: string;
  collectionNote: string;
  [key: string]: string;
}

export interface ItineraryItem {
  date: string; time: string; activity: string; venue: string;
  meal: string; dressCode: string; pic: string;
}
export interface RoomRow { roomId: string; roomType: string; roomLeader: string; name: string; costType: string; }
export interface TransportRow { vehicle: string; vehicleId: string; vehicleType: string; plate: string; isDriver: boolean; pic: string; name: string; pickupPoint: string; pickupTime: string; }
export interface TshirtRow { name: string; safariSize: string; waterworldSize: string; }
export interface PaymentRow { familyGroup: string; amountDue: string; amountPaid: string; balance: string; status: string; paxCount: string; paxAges: string; }
export interface AllowanceRow { item: string; amount: string; notes: string; }
export interface ContactRow { name: string; role: string; phone: string; }
export interface DressCodeRow { day: string; theme: string; description: string; image: string; teeColour: string; confirmed: string; }
export interface RoomTypeRow { code: string; label: string; }
export interface PaxRow { staffName: string; paxName: string; type: string; age: string; }
export interface RestaurantRow { name: string; cuisine: string; location: string; notes: string; mapLink: string; image: string; }
export interface LocationRow { name: string; address: string; mapLink: string; notes: string; image: string; }
export interface DosDontsRow { type: string; item: string; category: string; }
export interface ParkingRow { area: string; capacity: string; notes: string; mapLink: string; }
