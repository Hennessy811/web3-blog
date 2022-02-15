import { useState, useRef, useEffect } from "react"; // new
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

/* import contract address and contract owner address */
import { contractAddress } from "../config";

import Blog from "../artifacts/contracts/Greeter.sol/Blog.json";

/* define the ipfs endpoint */
const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const initialState = { title: "", content: "" };

function CreatePost() {
  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState);
  const [image, setImage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fileRef = useRef(null);
  const { title, content } = post;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      /* delay rendering buttons until dynamic import is complete */
      setLoaded(true);
    }, 500);
  }, []);

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function createNewPost() {
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) return;
    const hash = await savePostToIpfs();
    await savePost(hash);
    router.push(`/`);
  }

  async function savePostToIpfs() {
    /* save post metadata to ipfs */
    try {
      const added = await client.add(JSON.stringify(post));
      return added.path;
    } catch (err) {
      console.log("error: ", err);
    }
  }

  async function savePost(hash) {
    /* anchor post to smart contract */
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer);
      console.log("contract: ", contract);
      try {
        const val = await contract.createPost(post.title, hash);
        /* optional - wait for transaction to be confirmed before rerouting */
        /* await provider.waitForTransaction(val.hash) */
        console.log("val: ", val);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  function triggerOnChange() {
    /* trigger handleFileChange handler of hidden file input */
    fileRef.current.click();
  }

  async function handleFileChange(e) {
    /* upload cover image to ipfs and save hash to state */
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    const added = await client.add(uploadedFile);
    setPost((state) => ({ ...state, coverImage: added.path }));
    setImage(uploadedFile);
  }

  return (
    <div className="max-w-3xl m-auto mt-12">
      <h1 className="my-12 text-3xl font-medium">Create a post</h1>

      {image && (
        <img
          className="object-cover w-full max-w-xl text-center max-h-48"
          src={URL.createObjectURL(image)}
        />
      )}
      <input
        onChange={onChange}
        name="title"
        placeholder="Give it a title ..."
        value={post.title}
        className="mt-12 text-xl font-medium"
      />
      <SimpleMDE
        className="mt-12 border rounded-box"
        placeholder="What's on your mind?"
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      {loaded && (
        <div className="mt-4 space-x-4">
          <button
            className="btn btn-wide btn-primary"
            type="button"
            onClick={createNewPost}
          >
            Publish
          </button>
          <button onClick={triggerOnChange} className="btn">
            Add cover image
          </button>
        </div>
      )}
      <input
        id="selectImage"
        className="hidden"
        type="file"
        onChange={handleFileChange}
        ref={fileRef}
      />
    </div>
  );
}
export default CreatePost;
