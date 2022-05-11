import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { useAuthContext } from '../contexts/AuthContext'
import { db, storage } from '../firebase'
import { useParams } from "react-router-dom";

function useUploadImage() {
	const fns = require('date-fns')
    const [error, setError] = useState(null)
	const [isError, setIsError] = useState(null)
	const [isMutating, setIsMutating] = useState(null)
	const [isSuccess, setIsSuccess] = useState(null)
	const [progress, setProgress] = useState(null)
	const { uid } = useParams();

	const { currentUser } = useAuthContext()

	const mutate = async (image) => {
		// reset internal state
		setError(null)
		setIsError(null)
		setIsSuccess(null)
		setIsMutating(true)

		if (!image instanceof File) {
			setError("That is no file")
			setIsError(true)
			setIsMutating(false)
			return
		}

		// filename
		const storageFilename = `${Date.now()}-${image.name}`

		// pathname in storage to save image as
		const storageFullPath = `images/${storageFilename}`

		try {
			// reference in storage to upload image to
			const storageRef = ref(storage, storageFullPath)

			// upload image
			const uploadTask = uploadBytesResumable(storageRef, image)

			uploadTask.on('state_changed', (uploadTaskSnapshot) => {
				setProgress(
					Math.round(
						(uploadTaskSnapshot.bytesTransferred / uploadTaskSnapshot.totalBytes) * 1000
					) / 10
				)
			})
			await uploadTask.then()

			// get url to uploaded image
			const url = await getDownloadURL(storageRef)

			const collectionRef = collection(db, 'images')

			const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm")
			await addDoc(collectionRef, {
					created: currentTime,
					name: image.name,
					owner: currentUser.uid,
					path: storageRef.fullPath,
					size: image.size,
					type: image.type,
					albumuid: uid,
					image_src: url,
			})

			setProgress(null)
			setIsSuccess(true)
			setIsMutating(false)

		} catch (e) {
			console.log("error", e)

			setError(e.message)
			setIsError(true)
			setIsMutating(false)
			setIsSuccess(false)
		}
	}

	return {
		error,
		isError,
		isMutating,
		isSuccess,
		mutate,
		progress,
	}
}

export default useUploadImage
