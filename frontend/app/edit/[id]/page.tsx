"use client"
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Page() {

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState<{title? : string, content? : string}>({})
  
  useEffect(() => {
    fetch(`http://localhost:4000/api/posts/${id}`)
    .then(res => res.json())
    .then(data => setPost({title: data.title, content: data.content}))
  }, [id])

  const handleUpdate = async () => {

    try {
      const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })

      const data = await res.json();
      
      if(!res.ok){
        if(data.error.errors){
          const newErrors: {title? : string, content? : string} = {};
          if(data.error.errors.title){
            newErrors.title = data.error.errors.title.message;
          }
          if(data.error.errors.content){
            newErrors.content = data.error.errors.content.message;
          }
          setErrors(newErrors);
          return;
        }
      }

      toast.success(data.message);
      router.push('/')
    } catch (error) {
      
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Post</h1>
      <input
        className="border p-2 mb-2 w-full rounded"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />
      {
        errors.title && <p className="text-red-500 text-sm mb-2">{errors.title}</p>
      }
      <textarea
        className="border p-2 mb-2 w-full rounded"
        value={post.content}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
      />
      {
        errors.content && <p className="text-red-500 text-sm mb-2">{errors.content}</p>
      }
      <button className="bg-green-500 text-white p-2 rounded cursor-pointer" onClick={handleUpdate}>
        Update
      </button>
    </div>
  )
}