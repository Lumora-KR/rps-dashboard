// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add token to requests if available
// const token = localStorage.getItem("token");
// if (token) {
//   api.defaults.headers.common["x-auth-token"] = token;
// }

// // API service functions
// const apiService = {
//   // Dashboard overview data
//   getDashboardStats: async () => {
//     try {
//       const [
//         // tourPackages,
//         tourPackageDetails,
//         carRentalDetails,
//         contactForms,
//         hotelEnquiries,
//       ] = await Promise.all([
//         // api.get("/api/tour-packages"),
//         api.get("/api/tour-package-detail"),
//         api.get("/api/car-rental-detail"),
//         api.get("/api/contact"),
//         api.get("/api/hotel-enquiries"),
//       ]);

//       return {
//         // tourPackages: tourPackages.data.data.length,
//         tourPackageDetails: tourPackageDetails.data.data.length,
//         carRentalDetails: carRentalDetails.data.data.length,
//         contactForms: contactForms.data.data.length,
//         hotelEnquiries: hotelEnquiries.data.data.length,
//       };
//     } catch (error) {
//       console.error("Error fetching dashboard stats:", error);
//       throw error;
//     }
//   },

//   // Chart data
//   // getChartData: async () => {
//   //   try {
//   //     const [
//   //       tourPackageDetails,
//   //       carRentalDetails,
//   //       contactForms,
//   //       hotelEnquiries,
//   //     ] = await Promise.all([
//   //       // api.get("/api/tour-package-detail/stats/chart"),
//   //       api.get("/api/car-rental-detail/stats/chart"),
//   //       api.get("/api/contact/chart"),
//   //       api.get("/api/hotel-enquiries/stats/chart"),
//   //     ]);

//   //     return {
//   //       tourPackageDetails: tourPackageDetails.data.data,
//   //       carRentalDetails: carRentalDetails.data.data.timeSeriesData,
//   //       contactForms: contactForms.data.data,
//   //       hotelEnquiries: hotelEnquiries.data.data.timeSeriesData,
//   //     };
//   //   } catch (error) {
//   //     console.error("Error fetching chart data:", error);
//   //     throw error;
//   //   }
//   // },
//   getChartData: async () => {
//     try {
//       // Try to fetch all chart data, but handle individual failures
//       let tourPackageDetails = null;
//       let carRentalDetails = null;
//       let contactForms = null;
//       let hotelEnquiries = null;

//       try {
//         const response = await api.get("/api/tour-package-detail/stats/chart");
//         tourPackageDetails = response.data.data;
//       } catch (error) {
//         console.error("Error fetching tour package details chart data:", error);
//         // Set default data
//         tourPackageDetails = {
//           labels: [],
//           datasets: [{ label: "Tour Package Enquiries", data: [] }],
//         };
//       }

//       try {
//         const response = await api.get("/api/car-rental-detail/stats/chart");
//         carRentalDetails = response.data.data.timeSeriesData;
//       } catch (error) {
//         console.error("Error fetching car rental details chart data:", error);
//         // Set default data
//         carRentalDetails = {
//           labels: [],
//           datasets: [{ label: "Car Rental Enquiries", data: [] }],
//         };
//       }

//       try {
//         const response = await api.get("/api/contact/chart");
//         contactForms = response.data.data;
//       } catch (error) {
//         console.error("Error fetching contact forms chart data:", error);
//         // Set default data
//         contactForms = {
//           labels: [],
//           datasets: [{ label: "Contact Form Submissions", data: [] }],
//         };
//       }

//       try {
//         const response = await api.get("/api/hotel-enquiries/stats/chart");
//         hotelEnquiries = response.data.data.timeSeriesData;
//       } catch (error) {
//         console.error("Error fetching hotel enquiries chart data:", error);
//         // Set default data
//         hotelEnquiries = {
//           labels: [],
//           datasets: [{ label: "Hotel Enquiries", data: [] }],
//         };
//       }

//       return {
//         tourPackageDetails,
//         carRentalDetails,
//         contactForms,
//         hotelEnquiries,
//       };
//     } catch (error) {
//       console.error("Error fetching chart data:", error);
//       // Return default data structure
//       return {
//         tourPackageDetails: {
//           labels: [],
//           datasets: [{ label: "Tour Package Enquiries", data: [] }],
//         },
//         carRentalDetails: {
//           labels: [],
//           datasets: [{ label: "Car Rental Enquiries", data: [] }],
//         },
//         contactForms: {
//           labels: [],
//           datasets: [{ label: "Contact Form Submissions", data: [] }],
//         },
//         hotelEnquiries: {
//           labels: [],
//           datasets: [{ label: "Hotel Enquiries", data: [] }],
//         },
//       };
//     }
//   },

