import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import axios from "axios"

function ArticleByID(){

  const { id } = useParams()
  const location = useLocation()

  const [article,setArticle] = useState(
    location.state || null
  )

  // convert time to IST
  const formatDate = (dateString) => {

    const date = new Date(dateString)

    return date.toLocaleString("en-IN",{
      timeZone:"Asia/Kolkata",
      dateStyle:"medium",
      timeStyle:"short"
    })
  }

  const getArticleById = async ()=>{

    try{

      const res = await axios.get(
        `http://localhost:4000/user-api/articles/${id}`,
        {withCredentials:true}
      )

      setArticle(res.data.payload)

    }catch(err){
      console.log(err)
    }

  }

  useEffect(()=>{

    // call API only if article not passed
    if(!article){
      getArticleById()
    }

  },[])

  if(!article){
    return <p className="text-center mt-10">Loading...</p>
  }

  return(

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">
        {article.title}
      </h1>

      <p className="text-sm text-gray-500 mb-2">
        Category: {article.category}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Author: {article.authorName}
      </p>

      <p className="text-xs text-gray-400 mb-6">
        Published: {formatDate(article.createdAt)}
      </p>

      <p className="text-gray-700 leading-relaxed">
        {article.content}
      </p>

    </div>

  )
}

export default ArticleByID