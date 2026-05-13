import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../stores/authStore"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

function AuthorDashboard(){

  const [articles,setArticles] = useState([])
  const [selectedArticle,setSelectedArticle] = useState(null)
  const [userNames,setUserNames] = useState({})

  // ⭐ NEW STATES FOR ADD ARTICLE
  const [showForm,setShowForm] = useState(false)
  const [newArticle,setNewArticle] = useState({
    title:"",
    category:"",
    content:""
  })

  const currentUser = useAuth((state)=>state.currentUser)
  const logout = useAuth((state)=>state.logout)

  const navigate = useNavigate()

  if (!currentUser) {
    return <p className="text-center mt-10">Loading user data...</p>
  }

  // ---------------- LOGOUT ----------------
  const handleLogout = async ()=>{

    const res = await logout()

    if(res?.success){
      toast.success("Logged out successfully")
      navigate("/login")
    }

  }

  // ---------------- FETCH AUTHOR ARTICLES ----------------
  const getAuthorArticles = async ()=>{

    try{

      const res = await axios.get(
        `http://localhost:4000/author-api/articles/${currentUser._id}`,
        {withCredentials:true}
      )

      const data = res?.data?.payload || []
      setArticles(data)

      // Extract commenter IDs
      const ids = new Set()

      data.forEach(article=>{
        article.comments?.forEach(c=>{
          if (typeof c.user === "string") ids.add(c.user)
        })
      })

      const nameMap = {}

      for (const id of ids){

        try{
          const userRes = await axios.get(
            `http://localhost:4000/common-api/users/${id}`,
            {withCredentials:true}
          )

          nameMap[id] = userRes.data.payload.firstName

        }catch{
          nameMap[id] = "User"
        }

      }

      setUserNames(nameMap)

    }catch(err){
      console.log(err)
      toast.error("Failed to load articles")
    }

  }

  useEffect(()=>{
    getAuthorArticles()
  },[])

  // ================= ADD ARTICLE =================

  const handleChange = (e)=>{
    setNewArticle({
      ...newArticle,
      [e.target.name]:e.target.value
    })
  }

  const handleCreateArticle = async (e)=>{

    e.preventDefault()

    try{

      const articleData = {
        ...newArticle,
        author: currentUser._id
      }

      await axios.post(
        "http://localhost:4000/author-api/articles",
        articleData,
        {withCredentials:true}
      )

      toast.success("Article created")

      setShowForm(false)

      setNewArticle({
        title:"",
        category:"",
        content:""
      })

      getAuthorArticles()

    }catch(err){
      toast.error("Failed to create article")
    }

  }

  // ---------------- DELETE ----------------
  const deleteArticle = async (id)=>{
    try{
      await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive:false },
        { withCredentials:true }
      )
      toast.success("Article deleted")

      setArticles(prev =>
        prev.map(a =>
          a._id === id ? { ...a, isArticleActive:false } : a
        )
      )
    }catch{
      toast.error("Delete failed")
    }
  }

  // ---------------- RESTORE ----------------
  const restoreArticle = async (id)=>{
    try{
      await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive:true },
        { withCredentials:true }
      )
      toast.success("Article restored")

      setArticles(prev =>
        prev.map(a =>
          a._id === id ? { ...a, isArticleActive:true } : a
        )
      )
    }catch{
      toast.error("Restore failed")
    }
  }

  // ---------------- EDIT ----------------
  const editArticle = (article)=>{
    navigate(`/edit-article/${article._id}`, { state: article })
  }

  return(

    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          My Articles
        </h1>

        <div className="flex gap-4">

          {/* ⭐ ADD ARTICLE BUTTON */}
          <button
            onClick={()=>setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ➕ Add Article
          </button>

          {/* <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button> */}

        </div>

      </div>

      {/* ================= ADD ARTICLE FORM ================= */}

      {showForm && (

        <form
          onSubmit={handleCreateArticle}
          className="bg-white shadow-md p-6 rounded-lg mb-8"
        >

          <h2 className="text-xl font-semibold mb-4">
            Create New Article
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newArticle.title}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newArticle.category}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <textarea
            name="content"
            placeholder="Content"
            value={newArticle.content}
            onChange={handleChange}
            rows="6"
            className="w-full border p-2 rounded mb-4"
            required
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Publish Article
          </button>

        </form>

      )}

      {/* ================= ARTICLES GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {articles.map(article => (

          <div key={article._id}
          className="bg-white shadow-md rounded-lg p-4">

            <h2 className="text-xl font-semibold mb-2">
              {article.title}
            </h2>

            <p className="text-gray-600 text-sm">
              {article.content.slice(0,100)}...
            </p>

            <div className="flex gap-3 mt-3 flex-wrap">

              <button
                className="text-blue-500"
                onClick={()=>setSelectedArticle(article)}
              >
                Read More
              </button>

              <button
                className="text-yellow-600"
                onClick={()=>editArticle(article)}
              >
                Edit
              </button>

              {article.isArticleActive ? (
                <button
                  className="text-red-500"
                  onClick={()=>deleteArticle(article._id)}
                >
                  Delete
                </button>
              ) : (
                <button
                  className="text-green-600"
                  onClick={()=>restoreArticle(article._id)}
                >
                  Restore
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

      {/* ================= FULL ARTICLE VIEW ================= */}

      {selectedArticle && (

        <div className="mt-10 bg-white shadow-lg p-6 rounded-lg">

          <h2 className="text-2xl font-bold mb-4">
            {selectedArticle.title}
          </h2>

          <p className="text-gray-700 mb-6">
            {selectedArticle.content}
          </p>

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

               {
                  typeof c.user === "string"
                  ? userNames[c.user]
                  : `${c.user?.firstName || ""} ${c.user?.lastName || ""}`
               }

              </p>

              <p className="text-gray-600">
                {c.comment}
              </p>

            </div>

          ))}

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

export default AuthorDashboard