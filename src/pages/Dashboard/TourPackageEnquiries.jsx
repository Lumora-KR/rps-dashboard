// // client/src/pages/Dashboard/TourPackageEnquiries.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Box,
//   Grid,
//   Paper,
//   CircularProgress,
//   Divider,
//   Chip,
// } from "@mui/material";
// import { Bar } from "react-chartjs-2";
// import EnquiryList from "../../components/EnquiryList/EnquiryList";
// import { api } from "../../utils/api";
// import "./Dashboard.css";

// // Tour Package enquiry details component
// const TourPackageEnquiryDetails = ({ row }) => {
//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12} md={6}>
//         <Typography variant="subtitle1" gutterBottom>
//           Customer Information
//         </Typography>
//         <Box className="details-section">
//           <Typography variant="body2">
//             <strong>Name:</strong> {row.name}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Email:</strong> {row.email}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Phone:</strong> {row.phone}
//           </Typography>
//         </Box>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <Typography variant="subtitle1" gutterBottom>
//           Package Details
//         </Typography>
//         <Box className="details-section">
//           <Typography variant="body2">
//             <strong>Package Type:</strong> {row.packageType}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Travel Date:</strong>{" "}
//             {new Date(row.travelDate).toLocaleDateString()}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Duration:</strong> {row.duration || "Not specified"}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Travelers:</strong> {row.travelers || "Not specified"}
//           </Typography>
//         </Box>
//       </Grid>

//       <Grid item xs={12}>
//         <Typography variant="body2" color="textSecondary">
//           <strong>Submitted:</strong> {new Date(row.createdAt).toLocaleString()}
//         </Typography>
//       </Grid>
//     </Grid>
//   );
// };

// const TourPackageEnquiries = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [enquiries, setEnquiries] = useState([]);
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     const fetchTourPackageEnquiries = async () => {
//       try {
//         setLoading(true);

//         // Fetch tour package enquiries and chart data
//         const [enquiriesRes, chartDataRes] = await Promise.all([
//           api.getHomeEnquiriesByType("tourPackages"),
//           api.getHomeEnquiriesChartData("tourPackages"),
//         ]);

//         setEnquiries(enquiriesRes.data);
//         setChartData(chartDataRes.data);
//       } catch (err) {
//         console.error("Error fetching tour package enquiries:", err);
//         setError(
//           "Failed to load tour package enquiries. Please try again later."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTourPackageEnquiries();
//   }, []);

//   // Table columns configuration
//   const columns = [
//     {
//       id: "name",
//       label: "Customer Name",
//       align: "left",
//     },
//     {
//       id: "packageType",
//       label: "Package Type",
//       align: "left",
//     },
//     {
//       id: "travelDate",
//       label: "Travel Date",
//       align: "left",
//       format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
//     },
//     {
//       id: "duration",
//       label: "Duration",
//       align: "left",
//       format: (value) => value || "Not specified",
//     },
//     {
//       id: "travelers",
//       label: "Travelers",
//       align: "left",
//       format: (value) => value || "Not specified",
//     },
//     {
//       id: "createdAt",
//       label: "Submitted On",
//       align: "right",
//       format: (value) => new Date(value).toLocaleDateString(),
//     },
//   ];

//   if (loading) {
//     return (
//       <Box className="loading-container">
//         <CircularProgress />
//         <Typography variant="body1" sx={{ mt: 2 }}>
//           Loading tour package enquiries...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <div className="tour-package-enquiries-page">
//       <Typography variant="h4" component="h1" className="page-title">
//         Tour Package Enquiries
//       </Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Paper className="chart-container" elevation={2}>
//             <Box className="chart-header">
//               <Typography variant="h6">
//                 Daily Tour Package Enquiries (Last 30 Days)
//               </Typography>
//               <Chip
//                 label={`Total: ${enquiries.length}`}
//                 color="primary"
//                 size="small"
//               />
//             </Box>
//             <Divider />
//             <Box className="chart-content">
//               {chartData ? (
//                 <Bar
//                   data={{
//                     ...chartData,
//                     datasets: [
//                       {
//                         ...chartData.datasets[0],
//                         backgroundColor: "rgba(244, 67, 54, 0.5)",
//                         borderColor: "rgba(244, 67, 54, 1)",
//                       },
//                     ],
//                   }}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: {
//                         display: false,
//                       },
//                     },
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           precision: 0,
//                         },
//                       },
//                     },
//                   }}
//                   height={300}
//                 />
//               ) : (
//                 <Box className="no-chart-data">
//                   <Typography variant="body1">
//                     No chart data available
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           </Paper>
//         </Grid>

//         <Grid item xs={12}>
//           <EnquiryList
//             data={enquiries}
//             columns={columns}
//             detailsComponent={TourPackageEnquiryDetails}
//             loading={loading}
//             error={error}
//           />
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default TourPackageEnquiries;
