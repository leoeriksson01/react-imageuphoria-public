import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useAuthContext } from "../contexts/AuthContext";
import useDeleteAlbum from "../hooks/useDeleteAlbum";
import { useNavigate } from "react-router-dom";
import "../styles/AlbumPageStyle.scss";
import edit from "../assets/edit.png";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Form, Alert } from "react-bootstrap";

const AlbumCard = ({ album, onDelete, onUpdate }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuthContext();
    const deleteAlbum = useDeleteAlbum(album);
    const [formShowing, setFormShowing] = useState(false);

    const handleDeleteAlbum = async () => {
        await deleteAlbum.mutate();
        onDelete();
    };

    const handleEdit = async () => {
        formShowing ? setFormShowing(false) : setFormShowing(true);
    };

    const onSubmit = async (data, e) => {
        e.preventDefault();
        await updateDoc(doc(db, "albums", album.docId), {
            name: data.name,
        })
            .then(() => {
                reset();
                setFormShowing(false);
                onUpdate();
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    };

    const { register, handleSubmit, reset } = useForm();

    return (
        <div className="albumCard">
            <h2 className="albumName">
                {album.name}
                <div className="edit" onClick={handleEdit}>
                    <img src={edit} width="24px" height="24px" />
                </div>
            </h2>
            {formShowing ? (
                <>
                    <div className="addRecipeContainer">
                        <Form
                            className="addAlbumForm"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <input
                                className="form-control"
                                {...register("name", { required: true })}
                                placeholder="Album name"
                            />

                            <Button type="submit" className="authButton">
                                Update Album{" "}
                            </Button>
                        </Form>
                    </div>
                </>
            ) : (
                ""
            )}
            <div className="albumImage">
                <img
                    src={album.image_src}
                    onClick={() => navigate(`/album/${album.uid}`)}
                    width="100%"
                    height="100%"
                />
            </div>

            <div className="cardActions">
                {album.creator_uid === currentUser.uid && (
                    <>
                        <Button
                            variant="danger"
                            size="sm"
                            disabled={deleteAlbum.isMutating}
                            onClick={handleDeleteAlbum}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AlbumCard;
