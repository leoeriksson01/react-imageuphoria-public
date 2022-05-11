import { useState } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

const useDeleteAlbum = (album) => {
	const [error, setError] = useState(null)
	const [isError, setIsError] = useState(null)
	const [isMutating, setIsMutating] = useState(null)

	const mutate = async () => {
		setError(null)
		setIsError(false)
		setIsMutating(true)

		try {
			await deleteObject(ref(storage, album.path))
			await deleteDoc(doc(db, 'albums', album._id))

		} catch (e) {
			setError(e.message)
			setIsError(true)

		} finally {
			setIsMutating(false)
		}
	}

	return {
		error,
		isError,
		isMutating,
		mutate,
	}
}

export default useDeleteAlbum
