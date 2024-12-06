// // authHelpers.js
// import axios from 'axios';

// export const apiRequest = async (url, setError, setArticles, fetchArticles) => {
//   const token = localStorage.getItem('authToken');
//   if (!token) {
//     setError("You need to log in to access the articles.");
//     console.log("You need to log in to access the articles.");
//     return;
//   }

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("data", response.data);
//     setArticles(response.data);
//   } catch (error) {
//     console.error(error); // Log errors for debugging

//     if (error.response && error.response.status === 401) {
//       // Token expired, set error message
//       localStorage.removeItem('authToken');
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         setError("Your session has expired. Please log in again.");
//         return;
//       }
//       try {
//         const response = await axios.post('http://localhost:3000/auth/refresh-token', {
//           refreshToken,
//         });
//         localStorage.setItem('authToken', response.data.accessToken);
//         // Call fetchArticles again to fetch articles with the new access token
//         fetchArticles();
//       } catch (error) {
//         console.error(error); // Log errors for debugging
//         setError("Your session has expired. Please log in again.");
//       }
//     }
//   }
// };