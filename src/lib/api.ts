import axios from 'axios';
// ---------------------------- Student API ------------------------------------------------- //
// export async function resendEmail(email: string) {
//     try {
//       const res = await axios.post("/auth/register/resend-email/", { email });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
// }

export async function getCourses(
  offset = 0,
  pageLimit = 10,
  searchQuery = ''
) {
  try {
    // Replace with your actual API endpoint URL
    const res = await axios.get(
      `https://your-api-url.com/v1/courses?offset=${offset}&limit=${pageLimit}` +
        (searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '')
    );

    return res.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw error;
  }
}
