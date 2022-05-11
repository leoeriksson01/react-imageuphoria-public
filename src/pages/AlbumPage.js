import {  useEffect, useState, useRef, useCallback  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../styles/AlbumPageStyle.scss";
import "../styles/UploadStyle.scss";
import { db, storage } from '../firebase'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import UploadFile from "../components/UploadFile"
import ImageCard from '../components/ImageCard'
import Button from 'react-bootstrap/Button'
import { Form, Alert } from "react-bootstrap";
import { SRLWrapper } from 'simple-react-lightbox'
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
  } from "@firebase/firestore";
  import Checkbox from "@mui/material/Checkbox";
  import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
  import { useForm} from "react-hook-form";



  const colRef = collection(db, "images");
  const albumRef = collection(db, "albums");

function AlbumPage() {
  const navigate = useNavigate()
  const [selectedImages, setSelectedImages] = useState([])
    const fns = require('date-fns')
    const [allLikedImages, setAllLikedImages] = useState([]);
    const [allDislikedImages, setAllDislikedImages] = useState([]);
    const { currentUser} = useAuthContext();
    const [album, setAlbum] = useState({})
    const { uid } = useParams();
    const {statusMsg, setStatusMsg} = useState("")
    const [alertShowing, setAlertShowing] = useState(false);
    

    const {
      register,
      handleSubmit,
      reset,
    } = useForm()


    // Logic for selecting an image

    const handleSelect = (image  => {

      if(selectedImages.includes(image)){
        setSelectedImages(selectedImages.filter(item => item.docId === Image.docId))
        return
    }
    setSelectedImages([...selectedImages, image]);
  })
  

    // Logic for fetching the album from params
    const albumQuery = query(
      albumRef,
      where("uid", "==", uid),
    );
  
    useEffect(() => {
      onSnapshot(albumQuery, (snapshot) => {
        let album = [];
        snapshot.docs.forEach((doc) => {
          album.push({ ...doc.data(), id: doc.id });
        });
        setAlbum(album[0]);
      });
    }, []);

    // Logic for fetching all images for the current album

    const queryRef = query(
		collection(db, 'images'),
		where("albumuid", "==", uid),
	)
	const { data, isLoading } = useFirestoreQueryData(['images'], queryRef, {
		idField: 'docId',
		subscribe: true,
	}, {
    refetchOnMount: "always",
  }) 


  // Logic for fetching all liked images


   const q = query(
    colRef,
    where("albumuid", "==", uid),
    where("liked", "==", true),
  );

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      let likedImages = [];
      snapshot.docs.forEach((doc) => {
        likedImages.push({ ...doc.data(), id: doc.id });
      });
      setAllLikedImages(likedImages);
    });
  }, []);

  // Logic for fetching all disliked images


  const q2 = query(
    colRef,
    where("albumuid", "==", uid),
    where("liked", "==", false),
    
  );

  useEffect(() => {
    onSnapshot(q2, (snapshot) => {
      let dislikedImages = [];
      snapshot.docs.forEach((doc) => {
        dislikedImages.push({ ...doc.data(), id: doc.id });
      });
      setAllDislikedImages(dislikedImages);
    });
  }, []); 

  // Logic for sending liked images back to photographer

  const sendGallery = () => {
    const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm")
    const currentDate = Date.now();
    const documentID = album.name + currentDate
    
    addDoc(collection(db, "albums"), {
        creator_uid: album.creator_uid,
        created_at: currentTime,
        image_src: allLikedImages[0].image_src,
        uid: documentID,
        name: album.name + "," + currentTime,
        path: album.path,
      })

      allLikedImages.forEach((image) => {
        addDoc(collection(db, "images"), {
            owner: album.creator_uid,
            liked: "",
            created: currentTime,
            path: image.path,
            image_src: image.image_src,
            albumuid: documentID,
          })
      })
      setAlertShowing(true);
      setTimeout(function() {
        navigate("/")
      }, 5000);
      
  }

  // Logic for creating a new album with selected images

  const createNewAlbum = async(data, e) => {
    
    e.preventDefault();
    const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm")
    const currentDate = Date.now();
    const documentID = data.name + currentDate

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
        creator_uid: currentUser.uid,
        created_at: currentTime,
        image_src: downloadURL,
        uid: documentID,
        name: data.name,
        path: storageRef.fullPath,
        created_by: currentUser.displayName
      })

      selectedImages.forEach((image) => {
        addDoc(collection(db, "images"), {
            owner: currentUser.uid,
            liked: "",
            created: currentTime,
            path: image.path,
            image_src: image.image_src,
            albumuid: documentID,
          })
      })
  }
            )
})
reset();
        navigate(`/album/${documentID}`)
      }



    return (
        <div className="albumPageContainer">
              {album && (
               <> 
                <div className="albumMain"> 
                <h2> {album?.name} </h2>
                <h3> Uploaded  {album.created_by ? ("by " + album.created_by)  : ""} {album.created_at} </h3>
                <div className="albumRow"> 
                {currentUser?.uid === album?.creator_uid && ( <div className="albumAddImages">
               <UploadFile />
               
                  </div>) }
                <div className="albumGrid">
                    {data && (
                        <>
                        {data.map((image, i) => (
                          <div key={i}>
                    <ImageCard image={image} key={i}> </ImageCard>
                    <div className="imageCheckbox"> 
                    {currentUser && 
                      <Checkbox image={image} onChange={() => (handleSelect(image))} />
                      }
                  
                    </div>
                   </div>
                ))}
                        </>

                    )}
                
                </div>

                
                
              
                  </div>
                  </div>

                  <div className="gallerySummary">
                      <h2> Liked Images: {allLikedImages?.length} / {data?.length} </h2>
                      <h3> Send gallery back to photographer with liked photos</h3>
                   
                    {/* MAP ALL PICTURES WITH LIKES  */}
            
                    <div className="likedImages">
                    {allLikedImages?.map((likedImage) => (
                      <SRLWrapper> 
                      <div className="imageCard" key={likedImage.docId}>
                        <img src={likedImage.image_src} width="100%" height="100%" />
                        </div>
                        </SRLWrapper> 
                    ))}
                    </div>

                    {allLikedImages?.length + allDislikedImages?.length === data?.length ? (
                        <>
                        <Button onClick={sendGallery}> Send Gallery</Button>
                        {alertShowing && 
                       <Alert variant="success">
                    <Alert.Heading>Gallery Sent, Redirecting To Home</Alert.Heading>
                  </Alert>
                    }
                        </>
                    ) : <> <Button disabled> Send Gallery</Button>
                    <p> All images must be rated before proceeding. ({ data?.length - (allDislikedImages?.length + allLikedImages?.length)} left)  </p>
                   
                   
                    </>
                    }
               </div>


{currentUser && 
               <div className="gallerySummary">
                      <h2> Selected Images: {selectedImages?.length}  </h2>
                      <h3> Create a new album with the selected files</h3>
                   
                    {/* MAP ALL SELECTED IMAGES  */}
            
                    <div className="likedImages">
                    {selectedImages?.map((selectedImage) => (
                      <SRLWrapper> 
                       <div className="imageCard" key={selectedImage.docId}>
                       <img src={selectedImage.image_src} width="100%" height="100%" />
                       </div>
                       </SRLWrapper> 
                    ))}
                    
                    </div>

                    <Form className="addAlbumForm" onSubmit={handleSubmit(createNewAlbum)}>

<input
  className="form-control"
  {...register("name", { required: true })}
  
  placeholder="Album name"
/>

<div className="uploadFile"> <p>Add Album Cover Image</p></div>
<input

{...register("image", {required: true})}
type="file"></input>


  <Button type="submit">Create Album</Button>


</Form>

                    
                  
                      
               </div>
               
               
               }

{!currentUser && (
    <div className="gallerySummary">
    <h2> Liked Images: </h2>
                        <h4> You have to be logged in to select and save images to an album on your account</h4>
                        </div>
                      )}
                  </>
            )} 
            
        </div>
    )
}

export default AlbumPage
