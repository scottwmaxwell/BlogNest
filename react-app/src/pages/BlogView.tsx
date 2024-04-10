import dataSource from "../dataSource";
import React, { useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function BlogView(){

    const navigate = useNavigate();

    const [blog, setBlog] = useState({
        title: "",
        description: "",
        content: "",
        imageURL: "",
        author: "username"
    });

    const { id } = useParams()

    useEffect(()=>{
        loadBlog();
    }, []);

    const loadBlog = async () =>{
        const response = await dataSource.get('/api/posts/' + id);
        setBlog(response.data);
    }

    const handleDelete = async () =>{
        const deleteConfirm = window.confirm("Are you sure you want to delete?");
        if(deleteConfirm === true){
            const response = await dataSource.delete('/api/posts/' + id);
            navigate('/');
        }
    }

    return (
        <div className="container">
        <div className="row">

            <div className="col-md-3"></div>

            <div className="col-sm-6">

                <center>
                    <h1 id='title'>{blog.title}</h1>
                    <small className="text-muted">by {blog.author}</small>
                </center>

                <div className="row">
                    <p>{blog.content}</p>
                </div>

                <center>
                    <img src={blog.imageURL} style={{maxHeight:300}}></img>
                </center>

                <div className="d-flex justify-content-end">
                        <a href={'/edit/' + id} style={{borderRadius:"15px", backgroundColor:'rgb(199, 132, 56)', color:"rgb(97, 66, 30)", marginRight:7}} className="btn btn mb-2">Edit</a>
                        <button style={{borderRadius:"15px", backgroundColor:'rgb(179, 73, 73)', color:"rgb(89, 31, 31)"}} onClick={handleDelete} className="btn btn mb-2">Delete</button>
                </div>

            </div>
            <div className="col-md-3"></div>
        </div>
    </div>
    )
}

export default BlogView;