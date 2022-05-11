import { useAuthContext } from "../contexts/AuthContext";
import "../styles/AllAlbumsPageStyle.scss";
import AlbumsGrid from '../components/AlbumsGrid'
import useAlbums from '../hooks/useAlbums'
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
  } from "@firebase/firestore";
  import { db } from '../firebase'
  import { useFirestoreQueryData } from '@react-query-firebase/firestore'

function AlbumsPage({ data }) {

    const { currentUser } = useAuthContext()

 
    return (
        <div className="albumsContainer">
            <h1> All Albums </h1>
            <AlbumsGrid data={data} />
            
        </div>
    )
}

export default AlbumsPage
