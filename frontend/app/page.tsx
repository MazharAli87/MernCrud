"use client"
import { useEffect, useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

type Post ={
  _id: string,
  title: string,
  content: string,
  createdAt: string
}

export default function Page() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<{title?: string, content?: string}>({})

  useEffect(() => {
    fetch('http://localhost:4000/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data))
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.errors) {
          const newErrors: { title?: string; content?: string } = {};
          if (data.error.errors.title) {
            newErrors.title = data.error.errors.title.message;
          }
          if (data.error.errors.content) {
            newErrors.content = data.error.errors.content.message;
          }
          setErrors(newErrors);
          return;
        }
      }

      setPosts([data.post, ...posts]);
      setForm({title: '', content: ''})
      setErrors({});
      setShowModal(false);
      toast.success(data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleDelete = async (_id: string) => {

    const res = await fetch(`http://localhost:4000/api/posts/${_id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    setPosts(posts.filter(post => post._id !== _id))
    toast.success(data.message);
  }

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setForm({title: '', content: ''})
    setErrors({});
    setShowModal(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">NOTES</h1>

        <button className="flex justify-center items-center text-white bg-blue-400 p-2 rounded" onClick={()=>setShowModal(true)}>
          <Plus className="mr-1" size={16}/>Note
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-gray-200 p-8 rounded-2xl w-2/5 shadow-lg">
            <h1 className="mb-4 text-xl font-bold text-center">Create New Post</h1>
            <input
              className="border p-2 mb-2 w-full rounded"
              placeholder="Title"
              value={form.title}
              onChange={(e)=> setForm({...form, title: e.target.value})}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mb-2">{errors.title}</p>
            )}

            <textarea
              className="border p-2 mb-2 w-full rounded"
              placeholder="Content"
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mb-2">{errors.content}</p>
            )}

            <div className="flex justify-end items-center">
              <button className="bg-blue-500 text-white p-2 rounded cursor-pointer mr-2" onClick={handleSubmit} disabled={isLoading}>
                Create
              </button>
              <button className="bg-red-500 text-white p-2 rounded cursor-pointer" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {
          posts.map((post) => (
            
            <li key={post._id} className="">
              <div className="flex justify-between bg-gray-300 p-4 rounded-t-2xl shadow-xl">
                <h2 className="text-2xl">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-700">
                  {new Date(post.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata'
                  })}
                </p>
              </div>
              <div className="bg-gray-100 p-4">
                <p>
                  {post.content}
                </p>
              </div>
              <div className="flex justify-end gap-2 p-2 bg-gray-100 rounded-b-xl shadow-2xl">
                <Link href={`/edit/${post._id}`}><button className="text-white bg-green-500 p-2 rounded cursor-pointer"><Edit size={18}/></button></Link>
                <button className="text-white bg-red-500 p-2 rounded cursor-pointer" onClick={() => handleDelete(post._id)}>
                  <Trash size={18}/>
                </button>
              </div>
          </li>
          ))
        }
      </ul>
    </div>
  )
}