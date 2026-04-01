import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../stores/authStore"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

function UserDashboard(){

  const [articles,setArticles] = useState([])
  const [selectedArticle,setSelectedArticle] = useState(null)
  const [commentText,setCommentText] = useState("")

  const logout = useAuth((state)=>state.logout)
  const navigate = useNavigate()

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {

    const res = await logout()

    if(res.success){
      toast.success("Logged out successfully")
      navigate("/login")
    }

  }

  // ---------------- FETCH ARTICLES ----------------
  const getArticles = async()=>{

    try{

      const res = await axios.get(
        "http://localhost:4000/user-api/articles",
        {withCredentials:true}
      )

      setArticles(res.data.payload)

    }catch(err){
      console.log(err)
      toast.error("Failed to load articles")
    }

  }

  useEffect(()=>{
    getArticles()
  },[])

  // ---------------- ADD COMMENT ----------------
  const addComment = async ()=>{

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    try{

      const res = await axios.put(
        `http://localhost:4000/user-api/comment/${selectedArticle._id}`,
        { comment: commentText },
        { withCredentials:true }
      )

      toast.success("Comment added")

      //  Update selected article with new comments
      setSelectedArticle(res.data.payload)

      setCommentText("")

    }catch(err){
      console.log(err)
      toast.error("Failed to add comment")
    }

  }

  return(

    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          All Articles
        </h1>

        {/* <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button> */}

      </div>


      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {articles.map((article)=>(
          
          <div key={article._id}
          className="bg-white shadow-md rounded-lg p-4">

            <h2 className="text-xl font-semibold mb-2">
              {article.title}
            </h2>

            <p className="text-gray-600 text-sm">
              {article.content.slice(0,100)}...
            </p>

            <button
              className="text-blue-500 mt-3"
              onClick={()=>setSelectedArticle(article)}
            >
              Read More →
            </button>

          </div>
        ))}

      </div>


      {/* FULL ARTICLE VIEW */}
      {selectedArticle && (

        <div className="mt-10 bg-white shadow-lg p-6 rounded-lg">

          <h2 className="text-2xl font-bold mb-4">
            {selectedArticle.title}
          </h2>

          <p className="text-gray-700 mb-6">
            {selectedArticle.content}
          </p>

          {/* COMMENTS */}
          <h3 className="text-xl font-semibold mb-4">
            Comments
          </h3>

          {selectedArticle.comments?.length === 0 && (
            <p>No comments yet</p>
          )}

          {selectedArticle.comments?.map((c,index)=>(
            
            <div key={index}
            className="border p-3 rounded mb-3">

              <p className="font-semibold">
                {c.user?.firstName}
              </p>

              <p className="text-gray-600">
                {c.comment}
              </p>

            </div>

          ))}

          {/* ADD COMMENT BOX */}
          <div className="mt-6">

            <textarea
              rows="3"
              placeholder="Write your comment..."
              className="border w-full p-2 rounded"
              value={commentText}
              onChange={(e)=>setCommentText(e.target.value)}
            />

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={addComment}
            >
              Add Comment
            </button>

          </div>

          <button
            className="mt-4 text-red-500"
            onClick={()=>setSelectedArticle(null)}
          >
            Close Article
          </button>

        </div>

      )}

    </div>

  )
}

export default UserDashboard