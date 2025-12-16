import React from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import Dashboard from '@uppy/react/dashboard';

import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";

const uppy = new Uppy({
  autoProceed: false,
  restrictions: {
    maxNumberOfFiles: 20,
  },

  onBeforeUpload(files) {
    Object.values(files).forEach((file) => {
      file.meta.filename = file.name;
      file.meta.type = file.type;
    });
  }
}).use(Tus, {
  endpoint: "http://localhost:4000/files",
  retryDelays: [0, 1000, 3000, 5000],
});

const App = () => {
  return (
    <>
      <div style={{ padding: 40 }}>
        <h2>Resumable Upload Demo (TUS)</h2>
        <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />
      </div>
    </>
  )
}

export default App;
