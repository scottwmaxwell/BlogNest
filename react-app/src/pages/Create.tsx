import "./Create.css";
import React, { useState, useEffect } from 'react';
import dataSource from '../dataSource';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useParams } from 'react-router-dom';

function Create(){

    const navigate = useNavigate()

    const [blog, setBlog] = useState({
        id: 0,
        title: "",
        description: "",
        content: "",
        imageURL: "",
        author: "username"
    });

    var editMode = true;
    let title = "Edit Blog Post"
    const { id } = useParams()

    if(id === undefined){
        editMode = false;
        title = "Create a Blog Post"
    }

    useEffect(()=>{
        loadBlog();
    }, []);

    const loadBlog = async () =>{
        if(editMode === true){
            const response = await dataSource.get('/api/posts/' + id);
            setBlog(response.data);
        }
    }

    const handleFormSumit = async (event: any) => {
        console.log("form submitted!")
        event.preventDefault()

        let finalBlog = {
            ...blog
        }

        if(editMode === true){
            let response = await dataSource.put('/api/posts/' + id, finalBlog);
            navigate('/blog/' + id);
        }else{
            let response = await dataSource.post('/api/posts', finalBlog);
            navigate('/');
        }

    }

    const updateField = (field: string, value: string) => {
        setBlog((prevState: typeof blog) => ({
            ...prevState,
            [field]: value
        }));
    }

    return(
        <div className="row">

        <div className="col-md-3"></div>

        <div className="col-sm-6">

            <center>
                <h1 id='title'>{title}</h1>
            </center>

            <div className="row">

                <form onSubmit={handleFormSumit}>

                    <div className="form-group">
                        <input required={true} className="form-control form-control-lg" type="text" id="blog-title" maxLength={60} placeholder="Blog Title" value={blog.title} onChange={e => updateField('title', e.target.value)}></input>
                    </div>
                    

                    <div className="form-group">
                        <input required={true} className="form-control" id="blog-description" maxLength={100} placeholder="Description goes here..." value={blog.description} onChange={e => updateField('description', e.target.value)}></input>
                    </div>

                    <div className="form-group">
                        <textarea required={true} className="form-control" id="blog-content" placeholder="Main content goes here..." rows={6} value={blog.content} onChange={e => updateField('content', e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <input className="form-control" id="blog-imageURL" placeholder="https://example.com/image.jpg" value={blog.imageURL} onChange={e => updateField('imageURL', e.target.value)}></input>
                    </div>

                    <div>
                        <p>Preview:</p>
                        <Card key={1} id={1} blog={blog} />
                    </div>

                    <div className="d-flex justify-content-end">
                        <button id='post-button' type="submit" className="btn btn-primary mb-2">Post</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="col-md-3"></div>
    </div>
    );
}

export default Create;