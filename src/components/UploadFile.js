import {  useCallback  } from "react";
import "../styles/AlbumPageStyle.scss";
import "../styles/UploadStyle.scss";
import useUploadImage from '../hooks/useUploadImage'
import { useDropzone } from 'react-dropzone'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Alert from 'react-bootstrap/Alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

function UploadFile() {

    const uploadImage = useUploadImage()

	const onDrop = useCallback((acceptedFiles) => {
		if (!acceptedFiles.length) {
			return
		}

         acceptedFiles.forEach((file) => {
                uploadImage.mutate(file)
            })
	}, [])

	const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
		accept: 'image/gif, image/jpeg, image/png, image/webp',
		maxFiles: 100,
		onDrop,
	})



    return (
                <div
            {...getRootProps()}
            id="dropzoneWrapper"
            className={`${isDragAccept ? 'drag-accept' : ''}${isDragReject ? 'drag-reject' : ''}`}
        >
            <input  {...getInputProps()} />

            <div className="indicator">
                {
                    isDragActive
                        ?   (
                            
                            isDragAccept
                                ? <p>Drop here</p>
                                : <p>Incorrect file format</p>
                        )
                        : <> <p>Drop files here or click to upload</p>
                        <FontAwesomeIcon icon={faCloudUploadAlt} size="lg" />
                        
                        </> }
            {uploadImage.progress !== null && <ProgressBar variant="success" animated now={uploadImage.progress} />}

            {uploadImage.isError && <Alert variant="warning">{uploadImage.error}</Alert>}
            {uploadImage.isSuccess && <Alert variant="success">File Successfully Uploaded</Alert>}
            </div>

            
        </div>
    )
}

export default UploadFile
