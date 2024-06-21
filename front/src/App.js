import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CookieConsent from 'react-cookie-consent';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('360p');
  const [folderPath, setFolderPath] = useState('');
  const [message, setMessage] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('mp4');

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const handleDownload = async () => {
    // Check if any of the required fields is empty
    if (!url || !folderPath) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields (URL and Download Folder).',
      });
      return;
    }

    try {
      setMessage('Downloading Process...');
      setDownloadProgress(0);

      const response = await axios.post('http://localhost:5000/download', {
        url,
        quality: selectedFormat === 'mp4' ? quality : null,
        folder_path: folderPath,
        format: selectedFormat,
      }, {
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDownloadProgress(percentCompleted);
        }
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error: ${error.response.data.error}`);
    }
  };

  return (
      

    <div className="container">
      <CookieConsent
       location="bottom"
       buttonText="Accept"
       declineButtonText="Not Accept"
       cookieName="myAwesomeCookieName"
       style={{ background: '#2B373B' }}
       buttonStyle={{ color: '#4e503b', fontSize: '15px', padding: '10px' }}
       expires={150}
       onDecline={() => {
         console.log('User declined cookies');
       }}
     >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
       <h1>Media Downloader</h1>
      <label>
        Media URL (Video, Playlist, or Album):
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <br />
      <label>
        Download Format:
        <select value={selectedFormat} onChange={(e) => handleFormatChange(e.target.value)}>
          <option value="mp4">MP4</option>
          <option value="mp3">MP3</option>
        </select>
      </label>
      <br />
      {selectedFormat === 'mp4' && (
        <label>
          Video Quality:
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="360p">360p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </label>
      )}
      <br />
      <label>
        Download Folder:
        <input type="text" value={folderPath} onChange={(e) => setFolderPath(e.target.value)} />
      </label>
      <br />
      <button onClick={handleDownload}>Start Download</button>
      {downloadProgress > 0 && <p>Downloading Process: {downloadProgress}%</p>}
      <p>{message}</p>
    </div>
  );
};

export default App;
