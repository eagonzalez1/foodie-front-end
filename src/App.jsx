import { useState, useEffect} from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import * as authService from './services/authService'
import AddPost from './pages/AddPost/AddPost'
import * as postService from './services/postService'
import PostList from './pages/PostList/PostList'
import EditPost from './pages/EditPost/EditPost'

const App = () => {
  const [user, setUser] = useState(authService.getUser())
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  useEffect (() => {
    const fetchAllPosts = async () => {
      const postData = await postService.getAll()
      setPosts(postData)
    }
    fetchAllPosts()
  },[])

  const handleSignupOrLogin = () => {
    setUser(authService.getUser())
  }

  const handleAddPost = async postData => {
    const newPost = await postService.create(postData)
    setPosts([...posts, newPost])
    navigate('/')
  }

  const handleDeletePost = async postId => {
    const deletedPost = await postService.deletePost(postId)
    const newPostsArray = posts.filter(post => post._id !== deletedPost._id)
    setPosts(newPostsArray)
    navigate('/')
    
  }

  const handleUpdatePost = async (postData) => {
    const updatedPost = await postService.updatePost(postData)
    // map state to new array
    const newPostsArray = posts.map(post => post._id === updatedPost._id ? updatedPost : post)
    // use new array to set new state
    setPosts(newPostsArray)
    navigate('/')
    
  }

  

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/add" element={<AddPost handleAddPost={handleAddPost} />} 
        />
        <Route path="/edit" element={<EditPost handleUpdatePost={handleUpdatePost}  />} 
        />
        <Route path="/" element={<PostList user={user} posts={posts} handleDeletePost={handleDeletePost} />} 
        />
        <Route
          path="/signup"
          element={<Signup handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/login"
          element={<Login handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/profiles"
          element={user ? <Profiles /> : <Navigate to="/login" />}
        />
        <Route
          path="/changePassword"
          element={
            user ? (
              <ChangePassword handleSignupOrLogin={handleSignupOrLogin} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  )
}

export default App
