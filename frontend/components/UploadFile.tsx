import { useRef, useState } from "react";


export default function UploadFile(props: { useFile: (arg0: any) => void; }) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
    
  // handle drag events
  const handleDrag = function(e: { preventDefault: () => void; stopPropagation: () => void; type: string; }) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  function handleFile(files:any) {
    props.useFile(files[0]);
  }
  // triggers when file is selected with click
  const handleChange = function(e: { preventDefault: () => void; target: { files: any[]; }; }) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef?.current.click();
  };
  const handleDrop = function(e: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any[]; }; }) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };
    
  
      
  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
      <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
        <div>
          <p>Drag and drop your file here or</p>
          <button className="upload-button" onClick={onButtonClick}>Click here to upload file</button>
        </div> 
      </label>
      { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
    </form>
  );
};