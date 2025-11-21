import { Booking } from '../constants/Types';

const mockBookings: Booking[] = [];

export const bookingService = {
  createBooking: async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBooking: Booking = {
          ...bookingData,
          id: `booking_${Date.now()}`,
          status: 'pending',
        };
        mockBookings.push(newBooking);
        resolve(newBooking);
      }, 500);
    });
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userBookings = mockBookings.filter(b => b.entrepreneurId === userId);
        resolve(userBookings);
      }, 300);
    });
  },

  getExpertBookings: async (expertId: string): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expertBookings = mockBookings.filter(b => b.expertId === expertId);
        resolve(expertBookings);
      }, 300);
    });
  },

  updateBookingStatus: async (
    bookingId: string,
    status: Booking['status']
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = mockBookings.find(b => b.id === bookingId);
        if (booking) {
          booking.status = status;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },
};