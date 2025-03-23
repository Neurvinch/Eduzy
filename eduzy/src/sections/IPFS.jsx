import React, { useState } from 'react';

const UploadToPinataUI = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Your Pinata upload function
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': '9a9aec8860896cdab5ff',
        'pinata_secret_api_key': 'd9b46c9c92310ed537bb6fee7dd3b54320438f01f4cf80c992b699c6fc778b96',
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload file to IPFS');
    }

    const json = await res.json();
    return json.IpfsHash;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIpfsHash(''); // Reset previous hash
    setErrorMessage(''); // Clear previous errors
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file first!');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setIpfsHash('');

    try {
      const hash = await uploadToPinata(file);
      setIpfsHash(hash);
      console.log('Uploaded to IPFS with hash:', hash);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Upload to IPFS with Pinata</h1>

      {/* File Input */}
      <div style={styles.inputContainer}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*" // Restrict to video files; adjust as needed
          style={styles.fileInput}
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isUploading}
        style={{
          ...styles.button,
          ...(isUploading ? styles.buttonDisabled : {}),
        }}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>

      {/* Feedback Messages */}
      {ipfsHash && (
        <div style={styles.success}>
          <p>Upload successful!</p>
          <p>
            IPFS Hash:{' '}
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {ipfsHash}
            </a>
          </p>
        </div>
      )}
      {errorMessage && (
        <p style={styles.error}>{errorMessage}</p>
      )}
    </div>
  );
};

// Basic CSS styles
const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  success: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
  },
  error: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'underline',
  },
};

export default UploadToPinataUI;