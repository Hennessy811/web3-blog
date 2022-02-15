import type { NextPage } from "next";
import { useContext } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";

/* import contract address and contract owner address */
import { contractAddress, ownerAddress } from "../config";

/* import Application Binary Interface (ABI) */
import Blog from "../artifacts/contracts/Greeter.sol/Blog.json";
import { AccountContext } from "../lib/context";

export default function Home(props) {
  /* posts are fetched server side and passed in as props */
  /* see getServerSideProps */
  const { posts } = props;
  const account = useContext(AccountContext);

  const router = useRouter();
  async function navigate() {
    router.push("/create-post");
  }

  return (
    <div>
      <div className="flex flex-col max-w-3xl m-auto mt-12 space-y-4">
        <h2 className="text-3xl font-medium">Posts</h2>
        {
          /* map over the posts array and render a button with the post title */
          posts.map((post, index) => (
            <Link href={`/post/${post[2]}`} key={index}>
              <a className="w-full transition rounded-md shadow-md bg-base-200 hover:shadow-lg">
                <div className="btn btn-link">
                  <p className="text-xl font-medium">{post[1]}</p>
                </div>
              </a>
            </Link>
          ))
        }
      </div>
      <div className="flex justify-center">
        {account === ownerAddress && posts && !posts.length && (
          /* if the signed in user is the account owner, render a button */
          /* to create the first post */
          <button className="btn" onClick={navigate}>
            Create your first post
          </button>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  /* here we check to see the current environment variable */
  /* and render a provider based on the environment we're in */
  let provider;
  if (process.env.ENVIRONMENT === "local") {
    provider = new ethers.providers.JsonRpcProvider();
  } else if (process.env.ENVIRONMENT === "testnet") {
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  }

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
  const data = await contract.fetchPosts();

  console.log(JSON.parse(JSON.stringify(data)));

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data)) || [],
    },
  };
}