//   // Tour Package Detail Enquiries
//   getTourPackageDetailEnquiries: async (
//     page = 1,
//     limit = 10,
//     status = "all",
//     search = ""
//   ) => {
//     try {
//       let url = `/api/tour-package-detail?page=${page}&limit=${limit}`;

//       if (status !== "all") {
//         url += `&status=${status}`;
//       }

//       if (search) {
//         url += `&search=${search}`;
//       }

//       const response = await api.get(url);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching tour package detail enquiries:", error);
//       throw error;
//     }
//   },

//   // Update Tour Package Detail Enquiry
//   updateTourPackageDetailEnquiry: async (id, data) => {
//     try {
//       const response = await api.put(`/api/tour-package-detail/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating tour package detail enquiry:", error);
//       throw error;
//     }
//   },

//   // Delete Tour Package Detail Enquiry
//   deleteTourPackageDetailEnquiry: async (id) => {
//     try {
//       const response = await api.delete(`/api/tour-package-detail/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting tour package detail enquiry:", error);
//       throw error;
//     }
//   },

//   // Car Rental Detail Enquiries
//   getCarRentalDetailEnquiries: async (
//     page = 1,
//     limit = 10,
//     status = "all",
//     search = ""
//   ) => {
//     try {
//       let url = `/api/car-rental-detail?page=${page}&limit=${limit}`;

//       if (status !== "all") {
//         url += `&status=${status}`;
//       }

//       if (search) {
//         url += `&search=${search}`;
//       }

//       const response = await api.get(url);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching car rental detail enquiries:", error);
//       throw error;
//     }
//   },

//   // Update Car Rental Detail Enquiry
//   updateCarRentalDetailEnquiry: async (id, data) => {
//     try {
//       const response = await api.put(`/api/car-rental-detail/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating car rental detail enquiry:", error);
//       throw error;
//     }
//   },

//   // Delete Car Rental Detail Enquiry
//   deleteCarRentalDetailEnquiry: async (id) => {
//     try {
//       const response = await api.delete(`/api/car-rental-detail/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting car rental detail enquiry:", error);
//       throw error;
//     }
//   },

//   // Hotel Enquiries
//   getHotelEnquiries: async (
//     page = 1,
//     limit = 10,
//     status = "all",
//     search = ""
//   ) => {
//     try {
//       let url = `/api/hotel-enquiries?page=${page}&limit=${limit}`;

//       if (status !== "all") {
//         url += `&status=${status}`;
//       }

//       if (search) {
//         url += `&search=${search}`;
//       }

//       const response = await api.get(url);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching hotel enquiries:", error);
//       throw error;
//     }
//   },

//   // Update Hotel Enquiry
//   updateHotelEnquiry: async (id, data) => {
//     try {
//       const response = await api.put(`/api/hotel-enquiries/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating hotel enquiry:", error);
//       throw error;
//     }
//   },

//   // Delete Hotel Enquiry
//   deleteHotelEnquiry: async (id) => {
//     try {
//       const response = await api.delete(`/api/hotel-enquiries/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting hotel enquiry:", error);
//       throw error;
//     }
//   },

//   // Contact Form Submissions
//   getContactFormSubmissions: async (page = 1, limit = 10, search = "") => {
//     try {
//       let url = `/api/contact?page=${page}&limit=${limit}`;

//       if (search) {
//         url += `&search=${search}`;
//       }

//       const response = await api.get(url);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching contact form submissions:", error);
//       throw error;
//     }
//   },
// };

