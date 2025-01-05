import React ,{useRef,useEffect,useState}from 'react'
import { useNavigate,useLocation,useParams, Navigate} from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Dashboard from '../components/Dashboard'
import Editor from '../components/Editor'
import socket from './Socket';
function EditorPage() {
    const socketRef=useRef(null);
    const location=useLocation();
    const navigate=useNavigate();
     const [users, setUsers] = useState([]);
    const {roomId}=useParams();
    useEffect(()=>{
        const init=async()=>
        {
            socketRef.current=await socket();
            socketRef.current.on("connect_ error", (err) => { handleError(err); });
            socketRef.current.on("connect_failed", (err) => { handleError(err); });
            const handleError = (err) => {
                console.error(`Socket Error :  ${err}`);
                toast.error("Socket Error");
                navigate("/home");
                
            };
            if(!location.state){
              return <Navigate to="/home"/>
            }

            socketRef.current.emit('join', {
                roomId,
                username: location.state?.userName
              });
            socketRef.current.on("newUserJoined", ({ users, username, socketId }) => {
              if(username!==location.state?.userName)
              {
                toast.success(`${username} joined the room`);
              }
              setUsers(users);
             });
            socketRef.current.on("disconnected", ({ socketId, username }) => {
              toast.error(`${username} left the room`);
              setUsers((prevUsers) => prevUsers.filter((user) => user.socketId !== socketId));
              });
      }
        init();
        return ()=>{
        socketRef.current.disconnect();
        socketRef.current.off("newUserJoined");
        socketRef.current.off("disconnected");
        }
    },[]);
  return (
    <>
   <div className="flex h-screen  w-screen">
      {/* Member Section */}
      <div className="md:w-1/5 w-2/5 bg-gray-800 ">
        <Dashboard  users={users}/>
      </div>

      {/* Editor Section */}
      <div className="md:w-4/5 w-3/5 bg-gray-50">
        <Editor />
      </div>
    </div>
    </>
  )
}

export default EditorPage
