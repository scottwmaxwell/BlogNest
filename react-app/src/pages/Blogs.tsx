import React, { useEffect, useState} from 'react'
import Card from '../components/Card';
import "./Blogs.css";
import dataSource from '../dataSource';

function Blogs(){

    const [blogs, setBlogs] = useState([]);

    useEffect(()=>{
        loadBlogs();
    }, []);

    const loadBlogs = async () =>{
        const response = await dataSource.get('/api/posts')
        setBlogs(response.data);
    }

    const renderBlogs = () =>{
        if(blogs){
            return blogs.map((blog:any, index:number) => {
                return (
                    <Card key={index} id={index} blog={blog} />
                );
              });
        }
    }

    return(
        <div className="container">
            <div className="row">

                <div className="col-md-3"></div>

                <div className="col-sm-6">

                    <center>
                        <h1 id='title'>Blogs Below:</h1>
                    </center>

                    <div className="row">
                        { renderBlogs() }
                    </div>
                </div>

                <div className="col-md-3"></div>

            </div>
        </div>
    );
}

export default Blogs;
