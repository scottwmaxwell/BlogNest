import "./Create.css";
import React, { useState } from 'react';
import dataSource from '../dataSource';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

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


    const handleFormSumit = async (event: any) => {
        console.log("form submitted!")
        event.preventDefault()

        let finalBlog = {
            ...blog
        }

        await dataSource.post('/api/posts', finalBlog);
        navigate('/');
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
                <h1 id='title'>Create a Blog Post</h1>
            </center>

            <div className="row">

                <form onSubmit={handleFormSumit}>

                    <div className="form-group">
                        <input required={true} className="form-control form-control-lg" type="text" id="blog-title" maxLength={60} placeholder="Blog Title" onChange={e => updateField('title', e.target.value)}></input>
                    </div>
                    

                    <div className="form-group">
                        <input required={true} className="form-control" id="blog-description" maxLength={100} placeholder="Description goes here..." onChange={e => updateField('description', e.target.value)}></input>
                    </div>

                    <div className="form-group">
                        <textarea required={true} className="form-control" id="blog-content" placeholder="Main content goes here..." rows={6} onChange={e => updateField('content', e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <input className="form-control" id="blog-imageURL" placeholder="https://example.com/image.jpg" onChange={e => updateField('imageURL', e.target.value)}></input>
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