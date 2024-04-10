function Card(props: any) {

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    {/* Replace the src attribute with a valid image URL or reference */}
                    <img src="https://via.placeholder.com/150" className="img-fluid rounded-start" alt="Placeholder" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{props.blog.title}</h5>
                        <p className="card-text"><small className="text-muted">{props.blog.author}</small></p>
                        <p className="card-text">{props.blog.description}</p>
                        <p className="card-text"><small className="text-muted">{props.blog.createdAt}</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;