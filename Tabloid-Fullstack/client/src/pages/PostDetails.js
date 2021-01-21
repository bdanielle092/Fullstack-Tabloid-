import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Jumbotron } from "reactstrap";
import { Row } from "reactstrap";
import { Col } from "reactstrap";
import { Button } from "reactstrap"
import PostReactions from "../components/PostReactions";
import formatDate from "../utils/dateFormatter";
import "./PostDetails.css";
import { UserProfileContext } from "../providers/UserProfileProvider";
import { CommentCard } from "./CommentCard"


const PostDetails = () => {
  const { getToken } = useContext(UserProfileContext);
  const { postId } = useParams();
  const [post, setPost] = useState();
  // const [posts, setPosts] = useState([])
  const [reactionCounts, setReactionCounts] = useState([]);
  const history = useHistory();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/comment/${postId}`)
      .then((res) => res.json())
      .then((comments) => {
        setComments(comments);
      });
  }, []);

  // const getComments = () => {
  //   getToken().then((token) =>
  //     fetch(`/api/comment`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((comments) => {
  //         setComments(comments);
  //       })
  //   );
  // };

  // useEffect(() => {
  //   fetch(`/api/post`)
  //     .then((res) => res.json())
  //     .then((posts) => {
  //       setPosts(posts);
  //     });
  // }, []);

  useEffect(() => {
    fetch(`/api/post/${postId}`)
      .then((res) => {
        if (res.status === 404) {
          toast.error("This isn't the post you're looking for");
          return;
        }
        return res.json();
      })
      .then((data) => {
        setPost(data.post);
        setReactionCounts(data.reactionCounts);
      });
  }, [postId]);

  if (!post) return null;


  return (
    <div>
      <Jumbotron
        className="post-details__jumbo"
        style={{ backgroundImage: `url('${post.imageLocation}')` }}
      ></Jumbotron>
      <div className="container">
        <h1>{post.title}</h1>
        <h5 className="text-danger">{post.category.name}</h5>
        <div className="row">
          <div className="col">
            <img
              src={post.userProfile.imageLocation}
              alt={post.userProfile.displayName}
              className="post-details__avatar rounded-circle"
            />
            <p className="d-inline-block">{post.userProfile.displayName}</p>
          </div>
          <div className="col">
            <p>{formatDate(post.publishDateTime)}</p>
          </div>
        </div>
        <div className="text-justify post-details__content">{post.content}</div>
        <div className="my-4">
          <PostReactions postReactions={reactionCounts} />
        </div>
        <br />
      </div>
      <Row className="mt-5 ml-2">
        <Col>
          <h3>Comments</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="ml-4">
          <Button color="success"
            onClick={() => {
              history.push(`/post/addcomment/${postId}`)
            }}

          >Add New Comment
          </Button>
        </Col>
        <Col>
        </Col>
      </Row>

      {
        comments.map(comments => {
          return <CommentCard key={comments.id} comments={comments} />
        })
      }
      {/* 
      {
        posts.map(posts => {
          return <CommentCard key={posts.id} posts={posts} />
        })
      } */}

    </div >
  );
};

export default PostDetails;