import axios from 'axios';

const apiKey = 'YOUR_API_KEY_HERE';  // Replace with your PDFfiller API key
const apiUrl = 'https://api.pdffiller.com/v1';

const pdfFillerService = {
  uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${apiUrl}/document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${apiKey}`
      }
    });
  },

  getDocument(documentId) {
    return axios.get(`${apiUrl}/document/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
  },

  editDocument(documentId) {
    return axios.get(`${apiUrl}/document/${documentId}/edit`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
  },

  // Add more methods as needed
};

export default pdfFillerService;
