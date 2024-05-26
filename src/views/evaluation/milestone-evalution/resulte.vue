<template>
    <div class="pdf-editor">
      <h1>PDF Editor</h1>
      <input type="file" @change="handleFileUpload" />
      <div v-if="documentUrl">
        <iframe :src="documentUrl" width="100%" height="500px"></iframe>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import pdfFillerService from '../../../stores/pdfFillerService';
  
  export default {
    setup() {
      const documentUrl = ref(null);
  
      const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const response = await pdfFillerService.uploadDocument(file);
            const documentId = response.data.document_id;
            const editResponse = await pdfFillerService.editDocument(documentId);
            documentUrl.value = editResponse.data.edit_url;
          } catch (error) {
            console.error('Error uploading or editing document:', error);
          }
        }
      };
  
      return {
        documentUrl,
        handleFileUpload,
      };
    },
  };
  </script>
  
  <style scoped>
  .pdf-editor {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  </style>
  