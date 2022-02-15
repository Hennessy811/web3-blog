import Link from "next/link";
import React from "react";
import { ownerAddress } from "../config";

const Nav = ({ account, connect }) => {
  return (
    <div className="p-2">
      <nav className="navbar bg-primary rounded-box">
        <div className="flex flex-1 space-x-3">
          <div>
            <Link href="/" passHref>
              <a>
                <div className="flex items-end">
                  <h2 className="text-3xl font-medium">Full Stack</h2>
                  <p className="font-light">WEB3</p>
                </div>
              </a>
            </Link>
          </div>
          {!account && (
            <button className="btn btn-outline btn-sm" onClick={connect}>
              Connect
            </button>
          )}
          {account && (
            <p
              className="max-w-xs font-mono truncate bg-base-100"
              title={account}
            >
              Address: {account}
            </p>
          )}
        </div>
        <div className="flex flex-none space-x-2">
          <Link href="/">
            <a className="btn btn-outline">Home</a>
          </Link>
          {
            /* if the signed in user is the contract owner, we */
            /* show the nav link to create a new post */
            account === ownerAddress && (
              <Link href="/create-post">
                <a className="btn btn-outline">Create Post</a>
              </Link>
            )
          }
        </div>
      </nav>
    </div>
  );
};

export default Nav;
