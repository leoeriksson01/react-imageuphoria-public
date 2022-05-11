import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { collection, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../contexts/AuthContext'

const useAlbums = () => {
	const { currentUser } = useAuthContext()

	const q = query(
		collection(db, 'albums'),
		where("creator_uid", "==", currentUser?.uid),
	)
	const { data, isLoading } = useFirestoreQueryData(['albums'], q, {
		idField: 'docId',
		subscribe: true,
	}, {
    refetchOnMount: "always",
  })


  return data;

}

export default useAlbums
