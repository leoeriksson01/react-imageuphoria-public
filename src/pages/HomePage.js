import React from 'react'
import wedding from "../assets/wedding.svg"
import photographer from "../assets/photographer.svg"
import newalbum from "../assets/newalbum.svg"
import upload from "../assets/upload.svg"
import url from "../assets/url.svg"
import photoalbum from "../assets/photoalbum.svg"
import likedislike from "../assets/likedislike.svg"
import agree from "../assets/agree.svg"
import "../styles/HomePageStyle.scss"
import { useAuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";


function HomePage() {
    const { currentUser} = useAuthContext();
    return (
        <div className="homeContainer">
            <div className="topSection">
                <div className="topSectionText">
                    <h1>Let the customer pick out their favorite moments</h1>
                    <a href="#mainSection"> 
                    <button className="readMore"> <span className="buttonText">Find out how</span>  <span className="arrow"> </span></button>
                    </a>
                </div>

                <img className="moments" src={wedding} />
        
            </div>
            
        <div className="homeMain" id="homeMain">
            <div className="mainSection" id="mainSection"></div>
            <h1> How does it work?</h1>


            <div className="mainRow">
                <div className="mainText">
                    <span className="number"> 1</span>
                    <h3> The photographer takes photos </h3>
                </div>
                <div className="mainImage">
                    <img src={photographer} width="100%" height="100%" />
                </div>
            </div>

            <div className="mainRow reverse">
            <div className="mainText">
                    <span className="number"> 2</span>
                    <h3> The photographer 
                        <Link to={currentUser ? "/newalbum" : "/login" }> <span className="link"> creates a new album </span> </Link></h3>
                </div>
            <div className="mainImage">
                    <img src={newalbum} width="100%" height="100%" />
                </div>
                 </div>


                 <div className="mainRow">
                <div className="mainText">
                    <span className="number"> 3</span>
                    <h3> The photographer uploads images to the album </h3>
                </div>
                <div className="mainImage">
                    <img src={upload} width="100%" height="100%" />
                </div>
            </div>

            <div className="mainRow reverse">
            <div className="mainText">
                    <span className="number"> 4</span>
                    <h3> The photographer sends a link of the album to the customer </h3>
                </div>
            <div className="mainImage">
                    <img src={url} width="100%" height="100%" />
                </div>
                 </div>

                 <div className="mainRow">
                <div className="mainText">
                    <span className="number"> 5</span>
                    <h3> The customer looks at all images and rates each image with like or dislike </h3>
                </div>
                <div className="mainImage">
                    <img src={likedislike} width="100%" height="100%" />
                </div>
            </div>

            <div className="mainRow reverse">
            <div className="mainText">
                    <span className="number"> 6</span>
                    <h3> The liked images are sent back to the photographer in a newly created album </h3>
                </div>
            <div className="mainImage">
                    <img src={photoalbum} width="100%" height="100%" />
                </div>
                
                 </div>

                 <div className="mainRow">
                <div className="mainText">
                    <span className="number"> 7</span>
                    <h3> The process can be repeated until the perfect photo album exists and both parties are satisfied</h3>
                </div>
                <div className="mainImage">
                    <img src={agree} width="100%" height="100%" />
                </div>
            </div>

        </div>
        </div>
    )
}

export default HomePage
