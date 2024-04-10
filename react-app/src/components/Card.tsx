import defaultImage from '../assets/post.png'

function Card(props: any) {

    var cardImage = defaultImage;
    if(props.blog.imageURL !== ""){
        cardImage = props.blog.imageURL;
    }

    var date = props.blog.createdAt;
    if(date === undefined){
        date = new Date().toString();
    }

    var blogURL = "/blog/" + props.blog._id;
    if(props.blog._id === undefined){
        blogURL = "#";
    }

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-2">
                    <a href={blogURL}><img src={cardImage} className="img-fluid rounded-start" alt="Placeholder" /></a>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <a style={{textDecoration: 0, color: 'black'}} href={blogURL}><h5 className="card-title">{props.blog.title}</h5></a>
                        <p className="card-text"><small className="text-muted">{props.blog.author}</small></p>
                        <p className="card-text">{props.blog.description}</p>
                        <p className="card-text"><small className="text-muted">{date}</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;