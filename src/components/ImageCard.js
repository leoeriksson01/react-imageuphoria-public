
import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuthContext } from '../contexts/AuthContext'
 import "../styles/ImageCardStyle.scss"
 import { SRLWrapper } from 'simple-react-lightbox'
 import { doc, updateDoc, deleteDoc, } from "firebase/firestore";
 import { db} from '../firebase'
 import hasliked from "../assets/hasliked.png"
import liked from "../assets/liked.png"
import hasdisliked from "../assets/hasdisliked.png"
import disliked from "../assets/disliked.png"


 

const ImageCard = ({ image }) => {
	const { currentUser } = useAuthContext();

	 const likeImage = async () => {
			await updateDoc(doc(db, "images", image?.docId), {
			 liked: true
		 })
		}
		 
	 const dislikeImage = async () => {
		   await updateDoc(doc(db, "images", image?.docId), {
			liked: false
		})
	}

	const deleteImage = async () => {
		await deleteDoc(doc(db, "images", image?.docId))
	}
	return (
		<div className="imageCard">
			<SRLWrapper> 
			<div className={`imagePictureContainer ${image.liked === true ? "greenBorder" : image.liked === false ? "redBorder" : ""}`}> 
				<img src={image.image_src} alt={image.name} />
				</div>
				</SRLWrapper>

            <div className="cardActions">
					<div className="cardRatings">		
					<>
					<div className="cardLike"> 
					{image.liked === true ? (
					<>
					<img src={hasliked} width="24px" height="24px" onClick={likeImage}  />

					</>
					)
					:  <>
					<img src={liked} width="24px" height="24px" onClick={likeImage} />
					 </>}
	</div>
					 
			<div className="cardDislike"> 
					{image.liked === false ? (
					<>
					<img src={hasdisliked} width="24px" height="24px" onClick={dislikeImage}  />

					</>)
					:  <>
					<img src={disliked} width="24px" height="24px" onClick={dislikeImage} />
					 </>}
					 </div>
					</>
					
					</div>

		
					
				
					{image?.owner === currentUser?.uid && (
						<Button
						className="deleteButton"
							variant="danger"
							size="sm"
							onClick={deleteImage}
						>
							<FontAwesomeIcon icon={faTrashAlt} />
						</Button>
					)}
				</div>
		</div>
		
	)
}

export default ImageCard
