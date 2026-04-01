import { useForm } from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import {
  pageBackground,
  pageWrapper,
  formCard,
  formTitle,
  inputClass,
  formGroup,
  submitBtn,
  labelClass
} from "../styles/common"

function Register() {

  const { register, handleSubmit, formState:{errors} } = useForm()
  const navigate = useNavigate()

  const [preview,setPreview] = useState(null)
  const [errorMsg,setErrorMsg] = useState(null)

  // cleanup preview
  useEffect(()=>{
    return ()=>{
      if(preview){
        URL.revokeObjectURL(preview)
      }
    }
  },[preview])

  // ==========================
  // REGISTER FUNCTION
  // ==========================

  const onUserRegister = async(newUser)=>{

    try{

      // create FormData
      const formData = new FormData()

      let {role, profile, ...userObj} = newUser

      // append text fields
      Object.keys(userObj).forEach(key=>{
        formData.append(key,userObj[key])
      })

      // append file
      formData.append("profilePic",profile[0])

      let url=""

      if(role==="user"){
        url="http://localhost:4000/user-api/users"
      }

      if(role==="author"){
        url="http://localhost:4000/author-api/users"
      }

      const resObj = await axios.post(url,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })

      if(resObj.status===200 || resObj.status===201){
        navigate("/login")
      }

    }
    catch(err){
      console.log("Registration error:",err)
      setErrorMsg("Registration failed")
    }

  }

  return(

  <div className={pageBackground}>
  <div className={pageWrapper}>

  <form onSubmit={handleSubmit(onUserRegister)} className={formCard}>

  <h1 className={formTitle}>Register</h1>

  {/* ROLE */}

  <div className={formGroup}>

  <label className={labelClass}>Select Role</label>

  <div className="flex gap-6 mt-2">

  <label>
  <input type="radio" value="user" {...register("role",{required:"Role is required"})}/>
  <span className="ml-2">User</span>
  </label>

  <label>
  <input type="radio" value="author" {...register("role",{required:"Role is required"})}/>
  <span className="ml-2">Author</span>
  </label>

  </div>

  {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

  </div>

  {/* FIRST NAME */}

  <div className={formGroup}>
  <input type="text" placeholder="First Name" className={inputClass}
  {...register("firstName",{required:"First name required"})}/>
  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
  </div>

  {/* LAST NAME */}

  <div className={formGroup}>
  <input type="text" placeholder="Last Name" className={inputClass}
  {...register("lastName",{required:"Last name required"})}/>
  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
  </div>

  {/* EMAIL */}

  <div className={formGroup}>
  <input type="email" placeholder="Email" className={inputClass}
  {...register("email",{required:"Email required"})}/>
  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
  </div>

  {/* PASSWORD */}

  <div className={formGroup}>
  <input type="password" placeholder="Password" className={inputClass}
  {...register("password",{
    required:"Password required",
    minLength:{value:6,message:"Minimum 6 characters"}
  })}/>
  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
  </div>

  {/* PROFILE IMAGE */}

  <div className={formGroup}>

  <label className={labelClass}>Profile Image</label>

  <input
  type="file"
  accept="image/png,image/jpeg"
  className={inputClass}
  {...register("profile",{required:"Profile image required"})}

  onChange={(e)=>{

  const file=e.target.files[0]

  if(!file) return

  if(!["image/jpeg","image/png"].includes(file.type)){
  setErrorMsg("Only JPG or PNG allowed")
  return
  }

  if(file.size>2*1024*1024){
  setErrorMsg("File must be less than 2MB")
  return
  }

  const previewUrl=URL.createObjectURL(file)

  setPreview(previewUrl)
  setErrorMsg(null)

  }}

  />

  {errors.profile && <p className="text-red-500 text-sm">{errors.profile.message}</p>}

  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

  {preview && (
  <img src={preview} alt="preview"
  className="mt-4 w-24 h-24 rounded-full object-cover"/>
  )}

  </div>

  <button className={submitBtn}>Register</button>

  </form>

  </div>
  </div>

  )

}

export default Register