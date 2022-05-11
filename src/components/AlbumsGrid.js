import React from 'react'
import Alert from 'react-bootstrap/Alert'
import BeatLoader from 'react-spinners/BeatLoader'
import AlbumCard from './AlbumCard'
import "../styles/AllAlbumsPageStyle.scss"
import useAlbums from '../hooks/useAlbums'

const AlbumsGrid = () => {
	const data = useAlbums();
	

	const refetchQuery = () => {
		DataTransferItem.refetch()
	}

	return (
		<div className="albumsGrid"> 
		
				{data?.map(album => (
					<AlbumCard album={album} key={album.uid} onDelete={refetchQuery} onUpdate={refetchQuery} />
				))}
				</div>
			
	)
}

export default AlbumsGrid
