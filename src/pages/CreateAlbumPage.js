import { useState} from "react";
import { useAuthContext } from "../contexts/AuthContext";
import "../styles/UploadStyle.scss"
import { Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { db, storage } from '../firebase'
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection,   } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'
import "../styles/CreateAlbumStyle.scss"


function CreateAlbumPage() {
    const { currentUser} = useAuthContext();
    const fns = require('date-fns')
    const {statusMsg, setStatusMsg} = useState("")
    const navigate = useNavigate()


    const onSubmit = async (data, e) => {
    e.preventDefault();
    const currentDate = Date.now();
    const documentID = data.name +currentDate
    
        
        const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm")
    
        const file = data.image[0]
        const storageRef = ref(storage, `images/${currentTime}-${data.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            switch (snapshot.state) {
              case 'paused':
                break;
              case 'running':
                break;
            }
          }, 
          (error) => {
            setStatusMsg(error);
            switch (error.code) {
              case 'storage/unauthorized':
                break;
              case 'storage/canceled':
                break;
        
              // ...
        
              case 'storage/unknown':
                break;
            }
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               addDoc(collection(db, "albums"), {
                created_by: currentUser.displayName,
                creator_uid: currentUser.uid,
                created_at: currentTime,
                image_src: downloadURL,
                name: data.name,
                uid: documentID,
                path: storageRef.fullPath,
              })
            });
          }
        )
        reset();
        navigate(`/album/${documentID}`)
        }

    const {
        register,
        handleSubmit,
        reset,
      } = useForm()

    return (
        <div className="createContainer">
        <h1>Create an album</h1>

        <div className="addRecipeContainer">
                <Form className="addAlbumForm" onSubmit={handleSubmit(onSubmit)}>

                    <input
                      className="form-control"
                      {...register("name", { required: true })}
                      
                      placeholder="Album name"
                    />

      <div className="uploadFile"> <p>Add Album Cover Image</p></div>
      <input
      
      {...register("image", {required: true})}
      type="file"></input>
      

      <button type="submit" className="authButton">Create Album</button>
                  
                </Form>
              </div>
            

       
        
    </div>
    )
}

export default CreateAlbumPage
