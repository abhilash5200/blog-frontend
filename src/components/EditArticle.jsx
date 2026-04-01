import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../stores/authStore"

function EditArticle(){

  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useAuth(state => state.currentUser)

  const article = location.state

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: article.title,
      category: article.category,
      content: article.content
    }
  })

  const onSubmit = async (data)=>{

    try{

      await axios.put(
        "http://localhost:4000/author-api/articles",
        {
          articleId: article._id,
          title: data.title,
          category: data.category,
          content: data.content,
          author: currentUser._id
        },
        { withCredentials:true }
      )

      toast.success("Article updated successfully")

      navigate("/author-profile")

    }catch(err){
      toast.error("Update failed")
    }

  }

  return(

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-8 rounded w-full max-w-lg"
      >

        <h2 className="text-2xl font-bold mb-6">
          Edit Article
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="border w-full p-2 mb-4"
          {...register("title")}
        />

        <input
          type="text"
          placeholder="Category"
          className="border w-full p-2 mb-4"
          {...register("category")}
        />

        <textarea
          rows="6"
          placeholder="Content"
          className="border w-full p-2 mb-4"
          {...register("content")}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

      </form>

    </div>
  )
}

export default EditArticle