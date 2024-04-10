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
            </div>
            <div className="col-md-3"></div>
        </div>
    </div>
    )
}

export default BlogView;