// export default api;
// export { apiService };
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiLogin = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
const token = localStorage.getItem("token");
if (token) {
  apiLogin.defaults.headers.common["x-auth-token"] = token;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const apiService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard/stats", {
        headers: {
          "x-auth-token": token,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return default data in case of error
      return {
        tourPackageDetails: 0,
        carRentalDetails: 0,
        hotelEnquiries: 0,
        contactForms: 0,
      };
    }
  },

  getChartData: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard/chart-data", {
        headers: {
          "x-auth-token": token,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Return default data in case of error
      return {
        tourPackageDetails: {
          labels: [],
          datasets: [{ data: [] }],
        },
        carRentalDetails: {
          labels: [],
          datasets: [{ data: [] }],
        },
        hotelEnquiries: {
          labels: [],
          datasets: [{ data: [] }],
        },
        contactForms: {
          labels: [],
          datasets: [{ data: [] }],
        },
      };
    }
  },

  getRecentActivity: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard/recent-activity", {
        headers: {
          "x-auth-token": token,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      // Return default data in case of error
      return [];
    }
  },

  getQuickStats: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard/quick-stats", {
        headers: {
          "x-auth-token": token,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching quick stats:", error);
      // Return default data in case of error
      return {
        today: 0,
        week: 0,
        month: 0,
        conversionRate: 0,
      };
    }
  },

  // Contact Form
  getContactFormSubmissions: async () => {
    try {
      const response = await api.get("/contact-form");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching contact form submissions:", error);
      return [];
    }
  },

  updateContactFormSubmission: async (id, data) => {
    try {
      const response = await api.put(`/contact-form/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating contact form submission:", error);
      throw error;
    }
  },

  deleteContactFormSubmission: async (id) => {
    try {
      const response = await api.delete(`/contact-form/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting contact form submission:", error);
      throw error;
    }
  },

  // Tour Package Details
  getTourPackageDetailEnquiries: async (
    page = 1,
    limit = 10,
    status = "all",
    search = ""
  ) => {
    try {
      const response = await api.get("/tour-package-detail", {
        params: { page, limit, status, search },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching tour package detail enquiries:", error);
      return [];
    }
  },

  updateTourPackageDetail: async (id, data) => {
    try {
      const response = await api.put(`/tour-package-detail/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating tour package detail:", error);
      throw error;
    }
  },

  deleteTourPackageDetail: async (id) => {
    try {
      const response = await api.delete(`/tour-package-detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting tour package detail:", error);
      throw error;
    }
  },

  // Home Enquiries
  getHomeEnquiries: async (
    page = 1,
    limit = 10,
    status = "all",
    search = ""
  ) => {
    try {
      const response = await api.get("/home-enquiries", {
        params: { page, limit, status, search },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching home enquiries:", error);
      return [];
    }
  },

  getHomeEnquiriesByType: async (
    type,
    page = 1,
    limit = 10,
    status = "all",
    search = ""
  ) => {
    try {
      const response = await api.get(`/home-enquiries/${type}`, {
        params: { page, limit, status, search },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${type} home enquiries:`, error);
      return [];
    }
  },

  updateHomeEnquiry: async (id, data) => {
    try {
      const response = await api.put(`/home-enquiries/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating home enquiry:", error);
      throw error;
    }
  },

  deleteHomeEnquiry: async (id) => {
    try {
      const response = await api.delete(`/home-enquiries/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting home enquiry:", error);
      throw error;
    }
  },

  // Car Rental Details
  getCarRentalDetailEnquiries: async (
    page = 1,
    limit = 10,
    status = "all",
    search = ""
  ) => {
    try {
      const response = await api.get("/car-rental-detail", {
        params: { page, limit, status, search },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching car rental detail enquiries:", error);
      return [];
    }
  },

  updateCarRentalDetail: async (id, data) => {
    try {
      const response = await api.put(`/car-rental-detail/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating car rental detail:", error);
      throw error;
    }
  },

  deleteCarRentalDetail: async (id) => {
    try {
      const response = await api.delete(`/car-rental-detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting car rental detail:", error);
      throw error;
    }
  },

  // Hotel Enquiries
  getHotelEnquiries: async (
    page = 1,
    limit = 10,
    status = "all",
    search = ""
  ) => {
    try {
      const response = await api.get("/hotel-enquiry", {
        params: { page, limit, status, search },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching hotel enquiries:", error);
      return [];
    }
  },

  updateHotelEnquiry: async (id, data) => {
    try {
      const response = await api.put(`/hotel-enquiry/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating hotel enquiry:", error);
      throw error;
    }
  },

  deleteHotelEnquiry: async (id) => {
    try {
      const response = await api.delete(`/hotel-enquiry/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting hotel enquiry:", error);
      throw error;
    }
  },
};
export default apiLogin;
export { apiService };
